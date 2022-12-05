import { http } from '@google-cloud/functions-framework';
import { BigNumber, ethers } from 'ethers';
import { generateImage } from './stable-diffusion';
import express from 'express';
import template from './sdtemplate.json';
import { verifyMessage } from 'ethers/lib/utils';
import { Storage } from '@google-cloud/storage';
import { generateAsync } from 'stability-client';
import {
  createFileIfNotExists,
  freeSlot,
  getCumulativeDebt,
  readJsonFromFile,
} from './tiers';

export const app = express();
const storage = new Storage();
const bucket = storage.bucket('static.dreamerspaceguild.com');
let nftGenerationStatus: Record<string, boolean> = {};
const PLACEHOLDER_IMAGE_URL =
  'https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg';

//create tiers list if does not exist
createFileIfNotExists();

function convert2Prompt(query: any) {
  return `retro futuristic solarpunk ${query} trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on alien landscape, HQ`;
}

export async function fetchImg(query: any) {
  try {
    const { imageBuffer } = await generateImage(
      convert2Prompt(query),
      template.image.data
    );
    return imageBuffer; //.toString('base64');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function checkIfTrancheIdExists(trancheId: string) {
  // check if position exists
  return new Promise(async (resolve, _) => {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://api.avax.network/ext/bc/C/rpc'
    );
    const stratViewer = new ethers.Contract(
      // mainnet
      '0x55E343c27B794E7FCfebEf4bEA3dE24093418c50',
      // localhost
      // '0x3496c8329bF5a852bF06CA2667e86c9c132015c7',
      [
        {
          inputs: [
            { internalType: 'uint256', name: '_trancheId', type: 'uint256' },
          ],
          name: 'viewPositionMetadata',
          outputs: [
            {
              components: [
                { internalType: 'uint256', name: 'trancheId', type: 'uint256' },
                { internalType: 'address', name: 'strategy', type: 'address' },
                {
                  internalType: 'uint256',
                  name: 'collateral',
                  type: 'uint256',
                },
                { internalType: 'uint256', name: 'debt', type: 'uint256' },
                { internalType: 'address', name: 'token', type: 'address' },
                { internalType: 'uint256', name: 'yield', type: 'uint256' },
                {
                  internalType: 'uint256',
                  name: 'collateralValue',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'borrowablePer10k',
                  type: 'uint256',
                },
                { internalType: 'address', name: 'owner', type: 'address' },
              ],
              internalType: 'struct StableLending2.PositionMetadata',
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      provider
    );
    try {
      const positionMetadata = await stratViewer.viewPositionMetadata(
        BigNumber.from(trancheId)
      );
      console.log('positionMetadata', positionMetadata);
      resolve(positionMetadata);
    } catch (ex) {
      resolve(false);
    }
  });
}

app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'OPTIONS,GET');
  const { trancheId } = req.query;

  // check if position exists on chain
  const positionMetadata: any = await checkIfTrancheIdExists(
    trancheId.toString()
  );
  // if (!positionExists) {
  //   res.status(409).send('TrancheId not found');
  //   return;
  // }
  try {
    const generatedFile = bucket.file(`/${trancheId}`);
    const metadata: any = await readJsonFromFile(generatedFile);
    //
    if (metadata) {
      const cumulativeDebt: any = await getCumulativeDebt();
      const resImage: any = await generateAsync({
        prompt: `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on alien landscape, HQ`,
        apiKey: 'sk-EwcMCETdgWMchODMzZqr9gYmpzFd5V7DOfgzpoq7UuFcLcsF',
        cfgScale: 7.0,
        height: 512,
        width: 512,
        samples: 1,
        steps: 50,
      });
      console.log(resImage);
      const img = resImage.images[0];

      console.log('successfully got the image!');

      const digits = Math.round(cumulativeDebt[trancheId.toString()]).toString()
        .length;

      const generatedMetadata = {
        image: `https://static.moremoney.finance/images/${trancheId}.png`,
        generationTstamp: Date.now(),
        seller_fee_basis_points: 100,
        fee_recipient: '0x55E343c27B794E7FCfebEf4bEA3dE24093418c50',
        tier: '1'.padEnd(digits, '0'),
      };

      const imgFile = bucket.file(`images/${trancheId}.png`);
      await Promise.all([
        generatedFile.save(JSON.stringify(generatedMetadata, null, 2), {
          metadata: { contentType: 'application/json' },
        }),
        imgFile.save(img.buffer, {
          metadata: { contentType: `image/png` },
        }),
      ]);

      nftGenerationStatus[trancheId.toString()] = false;
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    } else {
      nftGenerationStatus[trancheId.toString()] = false;
      res.status(409).send('Already generated image for this id');
    }
  } catch (error) {
    nftGenerationStatus[trancheId.toString()] = false;
    console.error(error);
    res.status(500).send(`Error at SD API: ${error.toString()}`);
  }
});

app.get('/demote', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'OPTIONS,GET');
  const { trancheIdParam } = req.query;
  const trancheId = trancheIdParam.toString();
  const cumulativeDebt: any = await getCumulativeDebt();
  const generatedFile = bucket.file(`/${trancheId}`);
  const metadata: any = await readJsonFromFile(generatedFile);

  const digitsCumulativeDebt = parseFloat(
    '1'.padEnd(
      Math.round(cumulativeDebt[trancheId].cumulativeDebt).toString().length,
      '0'
    )
  );
  const digitsCurrentTier = parseFloat(
    '1'.padEnd(Math.round(metadata.tier).toString().length, '0')
  );

  if (digitsCumulativeDebt < digitsCurrentTier) {
    await freeSlot(digitsCumulativeDebt.toString());
    generatedFile.save(
      JSON.stringify(
        {
          ...metadata,
          tier: digitsCumulativeDebt,
          image: PLACEHOLDER_IMAGE_URL,
        },
        null,
        2
      ),
      {
        metadata: { contentType: 'application/json' },
      }
    );
  }
});

http('imgen', app);

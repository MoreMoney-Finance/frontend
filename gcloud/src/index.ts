import { http } from '@google-cloud/functions-framework';
import { BigNumber, ethers } from 'ethers';
import { generateImage } from './stable-diffusion';
import express from 'express';
import template from './sdtemplate.json';
import { verifyMessage } from 'ethers/lib/utils';
import { Storage } from '@google-cloud/storage';
import { generateAsync } from 'stability-client';

export const app = express();
const storage = new Storage();

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
      "0x55E343c27B794E7FCfebEf4bEA3dE24093418c50",
      [{ "inputs": [{ "internalType": "uint256", "name": "_trancheId", "type": "uint256" }], "name": "viewPositionMetadata", "outputs": [{ "components": [{ "internalType": "uint256", "name": "trancheId", "type": "uint256" }, { "internalType": "address", "name": "strategy", "type": "address" }, { "internalType": "uint256", "name": "collateral", "type": "uint256" }, { "internalType": "uint256", "name": "debt", "type": "uint256" }, { "internalType": "address", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "yield", "type": "uint256" }, { "internalType": "uint256", "name": "collateralValue", "type": "uint256" }, { "internalType": "uint256", "name": "borrowablePer10k", "type": "uint256" }, { "internalType": "address", "name": "owner", "type": "address" }], "internalType": "struct StableLending2.PositionMetadata", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }],
      provider
    );
    try {
      const positionMetadata = await stratViewer.viewPositionMetadata(BigNumber.from(trancheId));
      console.log('positionMetadata', positionMetadata);
      resolve(true)
    } catch (ex) {
      resolve(false);
    }

  });
}

app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'OPTIONS,GET');
  const { trancheId } = req.query;
  console.log('query', req.query, trancheId);

  // check if position exists on chain
  const positionExists = await checkIfTrancheIdExists(trancheId.toString());
  if (!positionExists) {
    res.status(409).send('TrancheId not found');
    return;
  }
  try {
    const bucket = storage.bucket('static.moremoney.com');
    const generatedFile = bucket.file(`/${trancheId}`);

    if (generatedFile.exists()) {
      const res: any = await generateAsync({
        prompt: `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on alien landscape, HQ`,
        apiKey: 'sk-EwcMCETdgWMchODMzZqr9gYmpzFd5V7DOfgzpoq7UuFcLcsF',
        cfgScale: 7.0,
        height: 512,
        width: 512,
        samples: 1,
        steps: 50
      });
      console.log(res);
      const img = res.images[0];

      console.log('successfully got the image!');

      const generatedMetadata = {
        image: `https://static.moremoney.com/images/${trancheId}.png`,
        generationTstamp: Date.now(),
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

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    } else {
      res.status(409).send('Already generated image for this id');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error at SD API: ${error.toString()}`);
  }
});
http('imgen', app);

import { http } from '@google-cloud/functions-framework';
import { generateImage } from './stable-diffusion';
import express from 'express';
import template from './sdtemplate.json';
import { verifyMessage } from 'ethers/lib/utils';
import { Storage } from '@google-cloud/storage';

export const app = express();
const storage = new Storage();

function convert2Prompt(query: any) {
  return `retro futuristic solarpunk ${query.adjective} ${query.types.join(
    ','
  )} with ${query.attributes.join(
    ','
  )}, trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on alien landscape, HQ`;
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

app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  const { serializedGeneratePayload, genSig } = req.query;
  const generatePayload = JSON.parse(
    decodeURIComponent(serializedGeneratePayload as string)
  );
  const recoveredSigner = verifyMessage(
    serializedGeneratePayload as string,
    decodeURIComponent(genSig as string)
  );

  if (recoveredSigner === '0x4E7f658839BB94Cb9BBe11689e3E1060c20fc95F') {
    // if (recoveredSigner === process.env.MAIN_SIGNER) {
    try {
      const bucket = storage.bucket('static.dreamerspaceguild.com');
      const generatedFile = bucket.file(
        `${generatePayload.collectionId}/${generatePayload.uid}`
      );

      if (generatedFile.exists()) {
        const img = await fetchImg(generatePayload.query);

        console.log('successfully got the image!');

        const generatedMetadata = {
          ...generatePayload,
          image: `https://static.dreamerspaceguild.com/images/${generatePayload.collectionId}/${generatePayload.uid}.png`,
          colony: 'mars',
          generationTstamp: Date.now(),
        };

        const imgFile = bucket.file(
          `images/${generatePayload.collectionId}/${generatePayload.uid}.png`
        );
        await Promise.all([
          generatedFile.save(JSON.stringify(generatedMetadata, null, 2), {
            metadata: { contentType: 'application/json' },
          }),
          imgFile.save(img, {
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
  } else {
    res.status(401).send(`Error: wrong signature`);
  }
});
http('imgen', app);

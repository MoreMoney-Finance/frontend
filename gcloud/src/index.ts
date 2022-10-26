import { http } from '@google-cloud/functions-framework';
import { generateImage } from './stable-diffusion';
import express from 'express';
import template from './sdtemplate.json';
import { verifyMessage } from 'ethers/lib/utils';
import { Storage } from '@google-cloud/storage';

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

app.get('/', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  const { trancheId, asset, strategyName } = req.query;
  try {
    const bucket = storage.bucket('static.moremoney.com');
    const generatedFile = bucket.file(`${asset}/${trancheId}`);

    if (generatedFile.exists()) {
      const img = await fetchImg(
        `position opened for ${asset} on ${strategyName}`
      );

      console.log('successfully got the image!');

      const generatedMetadata = {
        image: `https://static.moremoney.com/images/${asset}/${trancheId}.png`,
        generationTstamp: Date.now(),
      };

      const imgFile = bucket.file(`images/${asset}/${trancheId}.png`);
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
});
http('imgen', app);

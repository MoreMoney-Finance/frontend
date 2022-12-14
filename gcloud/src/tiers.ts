import { File, Storage } from '@google-cloud/storage';
const storage = new Storage();
const bucket = storage.bucket('static.dreamerspaceguild.com');
const tiersFile = bucket.file(`/tiers.json`);
import axios from 'axios';

// The function that returns a JSON string
export const readJsonFromFile = async (file: File) =>
  new Promise(async (resolve, reject) => {
    let buf = '';
    if ((await file.exists())[0]) {
      file
        .createReadStream()
        .on('data', (d) => (buf += d))
        .on('end', () => resolve(JSON.parse(buf)))
        .on('error', (e) => reject(e));
    } else {
      resolve(null);
    }
  });

const saveJsonFile = async (contents: any) =>
  new Promise((resolve, reject) => {
    tiersFile.save(JSON.stringify(contents, null, 2), {
      metadata: { contentType: 'application/json' },
    });
  });

export async function createFileIfNotExists() {
  const payload = {
    '10000': 100,
    '100000': 100,
    '1000000': 100,
    '10000000': 100,
    '100000000': 100,
    '1000000000': 100,
    '10000000000': 100,
  };
  const exists = await tiersFile.exists();
  if (!exists[0]) {
    tiersFile.save(JSON.stringify(payload, null, 2), {
      metadata: { contentType: 'application/json' },
    });
  }
}

export async function getCumulativeDebt() {
  const cumulativeDebt = await axios.get(
    'https://raw.githubusercontent.com/MoreMoney-Finance/craptastic-api/main/src/cumulative-debt-positions.json'
  );
  const contents = cumulativeDebt.data;
  return {
    tstamp: contents.tstamp,
    positions: contents?.positions?.reduce((map: any, obj: any) => {
      map[obj.trancheId] = obj;
      return map;
    }, {}),
  };
}

export async function getPromptForTier(tier: string) {
  const prompts = {
    '10000': `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on robot landscape, HQ`,
    '100000': `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on pilot landscape, HQ`,
    '1000000': `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on explorer landscape, HQ`,
    '10000000': `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on diva landscape, HQ`,
    '100000000': `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on hero landscape, HQ`,
    '1000000000': `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on villain landscape, HQ`,
    '10000000000': `retro futuristic solarpunk trending on artstation, synthwave, vibrant colors, sharp, with high level of detail, warm colors, on alien landscape, HQ`,
  };
  return prompts[tier];
}

export async function checkSlotAvailability(tier: string) {
  const contents = await readJsonFromFile(tiersFile);
  return contents[tier] > 0;
}

export async function freeSlot(tier: string) {
  const contents = await readJsonFromFile(tiersFile);
  contents[tier] = contents[tier] + 1;
  await saveJsonFile(contents);
  return true;
}

export async function allocateSlot(tier: string) {
  const contents = await readJsonFromFile(tiersFile);
  contents[tier] = contents[tier] - 1;
  await saveJsonFile(contents);
  return true;
}

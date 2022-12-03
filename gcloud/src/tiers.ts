import { File, Storage } from '@google-cloud/storage';
const storage = new Storage();
const bucket = storage.bucket('static.dreamerspaceguild.com');
const tiersFile = bucket.file(`/tiers.json`);
import axios from 'axios';

// The function that returns a JSON string
export const readJsonFromFile = async (file: File) =>
  new Promise(async (resolve, reject) => {
    let buf = '';
    if (await file.exists()) {
      file
        .createReadStream()
        .on('data', (d) => (buf += d))
        .on('end', () => resolve(buf))
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
  if (!exists) {
    tiersFile.save(JSON.stringify(payload, null, 2), {
      metadata: { contentType: 'application/json' },
    });
  }
}

export async function getCumulativeDebt() {
  const cumulativeDebt = await axios.get(
    'https://raw.githubusercontent.com/MoreMoney-Finance/craptastic-api/main/src/cumulative-debt-positions.json'
  );
  const contents = JSON.parse(cumulativeDebt.data);
  return contents.reduce((map: any, obj: any) => {
    map[obj.trancheId] = obj;
    return map;
  }, {});
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

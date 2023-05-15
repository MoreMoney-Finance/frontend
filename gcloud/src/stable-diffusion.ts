import { Answer__Output } from './proto/gooseai/Answer';
import { ProtoGrpcType } from './proto/generation';
import { randomUUID } from 'crypto';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ArtifactType } from './proto/gooseai/ArtifactType';

export const ADDRESS = 'grpc.stability.ai:443';
export const CFG_SCALE = 7.0;
export const DIFFUSION = 'SAMPLER_K_LMS';
export const ENGINE_ID = 'stable-diffusion-v1-5';
export const HEIGHT = 512;
export const MAX_RANDOM_SEED = 4294967295;
export const SAMPLES = 1;
export const SCALED_STEP = 0;
export const STEPS = 50;
export const WIDTH = 512;

interface GenerateImageReturn {
  imageBuffer: Buffer;
  mimeType: string;
  prompt: string;
}

function getServiceClient() {
  const packageDefinition = protoLoader.loadSync(
    './src/proto/generation.proto',
    {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );

  const pkg = grpc.loadPackageDefinition(
    packageDefinition
  ) as unknown as ProtoGrpcType;

  const callCredentials = grpc.credentials.createFromMetadataGenerator(
    (_, callback) => {
      const metadata = new grpc.Metadata();
      metadata.add(
        'authorization',
        'Bearer sk-HL9XzWGYZyZ7prUfFMiFq5Zf4gm8fQiVUz31xNnXo3RV4wtw'
        // `Bearer ${process.env.DS_KEY}`,
      );
      callback(null, metadata);
    }
  );

  const channelCredentials = grpc.credentials.combineChannelCredentials(
    grpc.credentials.createSsl(),
    callCredentials
  );

  return new pkg.gooseai.GenerationService(ADDRESS, channelCredentials);
}

export function generateImage(
  prompt: string,
  initImagePng: string | Buffer | Uint8Array
) {
  const serviceClient = getServiceClient();

  const stream = serviceClient.generate({
    image: {
      height: HEIGHT,
      parameters: [
        {
          scaledStep: SCALED_STEP,
          sampler: { cfgScale: CFG_SCALE },
          schedule: {
            start: 0.5,
            end: 0.05,
          },
        },
      ],
      samples: SAMPLES,
      seed: [Math.floor(Math.random() * MAX_RANDOM_SEED)],
      steps: STEPS,
      transform: { diffusion: DIFFUSION },
      width: WIDTH,
    },
    engineId: ENGINE_ID,
    prompt: [
      { text: prompt },
      {
        artifact: { type: ArtifactType.ARTIFACT_IMAGE, binary: initImagePng },
        parameters: { init: true },
      },
    ],
    requestId: randomUUID(),
  });

  return new Promise<GenerateImageReturn>((resolve, reject) => {
    stream.on('data', (response: Answer__Output) => {
      for (const artifact of response.artifacts) {
        if (artifact.type === 'ARTIFACT_IMAGE' && artifact.data === 'binary') {
          return resolve({
            prompt,
            imageBuffer: artifact.binary!,
            mimeType: artifact.mime,
          });
        }

        if (artifact.text) {
          return reject(`${artifact.finishReason}: ${artifact.text}`);
        }
      }
    });

    stream.on('error', (err) => reject(err));
  });
}

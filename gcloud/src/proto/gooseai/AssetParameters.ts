// Original file: src/proto/generation.proto

import type { AssetAction as _gooseai_AssetAction } from '../gooseai/AssetAction';

export interface AssetParameters {
  'action'?: (_gooseai_AssetAction | keyof typeof _gooseai_AssetAction);
  'project'?: (string);
}

export interface AssetParameters__Output {
  'action': (keyof typeof _gooseai_AssetAction);
  'project': (string);
}

// Original file: src/proto/generation.proto

import type { FinishReason as _gooseai_FinishReason } from '../gooseai/FinishReason';
import type { StageAction as _gooseai_StageAction } from '../gooseai/StageAction';

export interface OnStatus {
  'reason'?: (_gooseai_FinishReason | keyof typeof _gooseai_FinishReason)[];
  'target'?: (string);
  'action'?: (_gooseai_StageAction | keyof typeof _gooseai_StageAction)[];
  '_target'?: "target";
}

export interface OnStatus__Output {
  'reason': (keyof typeof _gooseai_FinishReason)[];
  'target'?: (string);
  'action': (keyof typeof _gooseai_StageAction)[];
  '_target': "target";
}

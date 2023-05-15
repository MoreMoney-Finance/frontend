// Original file: src/proto/generation.proto

import type { ArtifactType as _gooseai_ArtifactType } from '../gooseai/ArtifactType';
import type { Prompt as _gooseai_Prompt, Prompt__Output as _gooseai_Prompt__Output } from '../gooseai/Prompt';
import type { ImageParameters as _gooseai_ImageParameters, ImageParameters__Output as _gooseai_ImageParameters__Output } from '../gooseai/ImageParameters';
import type { ConditionerParameters as _gooseai_ConditionerParameters, ConditionerParameters__Output as _gooseai_ConditionerParameters__Output } from '../gooseai/ConditionerParameters';
import type { ClassifierParameters as _gooseai_ClassifierParameters, ClassifierParameters__Output as _gooseai_ClassifierParameters__Output } from '../gooseai/ClassifierParameters';
import type { AssetParameters as _gooseai_AssetParameters, AssetParameters__Output as _gooseai_AssetParameters__Output } from '../gooseai/AssetParameters';

export interface Request {
  'engineId'?: (string);
  'requestId'?: (string);
  'requestedType'?: (_gooseai_ArtifactType | keyof typeof _gooseai_ArtifactType);
  'prompt'?: (_gooseai_Prompt)[];
  'image'?: (_gooseai_ImageParameters | null);
  'conditioner'?: (_gooseai_ConditionerParameters | null);
  'classifier'?: (_gooseai_ClassifierParameters | null);
  'asset'?: (_gooseai_AssetParameters | null);
  'params'?: "image"|"classifier"|"asset";
  '_conditioner'?: "conditioner";
}

export interface Request__Output {
  'engineId': (string);
  'requestId': (string);
  'requestedType': (keyof typeof _gooseai_ArtifactType);
  'prompt': (_gooseai_Prompt__Output)[];
  'image'?: (_gooseai_ImageParameters__Output | null);
  'conditioner'?: (_gooseai_ConditionerParameters__Output | null);
  'classifier'?: (_gooseai_ClassifierParameters__Output | null);
  'asset'?: (_gooseai_AssetParameters__Output | null);
  'params': "image"|"classifier"|"asset";
  '_conditioner': "conditioner";
}

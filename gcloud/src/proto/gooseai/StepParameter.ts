// Original file: src/proto/generation.proto

import type { SamplerParameters as _gooseai_SamplerParameters, SamplerParameters__Output as _gooseai_SamplerParameters__Output } from '../gooseai/SamplerParameters';
import type { ScheduleParameters as _gooseai_ScheduleParameters, ScheduleParameters__Output as _gooseai_ScheduleParameters__Output } from '../gooseai/ScheduleParameters';

export interface StepParameter {
  'scaledStep'?: (number | string);
  'sampler'?: (_gooseai_SamplerParameters | null);
  'schedule'?: (_gooseai_ScheduleParameters | null);
  '_sampler'?: "sampler";
  '_schedule'?: "schedule";
}

export interface StepParameter__Output {
  'scaledStep': (number);
  'sampler'?: (_gooseai_SamplerParameters__Output | null);
  'schedule'?: (_gooseai_ScheduleParameters__Output | null);
  '_sampler': "sampler";
  '_schedule': "schedule";
}

// Original file: src/proto/generation.proto


export interface ScheduleParameters {
  'start'?: (number | string);
  'end'?: (number | string);
  '_start'?: "start";
  '_end'?: "end";
}

export interface ScheduleParameters__Output {
  'start'?: (number);
  'end'?: (number);
  '_start': "start";
  '_end': "end";
}

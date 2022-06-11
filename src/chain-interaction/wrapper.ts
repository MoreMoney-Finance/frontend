import { CallResult } from '@usedapp/core';
import {
  ContractMethodNames,
  TypedContract,
} from '@usedapp/core/dist/esm/src/model/types';

export function handleCallResultDefault(
  result: CallResult<TypedContract, ContractMethodNames<any>>,
  defaultResult: any,
  description: string,
  raw = false
) {
  if (result === undefined) {
    return defaultResult;
  } else if (result?.error) {
    console.error(`${description}: ${result.error.message}`);
    return defaultResult;
  }
  return raw ? result?.value : result?.value?.[0];
}

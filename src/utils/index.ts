import { CurrencyValue } from '@usedapp/core';

export function parseFloatNoNaN(input: string) {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? 0 : parsed;
}
export function parseFloatCurrencyValue(input: CurrencyValue) {
  const parsed = parseFloat(
    input.format({
      suffix: '',
      thousandSeparator: '',
      significantDigits: Infinity,
    })
  );
  return isNaN(parsed) ? 0 : parsed;
}

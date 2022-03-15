import { CurrencyValue } from '@usedapp/core';

export function parseFloatNoNaN(input: string) {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? 0 : parsed;
}
export function parseFloatCurrencyValue(input: CurrencyValue) {
  const parsed = parseFloatNoNaN(
    input.format({
      significantDigits: Infinity,
      suffix: '',
      thousandSeparator: '',
      decimalSeparator: '.',
    })
  );
  return isNaN(parsed) ? 0 : parsed;
}
export function formatNumber(input: number) {
  if (input) {
    return input.toLocaleString('en-US', {});
  } else {
    return 0;
  }
}

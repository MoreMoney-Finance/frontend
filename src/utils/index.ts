export function parseFloatNoNaN(input:string) {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? 0 : parsed;
}
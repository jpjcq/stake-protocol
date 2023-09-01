export function toEth(amountToConvert: bigint): number {
  const result = amountToConvert / (BigInt(10) ** BigInt(18));
  return Number(result);
}

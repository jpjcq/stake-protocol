export function toWei(amountToConvert: number): bigint {
  return BigInt(amountToConvert) * BigInt(10) ** BigInt(18);
}

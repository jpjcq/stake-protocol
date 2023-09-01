import { network } from "hardhat";

async function main() {
  await network.provider.send("evm_increaseTime", [16 * 60]);

  console.log(`Time increased by 16min`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

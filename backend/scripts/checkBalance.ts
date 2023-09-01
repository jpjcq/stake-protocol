import { ethers } from "hardhat";

async function main() {
  const [owner, user] = await ethers.getSigners();

  const stakeCoin = await ethers.getContractAt(
    "StakeCoin",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const ownerBalance = await stakeCoin.balanceOf(owner);
  const userBalance = await stakeCoin.balanceOf(user);

  console.log(`Owner's $STK balance: ${ownerBalance}`);
  console.log(`User's $STK balance: ${userBalance}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

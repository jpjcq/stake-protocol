import { ethers } from "hardhat";

async function main() {
  const [owner, user] = await ethers.getSigners();

  const stakeSoftPool = await ethers.getContractAt(
    "StakeSoftPool",
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  );

  const ownerBalance = await stakeSoftPool.getCurrentRewardAmount(
    owner.address
  );
  const userBalance = await stakeSoftPool.getCurrentRewardAmount(user.address);

  console.log(`Owner's $STK reward amount: ${ownerBalance}`);
  console.log(`User's $STK reward amount: ${userBalance}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

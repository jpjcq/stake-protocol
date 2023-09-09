import { ethers, network } from "hardhat";

async function main() {
  const [owner, user, stakeTreasury] = await ethers.getSigners();
  const lossPercentagePerSec = ethers.parseEther("0.0028");
  const yieldPercentagePerSec = ethers.parseEther("0.0028");
  const minimumStakeDuration = 15 * 60 * 60;

  console.log(`Contract deployment with wallet: ${owner.address}`);
  console.log(
    `Current balance: ${ethers.formatEther(
      await network.provider.send("eth_getBalance", [owner.address, "latest"])
    )}`
  );

  const stakeCoin = await ethers.deployContract("StakeCoin");

  const stakeCoinAddress = await stakeCoin.getAddress();

  const stakeSoftPool = await ethers.deployContract("StakePool", [
    lossPercentagePerSec,
    yieldPercentagePerSec,
    minimumStakeDuration,
    stakeCoinAddress,
    stakeTreasury.address,
  ]);

  const stakeHardPool = await ethers.deployContract("StakePool", [
    lossPercentagePerSec,
    yieldPercentagePerSec,
    minimumStakeDuration,
    stakeCoinAddress,
    stakeTreasury.address,
  ]);

  const stakeSoftPoolAddress = await stakeSoftPool.getAddress();

  const stakeHardPoolAddress = await stakeHardPool.getAddress();

  // Setting soft pool address in coin contract to require it in _poolMint
  await stakeCoin
    .connect(owner)
    .setPoolsAddresses(stakeSoftPoolAddress, stakeHardPoolAddress);

  // Adding wallets to whitelist
  await stakeCoin.connect(owner).addToWhitelist(owner.address);
  await stakeCoin.connect(owner).addToWhitelist(user.address);

  console.log(`Stake Coin address: ${stakeCoinAddress}`);
  console.log(`Stake Soft Pool address: ${stakeSoftPoolAddress}`);
  console.log(`Stake Soft Pool address: ${stakeHardPoolAddress}`);

  // Personal reminder
  console.log("\n*** DON'T FORGET TO RESET NONCE IN METAMASK ***\n");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

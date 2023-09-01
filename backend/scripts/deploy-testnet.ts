import { ethers, network, run } from "hardhat";

async function main() {
  const [owner, _, stakeTreasury] = await ethers.getSigners();
  const softLossPercentagePerSec = ethers.parseEther("0.00417");
  const softYieldPercentagePerSec = ethers.parseEther("0.0028");
  const hardLossPercentagePerSec = ethers.parseEther("0.0139");
  const hardYieldPercentagePerSec = ethers.parseEther("0.0097");
  const minimumStakeDuration = 15 * 60 * 60;

  console.log(`Contract deployment with wallet: ${owner.address}`);
  console.log(
    `Current balance: ${ethers.formatEther(
      await network.provider.send("eth_getBalance", [owner.address, "latest"])
    )}`
  );

  const stakeCoin = await ethers.deployContract("StakeCoin");

  const stakeCoinAddress = await stakeCoin.getAddress();

  const stakeSoftPoolconstructorArgs = [
    softLossPercentagePerSec,
    softYieldPercentagePerSec,
    minimumStakeDuration,
    stakeCoinAddress,
    stakeTreasury.address,
  ];

  const stakeHardPoolconstructorArgs = [
    hardLossPercentagePerSec,
    hardYieldPercentagePerSec,
    minimumStakeDuration,
    stakeCoinAddress,
    stakeTreasury.address,
  ];

  const stakeSoftPool = await ethers.deployContract(
    "StakePool",
    stakeSoftPoolconstructorArgs
  );

  const stakeHardPool = await ethers.deployContract(
    "StakePool",
    stakeHardPoolconstructorArgs
  );

  const stakeSoftPoolAddress = await stakeSoftPool.getAddress();
  const stakeHardPoolAddress = await stakeHardPool.getAddress();

  // Setting soft pool address in coin contract to require it in _poolMint
  await stakeCoin
    .connect(owner)
    .setPoolsAddresses(stakeSoftPoolAddress, stakeHardPoolAddress);

  // Addind owner to mint whitelist
  await stakeCoin.connect(owner).addToWhitelist(owner.address);

  console.log(`\nStake Coin address: ${stakeCoinAddress}`);
  console.log(`Stake Soft Pool address: ${stakeSoftPoolAddress}`);
  console.log(`Stake Hard Pool address: ${stakeHardPoolAddress}`);

  console.log("\nVerifying COIN source code in bscscan...");
  await run("verify:verify", {
    address: stakeCoinAddress,
  });
  console.log("\nSource code verifyed at " + stakeSoftPoolAddress);

  console.log("\nVerifying SOFTPOOL source code in bscscan...");
  await run("verify:verify", {
    address: stakeSoftPoolAddress,
    constructorArguments: stakeSoftPoolconstructorArgs,
  });
  console.log("Source code verifyed at " + stakeSoftPoolAddress);

  console.log("\nVerifying HARDPOOL source code in bscscan...");
  await run("verify:verify", {
    address: stakeHardPoolAddress,
    constructorArguments: stakeHardPoolconstructorArgs,
  });
  console.log("Source code verifyed at " + stakeHardPoolAddress);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });

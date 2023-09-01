import { ethers } from "hardhat";
import { expect } from "chai";
import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { StakeCoin, StakePool } from "../typechain-types";

describe("StakePool", function () {
  async function deployStakeSoftPoolFixture() {
    const softBaseLossPercentagePerSec = ethers.parseEther("0.0028");
    const softBaseYieldPercentagePerSec = ethers.parseEther("0.0028");
    const hardBaseLossPercentagePerSec = ethers.parseEther("0.0097");
    const hardBaseYieldPercentagePerSec = ethers.parseEther("0.0139");
    const baseMinimumStakeDuration = 15 * 60 * 60;

    const amountReceivedWhenMint = ethers.parseEther("100000");

    const [owner, user, user2, stakeTreasury, deadAddress] =
      await ethers.getSigners();

    const stakeCoin = await ethers.deployContract("StakeCoin");

    const stakeCoinAddress = await stakeCoin.getAddress();

    const stakePool = await ethers.deployContract("StakePool", [
      softBaseLossPercentagePerSec,
      softBaseYieldPercentagePerSec,
      baseMinimumStakeDuration,
      stakeCoinAddress,
      stakeTreasury,
    ]);

    const stakeHardPool = await ethers.deployContract("StakePool", [
      hardBaseLossPercentagePerSec,
      hardBaseYieldPercentagePerSec,
      baseMinimumStakeDuration,
      stakeCoinAddress,
      stakeTreasury,
    ]);

    const softPoolAddress = await stakePool.getAddress();
    const hardPoolAddress = await stakeHardPool.getAddress();

    await stakeCoin
      .connect(owner)
      .setPoolsAddresses(softPoolAddress, hardPoolAddress);
    await stakeCoin.connect(owner).addToWhitelist(user.address);
    await stakeCoin.connect(user).mint();

    return {
      stakePool,
      softPoolAddress,
      softBaseLossPercentagePerSec,
      softBaseYieldPercentagePerSec,
      baseMinimumStakeDuration,
      owner,
      user,
      user2,
      stakeCoin,
      stakeCoinAddress,
      amountReceivedWhenMint,
      stakeTreasury,
      deadAddress,
    };
  }

  describe("Deployment", function () {
    it("Should set the right base loss percentage", async function () {
      const { stakePool, softBaseLossPercentagePerSec } = await loadFixture(
        deployStakeSoftPoolFixture
      );

      expect(await stakePool.lossPercentagePerSec()).to.equal(
        softBaseLossPercentagePerSec
      );
    });

    it("Should set the right base yield percentage", async function () {
      const { stakePool, softBaseYieldPercentagePerSec } = await loadFixture(
        deployStakeSoftPoolFixture
      );

      expect(await stakePool.yieldPercentagePerSec()).to.equal(
        softBaseYieldPercentagePerSec
      );
    });

    it("Should pass the right minimum staking duration", async function () {
      const { stakePool, baseMinimumStakeDuration } = await loadFixture(
        deployStakeSoftPoolFixture
      );

      expect(await stakePool.minimumStakeDuration()).to.equal(
        baseMinimumStakeDuration
      );
    });

    it("Should have sent amountReceivedWhenMint $STK to user", async function () {
      const { stakeCoin, user, amountReceivedWhenMint } = await loadFixture(
        deployStakeSoftPoolFixture
      );

      expect(await stakeCoin.balanceOf(user.address)).to.equal(
        amountReceivedWhenMint
      );
    });
  });

  describe("Stake and claim tokens", function () {
    const amountToStake = ethers.parseEther("100");
    const allowanceAmount = ethers.parseEther("1000");
    let stakePool: StakePool;
    let user: HardhatEthersSigner;
    let user2: HardhatEthersSigner;
    let softBaseYieldPercentagePerSec: bigint;
    let baseMinimumStakeDuration: number;
    let stakeCoin: StakeCoin;
    let stakeTreasury: HardhatEthersSigner;
    let softPoolAddress: string;

    beforeEach(async function () {
      const fixture = await loadFixture(deployStakeSoftPoolFixture);
      stakePool = fixture.stakePool;
      user = fixture.user;
      user2 = fixture.user2;
      softBaseYieldPercentagePerSec = fixture.softBaseYieldPercentagePerSec;
      baseMinimumStakeDuration = fixture.baseMinimumStakeDuration;
      softPoolAddress = fixture.softPoolAddress;
      stakeCoin = fixture.stakeCoin;
      stakeTreasury = fixture.stakeTreasury;

      await stakeCoin.connect(user).approve(softPoolAddress, allowanceAmount);

      expect(
        await stakeCoin.allowance(user.address, softPoolAddress)
      ).to.equal(allowanceAmount);

      await expect(stakePool.connect(user).stakeTokens(amountToStake)).to.emit(
        stakePool,
        "TokensStaked"
      );
    });

    it("Should have stake", async function () {
      const timeToIncrease = 5 * 60 * 60;
      await time.increase(timeToIncrease); // For 5h staking duration, 50% chances for 10%/h, 0.0028%/sec
      const fiveHoursRewardAmount =
        amountToStake +
        (BigInt(timeToIncrease) *
          softBaseYieldPercentagePerSec *
          amountToStake) /
          (BigInt(100) * BigInt(1e18));
      console.log(
        "Reward after 5h: " +
          (fiveHoursRewardAmount - amountToStake) / BigInt(1e18)
      );
      expect(await stakePool.getCurrentRewardAmount(user.address)).to.equal(
        fiveHoursRewardAmount
      );
      expect(await stakePool.totalStaking()).to.equal(amountToStake);
    });

    it("Should emit Win or Loss at claim", async function () {
      await time.increase(5 * 60 * 60); // For 5h staking duration, 50% chances for 10%/h, 0.0028%/sec

      expect(await stakePool.connect(user).claimReward()).to.emit(
        stakePool,
        "Loss" || "Win"
      );
    });

    // Two "Should handle claimReward()" specs, to handle win and loss cases
    it("Should handle claimReward() correctly 1", async function () {
      await time.increase(5 * 60 * 60); // For 5h staking duration, 50% chances for 10%/h, 0.0028%/sec

      const receipt = await (
        await stakePool.connect(user).claimReward()
      ).wait();

      if (receipt) {
        for (const log of receipt.logs) {
          const logDescription = {
            topics: Array.from(log.topics),
            data: log.data,
          };
          const event = stakePool.interface.parseLog(logDescription);

          if (event?.name === "Loss") {
            expect(await stakeCoin.balanceOf(user.address)).to.equal(
              ethers.parseEther("99900")
            );
            // expect(await stakeCoin.balanceOf(deadAddress)).to.equal(
            //   ethers.parseEther("25")
            // );
            expect(await stakeCoin.balanceOf(stakeTreasury)).to.equal(
              ethers.parseEther("25")
            );
            console.log("This is a loss1");
          }
          if (event?.name === "Win") {
            expect(await stakeCoin.balanceOf(user.address)).to.be.above(
              ethers.parseEther("150")
            );
            console.log("This is a win1");
          }
        }
      }
    });

    it("Should handle claimReward() correctly 2", async function () {
      await time.increase(5 * 60 * 60 + 50); // +50sec, to verify !spec1

      const receipt = await (
        await stakePool.connect(user).claimReward()
      ).wait();

      if (receipt) {
        for (const log of receipt.logs) {
          const logDescription = {
            topics: Array.from(log.topics),
            data: log.data,
          };

          const event = stakePool.interface.parseLog(logDescription);

          if (event?.name === "Loss") {
            expect(await stakeCoin.balanceOf(user.address)).to.equal(
              ethers.parseEther("99900")
            );
            // expect(await stakeCoin.balanceOf(deadAddress)).to.equal(
            //   ethers.parseEther("25")
            // );
            expect(await stakeCoin.balanceOf(stakeTreasury)).to.equal(
              ethers.parseEther("25")
            );
            console.log("This is a loss2");
          }

          if (event?.name === "Win") {
            expect(await stakeCoin.balanceOf(user.address)).to.be.above(
              ethers.parseEther("150")
            );
            console.log("This is a win2");
          }
        }
      }
    });

    it("Should throw if I'm trying to claim before 15min", async function () {
      await time.increase(14 * 60 + 1 * 59); // For 14min59sec staking duration

      await expect(stakePool.connect(user).claimReward()).to.be.rejectedWith(
        "You must stake at least 15 minutes"
      );
    });

    it("Should throw if I'm trying to claim tokens I never staked", async function () {
      await time.increase(5 * 60 * 60);

      await expect(stakePool.connect(user2).claimReward()).to.be.rejectedWith(
        "You do not have any token staked"
      );
    });
  });

  describe("Set settings", function () {
    it("Should set loss and yield correctly if I'm the owner", async function () {
      const { stakePool, owner } = await loadFixture(
        deployStakeSoftPoolFixture
      );
      const parsedSetting = ethers.parseEther("0.0056");

      await stakePool.connect(owner).setLossPercentagePerSec(parsedSetting);
      await stakePool.connect(owner).setYieldPercentagePerSec(parsedSetting);

      expect(await stakePool.lossPercentagePerSec()).to.equal(parsedSetting);
      expect(await stakePool.yieldPercentagePerSec()).to.equal(parsedSetting);
    });

    // /*\ SETOWNER() REMOVED FROM SMART CONTRACT, OWNABLE.SOL IS NOW /*\
    // it("Should set the new owner correctly", async function () {
    //   const { stakePool, owner } = await loadFixture(
    //     deployStakeSoftPoolFixture
    //   );

    //   await stakePool.connect(owner).setOwner(owner.address);
    //   expect(await stakePool.owner()).to.equal(owner.address);
    // });

    // it("Should throw en error if I'm not the owner", async function () {
    //   const { stakePool, user } = await loadFixture(
    //     deployStakeSoftPoolFixture
    //   );
    //   const parsedSetting = ethers.parseEther("0.0056");

    //   expect(
    //     stakePool.connect(user).setLossPercentagePerSec(parsedSetting)
    //   ).to.be.rejectedWith("You are not the owner");
    //   expect(
    //     stakePool.connect(user).setYieldPercentagePerSec(parsedSetting)
    //   ).to.be.rejectedWith("You are not the owner");
    //   expect(
    //     stakePool.connect(user).setOwner(user.address)
    //   ).to.be.rejectedWith("You are not the owner");
    // });
  });
});

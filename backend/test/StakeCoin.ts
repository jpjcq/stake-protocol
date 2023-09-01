import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";

describe("StakeCoin", function () {
  async function deployStakeCoinFixture() {
    const [owner, user, softPool, hardPool] = await ethers.getSigners();

    const stakeCoin = await ethers.deployContract("StakeCoin", owner);

    return { stakeCoin, owner, user, softPool, hardPool };
  }

  describe("Deployment", function () {
    it("Should set the soft pool address and throw if not owner", async function () {
      const { stakeCoin, owner, user, softPool, hardPool } = await loadFixture(
        deployStakeCoinFixture
      );

      await stakeCoin
        .connect(owner)
        .setPoolsAddresses(softPool.address, hardPool.address);

      expect(await stakeCoin.connect(owner).softPoolAddress()).to.equal(
        softPool.address
      );
      expect(await stakeCoin.connect(owner).hardPoolAddress()).to.equal(
        hardPool.address
      );
      await expect(
        stakeCoin
          .connect(user)
          .setPoolsAddresses(softPool.address, hardPool.address)
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });
  });
});

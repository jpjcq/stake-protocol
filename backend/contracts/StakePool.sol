// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./StakeCoin.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakePool is Ownable {
    uint256 public lossPercentagePerSec;
    uint256 public yieldPercentagePerSec;
    uint256 public minimumStakeDuration;
    address public stakeTreasury;
    uint256 public totalBurnt;
    address public deadAddress = 0x000000000000000000000000000000000000dEaD;

    uint256 public poolBalance;
    uint256 public totalStaking;

    struct Staker {
        address userAddress;
        uint256 time;
        uint256 amount;
    }

    mapping(address => Staker) public poolUser;

    StakeCoin public stakeCoin;

    constructor(
        uint256 _lossPercentagePerSec,
        uint256 _yieldPercentagePerSec,
        uint256 _minimumStakeDuration,
        address _tokenAddress,
        address _stakeTresury
    ) {
        lossPercentagePerSec = _lossPercentagePerSec;
        yieldPercentagePerSec = _yieldPercentagePerSec;
        minimumStakeDuration = _minimumStakeDuration;
        stakeCoin = StakeCoin(_tokenAddress);
        stakeTreasury = _stakeTresury;
    }

    event TokensStaked(
        address indexed userAddress,
        uint256 amount,
        uint256 time
    );

    event Win(address indexed userAddress, uint256 amount);

    event Loss(address indexed userAddress);

    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "Amount cannot be 0");
        require(poolUser[msg.sender].amount == 0, "You can only stake once");
        require(
            stakeCoin.transferFrom(msg.sender, address(this), _amount),
            "Token transfer has failed"
        );

        Staker storage staker = poolUser[msg.sender];

        staker.userAddress = msg.sender;
        staker.time = block.timestamp;
        staker.amount += _amount;

        poolBalance += _amount;
        totalStaking += _amount;

        emit TokensStaked(msg.sender, _amount, block.timestamp);
    }

    function claimReward() public {
        Staker storage currentUser = poolUser[msg.sender];
        uint256 elapsedTime = block.timestamp - currentUser.time; // Minimum elapsed time, 15min

        require(currentUser.amount > 0, "You do not have any token staked");
        require(elapsedTime > 15 * 60, "You must stake at least 15 minutes");

        uint256 lossChancePercent = elapsedTime * lossPercentagePerSec; // Loss percentage per sec is parseEth("0.0028")
        uint256 lossChanceScaled = lossChancePercent / 1e18;

        uint256 reward = ((elapsedTime *
            yieldPercentagePerSec *
            currentUser.amount) / (100 * 1e18)) + currentUser.amount;

        bool loss = (block.timestamp % 100) < lossChanceScaled;

        if (loss) {
            stakeCoin.transfer(stakeTreasury, currentUser.amount / 4);
            stakeCoin.transfer(deadAddress, currentUser.amount / 4);
            poolBalance -= currentUser.amount / 2;

            totalBurnt += currentUser.amount / 4;
            totalStaking -= currentUser.amount;

            currentUser.amount = 0;
            currentUser.time = 0;
            emit Loss(currentUser.userAddress);
        }

        if (!loss) {
            if (reward <= poolBalance) {
                stakeCoin.transfer(currentUser.userAddress, reward);
                poolBalance -= reward;
            }
            if (reward >= poolBalance) {
                uint256 amountToMint = reward - poolBalance;
                stakeCoin._poolMint(amountToMint);
                poolBalance += amountToMint;
                stakeCoin.transfer(currentUser.userAddress, reward);
                poolBalance -= reward;
            }

            totalStaking -= currentUser.amount;
            currentUser.amount = 0;
            currentUser.time = 0;
            emit Win(currentUser.userAddress, reward);
        }
    }

    function getElapsedTime(
        address _user
    ) public view returns (uint256 elapsedTime) {
        Staker memory currentUser = poolUser[_user];
        require(currentUser.time > 0, "You do not have any position");
        uint256 duration = block.timestamp - currentUser.time;
        return duration;
    }

    function getCurrentRewardAmount(
        address _user
    ) public view returns (uint amount) {
        Staker memory currentUser = poolUser[_user];
        uint256 elapsedTime = block.timestamp - currentUser.time;
        uint256 currentRewardAmount = currentUser.amount +
            ((elapsedTime * yieldPercentagePerSec * currentUser.amount) /
                (100 * 1e18));
        return currentRewardAmount;
    }

    function setLossPercentagePerSec(
        uint256 _lossPercentagePerSec
    ) external onlyOwner {
        lossPercentagePerSec = _lossPercentagePerSec;
    }

    function setYieldPercentagePerSec(
        uint256 _yieldPercentagePerSec
    ) external onlyOwner {
        yieldPercentagePerSec = _yieldPercentagePerSec;
    }
}

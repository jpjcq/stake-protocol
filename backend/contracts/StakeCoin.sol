//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeCoin is ERC20, Ownable {
    uint256 public constant AMOUNT_TO_MINT = 100_000 * 1e18;
    uint256 public constant MAX_SUPPLY = 100_000_000 * 1e18;
    uint256 public mintedSupply;
    address public softPoolAddress;
    address public hardPoolAddress;

    struct Minter {
        bool isWhitelisted;
        bool hasMinted;
    }

    mapping(address => Minter) minter;

    constructor() ERC20("Stake Coin", "STK") {}

    event HasMinted(address indexed userAddress);

    function setPoolsAddresses(
        address _softPoolAddress,
        address _hardPoolAddress
    ) public onlyOwner {
        softPoolAddress = _softPoolAddress;
        hardPoolAddress = _hardPoolAddress;
    }

    function addToWhitelist(address _addressToWhitelist) public onlyOwner {
        require(
            minter[_addressToWhitelist].isWhitelisted == false,
            "User is already whitelisted"
        );

        minter[_addressToWhitelist].isWhitelisted = true;
    }

    function isWhitelisted(
        address _userAddress
    ) public view returns (bool result) {
        Minter memory userToCheck = minter[_userAddress];
        return userToCheck.isWhitelisted;
    }

    function hasMinted(address _userAddress) public view returns (bool result) {
        Minter memory userToCheck = minter[_userAddress];
        return userToCheck.hasMinted;
    }

    function mint() public {
        require(
            minter[msg.sender].isWhitelisted == true,
            "You are not whitelisted"
        );
        require(
            minter[msg.sender].hasMinted == false,
            "You already have minted"
        );
        require(
            AMOUNT_TO_MINT + mintedSupply <= MAX_SUPPLY,
            "The entire supply has been minted"
        );

        _mint(msg.sender, AMOUNT_TO_MINT);
        mintedSupply += AMOUNT_TO_MINT;
        minter[msg.sender].hasMinted = true;
        emit HasMinted(msg.sender);
    }

    function _poolMint(uint256 _amount) public {
        require(
            msg.sender == softPoolAddress || msg.sender == hardPoolAddress,
            "You cannot call this function"
        );
        require(
            _amount + mintedSupply <= MAX_SUPPLY,
            "The entire supply has been minted"
        );

        _mint(msg.sender, _amount);
        mintedSupply += _amount;
    }
}

# Stake Protocol

## Overview

Stake Protocol is a decentralized application that allows you to create an
ERC-20 token with a whitelist minting procedure. It also enables the creation
of liquidity mining pools where rewards increase gradually, along with the
associated risks. Currently configured on BSC Chain, but can be used on any EVM blockchain.

<!-- This project serves as a portfolio to demonstrate my skills in web3
development, particularly in React and Solidity. -->

## Features

- **ERC-20 Token Creation**: Easily create your own ERC-20 token.
- **Whitelist Minting**: Control who can mint tokens by using a whitelist.
- **Liquidity Mining Pools**: Create pools where users can stake tokens to earn rewards.
- **React Interface**: The protocol has a built-in interface that let users claim their tokens (if whitelisted) and stake them choosing a soft or hard risk/reward pool

## Technology Stack

- **Frontend**: React
- **Smart Contracts**: Solidity / Hardhat

## Prerequisites

- Node.js <= 18 (using a version of Node.js that is not supported may work incorrectly, or not work at all. See https://hardhat.org/nodejs-versions)
- NPM
- MetaMask or another web3 provider
- A bscscan api key

## Installation

1. Clone the repository

```bash
git clone https://github.com/jpjcq/stake-protocol.git
```

2. Navigate to the `stake-protocol` directory:

```bash
cd stake-protocol

```

3. Install the dependencies for the backend:

```bash
cd backend && npm i

```

4. Install the dependencies for the interface:

```bash
cd ../interface && npm i

```

5. Create a secrets.json file at backend root, paste your wallet mnemonic phrase and bscscan api key:

```json
{
  "mnemonic": "my mnemonic phrase can be found in metamask",
  "bscscanApiKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

6. You are set! A serie of tests can be run with:

```bash
npm test
```

7. And you can deploy on testnet with (be sure to have some testnet BNB to pay the fees), the contracts addresses will be displayed, copy and paste them in ./interface/artifacts in there respectives files:

```bash
npm run testnetDeploy
```

8. You can now go to ./interface, run:

```bash
npm run dev
```

9. And enjoy you dapp at `http://localhost:5173/`

## Contributing

Feel free to open issues or submit pull requests. Your contributions are welcome!

## License

This project is licensed under the MIT License.

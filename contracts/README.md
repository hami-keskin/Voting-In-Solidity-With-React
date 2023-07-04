# Smart Contract

The smart contract `Voting.sol` is written in Solidity and provides functionality for conducting a voting process.

## Getting Started

To create a project using this example, run the following command:

```bash
npx thirdweb create --contract --template hardhat-javascript-starter
```

You can start editing the contract by modifying the file `contracts/Voting.sol`.

To add functionality to your contracts, you can use the `@thirdweb-dev/contracts` package, which provides base contracts and extensions to inherit. The package is already installed with this project. Visit our [Contracts Extensions Docs](https://portal.thirdweb.com/contractkit) to learn more.

## Building the Project

After making any changes to the contract, run the following command to compile your contracts:

```bash
npm run build
# or
yarn build
```

This will also detect the [Contracts Extensions Docs](https://portal.thirdweb.com/contractkit) used in your contract.

## Deploying Contracts

When you're ready to deploy your contracts, use one of the following commands:

```bash
npm run deploy
# or
yarn deploy
```

## Releasing Contracts

If you want to release a version of your contracts publicly, you can use one of the following commands:

```bash
npm run release
# or
yarn release
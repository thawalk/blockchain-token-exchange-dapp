# Blockchain application to demo liquidity mining

**Dependencies**

- Node - https://nodejs.org/en/
- Ganache - https://www.trufflesuite.com/ganache
- Truffle - npm install --g truffle@5.1.39


Run ganache with quickstart settings

- Install MetaMask extension in chrome browser and connect to the second account in ganache, by using the private key in ganache.

**To Run the code**
1. Run the following code in the root folder

    ```
    npm run start
    ```
    The website will start up in localhost:3000
    
    You can stake DAI tokens, and earn DAPP tokens as rewards.
    
    To receive the rewards, after staking the tokens, run the following command in the root folder.
    
    ```
    truffle exec scripts/issue-token.js
    ```
    Refresh a couple of times to update the values.
    
    After receiving the DAPP tokens as reward, you can unstake the DAI tokens, by pressing the un-stake button
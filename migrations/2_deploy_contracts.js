const DappToken = artifacts.require("DappToken")
const DaiToken = artifacts.require("DaiToken")
const TokenFarm = artifacts.require("TokenFarm")

module.exports = async function(deployer, network, accounts) {
	//deploy Mock DaiToken
  	await deployer.deploy(DaiToken)
  	const daiToken = await DaiToken.deployed()

  	//deploy DappToken
  	await deployer.deploy(DappToken)
  	const dappToken = await DappToken.deployed()

  	//deploy TokenFarm
	await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
	const tokenFarm = await TokenFarm.deployed()

	// transfer all tokens to TokenFarm (1 million)
	await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

	// transfer 100 mock DAI tokens to investor (second account)
	await daiToken.transfer(accounts[1], '100000000000000000000')
}

  
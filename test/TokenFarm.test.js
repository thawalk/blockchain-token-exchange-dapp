const DappToken = artifacts.require("DappToken")
const DaiToken = artifacts.require("DaiToken")
const TokenFarm = artifacts.require("TokenFarm")

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('TokenFarm', (accounts) => {
	let daiToken, dappToken, tokenFarm

	before(async() => {
		// load contracts
		daiToken = await DaiToken.new()
		dappToken = await DappToken.new()
		tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
	})

	//tests
	describe('Mock DAI deployment', async() => {
		it('has a name', async() => {		
			const name = await daiToken.name()
			assert.equal(name, 'Mock DAI Token')
		})
	})
})
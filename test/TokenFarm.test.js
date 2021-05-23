const DappToken = artifacts.require("DappToken")
const DaiToken = artifacts.require("DaiToken")
const TokenFarm = artifacts.require("TokenFarm")

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n) {
	return web3.utils.toWei(n, 'ether')
}

contract('TokenFarm', ([owner, investor]) => {
	let daiToken, dappToken, tokenFarm

	before(async() => {
		// load contracts
		daiToken = await DaiToken.new()
		dappToken = await DappToken.new()
		tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

		// transfer all dapp tokens to farm (1 million)
		await dappToken.transfer(tokenFarm.address, tokens('1000000'))

		//send tokens to investor
		await daiToken.transfer(investor, tokens('100'), {from: owner})
	})

	//tests
	describe('Mock DAI deployment', async() => {
		it('has a name', async() => {		
			const name = await daiToken.name()
			assert.equal(name, 'Mock DAI Token')
		})
	})

	describe('Dapp Token deployment', async() => {
		it('has a name', async() => {		
			const name = await dappToken.name()
			assert.equal(name, 'DApp Token')
		})
	})

	describe('Token Farm deployment', async() => {
		it('has a name', async() => {		
			const name = await tokenFarm.name()
			assert.equal(name, 'Dapp Token Farm')
		})
		it('contract has tokens', async() => {		
			let balance = await dappToken.balanceOf(tokenFarm.address)
			assert.equal(balance.toString(), tokens('1000000'))
		})
	})

	describe('Farming tokens', async() => {
		it('rewards investors for staking mDai tokens', async() => {
			let result

			// check investor balance before staking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')

			// Stake mock DAI tokens
			await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
			await tokenFarm.stakeTokens(tokens('100'), {from: investor})

			//check staking result
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('0'), 'investor mock dai wallet correct after staking')
			
			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

			//Issue tokens
			await tokenFarm.issueTokens({from: owner})

			//check balances after issuing
			result = await dappToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor DApp token wallet balance correct after issuing')

			//ensure that only the owner can issue the tokens
			await tokenFarm.issueTokens({from: investor}).should.be.rejected;

			//unstake the tokens
			await tokenFarm.unstakeTokens({from: investor})

			//check balance of investor after unstaking
			result = await daiToken.balanceOf(investor)
			assert.equal(result.toString(), tokens('100'), 'investor mock dai wallet balance correct after unstaking')

			//check balance at token farm after unstaking
			result = await daiToken.balanceOf(tokenFarm.address)
			assert.equal(result.toString(), tokens('0'), 'token farm mock dai wallet balance correct after unstaking')

			//check stakingbalance at token farm after unstaking
			result = await tokenFarm.stakingBalance(investor)
			assert.equal(result.toString(), tokens('0'), 'token farm mock dai wallet staking balance correct after unstaking')

			//check the staking status of the investor at the token farm after unstaking
			result = await tokenFarm.isStaking(investor)
			assert.equal(result.toString(), 'false', 'investor staking status correct after unstaking')

		})
	})
})
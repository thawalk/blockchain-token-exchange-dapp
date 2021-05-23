import React, { Component } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadBlockChainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()

    //Load DaiToken
    const dappTokenData = DappToken.networks[networkId]
    if (dappTokenData) {
      // creating a web3 version of the contract
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      //store the token contract in the state
      this.setState({ dappToken })
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({ dappTokenBalance: dappTokenBalance.toString() })
    }
    else {
      window.alert('DappToken contract not deployed to detected network.')
    }

    //Load DappToken
    const daiTokenData = DaiToken.networks[networkId]
    if (daiTokenData) {
      // creating a web3 version of the contract
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      //store the token contract in the state
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
    }
    else {
      window.alert('DaiToken contract not deployed to detected network.')
    }


    //Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      // creating a web3 version of the contract
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      //store the token contract in the state
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    }
    else {
      window.alert('DaiToken contract not deployed to detected network.')
    }

    this.setState({ loading: false })

  }

  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                <h1>Hello, World!</h1>

              </div>
            </main>
          </div>
        </div> 
      </div>
    );
  }
}

export default App;

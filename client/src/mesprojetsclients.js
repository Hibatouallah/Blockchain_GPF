import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Button,Row,Image,Col,Table} from "react-bootstrap"
import addicon from './img/add.png';
import deleteicon from './img/delete.png';
import updateicon from './img/update.png';

class mesprojetsclients extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        clients : null,
        client : null,
        nbclientengage:0,
        nbclient : 0,
        clientengage:[]        
    }

    componentDidMount = async () => {

        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            ethereum.enable()
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts()

        // Get the current chain id
        const chainid = parseInt(await web3.eth.getChainId())
     
        this.setState({
            web3,
            accounts,
            chainid
        }, await this.loadInitialContracts)
        const clients = await this.loadContract("dev", "EngagementClient")
        var nb =  await clients.methods.getlisteclientengage().call()
        this.setState({nbclientengage:nb})

        const client = await this.loadContract("dev", "Client")
        var nb =  await client.methods.listeclient().call()
        this.setState({nbclient:nb})
        var ci = ""
        for (var i=0; i < nb; i++) {
          const wallet = await client.methods.getwalletAddress(i).call()
          if(accounts[0] == wallet){
            ci = await client.methods.getcin(i).call()
          }
        }
        for (var i=0; i < nb; i++) {
            const cin = await clients.methods.getcin(i).call()
            if(cin == ci)
            {
                const ref = await clients.methods.getreferenceclient(i).call() 
                const type = await clients.methods.gettypecontract(i).call()            
                const list =[{
                    cinclient : cin,
                    reference: ref, 
                    typecontrat: type
                }]
                this.setState({
                    clientengage:[...this.state.clientengage,list] 
                })
            }
           
        }
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const fonds = await this.loadContract("dev", "Fonds")

        if (!fonds) {
            return
        }
        this.setState({
            fonds
        })
    }
 
    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const {web3} = this.state

        // Get the address of the most recent deployment from the deployment map
        let address
        try {
            address = map[chain][contractName][0]
        } catch (e) {
            console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
            return undefined
        }

        // Load the artifact with the specified address
        let contractArtifact
        try {
            contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        return new web3.eth.Contract(contractArtifact.abi, address)
    }

    handleChange = (ref)  =>{
        localStorage.setItem('refprojet',ref);
        this.props.history.push("/Confirmerclient");
      }
    render() {
    
        const {
            web3, accounts, chainid,fonds
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!fonds) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
     
        return (<div className="container">
          
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
            <br/>
           
            <Table responsive >
                <thead>
                    <tr>
                    <th>Votre CIN</th>
                    <th>Reference projet</th>
                    <th>Type de contrat</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.clientengage.map((list) =>
                    <tr>
                           
                            <td>{list[0].cinclient}</td>
                            <td>{list[0].reference}</td>
                            <td>{list[0].typecontrat}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default mesprojetsclients

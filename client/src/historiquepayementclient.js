import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table,Image} from "react-bootstrap"
import updateicon from './img/update.png'

class historiquepayementclient extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        EngagementClient : null,
        liste:[]        
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
        const EngagementClient = await this.loadContract("dev", "EngagementClient")
        const client = await this.loadContract("dev", "Client")
        var nb =  await client.methods.getliste_payement_historique().call()
        console.log(nb)
        for (var i=0; i < nb; i++) {
            const cin = await client.methods.getcinclient_historique(i).call()
            console.log(cin)
            if(cin == localStorage.getItem('cinclient'))
            {

                const reference = await client.methods.getreference_historique(i).call()
                const description = await client.methods.getdescription_historique(i).call()
                console.log(reference)
                console.log(description)
                const list =[{
                        descriptionistorique: description, 
                        referenceprojet : reference
                    }]
                    this.setState({
                        liste:[...this.state.liste,list] 
                    })
                }
            }        
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const EngagementClient = await this.loadContract("dev", "EngagementClient")

        if (!EngagementClient) {
            return
        }
        this.setState({
            EngagementClient
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



    render() {
    
        const {
            web3, accounts, chainid,EngagementClient
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!EngagementClient) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
     
        return (<div className="container">
           {localStorage.getItem('isclient') != 'true' &&
             this.props.history.push("/Loginclient")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
            <br/>
         
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>referenceprojet</th>
                    <th>Description</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.liste.map((list) =>
                    <tr>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].descriptionistorique}</td>
                            
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default historiquepayementclient

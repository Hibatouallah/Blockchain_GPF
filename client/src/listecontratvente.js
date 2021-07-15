import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table} from "react-bootstrap"

class listecontratijara extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        EngagementClient : null,
        nbcontrat:0,
        listecontrat:[]        
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
        var nb =  await EngagementClient.methods.getlistecontratvente().call()
        this.setState({nbcontrat:nb})
        for (var i=0; i < nb; i++) {
        const cin = await EngagementClient.methods.getcinclientvente(i).call()
        const reference = await EngagementClient.methods.getreferenceprojetvente(i).call()
        const date= await EngagementClient.methods.getdatecontrat(i).call()
        const prix= await EngagementClient.methods.get_prixvente(i).call()

            const list =[{
                cinclient: cin, 
                referenceprojet : reference,
                datecontrat : date,
                prixvente : prix,
            }]
            this.setState({
                listecontrat:[...this.state.listecontrat,list] 
            })
       
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

    ajouter = async event => {
        this.props.history.push("/ajouterprojet");
      }
   
    handleaddcontrats = async event => {
        this.props.history.push("/ajouteravantcontrat");
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
          
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
            <br/>
            <Container>
            <Row>
                <Col xs={12} md={8}>
                </Col>
                <Col xs={6} md={4}>
                </Col>
            </Row>
            </Container>
           <br/><br/>
           <h3>Liste de contrats de vente </h3>
            <Table responsive >
                <thead>
                    <tr>
                    <th>cinclient</th>
                    <th>referenceprojet</th>
                    <th>datecontrat</th>
                    <th>prixvente</th>
                    
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listecontrat.map((list) =>
                    <tr>
                            <td>{list[0].cinclient}</td>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].datecontrat}</td>
                            <td>{list[0].prixvente}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default listecontratijara

import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table,Image} from "react-bootstrap"
import updateicon from './img/update.png'

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
        var nb =  await EngagementClient.methods.getliste_contrat_ijaramontahiyabitamlik().call()
        this.setState({nbcontrat:nb})
       
        for (var i=0; i < nb; i++) {
        const cin = await EngagementClient.methods.getcinclientijara(i).call()
        const reference = await EngagementClient.methods.getreferenceprojetijara(i).call()
        const date= await EngagementClient.methods.getdate_resuliation(i).call()
        const cession = await EngagementClient.methods.getcession_du_bien(i).call()
        const montantpar = await EngagementClient.methods.getmontantpartranche(i).call()
        const montant_loy = await EngagementClient.methods.getmontant_loyer(i).call()
        const duree_contra = await EngagementClient.methods.getduree_contratijara(i).call()
            
            const list =[{
                num : i,
                cinclient: cin, 
                referenceprojet : reference,
                date_resuliation : date,
                cession_du_bien : cession,
                montantpartranche: montantpar, 
                montant_loyer: montant_loy,
                duree_contrat :duree_contra
            }]
            this.setState({
                listecontrat:[...this.state.listecontrat,list] 
            })
            console.log(this.state.listecontrat)
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

 
   
    handlemodifier = async(ref) => {
        localStorage.setItem("referenceijara",ref)
        this.props.history.push("/fondsmodifiercontratijara");
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
           {localStorage.getItem('isfonds') != 'true' &&
             this.props.history.push("/Loginfonds")
            }
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
           <h3 class ='h3style'>Liste de contrats Ijara </h3>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>Action</th>
                    <th>cinclient</th>
                    <th>referenceprojet</th>
                    <th>date_resuliation</th>
                    <th>cession_du_bien</th>
                    <th>montantpartranche</th>
                    <th>montant_loyer</th>
                    <th>duree_contrat</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listecontrat.map((list) =>
                    <tr>
                            <td><Image onClick={() => this.handlemodifier(list[0].referenceprojet)} src={updateicon} roundedCircle /></td>
                            <td>{list[0].cinclient}</td>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].date_resuliation}</td>
                            <td>{list[0].cession_du_bien}</td>
                            <td>{list[0].montantpartranche}</td>
                            <td>{list[0].montant_loyer}</td>
                            <td>{list[0].duree_contrat}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default listecontratijara

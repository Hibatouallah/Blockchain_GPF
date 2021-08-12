import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table,Image} from "react-bootstrap"
import updateicon from './img/update.png'
class ListeContratsmorabaha extends Component {
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
        var nb =  await EngagementClient.methods.getListecontratmorabaha().call()
        this.setState({nbcontrat:nb})
  
        for (var i=0; i < nb; i++) {
            const cin = await EngagementClient.methods.getcinclient(i).call()
            const reference = await EngagementClient.methods.getreferenceprojet(i).call()
            const estimation = await EngagementClient.methods.getestimationpenalite(i).call()
            const cout = await EngagementClient.methods.getcoutderevien(i).call()
            const marg = await EngagementClient.methods.getmarge(i).call()
            const prix = await EngagementClient.methods.getprixvente(i).call()
            const duree_ammort = await EngagementClient.methods.getduree_ammortissement(i).call()
            const montantchois = await EngagementClient.methods.getmontantchoisi(i).call()
            const montant_Mensuel = await EngagementClient.methods.getmontant_Mensuelle(i).call()
            const montant_trimestrie = await EngagementClient.methods.getmontant_trimestriel(i).call()
            const montant_semestri = await EngagementClient.methods.getmontant_semestriel(i).call()
            const montant_annue = await EngagementClient.methods.getmontant_annuel(i).call()
            const assurancetakafu = await EngagementClient.methods.getassurancetakaful(i).call()
            const duree_contra = await EngagementClient.methods.getduree_contrat(i).call()
            
            const list =[{
                cinclient: cin, 
                referenceprojet : reference,
                estimationpenalite : estimation,
                coutderevien : cout,
                marge : marg,
                prixvente: prix, 
                duree_ammortissement: duree_ammort,
                montantchoisi :montantchois,
                montant_Mensuelle : montant_Mensuel,
                montant_trimestriel: montant_trimestrie,
                montant_semestriel: montant_semestri,
                montant_annuel: montant_annue,
                assurancetakaful: assurancetakafu,
                duree_contrat: duree_contra
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

    handlemodifier = async(ref) => {
        localStorage.setItem("referencemorabaha",ref)
        this.props.history.push("/fondsmodifiercontratmourabaha");
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
          
           <h3 class ='h3style'>Liste de contrats Morabaha </h3>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>Action</th>
                    <th>cinclient</th>
                    <th>referenceprojet</th>
                    <th>estimationpenalite</th>
                    <th>coutderevien</th>
                    <th>marge</th>
                    <th>prixvente</th>
                    <th>duree_ammortissement</th>
                    <th>montantchoisi</th>
                    <th>montant_Mensuelle</th>
                    <th>montant_trimestriel</th>
                    <th>montant_semestriel</th>
                    <th>montant_annuel</th>
                    <th>assurancetakaful</th>
                    <th>duree_contrat</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listecontrat.map((list) =>
                    <tr>
                            <td><Image onClick={() => this.handlemodifier(list[0].referenceprojet)} src={updateicon} roundedCircle /></td>
                            <td>{list[0].cinclient}</td>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].estimationpenalite}</td>
                            <td>{list[0].coutderevien}</td>
                            <td>{list[0].marge}</td>
                            <td>{list[0].prixvente}</td>
                            <td>{list[0].duree_ammortissement}</td>
                            <td>{list[0].montantchoisi}</td>
                            <td>{list[0].montant_Mensuelle}</td>
                            <td>{list[0].montant_trimestriel}</td>
                            <td>{list[0].montant_semestriel}</td>
                            <td>{list[0].montant_annuel}</td>
                            <td>{list[0].assurancetakaful}</td>
                            <td>{list[0].duree_contrat}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default ListeContratsmorabaha

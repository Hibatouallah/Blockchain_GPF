import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table} from "react-bootstrap"

class listecontratistisnaa extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        EngagamentPromoteur : null,
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
        const EngagamentPromoteur = await this.loadContract("dev", "EngagamentPromoteur")
        var nb =  await EngagamentPromoteur.methods.getListecontratistisnaa().call()
        this.setState({nbcontrat:nb})
        for (var i=0; i < nb; i++) {
        
        const numero = await EngagamentPromoteur.methods.getnumero_rc_istisnaa(i).call()
        const reference = await EngagamentPromoteur.methods.getreferenceprojet_istisnaa(i).call()
        const date_commenc= await EngagamentPromoteur.methods.getdate_commencement_istisnaa(i).call()
        const date_livraison= await EngagamentPromoteur.methods.getdate_livraison_bien(i).call()
        const modalite= await EngagamentPromoteur.methods.getmodalite_paiement_bien(i).call()
        const nature= await EngagamentPromoteur.methods.getnature_projet(i).call()

            const list =[{
                numero_rc: numero, 
                referenceprojet : reference,
                date_commencement : date_commenc,
                date_livraison_bien : date_livraison,
                modalite_paiement : modalite,
                nature_projet : nature
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
        const EngagamentPromoteur = await this.loadContract("dev", "EngagamentPromoteur")

        if (!EngagamentPromoteur) {
            return
        }
        this.setState({
            EngagamentPromoteur
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
            web3, accounts, chainid,EngagamentPromoteur
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!EngagamentPromoteur) {
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
           <h3>Liste de contrats Istisnaa </h3>
            <Table responsive >
                <thead>
                    <tr>
                    <th>numero_rc</th>
                    <th>referenceprojet</th>
                    <th>date_commencement</th>
                    <th>date_livraison_bien</th>
                    <th>modalite_paiement</th>
                    <th>nature_projet</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listecontrat.map((list) =>
                    <tr>
                            <td>{list[0].numero_rc}</td>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].date_commencement}</td>
                            <td>{list[0].date_livraison_bien}</td>
                            <td>{list[0].modalite_paiement}</td>
                            <td>{list[0].nature_projet}</td>
                    </tr>
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default listecontratistisnaa

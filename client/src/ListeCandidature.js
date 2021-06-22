import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Container,Row,Image,Col,Table} from "react-bootstrap"
import addicon from './img/add.png';
import deleteicon from './img/delete.png';
import updateicon from './img/update.png';

class listeprojets extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        promoteurs : null,
        nbcandidature:0,
        listecandidature:[]        
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
        const promoteurs = await this.loadContract("dev", "Promoteur")
        var nb =  await promoteurs.methods.listecandidature().call()
        this.setState({nbcandidature:nb})

        for (var i=0; i < nb; i++) {
            const ref = await promoteurs.methods.getreference(i).call()
            const cahier = await promoteurs.methods.getcahier_prestation_speciale(i).call()
            const bordereau = await promoteurs.methods.getbordereau_prix_detail_estimatif(i).call()
            const present = await promoteurs.methods.getpresent_reglement_consultation(i).call()
            const modele_acte = await promoteurs.methods.getmodele_acte_engagement(i).call()
            const modele_declaration = await promoteurs.methods.getmodele_declaration_honneur(i).call()
            
            const list =[{
                reference: ref, 
                cahier_prestation_speciale : cahier,
                bordereau_prix_detail_estimatif : bordereau,
                present_reglement_consultation : present,
                modele_acte_engagement : modele_acte,
                modele_declaration_honneur: modele_declaration, 
            }]
            this.setState({
                listecandidature:[...this.state.listecandidature,list] 
            })
       
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
                    <th >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action</th>
                    <th>reference</th>
                    <th>cahier_prestation_speciale</th>
                    <th>bordereau_prix_detail_estimatif</th>
                    <th>present_reglement_consultation</th>
                    <th>modele_acte_engagement</th>
                    <th>modele_declaration_honneur</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listecandidature.map((list) =>
                    <tr>
                            <td><Image  onClick={this.handlepomoteur} src={deleteicon} roundedCircle />
                            <Image onClick={this.handlepomoteur} src={updateicon} roundedCircle /></td>
                            <td>{list[0].reference}</td>
                            <td>{list[0].cahier_prestation_speciale}</td>
                            <td>{list[0].bordereau_prix_detail_estimatif}</td>
                            <td>{list[0].present_reglement_consultation}</td>
                            <td>{list[0].modele_acte_engagement}</td>
                            <td>{list[0].modele_declaration_honneur}</td>
                            
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default listeprojets

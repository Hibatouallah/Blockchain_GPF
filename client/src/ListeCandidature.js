import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Button,Table} from "react-bootstrap"


class ListeCandidature extends Component {

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
            const account = await promoteurs.methods.getaccountpromoteur(i).call()
            const nu_rc = await promoteurs.methods.getnumero_rccandidature(i).call()
            const ref = await promoteurs.methods.getreference(i).call()
            const cahier = await promoteurs.methods.getcahier_prestation_speciale(i).call()
            const bordereau = await promoteurs.methods.getbordereau_prix_detail_estimatif(i).call()
            const present = await promoteurs.methods.getpresent_reglement_consultation(i).call()
            const modele_acte = await promoteurs.methods.getmodele_acte_engagement(i).call()
            const modele_declaration = await promoteurs.methods.getmodele_declaration_honneur(i).call()
            const cv = await promoteurs.methods.getcvpromoteur(i).call()
            const list =[{
                accountpromoteur : account,
                reference: ref, 
                cahier_prestation_speciale : cahier,
                bordereau_prix_detail_estimatif : bordereau,
                present_reglement_consultation : present,
                modele_acte_engagement : modele_acte,
                modele_declaration_honneur: modele_declaration, 
                cvpromoteur : cv,
                numero_rc : nu_rc
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
    handleChange = async(ref,accountpromoteur) =>{
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
        const promoteur = await this.loadContract("dev", "Promoteur")
        
        var _message = " Félicitation,vous etes choisi comme promoteur pour le projet avec la reference :"+ref+",veuillez completer la procédure d'engagement"
        var result = await promoteur.methods.ajouternotification(_message,accountpromoteur).send({from: accounts[0]})
        var nb = await promoteur.methods.listecandidature().call()
        console.log(nb)
        for(var i = 0;i<nb;i++){
            var account = await promoteur.methods.getaccountpromoteur(i).call()
            console.log(account)
            if(account == accountpromoteur){
                const reference = await promoteur.methods.getreference(i).call()
                console.log(reference)
                console.log(ref)
                if(reference == ref){
                    var result2 = await promoteur.methods.confirmercandidature(i).send({from: accounts[0]})
                    alert("Message est envoyé au promoteur ") 
                }  
            }
        }
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
           {localStorage.getItem('isfonds') != 'true' &&
             this.props.history.push("/LoginFonds")
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
                    <th>Confirmer</th>
                    <th>reference</th>
                    <th>numero_rc</th>
                    <th>CV</th>
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
                            <td><Button variant="dark" onClick={() => this.handleChange(list[0].reference,list[0].accountpromoteur)}>Confirmer</Button></td>
                            <td>{list[0].reference}</td>
                            <td>{list[0].numero_rc}</td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].cvpromoteur}`}>cv.pdf</a></td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].cahier_prestation_speciale}`}>cahier_prestation_speciale.pdf</a></td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].bordereau_prix_detail_estimatif}`}>bordereau_prix_detail_estimatif.pdf</a></td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].present_reglement_consultation}`}>present_reglement_consultation.pdf</a></td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].modele_acte_engagement}`}>modele_acte_engagement.pdf</a></td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].modele_declaration_honneur}`}>modele_declaration_honneur.pdf</a></td>
                            
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default ListeCandidature


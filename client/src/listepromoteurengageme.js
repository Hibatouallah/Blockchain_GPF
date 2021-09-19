import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Button,Table,FormGroup,FormControl,Col} from "react-bootstrap"

const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class listepromoteurengageme extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        engagementpromoteur : null,
        listepromoteurengage:[],
        buffercontrat : null ,
        contrat : null    
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
        var nb =  await engagementpromoteur.methods.getlistepromoteurengage().call()
      
        for (var i=0; i < nb; i++) {
            const account = await engagementpromoteur.methods.getaccountpromoteur(i).call()
            const reference = await engagementpromoteur.methods.getreferencepromoteur(i).call()
            const assurances_respons = await engagementpromoteur.methods.getassurances_responsabilites_civile(i).call()
            const assurance_rique = await engagementpromoteur.methods.getassurance_rique_chantier(i).call()
            const assurance_accident = await engagementpromoteur.methods.getassurance_accident_travail(i).call()
            const contrat = await engagementpromoteur.methods.getcontrat(i).call()
            
            const list =[{
                accountpromoteur : account,
                referencepromoteur: reference, 
                assurances_responsabilites_civile : assurances_respons,
                assurance_rique_chantier : assurance_rique,
                assurance_accident_travail : assurance_accident,
                contrat : contrat,
                index : i
            }]
            this.setState({
                listepromoteurengage:[...this.state.listepromoteurengage,list] 
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
        const promoteur = await this.loadContract("dev", "Promoteur")
        console.log(accountpromoteur)
        console.log(ref)
        var _message = " Félicitation,vous etes choisi comme promoteur pour le projet avec la reference :"+ref
        var result = await promoteur.methods.ajouternotification(_message,accountpromoteur).send({from: accounts[0]})
        var result2 = await engagementpromoteur.methods.ajouterprojetpromoteur(accountpromoteur,ref).send({from: accounts[0]})
        this.props.history.push("/listeprojetsencours");
    }
    ajoutercontrat= async(event)=>{
        // Get network provider and web3 instance.
        event.preventDefault()
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
     
        var contrat = null
        console.log(this.state.buffercontrat)
        if (this.state.buffercontrat){
            const file = await ipfs.add(this.state.buffercontrat)
            contrat = file[0]["hash"]
            console.log(contrat)
        }
        
        var result = await engagementpromoteur.methods.modifiercontrat(localStorage.getItem('index'),contrat).send({from: accounts[0]})
          alert("Contrat envoyé")
          this.props.history.push("./listepromoteurengageme")
      }
      onChangeHandlercontrat=event=>{
        event.preventDefault()
        //Process file for IPFS ....
        const file = event.target.files[0]
        console.log(file)
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({buffercontrat : Buffer.from(reader.result)})
        }
        this.ajoutercontrat(event)
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
                    <th>Envoyer_contrat</th>
                    <th>Confirmer</th>
                    <th>accountpromoteur</th>
                    <th>referencepromoteur</th>
                    <th>assurances_responsabilites_civile</th>
                    <th>assurance_rique_chantier</th>
                    <th>assurance_accident_travail</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listepromoteurengage.map((list) =>
                    <tr>
                           <td>
                             {localStorage.setItem('index',list[0].index)}
                                { list[0].contrat == "" &&
                               
                                <FormGroup as={Col} controlId="contrat" bsSize="large">
                                <FormControl
                                    onChange={this.onChangeHandlercontrat}
                                    type="file"
                                />
                                </FormGroup>
                                }
                                 { list[0].contrat != "" &&
                               
                               <a href={`https://ipfs.infura.io/ipfs/${list[0].contrat}`}>contrat.pdf</a>
                               }
                            </td>
                            <td><Button variant="dark" onClick={() => this.handleChange(list[0].referencepromoteur,list[0].accountpromoteur)}>Confirmer</Button></td>
                            <td>{list[0].accountpromoteur}</td>
                            <td>{list[0].referencepromoteur}</td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].assurances_responsabilites_civile}`}>assurances_responsabilites_civile.pdf</a></td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].assurance_rique_chantier}`}>assurance_rique_chantier.pdf</a></td>
                            <td><a href={`https://ipfs.infura.io/ipfs/${list[0].assurance_accident_travail}`}>assurance_accident_travail.pdf</a></td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default listepromoteurengageme


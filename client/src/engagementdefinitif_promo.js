import React, { Component } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Form
} from "react-bootstrap";
import LoaderButton from "./containers/LoaderButton";
import "./containers/Signup.css";
import ImageUploader from 'react-images-upload';
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class engagementdefinitif_promo extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        engagementpromoteur : null,
        accountpromoteur : null,
        referencepromoteur:null,
        bufferassurances_responsabilites_civile  : null,
        bufferassurance_rique_chantier  : null,
        bufferassurance_accident_travail  : null,
        assurances_responsabilites_civile  : null,
        assurance_rique_chantier  : null,
        assurance_accident_travail  : null,
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

    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")

        if (!engagementpromoteur) {
            return
        }
        this.setState({
            engagementpromoteur
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

    ajouterpromoteurengage = async (e) => {
        const {accounts,engagementpromoteur,cahier_prestation_speciale,bordereau_prix_detail_estimatif,present_reglement_consultation,modele_acte_engagement,modele_declaration_honneur} = this.state
        e.preventDefault()
        const fonds = await this.loadContract("dev", "Fonds")
        var nb = await engagementpromoteur.methods.getlistepromoteurengage().call()
        console.log(nb)
            /* assurances_responsabilites_civile */
            if (this.state.bufferassurances_responsabilites_civile){
                const file = await ipfs.add(this.state.bufferassurances_responsabilites_civile)
                this.state.assurances_responsabilites_civile = file[0]["hash"]
                console.log(this.state.assurances_responsabilites_civile)
            }
            /* assurance_rique_chantier */
            if (this.state.bufferassurance_rique_chantier){
                const file = await ipfs.add(this.state.bufferassurance_rique_chantier)
                this.state.assurance_rique_chantier = file[0]["hash"]
                console.log(this.state.assurance_rique_chantier)
            }

            /* assurance_accident_travail */
            if (this.state.bufferassurance_accident_travail){
                const file = await ipfs.add(this.state.bufferassurance_accident_travail)
                this.state.assurance_accident_travail = file[0]["hash"]
                console.log(this.state.assurance_accident_travail)
            }
            
            var _assurances_responsabilites_civile = this.state.assurances_responsabilites_civile
            var _assurance_rique_chantier = this.state.assurance_rique_chantier
            var _assurance_accident_travail = this.state.assurance_accident_travail

        if(nb == 0){
            var result = await engagementpromoteur.methods.ajouterpromoteurengage(accounts[0],localStorage.getItem('reference_proj_eng_pro'),_assurances_responsabilites_civile,_assurance_rique_chantier,_assurance_accident_travail).send({from: accounts[0]})
            alert("Félicitation,vous etes engagé")
            this.props.history.push("/Listeprojetspromoteur");
        }
        else{
            for(var i = 0;i<nb;i++){
                var account = await engagementpromoteur.methods.getaccountpromoteur(i).call()
                console.log(account)
                if(account == accounts[0])
                {
                    var ref = await engagementpromoteur.methods.getreferencepromoteur(i).call()
                    if(ref == localStorage.getItem("reference_proj_eng_pro"))
                    {
                        alert("vous avez déja confirmer votre engagement")
                    }
                    else{
                        var result = await engagementpromoteur.methods.ajouterpromoteurengage(accounts[0],localStorage.getItem('reference_proj_eng_pro'),_assurances_responsabilites_civile,_assurance_rique_chantier,_assurance_accident_travail).send({from: accounts[0]})
                        var _message = "la procédure d'engagement est complété par le promoteur du projet avec la reference"+localStorage.getItem('reference_proj_eng_pro')
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                        alert("La confirmation est envoyée")
                        this.props.history.push("/");
                            
                    }
                }
            }
        }
    }
 
    onChangeHandlerassurances_responsabilites_civile=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferassurances_responsabilites_civile : Buffer.from(reader.result)})
      }
    }
    onChangeHandlerassurance_rique_chantier=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferassurance_rique_chantier : Buffer.from(reader.result)})
      }
    }
    onChangeHandlerassurance_accident_travail=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferassurance_accident_travail : Buffer.from(reader.result)})
      }
    }
  

    render() {

      const {
        web3, accounts, chainid,engagementpromoteur
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!engagementpromoteur) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
      return (
        <div className="container">
            {localStorage.getItem('ispromoteur') != 'true' &&
             this.props.history.push("/Loginpromoteur")
             }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
          <div className="Login">
            <form enctype ="multipart/form-data" onSubmit={(e) => this.ajouterpromoteurengage(e)}>
            <h3>Confirmer l'engagement:</h3>
            <FormGroup controlId="assurances_responsabilites_civile" bsSize="large">
              <FormLabel>assurances_responsabilites_civile</FormLabel>
              <input type="file" name="assurances_responsabilites_civile" onChange={this.onChangeHandlerassurances_responsabilites_civile}/>
            </FormGroup>

            <FormGroup controlId="assurance_rique_chantier" bsSize="large">
              <FormLabel>assurance_rique_chantier</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerassurance_rique_chantier}
              />
            </FormGroup>
            <FormGroup controlId="assurance_accident_travail" bsSize="large">
              <FormLabel>assurance_accident_travail</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerassurance_accident_travail}
              />
            </FormGroup>

              <LoaderButton
              block
              bsSize="large"
              text="Ajouter"
              type="submit"
              />
              <br/>
              </form>
          </div>
        </div>);
    }
}

export default engagementdefinitif_promo

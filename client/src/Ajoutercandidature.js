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

class Ajoutercandidature extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        promoteur : null,
        cahier_prestation_speciale:null,
        bordereau_prix_detail_estimatif:null,
        present_reglement_consultation:null,
        modele_acte_engagement: null,
        modele_declaration_honneur : null,
        cvpromoteur : null,
        buffercahier_prestation_speciale  : null,
        bufferbordereau_prix_detail_estimatif  : null,
        bufferpresent_reglement_consultation  : null,
        buffermodele_acte_engagement  : null,
        buffermodele_declaration_honneur  : null,
        buffercvpromoteur  : null,
        cvpromoteur  : null,
        modele_declaration_honneur  : null,
        modele_acte_engagement  : null,
        present_reglement_consultation  : null,
        bordereau_prix_detail_estimatif  : null,
        cahier_prestation_speciale  : null
      
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
        const promoteur = await this.loadContract("dev", "Promoteur")

        if (!promoteur) {
            return
        }
        this.setState({
            promoteur
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

    ajoutercandidature = async (e) => {
        const {accounts,promoteur,cahier_prestation_speciale,bordereau_prix_detail_estimatif,present_reglement_consultation,modele_acte_engagement,modele_declaration_honneur} = this.state
        e.preventDefault()

      /* cahier_prestation_speciale */
      if (this.state.buffercahier_prestation_speciale){
        const file = await ipfs.add(this.state.buffercahier_prestation_speciale)
        this.state.cahier_prestation_speciale = file[0]["hash"]
        console.log(this.state.cahier_prestation_speciale)
      }
       /* bordereau_prix_detail_estimatif */
       if (this.state.bufferbordereau_prix_detail_estimatif){
        const file = await ipfs.add(this.state.bufferbordereau_prix_detail_estimatif)
        this.state.bordereau_prix_detail_estimatif = file[0]["hash"]
        console.log(this.state.bordereau_prix_detail_estimatif)
      }
      
      /* present_reglement_consultation */
      if (this.state.bufferpresent_reglement_consultation){
        const file = await ipfs.add(this.state.bufferpresent_reglement_consultation)
        this.state.present_reglement_consultation = file[0]["hash"]
        console.log(this.state.present_reglement_consultation)
      }
      /* modele_acte_engagement */
      if (this.state.buffermodele_acte_engagement){
        const file = await ipfs.add(this.state.buffermodele_acte_engagement)
        this.state.modele_acte_engagement = file[0]["hash"]
        console.log(this.state.modele_acte_engagement)
      }
    /* modele_declaration_honneur */
    if (this.state.buffermodele_declaration_honneur){
      const file = await ipfs.add(this.state.buffermodele_declaration_honneur)
      this.state.modele_declaration_honneur = file[0]["hash"]
      console.log(this.state.modele_declaration_honneur)
    }
      /* cvpromoteur */
      if (this.state.buffercvpromoteur){
        const file = await ipfs.add(this.state.buffercvpromoteur)
        this.state.cvpromoteur = file[0]["hash"]
        console.log(this.state.cvpromoteur)
      }


        var _cahier_prestation_speciale = this.state.cahier_prestation_speciale
        var _bordereau_prix_detail_estimatif = this.state.bordereau_prix_detail_estimatif
        var _present_reglement_consultation = this.state.present_reglement_consultation
        var _modele_acte_engagement = this.state.modele_acte_engagement
        var _modele_declaration_honneur = this.state.modele_declaration_honneur
        var _cvpromoteur = this.state.cvpromoteur
        
        var nb =  await promoteur.methods.listecandidature().call()
        var existe = false
        for (var i=0; i < nb; i++) {
          const ref = await promoteur.methods.getreference(i).call()
          if (ref == localStorage.getItem('refdetails')) {
            existe = true
          } 
        }
        if(existe == false){
          console.log(localStorage.getItem('refdetails'))
          var nb =  await promoteur.methods.listepromoteur().call()
          var _numero_rc = 0
          for (var i=0; i < nb; i++) {
            const wallet = await promoteur.methods.getwalletAddress(i).call()
            if(accounts[0] == wallet){
              _numero_rc = await promoteur.methods.getnumero_rc(i).call()
            }
          }
          var result = await promoteur.methods.ajoutercandidature(_numero_rc,localStorage.getItem('refdetails'),_cvpromoteur,accounts[0],_cahier_prestation_speciale,_bordereau_prix_detail_estimatif,_present_reglement_consultation,_modele_acte_engagement,_modele_declaration_honneur).send({from: accounts[0]})
          alert("Candidature ajouté")
          this.props.history.push("/promoteurcandidature");
          }
          else {
            alert("Projet déja existe")
          }
          
    }
 
    onChangeHandlermodele_declaration_honneur=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({buffermodele_declaration_honneur : Buffer.from(reader.result)})
      }
    }
    onChangeHandlermodele_acte_engagement=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({buffermodele_acte_engagement : Buffer.from(reader.result)})
      }
    }
    onChangeHandlerpresent_reglement_consultation=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferpresent_reglement_consultation : Buffer.from(reader.result)})
      }
    }
  
    onChangeHandlerbordereau_prix_detail_estimatif=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferbordereau_prix_detail_estimatif : Buffer.from(reader.result)})
      }
    }
  
    onChangeHandlercahier_prestation_speciale=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({buffercahier_prestation_speciale : Buffer.from(reader.result)})
      }  
    }
    onChangeHandlercvpromoteur=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({buffercvpromoteur: Buffer.from(reader.result)})
      } 
    }
    render() {

      const {
        web3, accounts, chainid,promoteur
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!promoteur) {
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
            <form enctype ="multipart/form-data" onSubmit={(e) => this.ajoutercandidature(e)}>
            <h3>Candidature:</h3>
            <FormGroup controlId="cahier_prestation_speciale" bsSize="large">
              <FormLabel>cahier_prestation_speciale</FormLabel>
              <input type="file" name="cahier_prestation_speciale" onChange={this.onChangeHandlercahier_prestation_speciale}/>
            </FormGroup>

            <FormGroup controlId="bordereau_prix_detail_estimatif" bsSize="large">
              <FormLabel>bordereau_prix_detail_estimatif</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerbordereau_prix_detail_estimatif}
              />
            </FormGroup>
            <FormGroup controlId="present_reglement_consultation" bsSize="large">
              <FormLabel>present_reglement_consultation</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerpresent_reglement_consultation}
              />
            </FormGroup>

            <FormGroup controlId="modele_acte_engagement" bsSize="large">
              <FormLabel>modele_acte_engagement</FormLabel>
              <FormControl
                onChange={this.onChangeHandlermodele_acte_engagement}
                type="file"
              />
            </FormGroup>
            <FormGroup controlId="modele_declaration_honneur" bsSize="large">
              <FormLabel>modele_declaration_honneur</FormLabel>
              <FormControl
                onChange={this.onChangeHandlermodele_declaration_honneur}
                type="file"
              />
            </FormGroup>
            <FormGroup controlId="cvpromoteur" bsSize="large">
              <FormLabel>cv</FormLabel>
              <FormControl
                onChange={this.onChangeHandlercvpromoteur}
                type="file"
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

export default Ajoutercandidature

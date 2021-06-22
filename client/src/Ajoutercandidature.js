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
import axios from 'axios';

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
        modele_declaration_honneur : null
      
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

    ajouterprojet = async (e) => {
        const {accounts,promoteur,cahier_prestation_speciale,bordereau_prix_detail_estimatif,present_reglement_consultation,modele_acte_engagement,modele_declaration_honneur} = this.state
        e.preventDefault()

      /* cahier_prestation_speciale */
      const data1 =  new FormData()
      data1.append('file', this.state.cahier_prestation_speciale)
      axios.post("http://localhost:8000/upload", data1, { 
        // receive two    parameter endpoint url ,form data
      })
      .then(res => { // then print response status
          console.log(res.statusText)
      })
       /* bordereau_prix_detail_estimatif */
      const data2 = new FormData()
      data2.append('file', this.state.bordereau_prix_detail_estimatif)
      axios.post("http://localhost:8000/upload", data2, { 
          // receive two    parameter endpoint url ,form data
        })
      .then(res => { // then print response status
          console.log(res.statusText)
      })
      
      /* present_reglement_consultation */
      const data3 = new FormData()
      data3.append('file', this.state.present_reglement_consultation)
      axios.post("http://localhost:8000/upload", data3, { 
             // receive two    parameter endpoint url ,form data
      })
      .then(res => { // then print response status
          console.log(res.statusText)
      })
      /* modele_acte_engagement */
      const data4 = new FormData()
      data4.append('file', this.state.modele_acte_engagement)
      axios.post("http://localhost:8000/upload", data4, { 
          // receive two    parameter endpoint url ,form data
        })
      .then(res => { // then print response status
          console.log(res.statusText)
      })
    /* modele_declaration_honneur */
      const data6 = new FormData()
      data6.append('file', this.state.modele_declaration_honneur)
      axios.post("http://localhost:8000/upload", data6, { 
                // receive two    parameter endpoint url ,form data
      })
      .then(res => { // then print response status
          console.log(res.statusText)
      })
      
        var _cahier_prestation_speciale = cahier_prestation_speciale.name
        var _bordereau_prix_detail_estimatif = bordereau_prix_detail_estimatif.name
        var _present_reglement_consultation = present_reglement_consultation.name
        var _modele_acte_engagement = modele_acte_engagement.name
        var _modele_declaration_honneur = modele_declaration_honneur.name

        var nb =  await promoteur.methods.listecandidature().call()
        var existe = false
        for (var i=0; i < nb; i++) {
          const ref = await promoteur.methods.getreference(i).call()
          if (ref == localStorage.getItem('refdetails')) {
            existe = true
          } 
        }
        if(existe == false){
          var result = await promoteur.methods.ajoutercandidature(localStorage.getItem('refdetails'),accounts[0],_cahier_prestation_speciale,_bordereau_prix_detail_estimatif,_present_reglement_consultation,_modele_acte_engagement,_modele_declaration_honneur).send({from: accounts[0]})
          alert("Candidature ajouté")
          this.props.history.push("/ListeCandidature");
        }
        else {
          alert("Produit déja existe")
        }
          
    }
 
    onChangeHandlermodele_declaration_honneur=event=>{
      this.setState({
        modele_declaration_honneur: event.target.files[0],
        loaded: 0,
      })
    }
    onChangeHandlermodele_acte_engagement=event=>{
      this.setState({
        modele_acte_engagement: event.target.files[0],
        loaded: 0,
      })
    }
    onChangeHandlerpresent_reglement_consultation=event=>{
      this.setState({
        present_reglement_consultation: event.target.files[0],
        loaded: 0,
      })
    }
  
    onChangeHandlerbordereau_prix_detail_estimatif=event=>{
      this.setState({
        bordereau_prix_detail_estimatif: event.target.files[0],
        loaded: 0,
      })
    }
  
    onChangeHandlercahier_prestation_speciale=event=>{
      this.setState({
        cahier_prestation_speciale: event.target.files[0],
        loaded: 0,
      })  
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
          
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
          <div className="Login">
            <form enctype ="multipart/form-data" onSubmit={(e) => this.ajouterprojet(e)}>
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

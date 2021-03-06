import React, { Component } from "react";
import {
  Col,
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
const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class ajouterprojet extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        fonds : null,
        selectedFile: null,
        reference : " ",
        cout_estimation_travaux: 0.0,
        delai_execution: 0,
        montant_caution_provisoire: 0.0,
        duree_validite_offre: 0,
        mesures_securites_hygiene: null,
        reception_provisoire_travaux: "",
        reception_definitive:"",
        cahier_prestations_techniques: null,
        normes_mise_en_oeuvre: null,
        localisation: "",
        superficier : "",
        type_projet: "",
        nb_chambre: 0,
        terasse : "false",
        garage : "false",
        piscine : "false",
        balcon : "false",
        mini_hopital : "false",
        supermarche : "false",
        hamam : "false",
        mini_mosque : "false",
        pharmacie : "false",
        jardin : "false",
        etage : 0,
        image: null,
        imagesec1: null,
        imagesec2: null,
        imagesec3: null,
        descriptif : "",
        nb_client : 0,
        buffer : null,
        bufferimage : null,
        bufferimagesec1 : null,
        bufferimagesec2 : null,
        bufferimagesec3 : null,
        buffermesure : null,
        buffercahier : null,
        buffernorme  : null
    }
  
    validateForm() {
        return (
          
          this.state.reference.length > 0 &&
          !isNaN(parseFloat(this.state.cout_estimation_travaux))&&
          !isNaN(parseInt(this.state.nb_client))&&
          this.state.delai_execution.length > 0 &&
          !isNaN(parseFloat(this.state.montant_caution_provisoire)) &&
          this.state.duree_validite_offre.length > 0 &&
          this.state.mesures_securites_hygiene != " " &&
          this.state.reception_provisoire_travaux != " " &&
          this.state.cahier_prestations_techniques != " " &&
          this.state.normes_mise_en_oeuvre != " " &&
          this.state.localisation != " " &&
          this.state.superficier!= " "  &&
          this.state.type_projet != " " &&
          this.state.nb_chambre.length > 0 &&
          this.state.etage.length > 0 &&
          this.state.descriptif != " " &&
          this.state.imagesec1 != " " &&
          this.state.imagesec2 != " " &&
          this.state.imagesec3 != " " &&
          this.state.image != " " 
        );
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

    ajouterprojet = async (e) => {
        const {accounts,fonds,nb_client,jardin,balcon,mini_hopital,supermarche,hamam,mini_mosque,pharmacie,image,imagesec1,imagesec2,imagesec3,descriptif,reference,cout_estimation_travaux,delai_execution,montant_caution_provisoire,duree_validite_offre,mesures_securites_hygiene,reception_provisoire_travaux,reception_definitive,cahier_prestations_techniques,normes_mise_en_oeuvre,localisation,superficier,type_projet,nb_chambre,terasse,garage,piscine,etage} = this.state
        e.preventDefault()

      /* Image pricipale */ 
      if (this.state.bufferimage){
          const file = await ipfs.add(this.state.bufferimage)
          this.state.image = file[0]["hash"]
          console.log(this.state.image)
        
      }
       /* Image secondaire 1 */
       if (this.state.bufferimagesec1){
        const file = await ipfs.add(this.state.bufferimagesec1)
        this.state.imagesec1 = file[0]["hash"]
        console.log(this.state.imagesec1)
      }
      /* Image secondaire 2 */
      if (this.state.bufferimagesec2){
        const file = await ipfs.add(this.state.bufferimagesec2)
        this.state.imagesec2 = file[0]["hash"]
        console.log(this.state.imagesec2)
      }
      /* Image secondaire 3 */
      if (this.state.bufferimagesec3){
        const file = await ipfs.add(this.state.bufferimagesec3)
        this.state.imagesec3 = file[0]["hash"]
        console.log(this.state.imagesec3)
      }
      /* mesures_securites_hygiene */
      if (this.state.buffermesure){
        const file = await ipfs.add(this.state.buffermesure)
        this.state.mesures_securites_hygiene = file[0]["hash"]
        console.log(this.state.mesures_securites_hygiene)
      }
      /* cahier_prestations_techniques */
      if (this.state.buffercahier){
        const file = await ipfs.add(this.state.buffercahier)
        this.state.cahier_prestations_techniques = file[0]["hash"]
        console.log(this.state.cahier_prestations_techniques)
      }
      /* normes_mise_en_oeuvre */
      if (this.state.buffernorme){
        const file = await ipfs.add(this.state.buffernorme)
        this.state.normes_mise_en_oeuvre = file[0]["hash"]
        console.log(this.state.normes_mise_en_oeuvre)
      }
        var _nb_client = nb_client
        var _reference= reference
        var _cout_estimation_travaux = cout_estimation_travaux
        var _delai_execution = parseInt(delai_execution)
        var _montant_caution_provisoire = montant_caution_provisoire
        var _duree_validite_offre = parseInt(duree_validite_offre)
        var _mesures_securites_hygiene = this.state.mesures_securites_hygiene
        var _reception_provisoire_travaux = this.state.reception_provisoire_travaux
        var _cahier_prestations_techniques = this.state.cahier_prestations_techniques
        var _normes_mise_en_oeuvre = this.state.normes_mise_en_oeuvre
        var _localisation = localisation
        var _superficier = superficier
        var _type_projet = type_projet
        var _nb_chambre = parseInt(nb_chambre)
      
        var _terasse = terasse
        var _garage = garage
        var _piscine = piscine
        var _jardin = jardin
        var _balcon = balcon
        var _mini_hopital = mini_hopital
        var _supermarche = supermarche 
        var _hamam = hamam
        var _mini_mosque = mini_mosque
        var _pharmacie = pharmacie
        if (_terasse == "on"){
          _terasse = "oui"
        }else{
          _terasse = "non"
        }
        if (_garage == "on"){
          _garage = "oui"
        }else{
          _garage = "non"
        }
        if (_piscine == "on"){
         _piscine = "oui"
        }else{
          _piscine = "non"
        }
        if (_jardin == "on"){
          _jardin = "oui"
        }else{
          _jardin = "non"
        }
        if (_balcon == "on"){
          _balcon = "oui"
        }else{
          _balcon = "non"
        }
        if (_mini_hopital == "on"){
          _mini_hopital = "oui"
        }else{
          _mini_hopital = "non"
        }
       
        if (_supermarche == "on"){
          _supermarche = "oui"
        }else{
          _supermarche = "non"
        }
        if (_hamam == "on"){
          _hamam = "oui"
        }else{
          _hamam = "non"
        }
       
        if (_mini_mosque == "on"){
          _mini_mosque = "oui"
        }else{
          _mini_mosque = "non"
        }
        if (_pharmacie == "on"){
          _pharmacie = "oui"
        }else{
          _pharmacie = "non"
        }
        
        var _etage = parseInt(etage)
        var _image = this.state.image
        var _imagesec1 = this.state.imagesec1
        var _imagesec2 = this.state.imagesec2
        var _imagesec3 = this.state.imagesec3
        var _descriptif = descriptif

        var nb =  await fonds.methods.listeprojet().call()
        var existe = false
        for (var i=0; i < nb; i++) {
          const ref = await fonds.methods.getRef(i).call()
          if (ref == _reference) {
            existe = true
          } 
        }
        if(existe == false){
          var result = await fonds.methods.ajouterProjet(_nb_client,_mini_hopital,_supermarche,_hamam,_mini_mosque,_pharmacie,_reference,_image,_imagesec1,_imagesec2,_imagesec3,_cout_estimation_travaux,_delai_execution,_montant_caution_provisoire,_duree_validite_offre,_mesures_securites_hygiene,_reception_provisoire_travaux,_cahier_prestations_techniques,_normes_mise_en_oeuvre,_localisation,_descriptif,_superficier,_type_projet,_nb_chambre,_terasse,_garage,_piscine,_etage,_jardin,_balcon).send({from: accounts[0]})
          alert("Produit ajout??")
          this.props.history.push("/");
        }
        else {
          alert("Produit d??ja existe")
        }
          
    }
 
     onChangeHandlerimage = (event)=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferimage : Buffer.from(reader.result)})
      }
    }
    onChangeHandlerimagesec1= (event)=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferimagesec1 : Buffer.from(reader.result)})
      }
    }
    onChangeHandlerimagesec2= (event)=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferimagesec2 : Buffer.from(reader.result)})
      }
    }
    onChangeHandlerimagesec3= (event)=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({bufferimagesec3 : Buffer.from(reader.result)})
      }
    }
    onChangeHandlermesures_securites_hygiene= (event) =>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({buffermesure : Buffer.from(reader.result)})
      }
    }
  
    onChangeHandlercahier_prestations_techniques=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({buffercahier : Buffer.from(reader.result)})
      }
    }
  
    onChangeHandlernormes_mise_en_oeuvre=event=>{
      event.preventDefault()
      //Process file for IPFS ....
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
          this.setState({buffernorme : Buffer.from(reader.result)})
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
      return (
        <div className="container">
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
           
           <br/><br/>
          <h3>Ajouter un projet</h3>

            <form enctype = "multipart/form-data" onSubmit={(e) => this.ajouterprojet(e)}>
            <Form.Row>
            <FormGroup as={Col} controlId="reference" bsSize="large">
              <FormLabel>Reference</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value={this.state.reference}
                onChange={(e) => this.setState({reference: e.target.value})}
              />
            </FormGroup>
            <FormGroup as={Col} controlId="image" bsSize="large">
              <FormLabel>Image principale</FormLabel>
              <FormControl
                autoFocus
                type="file"
                name="image"
                onChange={this.onChangeHandlerimage}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="imagesec1" bsSize="large">
              <FormLabel>Image detail 1</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerimagesec1}
              />
            </FormGroup>
            <FormGroup as={Col} controlId="imagesec2" bsSize="large">
              <FormLabel>Image detail 2</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerimagesec2}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="imagesec3" bsSize="large">
              <FormLabel>Image detail 3</FormLabel>
              <FormControl
                autoFocus
                type="file"
                onChange={this.onChangeHandlerimagesec3}
              />
            </FormGroup>
            <FormGroup as={Col} controlId="cout_estimation_travaux" bsSize="large">
              <FormLabel>Cout d'estimation des travaux</FormLabel>
              <FormControl
                value={this.state.cout_estimation_travaux}
                onChange={(e) => this.setState({cout_estimation_travaux: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="nb_client" bsSize="large">
              <FormLabel>Nombre de client</FormLabel>
              <FormControl
                value={this.state.nb_client}
                onChange={(e) => this.setState({nb_client: e.target.value})}
                type="number"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="delai_execution" bsSize="large">
              <FormLabel>Delai d'execution</FormLabel>
              <FormControl
                value={this.state.delai_execution}
                onChange={(e) => this.setState({delai_execution: e.target.value})}
                type="number"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="montant_caution_provisoire" bsSize="large">
              <FormLabel>Montant de la caution provisoire</FormLabel>
              <FormControl
                value={this.state.montant_caution_provisoire}
                onChange={(e) => this.setState({montant_caution_provisoire: e.target.value})}
                type="text"
              />
            </FormGroup>

            <FormGroup as={Col} controlId="duree_validite_offre" bsSize="large">
              <FormLabel>Duree de validite d'offre</FormLabel>
              <FormControl
                value={this.state.duree_validite_offre}
                onChange={(e) => this.setState({duree_validite_offre: e.target.value})}
                type="number"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="mesures_securites_hygiene" bsSize="large">
              <FormLabel>Mesures des securites d'hygiene</FormLabel>
              <FormControl
                onChange={this.onChangeHandlermesures_securites_hygiene}
                type="file"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="reception_provisoire_travaux" bsSize="large">
              <FormLabel>Reception provisoire des travaux</FormLabel>
              <FormControl
                value={this.state.reception_provisoire_travaux}
                onChange={(e) => this.setState({reception_provisoire_travaux: e.target.value})}
                type="date"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="cahier_prestations_techniques" bsSize="large">
              <FormLabel>Cahier des prestations techniques</FormLabel>
              <FormControl
                onChange={this.onChangeHandlercahier_prestations_techniques}
                type="file"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="normes_mise_en_oeuvre" bsSize="large">
              <FormLabel>Normes des mise en oeuvre</FormLabel>
              <FormControl
               onChange={this.onChangeHandlernormes_mise_en_oeuvre}
                type="file"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="localisation" bsSize="large">
              <FormLabel>Localisation</FormLabel>
              <FormControl
                value={this.state.localisation}
                as="textarea" 
                rows={2}
                onChange={(e) => this.setState({localisation: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="descriptif" bsSize="large">
              <FormLabel>Descriptif</FormLabel>
              <FormControl
                value={this.state.descriptif}
                as="textarea" 
                rows={2}
                onChange={(e) => this.setState({descriptif: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="superficier" bsSize="large">
              <FormLabel>Superficier</FormLabel>
              <FormControl
                value={this.state.superficier}
                onChange={(e) => this.setState({superficier: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="type_projet" bsSize="large">
              <FormLabel>Type de projet</FormLabel>
              <FormControl
                value={this.state.type_projet}
                onChange={(e) => this.setState({type_projet: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="nb_chambre" bsSize="large">
              <FormLabel>Nombre de chambre</FormLabel>
              <FormControl
                value={this.state.nb_chambre}
                onChange={(e) => this.setState({nb_chambre: e.target.value})}
                type="number"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="etage" bsSize="large">
              <FormLabel>nombre etage:</FormLabel>
              <FormControl
                value={this.state.etage}
                onChange={(e) => this.setState({etage: e.target.value})}
                type="number"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
              {['checkbox'].map((type) => (
              <div key={`default-${type}`} className="mb-3">
              <Form.Check 
                type={type}
                id="terasse"
                label="terasse"
                onChange={(e) => this.setState({terasse: e.target.value})}
              />
              <Form.Check
                
                type={type}
                label="garage"
                id="garage"
                onChange={(e) => this.setState({garage: e.target.value})}
              />
              <Form.Check
                
                type={type}
                label="piscine"
                id="piscine"
                onChange={(e) => this.setState({piscine: e.target.value})}
              />
               <Form.Check
                
                type={type}
                label="jardin"
                id="jardin"
                onChange={(e) => this.setState({jardin: e.target.value})}
              />
               <Form.Check
                
                type={type}
                label="balcon"
                id="balcon"
                onChange={(e) => this.setState({balcon: e.target.value})}
              />
               <Form.Check
                type={type}
                label="mini_hopital"
                id="mini_hopital"
                onChange={(e) => this.setState({mini_hopital: e.target.value})}
              />
              <Form.Check
                type={type}
                label="supermarche"
                id="supermarche"
                onChange={(e) => this.setState({supermarche: e.target.value})}
              />
              <Form.Check
                type={type}
                label="hamam"
                id="hamam"
                onChange={(e) => this.setState({hamam: e.target.value})}
              />
              <Form.Check
                type={type}
                label="mini_mosque"
                id="mini_mosque"
                onChange={(e) => this.setState({mini_mosque: e.target.value})}
              />
                <Form.Check
                type={type}
                label="pharmacie"
                id="pharmacie"
                onChange={(e) => this.setState({pharmacie: e.target.value})}
              />
              </div>
              ))}
              </Form.Row>
              <Button
              block
              bsSize="large"
              disabled={!this.validateForm()}
              text="Ajouter"
              type="submit"
              variant = "primary"
              >Ajouter</Button>
              
              </form>
            
        </div>);
    }
}

export default ajouterprojet

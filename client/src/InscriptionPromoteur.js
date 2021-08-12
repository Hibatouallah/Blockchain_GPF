import React, { Component } from "react";
import {
  HelpBlock,
  Form,
  Col,
  FormGroup,
  FormControl,
  FormLabel,
  Button
} from "react-bootstrap";
import LoaderButton from "./containers/LoaderButton";
import "./containers/Signup.css";

import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"

const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })


class InscriptionPromoteur extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          isLoading: false,
          nom_prenom: "",
          imageHash:null,
          activite: "",
          identifiant_commun_entreprise: 0,
          identifiant_fiscal: 0,
          numero_rc: 0,
          adresse: "",
          email: "",
          password: "",
          passwordconfirmation: "",
          confirmationCode: "",
          newUser: null,
          web3: null,
          accounts: null,
          chainid: null,
          promoteur : null,
          buffer : null
        };
      }
    validateForm() {
        return (
          this.state.nom_prenom.length > 0 &&
          this.state.activite.length > 0 &&
          this.state.identifiant_commun_entreprise.length > 0 &&
          this.state.identifiant_fiscal.length > 0 &&
          this.state.numero_rc.length > 0 &&
          this.state.adresse.length > 0 &&
          this.state.email.length > 0 &&
          this.state.password === this.state.passwordconfirmation
        );
      }
      validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
      }
      handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }
      handleSubmit = async event => {
        event.preventDefault();
    
        this.setState({ isLoading: true });
    
        this.setState({ newUser: "test" });
    
        this.setState({ isLoading: false });
      }
    
      handleConfirmationSubmit = async event => {
        event.preventDefault();
    
        this.setState({ isLoading: true });
      }

      renderConfirmationForm() {
        return (
          <form onSubmit={this.handleConfirmationSubmit}>
            <FormGroup controlId="confirmationCode" bsSize="large">
              <FormLabel>Confirmation Code</FormLabel>
              <FormControl
                autoFocus
                type="tel"
                value={this.state.confirmationCode}
                onChange={this.handleChange}
              />
              <p>Please check your email for the code.</p>
            </FormGroup>
            <LoaderButton
              block
              bsSize="large"
              disabled={!this.validateConfirmationForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Verify"
              loadingText="Verifying…"
            />
          </form>
        );
      }
      onChangeHandlerimage= (event)=>{
        event.preventDefault()
          //Process file for IPFS ....
          const file = event.target.files[0]
          const reader = new window.FileReader()
          reader.readAsArrayBuffer(file)
          reader.onloadend = () => {
              this.setState({buffer : Buffer.from(reader.result)})
          }
      }
      renderForm() {
        return (
          
            <form onSubmit={(e) => this.InscriptionPromoteur(e)}>
            
            <Form.Row>
            <FormGroup as={Col} controlId="nom_prenom" bsSize="large">
              <FormLabel> Nom complet</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value={this.state.nom_prenom}
                onChange={(e) => this.setState({nom_prenom: e.target.value})}
              
              /> 
            </FormGroup>
            <FormGroup as={Col} controlId="activite" bsSize="large">
              <FormLabel> Activité</FormLabel>
              <FormControl
                value={this.state.activite}
                onChange={(e) => this.setState({activite: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="identifiant_commun_entreprise" bsSize="large">
              <FormLabel> Identifiant commun d'entreprise</FormLabel>
              <FormControl
                value={this.state.identifiant_commun_entreprise}
                onChange={(e) => this.setState({identifiant_commun_entreprise: e.target.value})}
                type="number"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="identifiant_fiscal" bsSize="large">
              <FormLabel> Identifiant fiscal</FormLabel>
              <FormControl
                value={this.state.identifiant_fiscal}
                onChange={(e) => this.setState({identifiant_fiscal: e.target.value})}
                type="number"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="numero_rc" bsSize="large">
              <FormLabel> Numéro RC</FormLabel>
              <FormControl
                value={this.state.numero_rc}
                onChange={(e) => this.setState({numero_rc: e.target.value})}
                type="number"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="email" bsSize="large">
              <FormLabel> Email</FormLabel>
              <FormControl
                value={this.state.email}
                onChange={(e) => this.setState({email: e.target.value})}
                type="email"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="adresse" bsSize="large">
              <FormLabel> Adresse</FormLabel>
              <FormControl
                value={this.state.adresse}
                onChange={(e) => this.setState({adresse: e.target.value})}
                type="text"
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
            <FormGroup as={Col} controlId="password" bsSize="large">
            <FormLabel> Mot de passe</FormLabel>
            <FormControl
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}
                type="password"
            />
            </FormGroup>
            <FormGroup as={Col} controlId="passwordconfirmation" bsSize="large">
            <FormLabel>Mot de passe confirmation</FormLabel>
            <FormControl
                value={this.state.passwordconfirmation}
                onChange={(e) => this.setState({passwordconfirmation: e.target.value})}
                type="password"
            />
            </FormGroup>
            </Form.Row>
            <Button 
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              variant = "primary"
            >S'inscrire</Button>
            <br/><br/>
          </form>
    

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
        console.log(accounts)
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
  

    InscriptionPromoteur = async (e) => {
        const {accounts,promoteur,nom_prenom,activite,identifiant_commun_entreprise,identifiant_fiscal,numero_rc,adresse,email,password} = this.state
        e.preventDefault()
        console.log("Submitting File .....")
        if (this.state.buffer){
            const file = await ipfs.add(this.state.buffer)
            this.state.imageHash = file[0]["hash"]
            console.log(this.state.imageHash)
          
        }
        var _image = this.state.imageHash
        var _nom_prenom = nom_prenom
        var _activite = activite
        var _identifiant_commun_entreprise = identifiant_commun_entreprise
        var _identifiant_fiscal = identifiant_fiscal
        var _numero_rc = numero_rc
        var _adresse = adresse
        var _email = email
        var _password = password

        var nbpromo = await promoteur.methods.listepromoteur().call()
        if(nbpromo == 0){
          var result = await promoteur.methods.inscription(_image,_nom_prenom,_activite,_identifiant_commun_entreprise,_identifiant_fiscal,_numero_rc,_adresse,_email,_password,accounts[0]).send({from: accounts[0]})
          this.props.history.push("/Loginpromoteur"); 
        }
        else{
          for(var i = 0;i<nbpromo;i++){
            var wallet = await promoteur.methods.getwalletAddress(i).call()
            if(wallet == accounts[0])
              {
                alert('Compte déja existe')
                this.props.history.push("/Loginpromoteur");
              }
              else{
                var result = await promoteur.methods.inscription(_image,_nom_prenom,_activite,_identifiant_commun_entreprise,_identifiant_fiscal,_numero_rc,_adresse,_email,_password,accounts[0]).send({from: accounts[0]})
                this.props.history.push("/Loginpromoteur"); 
              }
          }
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

        return (<div className="container">
        <br/><br/>
          <div className="slContainer">
              <div className ="formBoxLeftSignupPromoteur"></div>
              <div className="formBoxRight">
                <div className = "formContent">
          <h3>S'inscrire</h3>
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
         
                {this.state.newUser === null
                ? this.renderForm()
                : this.renderConfirmationForm()}
       
       </div>
              </div>
          </div>
        </div>)
    }
}

export default InscriptionPromoteur

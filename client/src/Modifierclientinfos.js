import React, { Component } from "react";
import {
  Form,
  Col,
  FormGroup,
  FormControl,
  FormLabel
} from "react-bootstrap";
import LoaderButton from "./containers/LoaderButton";
import "./containers/Signup.css";

import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import ReactPhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import axios from 'axios';


const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class Modifierclientinfos extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isLoading: false,
          nom_prenom: "",
          cin: "",
          date_naissance: "",
          numtele: "",
          adresse: "",
          email: "",
          password: "",
          passwordconfirmation: "",
          confirmationCode: "",
          newUser: null,
          buffer : null,
          web3: null,
          accounts: null,
          chainid: null,
          client : null
        };
      }

    validateForm() {
        return (
          this.state.nom_prenom.length > 0 &&
          this.state.cin.length > 0 &&
          this.state.date_naissance.length > 0 &&
          this.state.numtele.length > 0 &&
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
      handleOnChangetel = value => {
        console.log(value);
        this.setState({ numtele: value }, () => {
          console.log(this.state.numtele);
        });
      };
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

      renderForm() {
        return (
            <form onSubmit={(e) => this.ModifierinfosClient(e)}>
              
          <Form.Row>
            <FormGroup as={Col}  controlId="nom_prenom" bsSize="large">
              <FormLabel>Votre nom complet</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value={this.state.nom_prenom}
                onChange={(e) => this.setState({nom_prenom: e.target.value})}
              
              />
            </FormGroup>
            <FormGroup as={Col}  controlId="cin" bsSize="large">
              <FormLabel>Votre Cin</FormLabel>
              <FormControl
                value={this.state.cin}
                onChange={(e) => this.setState({cin: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col}  controlId="date_naissance" bsSize="large">
              <FormLabel>Votre Date de Naissance</FormLabel>
              <FormControl
                value={this.state.date_naissance}
                onChange={(e) => this.setState({date_naissance: e.target.value})}
                type="date"
              />
            </FormGroup>
            <FormGroup as={Col}  controlId="numtele" bsSize="large">
              <FormLabel>Votre Numero de telephone</FormLabel>
              <ReactPhoneInput
                inputExtraProps={{
                    name: "numtele",
                    required: true,
                    autoFocus: true
                }}
                defaultCountry={"mor"}
                value={this.state.numtele}
                onChange={this.handleOnChangetel}
                />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col}  controlId="adresse" bsSize="large">
              <FormLabel>Votre Adresse</FormLabel>
              <FormControl
                value={this.state.adresse}
                onChange={(e) => this.setState({adresse: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="email" bsSize="large">
              <FormLabel>Votre email</FormLabel>
              <FormControl
                value={this.state.email}
                onChange={(e) => this.setState({email: e.target.value})}
                type="email"
              />
            </FormGroup>
            </Form.Row>
            
            <FormGroup   controlId="adresse" bsSize="large">
              <FormLabel>Votre wallet addresse </FormLabel>
              <FormControl
                value={this.state.walletAddress}
                onChange={(e) => this.setState({adresse: e.target.value})}
                type="text"
              />
            </FormGroup>
    
            <LoaderButton
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Modifier"
              loadingText="Signing up…"
            />
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

       // Get the current chain id
       const chainid = parseInt(await web3.eth.getChainId())
    
       this.setState({
           web3,
           accounts,
           chainid
       }, await this.loadInitialContracts)
       const client = await this.loadContract("dev", "Client")
       var nb =  await client.methods.listeclient().call()
     

       for (var i=0; i < nb; i++) {
         const wallet = await client.methods.getwalletAddress(i).call()
         if(accounts[0] == wallet){
           const ph = await client.methods.getphoto(i).call()
           const nomprenom = await client.methods.getnom_prenom(i).call()
           const ci = await client.methods.getcin(i).call()
           const dt = await client.methods.getdate_naissance(i).call()
           const num = await client.methods.getnumtele(i).call()
           const addr = await client.methods.getadresse(i).call()
           const em = await client.methods.getemail(i).call()

           this.setState({
             nom_prenom: nomprenom, 
             numtele : num,
             date_naissance : dt,
             cin : ci,
             adresse: addr, 
             email: em,
             walletAddress: wallet
           })
         }
       }

    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const client = await this.loadContract("dev", "Client")

        if (!client) {
            return
        }
        this.setState({
            client
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

    ModifierinfosClient = async (e) => {
        const {accounts,client,nom_prenom,cin,date_naissance,numtele,adresse,email,walletAddress} = this.state
        e.preventDefault()
        var index = 0
        var nb =  await client.methods.listeclient().call()
        for (var i=0; i < nb; i++) {
          const wallet = await client.methods.getwalletAddress(i).call()
          if(accounts[0] == wallet){
            index = i
          }
        }       
        var _nom_prenom = nom_prenom
        var _cin = cin
        var _date_naissance = date_naissance
        var _numtele = numtele
        var _adresse = adresse
        var _email = email
        var _walletAddress = walletAddress

        var result = await client.methods.modifierclientinfo(index,_nom_prenom,_cin,_date_naissance,_numtele,_adresse,_email,_walletAddress).send({from: accounts[0]})
        alert(result)
        this.props.history.push("/Profileclient");   
    }

    render() {
        const {
            web3, accounts, chainid,client
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!client) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false

        return (<div className="container">
            <br/><br/>
              <div className="slContainer">
                  <div className ="formBoxLeftSignupClient"></div>
                  <div className="formBoxRight">
                    <div className = "formContent">
                    <h3>Modifier vos informations personnelles</h3>
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

export default Modifierclientinfos

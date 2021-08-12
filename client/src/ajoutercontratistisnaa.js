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

class ajoutercontratistisnaa extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        EngagamentPromoteur : null,
        referenceprojet : "",
        date_commencement : "",
        date_livraison_bien : "",
        modalite_paiement : "",
        nature_projet : ""
    }
  
    validateForm() {
        return (
          this.state.date_commencement.length > 0 &&
          this.state.date_livraison_bien.length > 0 &&
          this.state.modalite_paiement.length > 0 &&
          this.state.nature_projet.length > 0 
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

    ajoutercontrat = async (e) => {
        const {accounts,EngagamentPromoteur,date_commencement,date_livraison_bien,modalite_paiement,nature_projet} = this.state
        e.preventDefault()
  
        var _referenceprojet= localStorage.getItem('reference')
        var _date_commencement = date_commencement
        var _date_livraison_bien = date_livraison_bien
        var _modalite_paiement = modalite_paiement
        var _nature_projet = nature_projet
       

        var result = await EngagamentPromoteur.methods.ajoutercontratisitisnaa_fonds(_referenceprojet,_date_commencement,_date_livraison_bien,_modalite_paiement,_nature_projet).send({from: accounts[0]})
        alert("Contrat istisnaa ajouté")
        this.props.history.push("/listecontratistisnaa");
      
          
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

          <h3>Ajouter le contrat Istisnaa</h3>

            <form enctype = "multipart/form-data" onSubmit={(e) => this.ajoutercontrat(e)}>
            <Form.Row>
            <FormGroup as={Col} controlId="referenceprojet" bsSize="large" readOnly >
              <FormLabel>Reference projet</FormLabel>
              <FormControl
                autoFocus
                type="text"
                name="referenceprojet"
                value={localStorage.getItem('reference')}
                onChange={(e) => this.setState({referenceprojet: e.target.value})}
                readOnly
              />
            </FormGroup>
            <FormGroup as={Col} controlId="date_commencement " bsSize="large" readOnly>
              <FormLabel>Date de Commencement</FormLabel>
              <FormControl
                autoFocus
                type="date"
                name = "date_commencement "
                onChange={(e) => this.setState({date_commencement  : e.target.value})}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="date_livraison_bien " bsSize="large" readOnly>
              <FormLabel>date de livraison du bien  </FormLabel>
              <FormControl
                autoFocus
                type="date"
                onChange={(e) => this.setState({date_livraison_bien  : e.target.value})}
                name = "date_livraison_bien "
              />
            </FormGroup>
            <FormGroup as={Col} controlId="modalite_paiement" bsSize="large" readOnly>
              <FormLabel>modalite de paiement  </FormLabel>
              <FormControl
                autoFocus
                type="text"
                onChange={(e) => this.setState({modalite_paiement   : e.target.value})}
                name = "modalite_paiement"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="nature_projet" bsSize="large" readOnly>
              <FormLabel>Nature de projet   </FormLabel>
              <FormControl
                autoFocus
                type="text"
                onChange={(e) => this.setState({nature_projet : e.target.value})}
                name = "nature_projet"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="nature_projet" bsSize="large" readOnly>
            </FormGroup>
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

export default ajoutercontratistisnaa

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

class ajoutercontratvente extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        EngagementClient : null,
        referenceprojet : "",
        datecontrat : "",
        prixvente : ""
    }
  
    validateForm() {
        return (
          
          this.state.referenceprojet.length > 0 &&
          this.state.datecontrat .length > 0 &&
          this.state.prixvente.length > 0 
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
        const EngagementClient = await this.loadContract("dev", "EngagementClient")

        if (!EngagementClient) {
            return
        }
        this.setState({
          EngagementClient
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
        const {accounts,EngagementClient,referenceprojet,datecontrat,prixvente,mini_hopital,supermarche,hamam,mini_mosque,pharmacie,image,imagesec1,imagesec2,imagesec3,descriptif,reference,cout_estimation_travaux,delai_execution,montant_caution_provisoire,duree_validite_offre,mesures_securites_hygiene,reception_provisoire_travaux,reception_definitive,cahier_prestations_techniques,normes_mise_en_oeuvre,localisation,superficier,type_projet,nb_chambre,terasse,garage,piscine,etage} = this.state
        e.preventDefault()
        var _referenceprojet = referenceprojet
        var _datecontrat = datecontrat
        var _prixvente = prixvente
      
          var result = await EngagementClient.methods.ajoutercontratvente_fonds(_referenceprojet,_datecontrat,_prixvente).send({from: accounts[0]})
          alert("Contrat de vente ajouté")
          this.props.history.push("/listecontratvente");
       
    }

    render() {

      const {
        web3, accounts, chainid,EngagementClient
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!EngagementClient) {
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
           
           <br/><br/>

          <h3>Ajouter le contrat de vente </h3>

            <form enctype = "multipart/form-data" onSubmit={(e) => this.ajoutercontrat(e)}>
            <Form.Row>
            <FormGroup as={Col} controlId="referenceprojet" bsSize="large" readOnly >
              <FormLabel>Reference projet</FormLabel>
              <FormControl
                autoFocus
                type="text"
                name="referenceprojet"
                onChange={(e) => this.setState({referenceprojet: e.target.value})}
              />
            </FormGroup>
            <FormGroup as={Col} controlId="datecontrat " bsSize="large" readOnly>
              <FormLabel>Date de Contrat</FormLabel>
              <FormControl
                autoFocus
                type="text"
                name = "datecontrat "
                onChange={(e) => this.setState({datecontrat : e.target.value})}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="imagesec2" bsSize="large" readOnly>
              <FormLabel>Prix de vente</FormLabel>
              <FormControl
                autoFocus
                type="text"
                onChange={(e) => this.setState({prixvente : e.target.value})}
                name = "coutderevien"
              />
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

export default ajoutercontratvente

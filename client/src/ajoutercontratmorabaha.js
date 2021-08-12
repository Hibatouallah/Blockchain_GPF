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

class ajoutercontratmorabaha extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        engagementClient : null,
        referenceprojet : "",
        estimationpenalite : 0,
        coutderevien : "",
        marge : "",
        prixvente : "",
        duree_ammortissement :"",
        delai_execution :"",
        assurancetakaful :"",
        duree_contrat :"",
        montant_Mensuelle :"",
        montant_trimestriel :"",
        montant_semestriel :"",
        montant_annuel :""
    }
  
    validateForm() {
        return (
          !isNaN(parseInt(this.state.estimationpenalite))&&
          this.state.coutderevien.length > 0 &&
          this.state.marge.length > 0 &&
          this.state.prixvente != " " &&
          this.state.duree_ammortissement != " " &&
          this.state.delai_execution != " " &&
          this.state.montant_caution_provisoire != " " &&
          this.state.assurancetakaful!= " "  &&
          this.state.duree_contrat != " " &&
          this.state.montant_Mensuelle.length > 0 &&
          this.state.montant_trimestriel.length > 0 &&
          this.state.montant_semestriel != " " &&
          this.state.montant_annuel != " " 
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
        const engagementClient = await this.loadContract("dev", "EngagementClient")

        if (!engagementClient) {
            return
        }
        this.setState({
          engagementClient
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
        const {accounts,engagementClient,duree_contrat,montant_Mensuelle,montant_trimestriel,montant_semestriel,montant_annuel,assurancetakaful,montant_caution_provisoire,estimationpenalite,coutderevien,marge,prixvente,duree_ammortissement,delai_execution} = this.state
        e.preventDefault()
     
        var _referenceprojet = localStorage.getItem('reference')
        var _estimationpenalite= estimationpenalite
        var _coutderevien = coutderevien
        var _marge = marge
        var _prixvente= prixvente
        var _duree_ammortissement = duree_ammortissement
        var _delai_execution = delai_execution
        var _montant_caution_provisoire = montant_caution_provisoire
        var _assurancetakaful = assurancetakaful
        var _duree_contrat = duree_contrat
        var _montant_Mensuelle = montant_Mensuelle
        var _montant_trimestriel = montant_trimestriel
        var _montant_semestriel = montant_semestriel
        var _montant_annuel = montant_annuel
        
          var result = await engagementClient.methods.ajoutercontrat_morabaha_fonds(_referenceprojet,_estimationpenalite,_coutderevien,_marge,_prixvente,_duree_ammortissement,_montant_Mensuelle,_montant_trimestriel,_montant_semestriel,_montant_annuel,_assurancetakaful,_duree_contrat).send({from: accounts[0]})
          alert("contrat Mourabaha ajouté")
          this.props.history.push("/ListeContratsmorabaha");
   
          
    }

    render() {

      const {
        web3, accounts, chainid,engagementClient
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!engagementClient) {
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

          <h3>Ajouter le contrat Morabaha </h3>

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
            <FormGroup as={Col} controlId="estimationpenalite" bsSize="large" readOnly>
              <FormLabel>Estimation de penaité</FormLabel>
              <FormControl
                autoFocus
                type="number"
                name = "estimationpenalite"
                onChange={(e) => this.setState({estimationpenalite: e.target.value})}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="imagesec2" bsSize="large" readOnly>
              <FormLabel>Cout de revien</FormLabel>
              <FormControl
                autoFocus
                type="number"
                onChange={(e) => this.setState({coutderevien: e.target.value})}
                name = "coutderevien"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="marge" bsSize="large">
              <FormLabel>Marge</FormLabel>
              <FormControl
                autoFocus
                type="text"
                name = "marge"
                onChange={(e) => this.setState({marge: e.target.value})}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="prixvente" bsSize="large">
              <FormLabel>Prix de Vente</FormLabel>
              <FormControl
                onChange={(e) => this.setState({prixvente: e.target.value})}
                type="text"
                name = "prixvente"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="duree_ammortissement" bsSize="large">
              <FormLabel>Duree d'ammortissement</FormLabel>
              <FormControl
                onChange={(e) => this.setState({duree_ammortissement: e.target.value})}
                name = "duree_ammortissement"
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="delai_execution" bsSize="large">
              <FormLabel>Delai d'execution</FormLabel>
              <FormControl
                onChange={(e) => this.setState({delai_execution: e.target.value})}
                type="number"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="montant_caution_provisoire" bsSize="large">
              <FormLabel>Montant de la caution provisoire</FormLabel>
              <FormControl
                onChange={(e) => this.setState({montant_caution_provisoire: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
        
            <FormGroup as={Col} controlId="assurancetakaful" bsSize="large">
              <FormLabel>Assurance takaful</FormLabel>
              <FormControl
                value={this.state.assurancetakaful}
                onChange={(e) => this.setState({assurancetakaful: e.target.value})}
                type="number"
              />
            </FormGroup>

            <FormGroup as={Col} controlId="montant_annuel" bsSize="large">
              <FormLabel>Montant Annuel</FormLabel>
              <FormControl
                name = {this.state.montant_annuel}
                onChange={(e) => this.setState({montant_annuel: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="duree_contrat" bsSize="large">
              <FormLabel>duree de contrat</FormLabel>
              <FormControl
                name = {this.state.duree_contrat}
                onChange={(e) => this.setState({duree_contrat: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="montant_Mensuelle" bsSize="large">
              <FormLabel>Montant Mensuelle</FormLabel>
              <FormControl
                name = {this.state.montant_Mensuelle}
                onChange={(e) => this.setState({montant_Mensuelle: e.target.value})}
                type="text"
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="montant_trimestriel" bsSize="large">
              <FormLabel>montant trimestriel</FormLabel>
              <FormControl
                name = {this.state.montant_trimestriel}
                onChange={(e) => this.setState({montant_trimestriel: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="montant_semestriel" bsSize="large">
              <FormLabel>Montant semestriel</FormLabel>
              <FormControl
                name = {this.state.montant_semestriel}
                onChange={(e) => this.setState({montant_semestriel: e.target.value})}
                type="text"
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

export default ajoutercontratmorabaha

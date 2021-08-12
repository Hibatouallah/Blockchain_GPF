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
import mourabaha from './img/mourabaha.pdf';

class fondsmodifiercontratmourabaha extends Component {
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
        montant_annuel :"",
        nbcontrat:0,
        nbclient : 0,
        numcontrat :0
    }
  
    validateForm() {
        return (
          
          this.state.referenceprojet.length > 0 &&
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
const EngagementClient = await this.loadContract("dev", "EngagementClient")
var nb =  await EngagementClient.methods.getListecontratmorabaha().call()
this.setState({nbcontrat:nb})
console.log(nb)
for (var i=0; i < nb; i++) {
    const reference = await EngagementClient.methods.getreferenceprojet(i).call()
    if(reference == localStorage.getItem('referenceijara'))
    {
        
        const estimation = await EngagementClient.methods.getestimationpenalite(i).call()
        console.log(estimation)
        const cout = await EngagementClient.methods.getcoutderevien(i).call()
        const marg = await EngagementClient.methods.getmarge(i).call()
        const prix = await EngagementClient.methods.getprixvente(i).call()
        const duree_ammort = await EngagementClient.methods.getduree_ammortissement(i).call()
        const montantchois = await EngagementClient.methods.getmontantchoisi(i).call()
        const montant_Mensuel = await EngagementClient.methods.getmontant_Mensuelle(i).call()
        const montant_trimestrie = await EngagementClient.methods.getmontant_trimestriel(i).call()
        const montant_semestri = await EngagementClient.methods.getmontant_semestriel(i).call()
        const montant_annue = await EngagementClient.methods.getmontant_annuel(i).call()
        const assurancetakafu = await EngagementClient.methods.getassurancetakaful(i).call()
        const duree_contra = await EngagementClient.methods.getduree_contrat(i).call()

        this.setState({
            referenceprojet : reference,
            estimationpenalite : estimation,
            coutderevien : cout,
            marge : marg,
            prixvente: prix, 
            duree_ammortissement: duree_ammort,
            montantchoisi :montantchois,
            montant_Mensuelle : montant_Mensuel,
            montant_trimestriel: montant_trimestrie,
            montant_semestriel: montant_semestri,
            montant_annuel: montant_annue,
            assurancetakaful: assurancetakafu,
            duree_contrat: duree_contra ,
            numcontrat : i
        })
    }
}

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

    modifiercontrat = async (e) => {
      const {accounts,engagementClient,referenceprojet,estimationpenalite,coutderevien,marge,prixvente,duree_ammortissement,duree_contrat,assurancetakaful,montant_annuel,montant_Mensuelle,montant_trimestriel,montant_semestriel} = this.state
      e.preventDefault()
      var nb =  await engagementClient.methods.getListecontratmorabaha().call()
      for (var i=0; i < nb; i++) {
        const ref = await engagementClient.methods.getreferenceprojet(i).call()
        if(ref == localStorage.getItem("referencemorabaha")){
          var _referenceprojet = referenceprojet
          var _estimationpenalite =estimationpenalite
          var _coutderevien = coutderevien
          var _marge = marge
          var _prixvente = prixvente
          var _duree_ammortissement = duree_ammortissement
          var _duree_contrat = duree_contrat
          var _assurancetakaful = assurancetakaful
          var _montant_annuel = montant_annuel
          var _montant_Mensuelle = montant_Mensuelle
          var _montant_trimestriel = montant_trimestriel
          var _montant_semestriel = montant_semestriel
          
          var result = await engagementClient.methods.modifiercontrat_morabaha_fonds(i,_referenceprojet,_estimationpenalite,_coutderevien,_marge,_prixvente,_duree_ammortissement,_montant_Mensuelle,_montant_trimestriel,_montant_semestriel,_montant_annuel,_assurancetakaful,_duree_contrat).send({from: accounts[0]})
          alert("Contrat Mourabaha est modifiée")
        }
      }
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
             this.props.history.push("/LoginFonds")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
           <br/><br/>

          <h3>Modifier contrat Morabaha </h3>

       
            <form enctype = "multipart/form-data" onSubmit={(e) => this.modifiercontrat(e)}>
            <Form.Row>
            <FormGroup as={Col} controlId="referenceprojet" bsSize="large"  >
              <FormLabel>Reference projet</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value = {this.state.referenceprojet}
                name="referenceprojet"
                onChange={(e) => this.setState({referenceprojet: e.target.value})}
              />
            </FormGroup>
            <FormGroup as={Col} controlId="estimationpenalite" bsSize="large" >
              <FormLabel>Estimation de penalité</FormLabel>
              <FormControl
                autoFocus
                type="number"
                value = {this.state.estimationpenalite}
                name = "estimationpenalite"
                onChange={(e) => this.setState({estimationpenalite: e.target.value})}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="imagesec2" bsSize="large" >
              <FormLabel>Cout de revien</FormLabel>
              <FormControl
                autoFocus
                type="number"
                name = "coutderevien"
                value =  {this.state.coutderevien}
                onChange={(e) => this.setState({coutderevien: e.target.value})}
                
              />
            </FormGroup>
            <FormGroup as={Col} controlId="marge" bsSize="large">
              <FormLabel>Marge</FormLabel>
              <FormControl
                autoFocus
                type="text"
                name = "marge"
                value = {this.state.marge}
                onChange={(e) => this.setState({marge: e.target.value})}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="prixvente" bsSize="large">
              <FormLabel>Prix de Vente</FormLabel>
              <FormControl
                type="text"
                name = "prixvente"
                value = {this.state.prixvente}
                onChange={(e) => this.setState({prixvente: e.target.value})}
              />
            </FormGroup>
            <FormGroup as={Col} controlId="duree_ammortissement" bsSize="large">
              <FormLabel>Duree d'ammortissement</FormLabel>
              <FormControl
                name = "duree_ammortissement"
                type="text"
                value = {this.state.duree_ammortissement}
                onChange={(e) => this.setState({duree_ammortissement: e.target.value})}
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="duree_contrat" bsSize="large">
              <FormLabel>duree de contrat</FormLabel>
              <FormControl
                value = {this.state.duree_contrat}
                onChange={(e) => this.setState({duree_contrat: e.target.value})}
                type="text"
                
              />
            </FormGroup>
            <FormGroup as={Col} controlId="assurancetakaful" bsSize="large">
              <FormLabel>Assurance takaful</FormLabel>
              <FormControl
                value={this.state.assurancetakaful}
                type="number"
                onChange={(e) => this.setState({assurancetakaful: e.target.value})}
              />
            </FormGroup>
            </Form.Row>
         
            <Form.Row>
            <FormGroup as={Col} controlId="montant_annuel" bsSize="large">
              <FormLabel>Montant Annuel</FormLabel>
              <FormControl
                name = {this.state.montant_annuel}
                value = {this.state.montant_annuel}
                onChange={(e) => this.setState({montant_annuel: e.target.value})}
                type="text"
              />
            </FormGroup>
            <FormGroup as={Col} controlId="montant_Mensuelle" bsSize="large">
              <FormLabel>Montant Mensuelle</FormLabel>
              <FormControl
                name = {this.state.montant_Mensuelle}
                value = {this.state.montant_Mensuelle}
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
                value = {this.state.montant_trimestriel}
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
                value ={this.state.montant_semestriel}
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
              >Confirmer</Button>
              
              </form>
            
        </div>);
    }
}

export default fondsmodifiercontratmourabaha

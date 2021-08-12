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
import ijara from './img/ijara.pdf';

class fondsmodifiercontratijara extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        engagementClient : null,
        referenceprojet : "",
        duree_contrat : "",
        montant_loyer : "",
        date_resuliation : "",
        cession_du_bien : "",
        montantpartranche : "",
        nbcontrat:0,
        nbclient : 0,
        numcontrat : 0
    }
  
    validateForm() {
        return (
          this.state.referenceprojet.length > 0 &&
          this.state.duree_contrat.length > 0 &&
          this.state.montant_loyer.length > 0 &&
          this.state.date_resuliation != " " &&
          this.state.cession_du_bien != " " &&
          this.state.montantpartranche != " " 
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
var nb =  await EngagementClient.methods.getliste_contrat_ijaramontahiyabitamlik().call()
this.setState({nbcontrat:nb})
console.log(nb)
for (var i=0; i < nb; i++) {
    const reference = await EngagementClient.methods.getreferenceprojetijara(i).call()
    if(reference == localStorage.getItem('referencemorabaha'))
    {
        const duree = await EngagementClient.methods.getduree_contratijara(i).call()
        const montantl = await EngagementClient.methods.getmontant_loyer(i).call()
        const dater = await EngagementClient.methods.getdate_resuliation(i).call()
        const cession = await EngagementClient.methods.getcession_du_bien(i).call()
        const montantt = await EngagementClient.methods.getmontantpartranche(i).call()
       
        this.setState({
            referenceprojet : reference,
            duree_contrat : duree,
            montant_loyer : montantl,
            date_resuliation : dater,
            cession_du_bien : cession,
            montantpartranche : montantt,
            numcontrat:i
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
        const {accounts,engagementClient,referenceprojet,duree_contrat,montant_loyer,date_resuliation,cession_du_bien,montantpartranche} = this.state
        e.preventDefault()
        var nb =  await engagementClient.methods.getliste_contrat_ijaramontahiyabitamlik().call()
        for (var i=0; i < nb; i++) {
          const ref = await engagementClient.methods.getreferenceprojetijara(i).call()
          if(ref == localStorage.getItem("referenceijara")){
            var _referenceprojet = referenceprojet
            var _duree_contrat =duree_contrat
            var _montant_loyer = montant_loyer
            var _date_resuliation = date_resuliation
            var _cession_du_bien = cession_du_bien
            var _montantpartranche = montantpartranche
            var result = await engagementClient.methods.modifierijaramontahiyabitamlik_fonds(i,_referenceprojet,_duree_contrat,_montant_loyer,_date_resuliation,_cession_du_bien,_montantpartranche).send({from: accounts[0]})
            alert("Contrat Ijara est modifiée")
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

          <h3>Modifier  contrat Ijara </h3>
            <form enctype = "multipart/form-data" onSubmit={(e) => this.modifiercontrat(e)}>
            <Form.Row>
            <FormGroup as={Col} controlId="referenceprojet" bsSize="large"  >
              <FormLabel>Reference projet</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value = {this.state.referenceprojet}
                name="referenceprojet"
                 
              />
            </FormGroup>
            <FormGroup as={Col} controlId="duree_contrat" bsSize="large" >
              <FormLabel>Duree de contrat</FormLabel>
              <FormControl
                autoFocus
                type="number"
                value = {this.state.duree_contrat}
                name = "duree_contrat"
                
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="montant_loyer" bsSize="large" >
              <FormLabel>Montant de location</FormLabel>
              <FormControl
                autoFocus
                type="number"
                name = "montant_loyer"
                placeholder = {this.state.montant_loyer}
                
              />
            </FormGroup>
        
            <FormGroup as={Col} controlId="date_resuliation" bsSize="large">
              <FormLabel>Date de resuliation </FormLabel>
              <FormControl
                autoFocus
                type="text"
                name = "date_resuliation"
                value = {this.state.date_resuliation}
                
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="cession_du_bien" bsSize="large">
              <FormLabel>Cession du bien</FormLabel>
              <FormControl
                type="text"
                name = "cession_du_bien"
                value = {this.state.cession_du_bien}
                
              />
            </FormGroup>
            <FormGroup as={Col} controlId="montantpartranche" bsSize="large">
              <FormLabel>montant par tranche</FormLabel>
              <FormControl
                name = "montantpartranche"
                type="text"
                value = {this.state.montantpartranche}
                
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
              >Modifier</Button>
              
              </form>
            
        </div>);
    }
}

export default fondsmodifiercontratijara

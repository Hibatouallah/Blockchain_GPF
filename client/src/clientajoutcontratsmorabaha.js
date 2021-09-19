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

class clientajoutcontratsmorabaha extends Component {
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
        duree_payement : "",
        type_payement : "",
        nbcontrat:0,
        nbclient : 0,
        numcontrat :0,
        contrat : ""
    }
  
    validateForm() {
        return (
          this.state.duree_payement.length > 0 &&
          this.state.type_payement.length > 0 
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
    if(reference == localStorage.getItem('refprojet'))
    {
        
        const estimation = await EngagementClient.methods.getestimationpenalite(i).call()
        console.log(estimation)
        const cout = await EngagementClient.methods.getcoutderevien(i).call()
        const marg = await EngagementClient.methods.getmarge(i).call()
        const prix = await EngagementClient.methods.getprixvente(i).call()
        const duree_ammort = await EngagementClient.methods.getduree_ammortissement(i).call()
        const assurancetakafu = await EngagementClient.methods.getassurancetakaful(i).call()
        const duree_contra = await EngagementClient.methods.getduree_contrat(i).call()

        this.setState({
            referenceprojet : reference,
            estimationpenalite : estimation,
            coutderevien : cout,
            marge : marg,
            prixvente: prix, 
            duree_ammortissement: duree_ammort,
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
        const {accounts,montantchoisi,engagementClient,referenceprojet,prixvente,duree_payement,type_payement} = this.state
        e.preventDefault()
        const client = await this.loadContract("dev", "Client")
        const fonds = await this.loadContract("dev", "Fonds")
        var nb =  await client.methods.listeclient().call()
        this.setState({nbclient:nb})
        var ci = ""
        for (var i=0; i < nb; i++) {
          const wallet = await client.methods.getwalletAddress(i).call()
          if(accounts[0] == wallet){
            ci = await client.methods.getcin(i).call()
          }
        }
        var _referenceprojet = referenceprojet
        // Calcul du montant
        var _montantchoisi  = 0
        if(type_payement == "Annuellement"){
           _montantchoisi = parseFloat(prixvente/duree_payement)
        }
        if(type_payement == "Trimestriellement"){
          _montantchoisi = parseFloat((prixvente/duree_payement)/3)
        }
        if(type_payement == "Semestriellement"){
          _montantchoisi = parseFloat((prixvente/duree_payement)/2)
        }
        if(type_payement == "Mensuellement"){
         _montantchoisi = parseFloat((prixvente/duree_payement)/12)
        }
        console.log(_montantchoisi)
        var montant = (_montantchoisi.toFixed(2)).toString();
        
        console.log(montant)
         var result = await engagementClient.methods.modifiercontrat_morabaha_client(type_payement,duree_payement,montant,this.state.numcontrat,ci,_referenceprojet).send({from: accounts[0]})
          var nb =  await client.methods.listewishlist().call()
          console.log(nb)
          this.setState({nbwishlist:nb})
          
          for (var i=0; i < nb; i++) {
             const wallet = await client.methods.getwalletAddress(i).call()
             if(accounts[0] == wallet){
              var reference = await client.methods.getreferencewishlist(i).call()
              if(reference == _referenceprojet){
                  var result = await client.methods.modifierwishlist(i).send({from: accounts[0]})
                  var nbclientproje = 0
                  // Calculer le percentage dees clients
                  const nbprojet = await fonds.methods.listeprojet().call()
                  for(var j = 0;j<nbprojet;j++)
                  {
                      //savoir le nombre de clients du projets
                      const ref = await fonds.methods.getRef(j).call()
                      if(ref == reference)
                       {
                         nbclientproje = await fonds.methods.getnb_client(j).call()
                       }
                  }
                 //savoir le nombre de clients engagé
                 const nblistclientengage= await engagementClient.methods.getlisteclientengage().call()
                 var nbclientengage = 0
                 for(var k=0;k<nblistclientengage;k++){
                    var ref = await engagementClient.methods.getreferenceclient(k).call()
                    if(ref == reference){
                      nbclientengage++
                    }
                 }
                  //savoir le percentage
                  var percentage = (nbclientengage*100)/nbclientproje
                  if(percentage >= 50)
                  {
                    var _message = "le percentage des clients engagés est 50% du projet avec la reference "+reference+"vous pouvez déclencher la procédure des travaux"
                    var result = fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                  }
                  if(percentage == 100)
                  {
                    var _message = "le percentage des clients engagés est 100% du projet avec la reference "+reference
                    var result = fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                    var result = fonds.methods.modifierstatus(k).send({from: accounts[0]})
                  }
                  this.props.history.push("/mesprojetsclients");
              }
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
           {localStorage.getItem('isclient') != 'true' &&
             this.props.history.push("/Loginclient")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
           <br/><br/>

          <h3>Remplir votre contrat Morabaha </h3>

       
            <form enctype = "multipart/form-data" onSubmit={(e) => this.modifiercontrat(e)}>
            <Form.Row>
            <FormGroup as={Col} controlId="referenceprojet" bsSize="large"  >
              <FormLabel>Reference projet</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value = {this.state.referenceprojet}
                name="referenceprojet"
                readOnly 
              />
            </FormGroup>
            <FormGroup as={Col} controlId="estimationpenalite" bsSize="large" readOnly>
              <FormLabel>Estimation de penaité</FormLabel>
              <FormControl
                autoFocus
                type="number"
                value = {this.state.estimationpenalite}
                name = "estimationpenalite"
                readOnly
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="imagesec2" bsSize="large" readOnly>
              <FormLabel>Cout de revien</FormLabel>
              <FormControl
                autoFocus
                type="number"
                name = "coutderevien"
                placeholder = {this.state.coutderevien}
                readOnly
              />
            </FormGroup>
            <FormGroup as={Col} controlId="marge" bsSize="large">
              <FormLabel>Marge</FormLabel>
              <FormControl
                autoFocus
                type="text"
                name = "marge"
                value = {this.state.marge}
                readOnly
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
                readOnly
              />
            </FormGroup>
            <FormGroup as={Col} controlId="duree_ammortissement" bsSize="large">
              <FormLabel>Duree d'ammortissement</FormLabel>
              <FormControl
                name = "duree_ammortissement"
                type="text"
                value = {this.state.duree_ammortissement}
                readOnly
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="duree_contrat" bsSize="large">
              <FormLabel>duree de contrat</FormLabel>
              <FormControl
                value = {this.state.duree_contrat}
                onChange={(e) => this.setState({duree_contrat: e.target.value})}
                type="text"
                readOnly
              />
            </FormGroup>
            <FormGroup as={Col} controlId="assurancetakaful" bsSize="large">
              <FormLabel>Assurance takaful</FormLabel>
              <FormControl
                value={this.state.assurancetakaful}
                readOnly
                type="number"
              />
            </FormGroup>
            </Form.Row>
          <Form.Row>
            <Form.Group  as={Col} controlId="exampleForm.SelectCustom" size="lg" custom>
                  <Form.Label>Duree de payement : </Form.Label>
                    <Form.Control onChange={(e) => this.setState({duree_payement: e.target.value})} as="select" custom>
                    <option> 5 </option>
                    <option> 6 </option>
                    <option> 7 </option>
                    <option> 8 </option>
                    <option> 9 </option>
                    <option> 10 </option>
                    <option> 11 </option>
                    <option> 12 </option>
                    <option> 13 </option>
                    <option> 14 </option>
                    <option> 15 </option>
                    <option> 16 </option>
                    <option> 17 </option>
                    <option> 18 </option>
                    <option> 19 </option>
                    <option> 20 </option>
                    <option> 21 </option>
                    <option> 22 </option>
                    <option> 23 </option>
                    <option> 24 </option>
                    <option> 25 </option>
                    </Form.Control>
            </Form.Group>
            <Form.Group  as={Col} controlId="exampleForm.SelectCustom" size="lg" custom>
                  <Form.Label> Type de Payement  : </Form.Label>
                    <Form.Control onChange={(e) => this.setState({type_payement: e.target.value})} as="select" custom>
                    <option> Annuellement </option>
                    <option>  Semestriellement </option>
                    <option>  Trimestriellement  </option>
                    <option> Mensuellement  </option>
                    </Form.Control>
            </Form.Group>
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

export default clientajoutcontratsmorabaha

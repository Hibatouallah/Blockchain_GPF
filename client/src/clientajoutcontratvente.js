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

class clientajoutcontratvente extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        engagementClient : null,
        referenceprojet : "" ,
        datecontrat : "", 
        prixvente : "",
        nbcontrat:0,
        nbclient : 0,
        numcontrat: 0
    }
  
    validateForm() {
        return (
          
          this.state.referenceprojet.length > 0 &&
          this.state.datecontrat.length > 0 &&
          this.state.prixvente != " " &&
          this.state.prixvente != " " 
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
            var nb =  await EngagementClient.methods.getlistecontratvente().call()
            this.setState({nbcontrat:nb})
            console.log(nb)
            for (var i=0; i < nb; i++) {
                const reference = await EngagementClient.methods.getreferenceprojetvente(i).call()
                if(reference == localStorage.getItem('refprojet'))
                {
                    const datec = await EngagementClient.methods.getdatecontrat(i).call()
                    const prix = await EngagementClient.methods.get_prixvente(i).call()
                    
                    this.setState({
                        referenceprojet : reference ,
                        datecontrat : datec, 
                        prixvente : prix,
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
        const {accounts,montantchoisi,engagementClient,referenceprojet} = this.state
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
        var result = await engagementClient.methods.modifiercontratvente_client(this.state.numcontrat,ci,_referenceprojet).send({from: accounts[0]})
        var nb =  await client.methods.listewishlist().call()
        console.log(nb)
        this.setState({nbwishlist:nb})
        
        for (var j=0; j < nb; j++) {
           const wallet = await client.methods.getwalletAddresswishlist(j).call()
           if(accounts[0] == wallet){
            var reference = await client.methods.getreferencewishlist(j).call()
            if(reference == _referenceprojet){
                var result = await client.methods.modifierwishlist(j).send({from: accounts[0]})
                var nbclientproje = 0
                // Calculer le percentage dees clients
                var nbprojet = await fonds.methods.listeprojet().call()
                for(var m = 0;m<nbprojet;m++)
                {
                    //savoir le nombre de clients du projets
                    const ref = await fonds.methods.getRef(m).call()
                    if(ref == reference)
                     {
                       nbclientproje = await fonds.methods.getnb_client(m).call()
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

          <h3>Remplir votre contrat de vente </h3>
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
           
            <FormGroup as={Col} controlId="datecontrat" bsSize="large" readOnly>
              <FormLabel>Date de contrat</FormLabel>
              <FormControl
                autoFocus
                type="text"
                value = {this.state.datecontrat}
                name = "datecontrat"
                readOnly
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <FormGroup as={Col} controlId="prixvente" bsSize="large" readOnly>
              <FormLabel>Prix de vente</FormLabel>
              <FormControl
                autoFocus
                type="number"
                name = "prixvente"
                placeholder = {this.state.prixvente}
                readOnly
              />
            </FormGroup>
            </Form.Row>
            <Form.Row>
            <Form.Group >
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

export default clientajoutcontratvente

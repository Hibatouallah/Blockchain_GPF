import React, { Component } from "react";
import {
  HelpBlock,
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

class Ajoutercandidature extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        promoteur : null,      
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

    ajouterprojet = async (e) => {
        const {accounts,promoteur} = this.state
        e.preventDefault()

        var nb =  await promoteur.methods.listewishlist().call()
        var existe = false
        for (var i=0; i < nb; i++) {
          const ref = await promoteur.methods.getreferencewishlist(i).call()
          if (ref == localStorage.getItem('refdetails')) {
            existe = true
          } 
        }
        if(existe == false){
            var today = new Date(),
             _dateajout = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
             console.log(_dateajout)
          var result = await promoteur.methods.ajouterwishlist(localStorage.getItem('refdetails'),accounts[0],_dateajout).send({from: accounts[0]})
          console.log(result)
          alert("projet ajouté au panier")
          this.props.history.push("/ListeCandidature");
        }
        else {
          alert("Projet déja existe dans le panier")
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
      return (
        <div className="container">
          
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
          <div className="Login">
            <form enctype ="multipart/form-data" onSubmit={(e) => this.ajouterprojet(e)}>
            <Button type = "Submit">Confirmer</Button>
              </form>
          </div>
        </div>);
    }
}

export default Ajoutercandidature

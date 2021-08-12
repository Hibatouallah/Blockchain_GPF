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

class Modifierclientimage extends Component {

    constructor(props) {
        super(props);
        this.state = {
          imageHash:null,
          web3: null,
          accounts: null,
          chainid: null,
          client : null,
        };
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
            <form onSubmit={(e) => this.ModifierClientimage(e)}>
            
            <FormGroup as={Col} controlId="image" bsSize="large">
              <FormLabel>Image principale</FormLabel>
              <FormControl
                autoFocus
                type="file"
                name="image"
                onChange={this.onChangeHandlerimage}
              />
            </FormGroup>
            <LoaderButton
              block
              bsSize="large"
              type="submit"
         
              text="Modifier"
             
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

    ModifierClientimage = async (e) => {
        const {accounts} = this.state
        e.preventDefault()
        console.log("Submitting File .....")
        if (this.state.buffer){
            const file = await ipfs.add(this.state.buffer)
            this.state.imageHash = file[0]["hash"]
            console.log(this.state.imageHash)
          
        }
        const client = await this.loadContract("dev", "Client")
        var index = 0
        var nb =  await client.methods.listeclient().call()
        var _image = this.state.imageHash
      

        for (var i=0; i < nb; i++) {
          const wallet = await client.methods.getwalletAddress(i).call()
          if(accounts[0] == wallet){
            index = i
          }
        }           
        var result = await client.methods.modifierimage(index,_image).send({from: accounts[0]})
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
                    <h3>Modifier l'image du profile </h3>
                      {
                          !isAccountsUnlocked ?
                              <p><strong>Connect with Metamask and refresh the page to
                                  be able to edit the storage fields.</strong>
                              </p>
                              : null
                      }
                  
                         {this.renderForm()} 
                        
                  </div>
              </div>
          </div>
        </div>)
    }
}

export default Modifierclientimage

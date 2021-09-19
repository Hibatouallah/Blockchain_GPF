import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import projet from './img/projet.png';



class mesprojetsclients extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        fonds : null,
        dureepayement:0 ,
        liste:[]
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
       // nb client engage
       const engagementclients = await this.loadContract("dev", "EngagementClient")
       var nb =  await engagementclients.methods.getlisteclientengage().call()
     
       for (var i=0; i < nb; i++) {
           const cin = await engagementclients.methods.getcin(i).call()
           if(cin == localStorage.getItem('cinclient'))
           {
               const ref = await engagementclients.methods.getreferenceclient(i).call()
               const type = await engagementclients.methods.gettypecontract(i).call() 
               const list = [{
                    reference : ref,
                    typecontrat : type
               }]
                this.setState({
                        liste:[...this.state.liste,list] 
                })

           }
          
       }
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const fonds = await this.loadContract("dev", "Fonds")

        if (!fonds) {
            return
        }
        this.setState({
            fonds
        })
    }
    handlelistepayer= (ref,type)  =>{
        localStorage.setItem("referenceprojetpayliste",ref)
        localStorage.setItem("typecontrat",type)
        this.props.history.push("/Listeclient_projet");
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
    render() {
   
        return (
            <div className="Login">
          <Container>
              <center>
            <Row className="justify-content-md-center">
                {this.state.liste.map(index => (
                    
                    <Col xs={6} md={4}>
                    <Image onClick={() => this.handlelistepayer(index[0].reference,index[0].typecontrat)} src={projet} roundedCircle />
                    <br/>
                    <h6>{index[0].reference}</h6>
                    <br/> 
                    </Col>
                  
                ))}
             
            </Row></center>
            </Container>
        </div>
       )
    }
}

export default mesprojetsclients


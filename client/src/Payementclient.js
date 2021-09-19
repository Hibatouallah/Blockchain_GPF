import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import PAYER from './img/payementclient.png';
import DESACTIVER from './img/desactiver.png';


class Payementclient extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        fonds : null,
        dureepayement:0 ,
        anneeactuel : "",
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

       if(localStorage.getItem('typecontrat')== "Ijara"){
        var nb =  await engagementclients.methods.getliste_contrat_ijaramontahiyabitamlik().call()
      
        for (var i=0; i < nb; i++) {
            const cin = await engagementclients.methods.getcinclientijara(i).call()
            if(cin == localStorage.getItem('cinclientpayer'))
            {
                const ref = await engagementclients.methods.getreferenceprojetijara(i).call() 
                if(ref == localStorage.getItem('refprojetpayer'))
                {
                 var annee = await engagementclients.methods.getanneeactuelpayement_ijara(i).call()
                 const duree = await engagementclients.methods.getduree_payement_ijara(i).call() 
                 this.setState({
                     anneeactuel : annee,
                     dureepayement: duree
                 })
                 for(var j = 1;j<=duree;j++)
                 {
                     this.setState({
                         liste:[...this.state.liste,j] 
                     })
                 }
                }         
               
            }
            localStorage.setItem("dureepayement",this.state.dureepayement)
           console.log(this.state.anneeactuel)
        }
       }
       if(localStorage.getItem('typecontrat')== "Morabaha"){
        var nb =  await engagementclients.methods.getListecontratmorabaha().call()
      
        for (var i=0; i < nb; i++) {
            const cin = await engagementclients.methods.getcinclient(i).call()
            if(cin == localStorage.getItem('cinclientpayer'))
            {
                const ref = await engagementclients.methods.getreferenceprojet(i).call() 
                if(ref == localStorage.getItem('refprojetpayer'))
                {
                 var annee = await engagementclients.methods.getanneeactuelpayement(i).call()
                 const duree = await engagementclients.methods.getduree_payement(i).call() 
                 this.setState({
                     anneeactuel : annee,
                     dureepayement: duree
                 })
                 for(var j = 1;j<=duree;j++)
                 {
                     this.setState({
                         liste:[...this.state.liste,j] 
                     })
                 }
                }         
            }
            localStorage.setItem("dureepayement",this.state.dureepayement)
           console.log(this.state.dureepayement)
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
    handlepayer= ()  =>{
        if(localStorage.getItem('typecontrat')== "Ijara")
        {
            this.props.history.push("/PagePayementclient_ijara");
        }
        if(localStorage.getItem('typecontrat')== "Morabaha")
        {
            this.props.history.push("/PagePayementclient_Morabaha");
        }
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
                        {index == this.state.anneeactuel &&
                         <Image onClick={this.handlepayer} src={PAYER} roundedCircle />
                          }
                        {index != this.state.anneeactuel &&
                         <Image src={DESACTIVER} roundedCircle />
                        }
                    <br/>
                    <h4>{index}</h4>
                    <br/> 
                    </Col>
                  
                ))}
             
            </Row></center>
            </Container>
        </div>
       )
    }
}

export default Payementclient


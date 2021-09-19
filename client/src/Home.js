import React, {Component,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card, Image,Container,Row,Col,ListGroup,ListGroupItem} from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import promoteuricon from './img/promoteuricon.png';
import Slider from "./components/Slider";
import Close from "./img/close.png"
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBRipple } from 'mdb-react-ui-kit';


class Home extends Component {
  state = {
    web3: null,
    accounts: null,
    chainid: null,
    fonds : null,
    nbprojet:0,
    listeprojet:[],
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
      const fonds = await this.loadContract("dev", "Fonds")
      var nb =  await fonds.methods.listeprojet().call()
      this.setState({nbprojet:nb})
      for (var i=0; i < nb; i++) {
        const ref = await fonds.methods.getRef(i).call()
        const type = await fonds.methods.gettype_projet(i).call()
        const local = await fonds.methods.getlocalisation(i).call()
        const img = await fonds.methods.getimage(i).call()
        const montant = await fonds.methods.getMontant_caution_provisoire(i).call()
        const status = await fonds.methods.getstatus(i).call()
        const list =[{
          references: ref, 
          montant_caution_provisoire: montant, 
          localisation: local,
          type_projet :type,
          image : img,
          statusprojet : status
        }]
        this.setState({
          listeprojet:[...this.state.listeprojet,list] 
        })
       
        console.log(this.state.listeprojet)
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
moredetails = (ref) => {
  localStorage.setItem('refdetails', ref);
  console.log(localStorage.getItem('refdetails'))
  this.props.history.push("/detailprojet"); 
}
 
    render() { 
    
        return ( 
            <>
          
        <Slider />
        <Container>
          <Row>
          {this.state.listeprojet.map((list) =>
          <Col  md={4}>
 
            <MDBCard style={{ maxWidth: '22rem' }}>
              <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                <MDBCardImage className="image" src={`https://ipfs.infura.io/ipfs/${list[0].image}`} position='top' alt='...' />
              </MDBRipple>
              <MDBCardBody>
                <MDBCardTitle>{list[0].references}</MDBCardTitle>
                <MDBCardText>
                <p><b>Localisation:</b>{list[0].localisation}</p>
                      <p><b>Type du projet :</b>{list[0].type_projet}</p>
                      <p  class = "classp" ><b>{list[0].montant_caution_provisoire} DH</b></p>
                </MDBCardText>
                { list[0].statusprojet == "disponible" &&
                <MDBBtn className = "classbtn" onClick={() => this.moredetails(list[0].references)}>Plus de detail</MDBBtn>
                }
                { list[0].statusprojet == "NonDisponible" &&
                <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Image src={Close}></Image></center>
                }
                </MDBCardBody>
            </MDBCard>
    
          </Col>

          )}
          </Row>
          </Container>
          
          
          
        </>
       )
    }
}

export default Home

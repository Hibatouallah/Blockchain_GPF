import React, {Component,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import './App.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { Card, Button,Container,Row,Col} from 'react-bootstrap';
class detailprojet extends Component {
  state = {
    web3: null,
    accounts: null,
    chainid: null,
    fonds : null,
    nbprojet:0,
    reference : " ",
    cout_estimation_travaux: 0.0,
    delai_execution: 0,
    montant_caution_provisoire: 0.0,
    duree_validite_offre: 0,
    mesures_securites_hygiene: null,
    reception_provisoire_travaux: "",
    reception_definitive:"",
    cahier_prestations_techniques: null,
    normes_mise_en_oeuvre: null,
    localisation: "",
    superficier : "",
    type_projet: "",
    nb_chambre: 0,
    terasse : "false",
    garage : "false",
    piscine : "false",
    balcon : "false",
    mini_hopital : "false",
    supermarche : "false",
    hamam : "false",
    mini_mosque : "false",
    pharmacie : "false",
    jardin : "false",
    etage : 0,
    image: null,
    imagesec1: null,
    imagesec2: null,
    imagesec3: null,
    descriptif : "",
    
}
handleChangewishlistclient = async ()=>{
 
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
      
    const client = await this.loadContract("dev", "Client")
    var nb =  await client.methods.listewishlist().call()
    console.log(nb)
    var existe = 'true'
    if(nb == 0){
          var today = new Date(),
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          console.log(typeof(date))
          var result = await client.methods.ajouterwishlist(localStorage.getItem('refdetails'),accounts[0],date).send({from: accounts[0]})
          alert(result)
          this.props.history.push("/Listewishlistclient");
    }else{
      for (var i=0; i < nb; i++) {
        const ref = await client.methods.getreferencewishlist(i).call()
        const wallet = await client.methods.getwalletAddresswishlist(i).call()
        console.log(wallet)
        console.log(localStorage.getItem('refdetails'))
        if((localStorage.getItem('refdetails') != ref && wallet != accounts[0]) || (localStorage.getItem('refdetails') == ref && wallet != accounts[0]))
        {
          existe = 'false'
        }
        console.log(existe)
      }
        if(existe == 'false')
        {
          var today = new Date(),
          date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          var result = await client.methods.ajouterwishlist(localStorage.getItem('refdetails'),accounts[0],date).send({from: accounts[0]})
          alert(result)
          this.props.history.push("/Listewishlistclient");
        }
      
}

}
handleChangewishlist = async ()=>{
 
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
      
    const promoteur = await this.loadContract("dev", "Promoteur")
    var nb =  await promoteur.methods.listewishlist().call()
    console.log(nb)
    if(nb == 0){
          var today = new Date(),
           date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          console.log(typeof(date))
          var result = await promoteur.methods.ajouterwishlist(localStorage.getItem('refdetails'),accounts[0],date).send({from: accounts[0]})
          alert(result)
          this.props.history.push("/Listewishlist");
    }else{
      for (var i=0; i < nb; i++) {
        console.log("hii")
        const ref = await promoteur.methods.getreferencewishlist(i).call()
        console.log("hii")
        if(ref != localStorage.getItem('refdetails'))
        {
          console.log("hi2")
          let newDate = new Date()
          let date = newDate.getDate();
          var result = await promoteur.methods.ajouterwishlist(localStorage.getItem('refdetails'),accounts[0],date).call()
          alert(result)
          this.props.history.push("/Listewishlist");
        }
      }
    }
    
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
        if(ref == localStorage.getItem('refdetails'))
        {
            const cout = await fonds.methods.getCout_estimation_travaux(i).call()
            const type = await fonds.methods.gettype_projet(i).call()
            const local = await fonds.methods.getlocalisation(i).call()
            const desc = await fonds.methods.getdescriptif(i).call()
            const delai = await fonds.methods.getDelai_execution(i).call()
            const montant = await fonds.methods.getMontant_caution_provisoire(i).call()
            const duree = await fonds.methods.getduree_validite_offre(i).call()
            const mesures = await fonds.methods.getmesures_securites_hygiene(i).call()
            const reception_provisoire = await fonds.methods.getreception_provisoire_travaux(i).call()
            const reception = await fonds.methods.getreception_definitive(i).call()
            const cahier = await fonds.methods.getcahier_prestations_techniques(i).call()
            const normes = await fonds.methods.getnormes_mise_en_oeuvre(i).call()
            const superf = await fonds.methods.getsuperficier(i).call()
            const nbchambre = await fonds.methods.getnb_chambre(i).call()
            const img = await fonds.methods.getimage(i).call()
            const sec1 = await fonds.methods.getimagedet1(i).call()
            const sec2 = await fonds.methods.getimagedet2(i).call()
            const sec3 = await fonds.methods.getimagedet3(i).call()
            const etag = await fonds.methods.getetage(i).call()

            var ter = await fonds.methods.getterasse(i).call()
            var gara = await fonds.methods.getgarage(i).call()
            var piscin = await fonds.methods.getpiscine(i).call()
            var balco = await fonds.methods.getbalcon(i).call()
            var mini_hopita = await fonds.methods.getmini_hopital(i).call()
            var supermarch = await fonds.methods.getsupermarche(i).call()
            var hama = await fonds.methods.gethamam(i).call()
            var mini_mosqu = await fonds.methods.getmini_mosque(i).call()
            var pharmaci = await fonds.methods.getpharmacie(i).call()
            var jardi = await fonds.methods.getpharmacie(i).call()
           
            this.setState({
              references: ref, 
              image : img,
              imagesec1 : sec1,
              imagesec2 : sec2,
              imagesec3 : sec3,
              couts_estimation_travaux: cout, 
              localisation: local,
              type_projet :type,
              descriptif : desc,
              delai_execution: delai,
              montant_caution_provisoire: montant,
              duree_validite_offre: duree,
              mesures_securites_hygiene: mesures,
              reception_provisoire_travaux: reception_provisoire,
              reception_definitive: reception,
              cahier_prestations_techniques: cahier,
              normes_mise_en_oeuvre: normes,
              superficier: superf,
              nb_chambre: nbchambre,
              terasse: ter,
              garage: gara,
              piscine: piscin,
              etage: etag,
              balcon : balco,
              mini_hopital : mini_hopita,
              supermarche : supermarch,
              hamam : hama,
              mini_mosque : mini_mosqu,
              pharmacie : pharmaci,
              jardin : jardi,
             
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
 myRef = React.createRef();

  handleTab = index =>{
    this.setState({index: index})
    const images = this.myRef.current.children;
    for(let i=0; i<images.length; i++){
      images[i].className = images[i].className.replace("active", "");
    }
    images[index].className = "active";
  };

  componentDidMount(){
    const {index} = this.state;
    this.myRef.current.children[index].className = "active";
  }
  handleChange = ()  =>{
    localStorage.setItem('refprojet', this.state.references);
    this.props.history.push("/Ajoutercandidature");
  }

    render() {   

        return ( 
          <>
          <br/><br/>
              <center>
                <AwesomeSlider className="slider" >
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.image}`}/>
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.imagesec1}`}/>
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.imagesec2}`}/>
                  <div data-src={`https://ipfs.infura.io/ipfs/${this.state.imagesec3}`}/>
                </AwesomeSlider>
                </center>
                {/* 
                <div className="row">
                      <h4>{this.state.references}</h4>
                      <span>${this.state.montant_caution_provisoire}</span>
                    </div>
                    <p>{this.state.descriptif}</p>
                    <p>{this.state.superficier}</p>
                    {localStorage.getItem('isclient') === 'true' &&
                    <button className="cart" onClick={() => this.handleChangewishlistclient()}>Ajouter au panier </button>
                      }
                    {localStorage.getItem('ispromoteur') === 'true' &&
                    <button className="cart" onClick={() => this.handleChangewishlist()}>Ajouter au panier </button>
                      }
                    &nbsp;&nbsp;&nbsp;{localStorage.getItem('ispromoteur') === 'true' &&
                   <button className="cart" onClick={() => this.handleChange()}>Ajouter candidature </button>
                       }
                      */}
                      <br/><br/><br/>
                  <Card>
                     <Card.Body className="detailscard">
                      <Card.Title className="classp" ><b>R??f??rence :{this.state.references}</b></Card.Title>
                      <Card.Text>
                      <p ><b>Montant caution provisoire :</b>{this.state.montant_caution_provisoire} DH</p>
                      <p><b>Descriptif :</b> {this.state.descriptif}</p>
                      <p ><b>Superficier: </b>{this.state.superficier} DH</p>
                      <center>
                      {localStorage.getItem('isclient') === 'true' &&
                        <Button className="classbtn" onClick={() => this.handleChangewishlistclient()}>Ajouter au panier </Button>
                          }
                        {localStorage.getItem('ispromoteur') === 'true' &&
                        <Button className="classbtn" onClick={() => this.handleChangewishlist()}>Ajouter au panier </Button>
                          }
                        &nbsp;&nbsp;&nbsp;{localStorage.getItem('ispromoteur') === 'true' &&
                      <Button className="classbtn" onClick={() => this.handleChange()}>Ajouter candidature </Button>
                          }
                          </center>
                      </Card.Text>
                    </Card.Body>
                  </Card> 
    <Container>
  <Row>
    <Col>
                    <Card>
                    <Card.Header className="detailscardtitle" as="h5">Informations du projet</Card.Header>
                    <Card.Body className="detailscard">
                      <Card.Title></Card.Title>
                      <Card.Text>
                      <p class = "classp"><b>Type de projet :</b> {this.state.type_projet}</p>
                      <p class = "classp"><b>Localisation :</b> {this.state.localisation}</p>
                      <p class = "classp"><b>Cout d'estimation des travaux : </b>{this.state.couts_estimation_travaux} DH</p>
                      <p class = "classp"><b>Delai d'execution :</b> {this.state.delai_execution} ans</p>
                      <p class = "classp"><b>Dur??e de validit?? d'offre :</b> {this.state.duree_validite_offre} jours</p>
                      <p class = "classp"><b>reception provisoire des travaux :</b> {this.state.reception_provisoire_travaux} </p>
                      <p class = "classp" ><b>superficier :</b> {this.state.superficier}</p>
                      
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <br/>
                  </Col>
    <Col>
                  <Card>
      
                    <Card.Header className="detailscardtitle" as="h5">Details</Card.Header>
                    <Card.Body className="detailscard">
                      <Card.Text>
                      <p class = "classp"><b>terasse :</b> {this.state.terasse}</p>
                      <p class = "classp"><b>garage :</b> {this.state.garage}</p>
                      <p class = "classp"><b>piscine :</b> {this.state.piscine}</p>
                      <p class = "classp"><b>etage : </b>{this.state.etage}</p>
                      <p class = "classp"><b>balcon :</b> {this.state.balcon}</p>
                      
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card>
                    <Card.Body className="detailscard">
                      <Card.Text>
                      <p class = "classp"><b>mini hopital : </b>{this.state.mini_hopital}</p>
                      <p class = "classp"><b>supermarche :</b> {this.state.supermarche}</p>
                      <p class = "classp"><b>hamam :</b> {this.state.hamam}</p>
                      <p class = "classp"><b>mini mosque :</b> {this.state.mini_mosque}</p>
                      <p class = "classp" ><b>nb_chambre :</b> {this.state.nb_chambre}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  
                  </Col>
            </Row>
            </Container>
     </>

       )
    }
    
}

export default detailprojet

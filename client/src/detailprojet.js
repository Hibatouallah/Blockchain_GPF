import React, {Component,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import './App.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
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
            if (ter == "on"){
              ter = "oui"
            }else{
              ter = "non"
            }
            var gara = await fonds.methods.getgarage(i).call()
            if (gara == "on"){
              gara = "oui"
            }else{
              gara = "non"
            }
            var piscin = await fonds.methods.getpiscine(i).call()
            if (piscin == "on"){
              piscin = "oui"
            }else{
              piscin = "non"
            }
        
            var balco = await fonds.methods.getbalcon(i).call()
            if (balco == "on"){
              balco = "oui"
            }else{
              balco = "non"
            }
            var mini_hopita = await fonds.methods.getmini_hopital(i).call()
            if (mini_hopita == "on"){
              mini_hopita = "oui"
            }else{
              mini_hopita = "non"
            }
            var supermarch = await fonds.methods.getsupermarche(i).call()
            if (supermarch == "on"){
              supermarch = "oui"
            }else{
              supermarch = "non"
            }
            var hama = await fonds.methods.gethamam(i).call()
            if (hama == "on"){
              hama = "oui"
            }else{
              hama = "non"
            }
            var mini_mosqu = await fonds.methods.getmini_mosque(i).call()
            if (mini_mosqu == "on"){
              mini_mosqu = "oui"
            }else{
              mini_mosqu = "non"
            }
            var pharmaci = await fonds.methods.getpharmacie(i).call()
            if (pharmaci == "on"){
              pharmaci = "oui"
            }else{
              pharmaci = "non"
            }
            var jardi = await fonds.methods.getpharmacie(i).call()
            if (jardi == "on"){
              jardi = "oui"
            }else{
              jardi = "non"
            }
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
  handleChangewishlist = ()=>{
    this.props.history.push("/Ajouterwishlist");
  }
    render() {   

        return ( 

            <div className="app">
                <AwesomeSlider >
                  <div data-src={this.state.image} />
                  <div data-src={this.state.imagesec1} />
                  <div data-src={this.state.imagesec2} />
                  <div data-src={this.state.imagesec3} />
                </AwesomeSlider>
               
                <div className="details" >
                    <div className="big-img">
                    <p class = "classp"><b>Type de projet :</b> {this.state.type_projet}</p>
                    <p class = "classp"><b>Localisation :</b> {this.state.localisation}</p>
                    <p class = "classp"><b>Cout d'estimation des travaux : </b>{this.state.couts_estimation_travaux} DH</p>
                    <p class = "classp"><b>Delai d'execution :</b> {this.state.delai_execution}</p>
                    <p class = "classp"><b>Durée de validité d'offre :</b> {this.state.duree_validite_offre}</p>
                    <p class = "classp"><b>reception provisoire des travaux :</b> {this.state.reception_provisoire_travaux} </p>
                    <p class = "classp" ><b>superficier :</b> {this.state.superficier}</p>
                    <p class = "classp" ><b>nb_chambre :</b> {this.state.nb_chambre}</p>
                    <p class = "classp"><b>terasse :</b> {this.state.terasse}</p>
                    <p class = "classp"><b>garage :</b> {this.state.garage}</p>
                    <p class = "classp"><b>piscine :</b> {this.state.piscine}</p>
                    <p class = "classp"><b>etage : </b>{this.state.etage}</p>
                    <p class = "classp"><b>balcon :</b> {this.state.balcon}</p>
                    <p class = "classp"><b>mini hopital : </b>{this.state.mini_hopital}</p>
                    <p class = "classp"><b>supermarche :</b> {this.state.supermarche}</p>
                    <p class = "classp"><b>hamam :</b> {this.state.hamam}</p>
                    <p class = "classp"><b>mini mosque :</b> {this.state.mini_mosque}</p>

                    </div>
                  <div className="box">
                    <div className="row">
                      <h3>{this.state.references}</h3>
                      <span>${this.state.montant_caution_provisoire}</span>
                    </div>
                    
                    <p>{this.state.descriptif}</p>
                    <p>{this.state.superficier}</p>

  
                    <button className="cart" onClick={() => this.handleChangewishlist()}>Ajouter à wishList </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="cart" onClick={() => this.handleChange()}>Envoyer le dossier de candidature </button>
    
                  </div>
          </div>
     </div>

       )
    }
    
}

export default detailprojet

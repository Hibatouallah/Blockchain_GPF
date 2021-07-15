import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Container,Row,Image,Col,Table,Button} from "react-bootstrap"
import addicon from './img/add.png';
import deleteicon from './img/delete.png';
import updateicon from './img/update.png';
import addcontratsicon from './img/addcontrats.png';

class listeprojets extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        fonds : null,
        nbprojet:0,
        listeprojet:[]        
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
            const ter = await fonds.methods.getterasse(i).call()
            const gara = await fonds.methods.getgarage(i).call()
            const piscin = await fonds.methods.getpiscine(i).call()
            const etag = await fonds.methods.getetage(i).call()
            const img = await fonds.methods.getimage(i).call()
            const sec1 = await fonds.methods.getimagedet1(i).call()
            const sec2 = await fonds.methods.getimagedet2(i).call()
            const sec3 = await fonds.methods.getimagedet3(i).call()
            console.log(sec1)
            console.log(sec2)
            console.log(sec3)
            const list =[{
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
              etage: etag
            }]
            this.setState({
              listeprojet:[...this.state.listeprojet,list] 
            })
       
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

    ajouter = async event => {
        this.props.history.push("/ajouterprojet");
      }
   
    handleaddcontrats = async event => {
        this.props.history.push("/ajouteravantcontrat");
      }


    render() {
    
        const {
            web3, accounts, chainid,fonds
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!fonds) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
     
        return (<div className="container">
          
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
        
            <Container>
            <Row>
                <Col xs={12} md={8}>
                </Col>
                <Col xs={6} md={4}>
                    <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={this.ajouter} variant="outline-primary">Ajouter un projet</Button></center>
                </Col>
            </Row>
            </Container>
            <Table responsive >
                <thead>
                    <tr>
                    <th >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Contrats</th>
                    <th >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action</th>
                    <th>reference</th>
                    <th>Image_principale</th>
                    <th>Image_Secondaire_1</th>
                    <th>Image_Secondaire_2</th>
                    <th>Image_Secondaire_3</th>
                    <th>cout_estimation_travaux</th>
                    <th>delai_execution</th>
                    <th>montant_caution_provisoire</th>
                    <th>duree_validite_offre</th>
                    <th>mesures_securites_hygiene</th>
                    <th>reception_provisoire_travaux</th>
                    <th>reception_definitive</th>
                    <th>cahier_prestations_techniques</th>
                    <th>normes_mise_en_oeuvre</th>
                    <th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;localisation</th>
                    <th>superficier</th>
                    <th>type_projet</th>
                    <th>nb_chambre</th>
                    <th>terasse</th>
                    <th>garage</th>
                    <th>piscine</th>
                    <th>etage</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listeprojet.map((list) =>
                    <tr>
                            <td><center><Image  onClick={this.handleaddcontrats} src={addcontratsicon} /></center></td>
                            <td><Image  onClick={this.handlepomoteur} src={deleteicon} roundedCircle />
                            <Image onClick={this.handlepomoteur} src={updateicon} roundedCircle /></td>
                            <td>{list[0].references}</td>
                            <td><Card.Img variant="top" src={list[0].image} /></td>
                            <td><Card.Img variant="top" src={list[0].imagesec1} /></td>
                            <td><Card.Img variant="top" src={list[0].imagesec2} /></td>
                            <td><Card.Img variant="top" src={list[0].imagesec3} /></td>
                            <td>{list[0].couts_estimation_travaux}</td>
                            <td>{list[0].delai_execution}</td>
                            <td>{list[0].montant_caution_provisoire}</td>
                            <td>{list[0].duree_validite_offre}</td>
                            <td>{list[0].mesures_securites_hygiene}</td>
                            <td>{list[0].reception_provisoire_travaux}</td>
                            <td>{list[0].reception_definitive}</td>
                            <td>{list[0].cahier_prestations_techniques}</td>
                            <td>{list[0].normes_mise_en_oeuvre}</td>
                            <td>{list[0].localisation}</td>
                            <td>{list[0].superficier}</td>
                            <td>{list[0].type_projet}</td>
                            <td>{list[0].nb_chambre}</td>
                            <td>{list[0].terasse}</td>
                            <td>{list[0].garage}</td>
                            <td>{list[0].piscine}</td>
                            <td>{list[0].etage}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default listeprojets

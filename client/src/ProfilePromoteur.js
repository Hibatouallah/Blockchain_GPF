import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Container,Row,Image,Col,Button} from "react-bootstrap"


class ProfilePromoteur extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        promoteur : null,
        nbpromoteur:0,
        nom_prenom: "", 
        activite : "",
        identifiant_commun_entreprise : 0,
        identifiant_fiscal : 0,
        numero_rc : 0,
        adresse: "", 
        email: "",
        walletAddress: "",
        photo:null  
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
        const promoteur = await this.loadContract("dev", "Promoteur")
        var nb =  await promoteur.methods.listepromoteur().call()
        this.setState({nbpromoteur:nb})

        for (var i=0; i < nb; i++) {
          const wallet = await promoteur.methods.getwalletAddress(i).call()
          if(accounts[0] == wallet){
            const nomprenom = await promoteur.methods.getnom_prenom(i).call()
            const act = await promoteur.methods.getactivite(i).call()
            const i_c_e = await promoteur.methods.getidentifiant_commun_entreprise(i).call()
            const i_f = await promoteur.methods.getidentifiant_fiscal(i).call()
            const n_rc = await promoteur.methods.getnumero_rc(i).call()
            const addr = await promoteur.methods.getadresse(i).call()
            const em = await promoteur.methods.getemail(i).call()
            const ph = await promoteur.methods.getphoto(i).call()

            this.setState({
              nom_prenom: nomprenom, 
              activite : act,
              identifiant_commun_entreprise : i_c_e,
              identifiant_fiscal : i_f,
              numero_rc : n_rc,
              adresse: addr, 
              email: em,
              walletAddress: wallet,
              photo : ph
            })
          }
        }
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
     
        return (<div className="container">
            {localStorage.getItem('ispromoteur') != 'true' &&
             this.props.history.push("/Loginpromoteur")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
            <br/>
            <Container>
                {/* Columns are always 50% wide, on mobile and desktop */}
                <Row>
                <Col xs={6} > 
                <Card border="primary" style={{ width: '30rem' }}>
                    <Card.Header><Image src={`https://ipfs.infura.io/ipfs/${this.state.photo}`} fluid roundedCircle /></Card.Header>
                    <Card.Body>
                      <Card.Title><center><h5><b>Informations Personnelle</b></h5></center></Card.Title>
                      <Card.Text>
                        <p><b>Nom Complet :</b>{this.state.nom_prenom}</p>
                        <p><b>Email :</b>{this.state.email}</p>
                        <p><b>Addresse :</b>{this.state.adresse}</p>
                        <p><b>Addresse du portefeuille :</b>{this.state.walletAddress}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <br /></Col>
                  <Col xs={6} >
                  <Card border="primary" style={{ width: '30rem' }}>
                    <Card.Header><center><h5><b>Details</b></h5></center></Card.Header>
                    <Card.Body>
                      <Card.Title></Card.Title>
                      <Card.Text>
                        <p><b>Identifiant fiscal :</b>{this.state.identifiant_fiscal}</p>
                        <p><b>Identifiant Commun Entreprise :</b>{this.state.identifiant_commun_entreprise}</p>
                        <p><b>Activité :</b>{this.state.activite}</p>
                        <p><b>Numéro RC :</b>{this.state.numero_rc}</p>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <br />
                  <Button variant="dark">Modifier Mes Informations</Button>
                  </Col>
                </Row>
            </Container>
            
        </div>)
    }
}

export default ProfilePromoteur


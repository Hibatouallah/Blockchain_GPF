import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Container,Row,Image,Col,Table} from "react-bootstrap"
import addicon from './img/add.png';
import deleteicon from './img/delete.png';
import updateicon from './img/update.png';

class listepromoteurs extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        promoteur : null,
        nbpromoteur:0,
        listepromoteurs:[]        
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
            const nomprenom = await promoteur.methods.getnom_prenom(i).call()
            const act = await promoteur.methods.getactivite(i).call()
            const i_c_e = await promoteur.methods.getidentifiant_commun_entreprise(i).call()
            const i_f = await promoteur.methods.getidentifiant_fiscal(i).call()
            const n_rc = await promoteur.methods.getnumero_rc(i).call()
            const addr = await promoteur.methods.getadresse(i).call()
            const em = await promoteur.methods.getemail(i).call()
            const ps = await promoteur.methods.getpassword(i).call()
            const st = await promoteur.methods.getstatus(i).call()
            const wallet = await promoteur.methods.getwalletAddress(i).call()
            const create = await promoteur.methods.getcreatedAt(i).call()
            const update = await promoteur.methods.getupdatedAt(i).call()
            const penalite = await promoteur.methods.getPenalits_retard(i).call()
            const a_r_c = await promoteur.methods.getassurances_responsabilites_civile(i).call()
            const a_r_ch = await promoteur.methods.getassurance_rique_chantier(i).call()
            const a_a_t = await promoteur.methods.getassurance_accident_travail(i).call()
        
            const list =[{
                nom_prenom: nomprenom, 
                activite : act,
                identifiant_commun_entreprise : i_c_e,
                identifiant_fiscal : i_f,
                numero_rc : n_rc,
                adresse: addr, 
                email: em,
                password :ps,
                status : st,
                walletAddress: wallet,
                createdAt: create,
                updatedAt: update,
                Penalits_retard: penalite,
                assurances_responsabilites_civile: a_r_c,
                assurance_rique_chantier: a_r_ch,
                assurance_accident_travail: a_a_t
            }]
            this.setState({
                listepromoteurs:[...this.state.listepromoteurs,list] 
            })
       
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

    ajouter = async event => {
        alert('hello');
        this.props.history.push("/ajouterprojet");
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
          
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
            <br/>
            <Container>
            <Row>
                <Col xs={12} md={8}>
                </Col>
                <Col xs={6} md={4}>
                <center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Image left onClick={this.ajouter} src={addicon}  rounded /></center> 
                    <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Ajouter</h4>
                </Col>
            </Row>
            </Container>
           
            <Table responsive >
                <thead>
                    <tr>
                    <th >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action</th>
                    <th>nom_prenom</th>
                    <th>activite</th>
                    <th>identifiant_commun_entreprise</th>
                    <th>identifiant_fiscal</th>
                    <th>numero_rc</th>
                    <th>adresse</th>
                    <th>email</th>
                    <th>password</th>
                    <th>status</th>
                    <th>walletAddress</th>
                    <th>createdAt</th>
                    <th>updatedAt</th>
                    <th>Penalits_retard</th>
                    <th>assurances_responsabilites_civile</th>
                    <th>assurance_rique_chantier</th>
                    <th>assurance_accident_travail</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listepromoteurs.map((list) =>
                    <tr>
                            <td><Image  onClick={this.handlepomoteur} src={deleteicon} roundedCircle />
                            <Image onClick={this.handlepomoteur} src={updateicon} roundedCircle /></td>
                            <td>{list[0].nom_prenom}</td>
                            <td>{list[0].activite}</td>
                            <td>{list[0].identifiant_commun_entreprise}</td>
                            <td>{list[0].identifiant_fiscal}</td>
                            <td>{list[0].numero_rc}</td>
                            <td>{list[0].adresse}</td>
                            <td>{list[0].email}</td>
                            <td>{list[0].password}</td>
                            <td>{list[0].status}</td>
                            <td>{list[0].walletAddress}</td>
                            <td>{list[0].createdAt}</td>
                            <td>{list[0].updatedAt}</td>
                            <td>{list[0].Penalits_retard}</td>
                            <td>{list[0].assurances_responsabilites_civile}</td>
                            <td>{list[0].assurance_rique_chantier}</td>
                            <td>{list[0].assurance_accident_travail}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default listepromoteurs

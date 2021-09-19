import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Col,Table,Image} from "react-bootstrap"
import updateicon from './img/update.png'

class Listeclient_projet extends Component {
    state = {
        web3: null,
        accounts: null,
        chainid: null,
        EngagementClient : null,
        nbcontrat:0,
        listecontrat:[]        
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
        const EngagementClient = await this.loadContract("dev", "EngagementClient")
        
        if(localStorage.getItem('typecontrat')=="Morabaha"){
            var nb =  await EngagementClient.methods.getListecontratmorabaha().call()
            this.setState({nbcontrat:nb})
    
            for (var i=0; i < nb; i++) {
                const cin = await EngagementClient.methods.getcinclient(i).call()
                if(cin == localStorage.getItem('cinclient'))
                {
                    const reference = await EngagementClient.methods.getreferenceprojet(i).call()
                    if(reference == localStorage.getItem('referenceprojetpayliste')){
                        const estimation = await EngagementClient.methods.getestimationpenalite(i).call()
                        const cout = await EngagementClient.methods.getcoutderevien(i).call()
                        const marg = await EngagementClient.methods.getmarge(i).call()
                        const prix = await EngagementClient.methods.getprixvente(i).call()
                        const duree_ammort = await EngagementClient.methods.getduree_ammortissement(i).call()
                        const assurancetakafu = await EngagementClient.methods.getassurancetakaful(i).call()
                        const duree_contra = await EngagementClient.methods.getduree_contrat(i).call()
                        const montant = await EngagementClient.methods.getmontantpaye(i).call()
                        const annee = await EngagementClient.methods.getanneeactuelpayement(i).call()
                        const mois = await EngagementClient.methods.getmoisactuelpayement(i).call()
                        const trimestre = await EngagementClient.methods.gettrimestreactuelpayement(i).call()
                        const semestre = await EngagementClient.methods.getsemestreactuelpayement(i).call()
                        const duree = await EngagementClient.methods.getduree_payement(i).call()
                        const type = await EngagementClient.methods.gettype_payement(i).call()
                        const list =[{
                            cinclient: cin, 
                            referenceprojet : reference,
                            estimationpenalite : estimation,
                            coutderevien : cout,
                            marge : marg,
                            prixvente: prix, 
                            duree_ammortissement: duree_ammort,
                            assurancetakaful: assurancetakafu,
                            duree_contrat: duree_contra,
                            type_payement : type,
                            duree_payement : duree,
                            montantpayer : montant,
                            anneeactuel : annee,
                            moisactuel : mois,
                            trimestreactuel : trimestre,
                            semestreactuel: semestre
                        }]
                        this.setState({
                            listecontrat:[...this.state.listecontrat,list] 
                        })
                    }
                }
            }
        }
        if(localStorage.getItem('typecontrat')=="Ijara"){
            var nb =  await EngagementClient.methods.getliste_contrat_ijaramontahiyabitamlik().call()
            this.setState({nbcontrat:nb})
    
            for (var i=0; i < nb; i++) {
                const cin = await EngagementClient.methods.getcinclientijara(i).call()
                if(cin == localStorage.getItem('cinclient'))
                {
                    const reference = await EngagementClient.methods.getreferenceprojetijara(i).call()
                    if(reference == localStorage.getItem('referenceprojetpayliste')){
                        const duree = await EngagementClient.methods.getduree_contratijara(i).call()
                        const montantloyer = await EngagementClient.methods.getmontant_loyer(i).call()
                        const date_res = await EngagementClient.methods.getdate_resuliation(i).call()
                        const cession = await EngagementClient.methods.getcession_du_bien(i).call()

                        const montantpartranche = await EngagementClient.methods.getmontantpartranche(i).call()
                    
                        const annee = await EngagementClient.methods.getanneeactuelpayement_ijara(i).call()
                        const mois = await EngagementClient.methods.getmoisactuelpayement_ijara(i).call()
                        const trimestre = await EngagementClient.methods.gettrimestreactuelpayement_ijara(i).call()
                        const semestre = await EngagementClient.methods.getsemestreactuelpayement_ijara(i).call()
                        const dureepayi = await EngagementClient.methods.getduree_payement_ijara(i).call()
                        const type = await EngagementClient.methods.gettype_payement_ijara(i).call()
                        const list =[{
                            cinclient: cin, 
                            referenceprojet : reference,
                            dureepayi : dureepayi,
                            montantloyer : montantloyer,
                            date_res : date_res,
                            cession: cession, 
                            montantpartranche: montantpartranche,
                            type_payement : type,
                            duree_payement : duree,
                            anneeactuel : annee,
                            moisactuel : mois,
                            trimestreactuel : trimestre,
                            semestreactuel: semestre
                        }]
                        this.setState({
                            listecontrat:[...this.state.listecontrat,list] 
                        })
                    }
                }
            }
        }
        if(localStorage.getItem('typecontrat')=="Vente"){
            var nb =  await EngagementClient.methods.getlistecontratvente().call()
            this.setState({nbcontrat:nb})
    
            for (var i=0; i < nb; i++) {
                const cin = await EngagementClient.methods.getcinclientvente(i).call()
                if(cin == localStorage.getItem('cinclient'))
                {
                    const reference = await EngagementClient.methods.getreferenceprojetvente(i).call()
                    if(reference == localStorage.getItem('referenceprojetpayliste')){
                        const date_c = await EngagementClient.methods.getdatecontrat(i).call()
                        const prix_v = await EngagementClient.methods.get_prixvente(i).call()
                        
                        const list =[{
                            cinclient: cin, 
                            referenceprojet : reference,
                            date_contrat : date_c,
                            prix_vente : prix_v,
                        }]
                        this.setState({
                            listecontrat:[...this.state.listecontrat,list] 
                        })
                    }
                }
            }
        }
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const EngagementClient = await this.loadContract("dev", "EngagementClient")

        if (!EngagementClient) {
            return
        }
        this.setState({
            EngagementClient
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
            web3, accounts, chainid,EngagementClient
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!EngagementClient) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
     
        return (<div className="container">
           {localStorage.getItem('isclient') != 'true' &&
             this.props.history.push("/Loginclient")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
            <br/>
            {localStorage.getItem('typecontrat')=="Vente" &&
          <>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>reference_projet</th>
                    <th>date_contrat</th>
                    <th>prix_vente</th>
                  
                    </tr>
                </thead>
                <tbody>
                {this.state.listecontrat.map((list) =>
                    <tr>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].date_contrat}</td>
                            <td>{list[0].prix_vente}</td>
                           
                    </tr>
 
                )}
                </tbody>
            </Table>
            </>}
          {localStorage.getItem('typecontrat')=="Morabaha" &&
          <>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>referenceprojet</th>
                    <th>estimationpenalite</th>
                    <th>coutderevien</th>
                    <th>marge</th>
                    <th>prixvente</th>
                    <th>duree_ammortissement</th>
                    <th>assurancetakaful</th>
                    <th>duree_contrat</th>
                    <th>type_payement </th> 
                    <th>duree_payement</th> 
                    <th>montantpayer</th>
                    <th>anneeactuel</th>
                    <th>moisactuel</th>
                    <th>trimestreactuel</th>
                    <th>semestreactuel</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.listecontrat.map((list) =>
                    <tr>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].estimationpenalite}</td>
                            <td>{list[0].coutderevien}</td>
                            <td>{list[0].marge}</td>
                            <td>{list[0].prixvente}</td>
                            <td>{list[0].duree_ammortissement}</td>
                            <td>{list[0].assurancetakaful}</td>
                            <td>{list[0].duree_contrat}</td>
                            <td>{list[0].type_payement}</td>
                            <td>{list[0].duree_payement}</td>
                            <td>{list[0].montantpayer}</td>
                            <td>{list[0].anneeactuel}</td>
                            <td>{list[0].moisactuel}</td>
                            <td>{list[0].trimestreactuel}</td>
                            <td>{list[0].semestreactuel}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            </>}

            {localStorage.getItem('typecontrat')=="Ijara" &&
          <>
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>referenceprojet</th>
                    <th>Duree</th>
                    <th>Mpntant_location</th>
                    <th>Date_resuliation</th>
                    <th>Cession_bien</th>
                    <th>type_payement </th> 
                    <th>duree_payement</th> 
                    <th>montantpartranche</th>
                    <th>anneeactuel</th>
                    <th>moisactuel</th>
                    <th>trimestreactuel</th>
                    <th>semestreactuel</th>
                    </tr>
                </thead>
                <tbody>
             
             
                {this.state.listecontrat.map((list) =>
                    <tr>
                            <td>{list[0].referenceprojet}</td>
                            <td>{list[0].dureepayi}</td>
                            <td>{list[0].montantloyer}</td>
                            <td>{list[0].date_res}</td>
                            <td>{list[0].cession}</td>
                            <td>{list[0].type_payement}</td>
                            <td>{list[0].duree_payement}</td>
                            <td>{list[0].montantpayer}</td>
                            <td>{list[0].anneeactuel}</td>
                            <td>{list[0].moisactuel}</td>
                            <td>{list[0].trimestreactuel}</td>
                            <td>{list[0].semestreactuel}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            </>}
        </div>)
    }
}

export default Listeclient_projet

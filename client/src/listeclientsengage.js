import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Container,Row,Image,Col,Table,Button} from "react-bootstrap"

import updateicon from './img/update.png';
import addcontratsicon from './img/addcontrats.png';


class listeclientsengage extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        engagementclient : null,
        nbprojet:0,
        listeprojet:[], 
        nbclientengage : 0 ,
        listclient : [] ,
        listrefer : []
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
       
        const engagementclient = await this.loadContract("dev","EngagementClient")
        const client = await this.loadContract("dev","Client")
        var nbc = await engagementclient.methods.getlisteclientengage().call()
        var nb =  await client.methods.getliste_contrat_client().call()
        this.setState({nbclientengage:nbc})
        console.log(nbc)
        var n = 0
        for (var j = 0; j<nbc; j++){
            this.state.listclient = []
            var exisite = 'false'
            const referenceclie = await engagementclient.methods.getreferenceclient(j).call()
              this.state.listrefer.map((list) => {
                    if(list[0].referenceclient == referenceclie){
                        exisite = 'true'
                    }
                })
            if(exisite =='false'){
                n = n+1
            for (var k = 0;k<nbc;k++){
                console.log(this.state.listrefer)
                const reference = await engagementclient.methods.getreferenceclient(k).call()
                
                console.log(exisite)
                if(referenceclie == reference){
                   
                        const cinclient = await engagementclient.methods.getcin(k).call()
                        const typecontra = await engagementclient.methods.gettypecontract(k).call()
                        const statuspayement = await engagementclient.methods.getstatuspayment(k).call()
                        for(var j = 0;j<nb;j++){
                            const cincontrat = await engagementclient.methods.getcinclient_contrat(j).call() 
                            if(cincontrat == cinclient){
                                const refcontrat = await engagementclient.methods.getreferenceprojet_contrat(j).call() 
                                if(refcontrat == referenceclie){
                                    const contrat = await engagementclient.methods.getcontrat_contrat(j).call()
                                    const list =[{
                                        cin : cinclient,
                                        typecontract : typecontra,
                                        reference : referenceclie,
                                        status : statuspayement,
                                        contrati : contrat
                                    }]
                                    this.setState({
                                        listclient:[...this.state.listclient,list] 
                                    }) 
                                }
                            }
                        }     
                    }
                   
                }
           
            const listref = [{
                num :n,
                referenceclient : referenceclie,
                listeclients : this.state.listclient
            }]
            this.setState({
                listrefer:[...this.state.listrefer,listref] 
              })
            
            //console.log(this.state.listclient)
             }
            }

    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const engagementclient = await this.loadContract("dev", "EngagementClient")

        if (!engagementclient) {
            return
        }
        this.setState({
            engagementclient
        })
    }
    activer = async (cinclient,ref) => {
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
        var account = null
        const engagementclient = await this.loadContract("dev", "EngagementClient")
        const client = await this.loadContract("dev", "Client")
        var nbc =  await client.methods.listeclient().call()
        for(var i = 0;i<nbc;i++){
            var cin = await client.methods.getcin(i).call()
            if(cinclient == cin)
            {
                 account = await client.methods.getwalletAddress(i).call()
            }
        }
        var nb =  await engagementclient.methods.getlisteclientengage().call()

        for (var j = 0; j<nb; j++){
            const cin = await engagementclient.methods.getcin(j).call()
            if(cin == cinclient){
                const reference = await engagementclient.methods.getreferenceclient(j).call()
                if(reference == ref){
                    var result = await engagementclient.methods.modifierpayement_client(j,'Activer').send({from: accounts[0]})
                    var type = await engagementclient.methods.gettypecontract(j).call()
                 
                    if(type == "Morabaha"){
                        var nbl = await engagementclient.methods.getListecontratmorabaha().call()
                        for(var k = 0;k<nbl;k++){
                            const cinpay = await engagementclient.methods.getcinclient(k).call()
                            if(cinpay == cinclient){
                                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                                if(refpay == ref){
                                    var annee = await engagementclient.methods.modifier_anneeactuelpayement(k,"1").send({from: accounts[0]})
                                    var typepayement = await engagementclient.methods.gettype_payement(k).call()
                                    if(typepayement == 'Mensuellement'){
                                        var mois = await engagementclient.methods.modifier_moisactuelpayement(k,"1").send({from: accounts[0]})
                                    }
                                    if(typepayement == 'Semestriellement'){
                                        var mois = await engagementclient.methods.modifier_semestreactuelpayement(k,"1").send({from: accounts[0]})
                                    }
                                    if(typepayement == 'Trimestriellement'){
                                        var mois = await engagementclient.methods.modifier_trimestreactuelpayement(k,"1").send({from: accounts[0]})
                                    }
                                
                                }
                            }
                        }
                    }

                    if(type == "Ijara"){
                        var nbl = await engagementclient.methods.getliste_contrat_ijaramontahiyabitamlik().call()
                        for(var k = 0;k<nbl;k++){
                            const cinpay = await engagementclient.methods.getcinclientijara(k).call()
                            if(cinpay == cinclient){
                                const refpay= await engagementclient.methods.getreferenceprojetijara(k).call()
                                if(refpay == ref){
                                    var annee = await engagementclient.methods.modifier_anneeactuelpayement_ijara(k,"1").send({from: accounts[0]})
                                    var typepayement = await engagementclient.methods.gettype_payement_ijara(k).call()
                                    if(typepayement == 'Mensuellement'){
                                        var mois = await engagementclient.methods.modifier_moisactuelpayement_ijara(k,"1").send({from: accounts[0]})
                                    }
                                    if(typepayement == 'Semestriellement'){
                                        var mois = await engagementclient.methods.modifier_semestreactuelpayement_ijara(k,"1").send({from: accounts[0]})
                                    }
                                    if(typepayement == 'Trimestriellement'){
                                        var mois = await engagementclient.methods.modifier_trimestreactuelpayement_ijara(k,"1").send({from: accounts[0]})
                                    }
                                
                                }
                            }
                        }
                    }
                    var _message = "le projet avec la reference : "+reference+"est finalisé ,les clés sont disponible maintenant vous pouvez débuter la procédure de payement"
                    var result1 = await client.methods.ajouternotification(_message,account).send({from: accounts[0]})      
                    alert(result)
                    this.props.history.push("/listeclientsengage");
                }
            }
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
    
        const {
            web3, accounts, chainid,engagementclient
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!engagementclient) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
     
        return (<div className="container">
           {localStorage.getItem('isfonds') != 'true' &&
             this.props.history.push("/Loginfonds")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
        
            <h3 class ='h3style'>Liste des clients engagés par projet</h3>
            {this.state.listrefer.map((refli) => 
            <>
            <br/>
             <h6 class='h6style'><b>Reference de projet N {refli[0].num} : {refli[0].referenceclient}</b></h6> 
            <Table responsive >
            <thead class="thead-dark">
                    <tr>
                    <th>Contrat_signé</th> 
                    <th>cin_client</th> 
                    <th>typecontract</th>
                    <th>Payement</th>
                    <th>Status_Payement</th>
                    </tr>
                </thead>
                <tbody>
                {refli[0].listeclients.map((list) =>
                    <tr>
                        <td>
                            {list[0].contrati == "" &&
                             <p>Contrat non livré</p>
                            }
                             {list[0].contrati != "" &&
                            <a href={`https://ipfs.infura.io/ipfs/${list[0].contrati}`}>contrat.pdf</a>
                            }
                        </td>
                        <td>{list[0].cin}</td>
                        <td>{list[0].typecontract}</td>  
                        <td>
                        {list[0].status === 'Desactiver' &&
                            <Button variant="danger" onClick={(e) => this.activer(list[0].cin,refli[0].referenceclient)} color="primary">
                                Activer
                        </Button>  
                        }    
                        </td>   
                        <td>{list[0].status}</td>
                    </tr>
                )}
                </tbody>
            </Table>
             </>)}
             <br/> <br/> <br/> <br/> <br/> <br/>  <br/> <br/> 
        </div>)
    }
}

export default listeclientsengage

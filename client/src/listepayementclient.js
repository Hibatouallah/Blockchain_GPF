import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { FormControl,Button,Row,Image,Col,Table,FormGroup} from "react-bootstrap"
import addicon from './img/add.png';
import deleteicon from './img/delete.png';
import updateicon from './img/update.png';
import mourabaha from './img/mourabaha.pdf';
import ijara from './img/ijara.pdf';
import vente from './img/vente.pdf';
const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class mesprojetsclients extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        clients : null,
        client : null,
        nbclientengage:0,
        nbclient : 0,
        clientengage:[],
        buffercontrat : null,
        contrat:null     
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
        this.setState({nbclientengage:nb})

        // nb client inscris
        const client = await this.loadContract("dev", "Client")
        var nbc =  await client.methods.listeclient().call()
        this.setState({nbclient:nb})
        var ci = ""
        // trouver le cin du client actuel
        for (var i=0; i < nbc; i++) {
          const wallet = await client.methods.getwalletAddress(i).call()
          if(accounts[0] == wallet){
            ci = await client.methods.getcin(i).call()
          }
        }

        var nbc =  await client.methods.listeclient().call()
        var nb =  await client.methods.getliste_contrat_client().call()
        
        for (var i=0; i < nb; i++) {
            const cin = await engagementclients.methods.getcin(i).call()
            if(cin == ci)
            {
                const ref = await engagementclients.methods.getreferenceclient(i).call() 
                const type = await engagementclients.methods.gettypecontract(i).call()  
                const status = await engagementclients.methods.getstatuspayment(i).call()  
                for(var j = 0;j<nb;j++){
                    const cincontrat = await engagementclients.methods.getcinclient_contrat(j).call() 
                    if(cincontrat == ci){
                        const refcontrat = await engagementclients.methods.getreferenceprojet_contrat(j).call() 
                        if(refcontrat == ref){
                            const contrat = await engagementclients.methods.getcontrat_contrat(j).call()
                            const list =[{
                                cinclient : cin,
                                reference: ref, 
                                typecontrat: type,
                                statuspayement : status,
                                contrat : contrat
                            }]
                            this.setState({
                                clientengage:[...this.state.clientengage,list] 
                            }) 
                        }
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

    handleChange = (ref)  =>{
        localStorage.setItem('refprojet',ref);
        this.props.history.push("/Confirmerclient");
      }
    payer = async(type,cin,ref)  =>{

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
    
        localStorage.setItem('refprojetpayer',ref);
        localStorage.setItem('cinclientpayer',cin);
        localStorage.setItem('typecontrat',type);
     
        if(type === 'Vente'){
            const engagementclient = await this.loadContract("dev", "EngagementClient")
            const fonds = await this.loadContract("dev", "Fonds")
        
            var _account = await fonds.methods.getwalletAddress().call()
            var nbl = await engagementclient.methods.getlistecontratvente().call()
            var nbc = await engagementclient.methods.getlisteclientengage().call()
            console.log(nbc)
            for(var k = 0;k<nbl;k++){
                const cinpay = await engagementclient.methods.getcinclient(k).call()
                console.log(cinpay)
                if(cinpay == localStorage.getItem("cinclient")){
                    const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                    if(refpay == localStorage.getItem('refprojetpayer')){
                        const montant= await engagementclient.methods.get_prixvente(k).call()
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        //envoi du montant 
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        
                        var _message = "Le paiement est effecué par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+localStorage.getItem('refprojetpayer')
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                        // Stocker historique de payement
                        var res = await engagementclient.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),localStorage.getItem('refprojetpayer'),_message).send({from: accounts[0]})
                        
                        // Fin Payement
                        for(var l = 0;l<nbc;l++){
                            const ci = await engagementclient.methods.getcin(l).call()
                            if(ci == localStorage.getItem("cinclient")){
                                const ref= await engagementclient.methods.getreferenceclient(l).call()
                                if(ref == localStorage.getItem('refprojetpayer')){
                                var res = await engagementclient.methods.modifierpayement_client(l,'Payement effectué').send({from: accounts[0]})
                                var res1 = await engagementclient.methods.desa_activerpayement_client(l,'Desactiver').send({from: accounts[0]})
                                }
                            }
                        }
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    
                    }
                }
            }
        }
        else{
            this.props.history.push("/Payementclient");
        }
      }

      ajoutercontrat= async(event)=>{
        // Get network provider and web3 instance.
        event.preventDefault()
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
     
        var contrat = null
        console.log(this.state.buffercontrat)
        if (this.state.buffercontrat){
            const file = await ipfs.add(this.state.buffercontrat)
            contrat = file[0]["hash"]
            console.log(contrat)
        }
        var result = await client.methods.ajoutercontrat_client(localStorage.getItem('cinclient'),localStorage.getItem('ref'),this.state.contrat).send({from: accounts[0]})
          alert("Contrat envoyé")
          this.props.history.push("./listepayementclient")
      }
      onChangeHandlercontrat=event=>{
        event.preventDefault()
        //Process file for IPFS ....
        const file = event.target.files[0]
        console.log(file)
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({buffercontrat : Buffer.from(reader.result)})
        }
        this.ajoutercontrat(event)
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
           
            <Table responsive >
                <thead class="thead-dark">
                    <tr>
                    <th>Envoyer_contrat</th>
                    <th>Reference projet</th>
                    <th>Type de contrat</th>
                    <th>Contrat</th>
                    <th>Payement</th>
                    </tr>
                </thead>
                <tbody>
             
                {this.state.clientengage.map((list) =>
                    <tr>
                            <td>
                            {localStorage.setItem('cinclient',list[0].cinclient)}
                            {localStorage.setItem('ref',list[0].reference)}
                                { list[0].contrat == "" &&
                               
                                <FormGroup as={Col} controlId="contrat" bsSize="large">
                                <FormControl
                                    onChange={this.onChangeHandlercontrat}
                                    type="file"
                                />
                                </FormGroup>
                                }
                                 { list[0].contrat != "" &&
                               
                               <a href={`https://ipfs.infura.io/ipfs/${list[0].contrat}`}>contrat.pdf</a>
                               }
                            </td>
                            <td>{list[0].reference}</td>
                            <td>{list[0].typecontrat}</td>
                            <td>
                            {list[0].typecontrat === 'Morabaha' &&
                             <Button
                                    href={mourabaha}
                                    variant="danger"
                                    target="_blank"
                                    download>Cliquez ici
                                </Button>
                            }
                            {list[0].typecontrat === 'Vente'  &&
                                <Button
                                    href={vente}
                                    variant="danger"
                                    target="_blank"
                                    download>Cliquez ici
                                </Button>
                            }     
                            {list[0].typecontrat === 'Ijara'  &&    
                                <Button
                                    href={ijara}
                                    variant="danger"
                                    target="_blank"
                                    download>Cliquez ici
                                </Button>
                            }
                            </td>
                            <td>
                            {list[0].statuspayement === 'Activer'  &&    
                                <Button
                                    onClick={(e) => this.payer(list[0].typecontrat,list[0].cinclient,list[0].reference)}
                                    variant="primary"
                                    target="_blank"
                                    download>Cliquez ici
                                </Button>
                            }
                             {list[0].statuspayement != 'Activer'  &&  
                                list[0].statuspayement
                            }
                            </td>
                         
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default mesprojetsclients

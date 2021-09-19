import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Card,Image} from "react-bootstrap"

import OK from './img/ok.png'

const ipfsClient = require('ipfs-api')
// connect to ipfs daemon API server
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
class listeprojetspromoteurs extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        engagementpromoteur : null,
        listeprojetpromoteur : []
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
        const engagamentpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
        var nb =  await engagamentpromoteur.methods.getlisteprojetpromoteur().call()
        var nbl =  await engagamentpromoteur.methods.getlisteprojetpromoteur().call()
        for (var i=0; i < nb; i++) {
            const account = await engagamentpromoteur.methods.getaccountpromoteurprojet(i).call()
            if(account == accounts[0]){
                var ref = await engagamentpromoteur.methods.getreferencepromoteurprojet(i).call()
                var debut = await engagamentpromoteur.methods.getdebutdestravaux(i).call()
                var construction = await engagamentpromoteur.methods.getconstruction_rez_de_chaussee(i).call()
                var grand = await engagamentpromoteur.methods.getgrands_travaux(i).call()
                var fini = await engagamentpromoteur.methods.getfinition(i).call()
                var livr = await engagamentpromoteur.methods.getlivraison(i).call()
                for(var k = 0;k<nbl;k++){
                    var acc =  await engagamentpromoteur.methods.getaccountpromoteurprojet(k).call()
                    console.log(acc)
                    if(acc == accounts[0]){
                        var reference = await engagamentpromoteur.methods.getreferencepromoteurprojet(k).call()
                        console.log(reference)
                        if(reference == ref){
                            console.log(reference)
                            var contrat = await engagamentpromoteur.methods.getcontrat(k).call()
                            console.log(contrat)
                            const list =[{
                                accountpromoteur: account,
                                referencepromoteur : ref,
                                debutdestravaux : debut,
                                construction_rez_de_chaussee : construction,
                                grands_travaux : grand ,
                                finition : fini,
                                livraison : livr,
                                contrat : contrat
                            }]
                            this.setState({
                                listeprojetpromoteur:[...this.state.listeprojetpromoteur,list] 
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")

        if (!engagementpromoteur) {
            return
        }
        this.setState({
            engagementpromoteur
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
    handledebutdestravaux = async(ref) =>{
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    
        var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
        for(var i = 0;i<nb;i++){
            var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
            if(reference == ref){
                const debut = await engagementpromoteur.methods.modifierdebutdestravaux(i).send({from: accounts[0]})
                var _message = " La tache de debut des travaux est accomplie du projet avec la reference :"+ref
                var result = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                alert("Message est envoyé  ") 
            }  
            }
        
    }
    handleconstruction_rez_de_chaussee = async(ref) =>{
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    
        var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
        for(var i = 0;i<nb;i++){
            var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
            if(reference == ref){
                const debut = await engagementpromoteur.methods.modifierconstruction_rez_de_chaussee(i).send({from: accounts[0]})
                var _message = " La tache de la construction de rez de chausée est accomplie du projet avec la reference :"+ref
                var result = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                alert("Message est envoyé ") 
            }  
            }
        
    }
    handlegrands_travaux = async(ref) =>{
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    
        var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
        for(var i = 0;i<nb;i++){
            var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
            if(reference == ref){
                const debut = await engagementpromoteur.methods.modifiergrands_travaux(i).send({from: accounts[0]})
                var _message = " La tache des grands travaux est accomplie du projet avec la reference :"+ref
                var result = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                alert("Message est envoyé ") 
            }  
            }
    }
    handlefinition = async(ref) =>{
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    
        var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
        for(var i = 0;i<nb;i++){
            var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
            if(reference == ref){
                const debut = await engagementpromoteur.methods.modifierfinition(i).send({from: accounts[0]})
                var _message = " La tache de la finition est accomplie du projet avec la reference :"+ref
                var result = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                alert("Message est envoyé ") 
            }  
            }
    }
    handlelivraison = async(ref) =>{
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
        const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    
        var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
        for(var i = 0;i<nb;i++){
            var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
            if(reference == ref){
                const debut = await engagementpromoteur.methods.modifierlivraison(i).send({from: accounts[0]})
                var _message = " La tache de la livraison est accomplie du projet avec la reference :"+ref
                var result = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})
                alert("Message est envoyé ") 
            }  
            }
        
    }
    render() {
    
        const {
            web3, accounts, chainid,engagementpromoteur
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!engagementpromoteur) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
     
        return (<div className="container">
           {localStorage.getItem('ispromoteur') != 'true' &&
             this.props.history.push("/LoginPromoteur")
            }
            {
                !isAccountsUnlocked ?
                    <p><strong>Connect with Metamask and refresh the page to
                        be able to edit the storage fields.</strong>
                    </p>
                    : null
            }
           
            <br/>
           
            {this.state.listeprojetpromoteur.map((list) =>
                  <Card>
                     <Card.Body className="detailscard">
                      <Card.Title className="classp" ><b>Référence :{list[0].referencepromoteur}</b></Card.Title>
                      <Card.Text>
                      <p><b>Account promoteur :</b>&nbsp;{list[0].accountpromoteur} &nbsp;</p>
                    
                      <p><b>Debut des travaux :</b> &nbsp;{list[0].debutdestravaux} &nbsp;<b className="red">cliquez sur </b>
                      {list[0].debutdestravaux === 'non' &&
                        <Image onClick={() => this.handledebutdestravaux(list[0].referencepromoteur)} src={OK} roundedCircle />
                      }<b className="red">si vous avez terminer cette tache</b>
                      </p>
                      <p><b>Construction du rez de chaussée: </b>&nbsp;{list[0].construction_rez_de_chaussee} &nbsp;<b className="red">cliquez sur </b>
                      {list[0].construction_rez_de_chaussee === 'non' &&
                        <Image onClick={() => this.handleconstruction_rez_de_chaussee(list[0].referencepromoteur)} src={OK} roundedCircle />
                      }<b className="red">si vous avez terminer cette tache</b>
                      </p>
                      <p><b>Grands travaux: </b>&nbsp;{list[0].grands_travaux}&nbsp; <b className="red">cliquez sur </b>
                      {list[0].grands_travaux === 'non' &&
                        <Image onClick={() => this.handlegrands_travaux(list[0].referencepromoteur)} src={OK} roundedCircle />
                      }<b className="red">si vous avez terminer cette tache</b>
                      </p>
                      <p><b>Finition </b>&nbsp;{list[0].finition}&nbsp; <b className="red">cliquez sur </b>
                      {list[0].finition === 'non' &&
                        <Image onClick={() => this.handlefinition(list[0].referencepromoteur)} src={OK} roundedCircle />
                      } <b className="red">si vous avez terminer cette tache</b>
                      </p>
                      <p><b>Livraison: </b>&nbsp;{list[0].livraison}&nbsp; <b className="red">cliquez sur </b>
                      {list[0].livraison === 'non' &&
                        <Image onClick={() => this.handlelivraison(list[0].referencepromoteur)} src={OK} roundedCircle />
                      } <b className="red">si vous avez terminer cette tache</b>
                      </p>
                      <p><b>Contrat Istisnaa: </b>&nbsp; <b className="red"><a href={`https://ipfs.infura.io/ipfs/${list[0].contrat}`}>contrat.pdf</a>&nbsp; </b>
                  
                      </p>
                   
                      </Card.Text>
                    </Card.Body>
                  </Card> 
          )}
          
            
        </div>)
    }
}

export default listeprojetspromoteurs


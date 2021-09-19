import React, {Component,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import './App.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { Container,Table, Button} from 'react-bootstrap';
import payer from './img/ethereum.png';

class PagePayementclient_Morabaha extends Component {

  state = {
    web3: null,
    accounts: null,
    chainid: null,
    engagementclient : null,
    typepayement: null,
    montantapayer : null,
    anneeactuel : null,
    moisactuel : null,
    trimestreactuel : null,
    semestreactuel: null,
    reference : null
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
      
      const engagementclient = await this.loadContract("dev", "EngagementClient")

    var nb =  await engagementclient.methods.getListecontratmorabaha().call()
            console.log(nb)
            for (var i=0; i < nb; i++) {
                    const cin = await engagementclient.methods.getcinclient(i).call()
                    console.log(i)
                    if(cin == localStorage.getItem("cinclientpayer")){
                        const ref = await engagementclient.methods.getreferenceprojet(i).call()
                        if(ref == localStorage.getItem("refprojetpayer")){
                            const type = await engagementclient.methods.gettype_payement(i).call()
                            const montant = await engagementclient.methods.getmontantpaye(i).call()
                            const annee = await engagementclient.methods.getanneeactuelpayement(i).call()
                            const mois = await engagementclient.methods.getmoisactuelpayement(i).call()
                            const trimestre = await engagementclient.methods.gettrimestreactuelpayement(i).call()
                            const semestre = await engagementclient.methods.getsemestreactuelpayement(i).call()
                        
                            this.setState({
                                reference : ref,
                                typepayement: type,
                                montantapayer : montant,
                                anneeactuel : annee,
                                moisactuel : mois,
                                trimestreactuel : trimestre,
                                semestreactuel: semestre
                            })
                            console.log(montant) 
                            console.log(annee) 
                            console.log(mois) 
                            console.log(trimestre) 
                        }
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
payermensuel = async (mois,montant,anneeac) => {
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
    const engagementclient = await this.loadContract("dev", "EngagementClient")
    const fonds = await this.loadContract("dev", "Fonds")
    const client = await this.loadContract("dev", "Client")

    var _account = await fonds.methods.getwalletAddress().call()
    var nbl = await engagementclient.methods.getListecontratmorabaha().call()
    var nbc = await engagementclient.methods.getlisteclientengage().call()
    if(mois<2){
        for(var k = 0;k<nbl;k++){
            const cinpay = await engagementclient.methods.getcinclient(k).call()
            if(cinpay == localStorage.getItem("cinclientpayer")){
                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
              
                if(refpay == this.state.reference){
                    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                    var montantdollar = montant * 0.11
                    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                    var montantether = (montantdollar * 0.00031).toString()
                    //envoi du montant 
                    web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                    var moisactuel = (parseInt(mois)+1).toString()
                    var result = await engagementclient.methods.modifier_moisactuelpayement(k,moisactuel).send({from: accounts[0]})
                    var _message = "La tranche du mois "+ mois +"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                    var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                    // Stocker historique de payement
                   
                    var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                     
                    alert('Payement est effectué avec succés')
                    this.props.history.push("/historiquepayementclient");
                
                }
            }
        }
        
    }
    if(mois == 2){
        for(var k = 0;k<nbl;k++){
            const cinpay = await engagementclient.methods.getcinclient(k).call()
            if(cinpay == localStorage.getItem("cinclientpayer")){
                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                if(refpay == this.state.reference){
                    const duree= await engagementclient.methods.getduree_payement(k).call()

                    if(anneeac == duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var _message = "La tranche du mois "+ mois +"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                       // Stocker historique de payement
                       var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                      // Fin Payement
                      for(var l = 0;l<nbc;l++){
                        const ci = await engagementclient.methods.getcin(l).call()
                        if(ci == localStorage.getItem("cinclient")){
                            const ref= await engagementclient.methods.getreferenceclient(l).call()
                            if(ref == this.state.reference){
                               var res = await engagementclient.methods.modifier_Etatpayment(l,'Paiement effectuée').send({from: accounts[0]})
                               }
                        }
                      }
                      alert('Payement est effectué avec succés')
                      this.props.history.push("/historiquepayementclient");
                    }
                    if(anneeac < duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var anneeactuel = (parseInt(anneeac)+1).toString()
                        var result = await engagementclient.methods.modifier_anneeactuelpayement(k,anneeactuel).send({from: accounts[0]})
                        var result2 = await engagementclient.methods.modifier_moisactuelpayement(k,'1').send({from: accounts[0]})
                        var _message = "La tranche du mois "+ mois +"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                        
                        // Stocker historique de payement
                        var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                     
                        
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    }
                }
            }
        }
    }
}
     
payerannuel = async (montant,anneeac) => {
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

    const engagementclient = await this.loadContract("dev", "EngagementClient")
    const fonds = await this.loadContract("dev", "Fonds")
    const client = await this.loadContract("dev", "Client")

    var _account = await fonds.methods.getwalletAddress().call()
    var nbl = await engagementclient.methods.getListecontratmorabaha().call()
    var nbh = await client.methods.getliste_payement_historique().call()
    var nbc = await engagementclient.methods.getlisteclientengage().call()
    for(var k = 0;k<nbl;k++){
            const cinpay = await engagementclient.methods.getcinclient(k).call()
            if(cinpay == localStorage.getItem("cinclientpayer")){
                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                if(refpay == this.state.reference){
                    const duree= await engagementclient.methods.getduree_payement(k).call()
                    if(anneeac == duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var _message = "La tranche de l'annee "+ anneeac +"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                        var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                        
                        // Fin Payement
                      for(var l = 0;l<nbc;l++){
                        const ci = await engagementclient.methods.getcin(l).call()
                        if(ci == localStorage.getItem("cinclient")){
                            const ref= await engagementclient.methods.getreferenceclient(l).call()
                            if(ref == this.state.reference){
                               var res = await engagementclient.methods.modifier_Etatpayment(l,'Paiement effectuée').send({from: accounts[0]})
                               }
                        }
                      }
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    }
                    if(anneeac < duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var anneeactuel = (parseInt(anneeac)+1).toString()
                        var result = await engagementclient.methods.modifier_anneeactuelpayement(k,anneeactuel).send({from: accounts[0]})
                        var _message = "La tranche de l'annee "+ anneeac +"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                        var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                     
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    }
                }
            }
        }
    
}
payersemestre = async (semestre,montant,anneeac) => {
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
    
    const engagementclient = await this.loadContract("dev", "EngagementClient")
    const fonds = await this.loadContract("dev", "Fonds")
    const client = await this.loadContract("dev", "Client")

    var _account = await fonds.methods.getwalletAddress().call()
    var nbl = await engagementclient.methods.getListecontratmorabaha().call()
    var nbh = await engagementclient.methods.getliste_payement_historique().call()
    var nbc = await engagementclient.methods.getlisteclientengage().call()

    if(semestre<2){
        for(var k = 0;k<nbl;k++){
            const cinpay = await engagementclient.methods.getcinclient(k).call()
            if(cinpay == localStorage.getItem("cinclientpayer")){
                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                if(refpay == this.state.reference){
                    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                    var montantdollar = montant * 0.11
                    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                    var montantether = (montantdollar * 0.00031).toString()
                    //envoi du montant 
                    web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                    
                    var semstreactuel = (parseInt(semestre)+1).toString()
                    var result = await engagementclient.methods.modifier_semestreactuelpayement(k,semstreactuel).send({from: accounts[0]})
                    var _message = "La tranche du semestre "+ semestre +"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                    var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                    // Stocker historique de payement
                    var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                     
                   
                    alert('Payement est effectué avec succés')
                    this.props.history.push("/historiquepayementclient");
                
                }
            }
        }
        
    }
    if(semestre == 2){
        for(var k = 0;k<nbl;k++){
            const cinpay = await engagementclient.methods.getcinclient(k).call()
            if(cinpay == localStorage.getItem("cinclientpayer")){
                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                if(refpay == this.state.reference){
                    const duree= await engagementclient.methods.getduree_payement(k).call()
                    if(anneeac == duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var _message = "La tranche du semestre "+ semestre +"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                         // Stocker historique de payement
                         var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                        // Fin Payement
                      for(var l = 0;l<nbc;l++){
                        const ci = await engagementclient.methods.getcin(l).call()
                        if(ci == localStorage.getItem("cinclient")){
                            const ref= await engagementclient.methods.getreferenceclient(l).call()
                            if(ref == this.state.reference){
                               var res = await engagementclient.methods.modifier_Etatpayment(l,'Paiement effectuée').send({from: accounts[0]})
                              }
                        }
                      }
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    }
                    if(anneeac < duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var anneeactuel = (parseInt(anneeac)+1).toString()
                        var result = await engagementclient.methods.modifier_anneeactuelpayement(k,anneeactuel).send({from: accounts[0]})
                        var result2 = await engagementclient.methods.modifier_semestreactuelpayement(k,'1').send({from: accounts[0]})
                        var _message = "La tranche du semestre "+ semestre +"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                        
                         // Stocker historique de payement
                         var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                    
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    }
                }
            }
        }
    }  
}  
payertrimestre = async (trimestre,montant,anneeac) => {
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
    
    const engagementclient = await this.loadContract("dev", "EngagementClient")
    const fonds = await this.loadContract("dev", "Fonds")
    const client = await this.loadContract("dev", "Client")

    var _account = await fonds.methods.getwalletAddress().call()
    var nbl = await engagementclient.methods.getListecontratmorabaha().call()
    var nbh = await engagementclient.methods.getliste_payement_historique().call()
    var nbc = await engagementclient.methods.getlisteclientengage().call()

    if(trimestre<4){
        for(var k = 0;k<nbl;k++){
            const cinpay = await engagementclient.methods.getcinclient(k).call()
            if(cinpay == localStorage.getItem("cinclientpayer")){
                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                if(refpay == this.state.reference){
                    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                    var montantdollar = montant * 0.11
                    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                    var montantether = (montantdollar * 0.00031).toString()
                    //envoi du montant 
                    web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                    var trimestreactuel = (parseInt(trimestre)+1).toString()
                    var result = await engagementclient.methods.modifier_trimestreactuelpayement(k,trimestreactuel).send({from: accounts[0]})
                    var _message = "La tranche du trimestre "+ trimestre +"de l'année "+anneeac+"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                    var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                    // Stocker historique de payement
                    var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                     
                   
                    alert('Payement est effectué avec succés')
                    this.props.history.push("/historiquepayementclient");
                
                }
            }
        }
        
    }
    if(trimestre == 4){
        for(var k = 0;k<nbl;k++){
            const cinpay = await engagementclient.methods.getcinclient(k).call()
            if(cinpay == localStorage.getItem("cinclientpayer")){
                const refpay= await engagementclient.methods.getreferenceprojet(k).call()
                if(refpay == this.state.reference){
                    const duree= await engagementclient.methods.getduree_payement(k).call()
                    if(anneeac == duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var _message = "La tranche du trimestre "+ trimestre +"de l'année "+anneeac+"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                         // Stocker historique de payement
                         var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                        
                         // Fin Payement
                        for(var l = 0;l<nbc;l++){
                            const ci = await engagementclient.methods.getcin(l).call()
                            if(ci == localStorage.getItem("cinclient")){
                                const ref= await engagementclient.methods.getreferenceclient(l).call()
                                if(ref == this.state.reference){
                                var res = await engagementclient.methods.modifier_Etatpayment(l,'Paiement effectuée').send({from: accounts[0]})
                               }
                            }
                        }
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    }
                    if(anneeac < duree){
                        // transformer le montant en dollar 1 MAD ---> 0,11 dollar
                        var montantdollar = montant * 0.11
                        // transformer le montant en ether 1 dollar --> 0,00031 ETHER
                        var montantether = (montantdollar * 0.00031).toString()
                        web3.eth.sendTransaction({from:accounts[0] ,to:_account, value:web3.utils.toWei(montantether,'ether')});
                        var anneeactuel = (parseInt(anneeac)+1).toString()
                        var result = await engagementclient.methods.modifier_anneeactuelpayement(k,anneeactuel).send({from: accounts[0]})
                        var result2 = await engagementclient.methods.modifier_trimestreactuelpayement(k,'1').send({from: accounts[0]})
                        var _message = "La tranche du trimestre "+ trimestre +"de l'année "+anneeac+"a été payer par le client "+localStorage.getItem("cinclientpayer")+",le projet avec la reference : "+this.state.reference
                        var result1 = await fonds.methods.ajouternotification(_message).send({from: accounts[0]})  
                        // Stocker historique de payement
                        var res = await client.methods.ajouterpayementhistorique(localStorage.getItem("cinclientpayer"),this.state.reference,_message).send({from: accounts[0]})
                     
                        alert('Payement est effectué avec succés')
                        this.props.history.push("/historiquepayementclient");
                    }
                }
            }
        }
    }
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

        return ( 
            <div className="Login">
            <Container>
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
        
       
                {this.state.typepayement == "Mensuellement" && 
                   
            <Table responsive >
            <thead class="thead-dark">
                <tr>
                <th>Reference_projet</th>
                <th>Annee</th>
                <th>Mois</th>
                <th>Montant_à_payer</th>
                <th>Payement</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{this.state.reference}</td>
                    <td>{this.state.anneeactuel}</td>
                    <td>{this.state.moisactuel}</td>
                    <td>{this.state.montantapayer}</td>
                    <td>
                        <Button
                            variant="danger"
                            target="_blank"
                            onClick={(e) => this.payermensuel(this.state.moisactuel,this.state.montantapayer,this.state.anneeactuel)}
                            >Payer
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
        }
        
        {this.state.typepayement == "Annuellement" && 
                   
                   <Table responsive >
                   <thead class="thead-dark">
                       <tr>
                       <th>Reference projet</th>
                       <th>Montant_à_payer</th>
                       <th>Annee</th>
                       <th>Payement</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                           <td>{this.state.reference}</td>
                           <td>{this.state.montantapayer}</td>
                           <td>{this.state.anneeactuel}</td>
                           <td>
                               <Button
                                   variant="danger"
                                   target="_blank"
                                   onClick={(e) => this.payerannuel(this.state.montantapayer,this.state.anneeactuel)}
                                 >Payer
                               </Button>
                           </td>
                       </tr>
                   </tbody>
               </Table>
               }
         {this.state.typepayement == "Semestriellement" && 
                   
                   <Table responsive >
                   <thead class="thead-dark">
                       <tr>
                       <th>Reference projet</th>
                       <th>Montant_à_payer</th>
                       <td>Annee</td>
                       <th>Semestre</th>
                       <th>Payement</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                           <td>{this.state.reference}</td>
                           <td>{this.state.anneeactuel}</td>
                           <td>{this.state.montantapayer}</td>
                           <td>{this.state.semestreactuel}</td>
                           <td>
                               <Button
                                   variant="danger"
                                   target="_blank"
                                   onClick={(e) => this.payersemestre(this.state.semestreactuel,this.state.montantapayer,this.state.anneeactuel)}
                                   >Payer
                               </Button>
                           </td>
                       </tr>
                   </tbody>
               </Table>
               }
        {this.state.typepayement == "Trimestriellement" && 
                   
                   <Table responsive >
                   <thead class="thead-dark">
                       <tr>
                       <th>Reference projet</th>
                       <th>Montant_à_payer</th>
                       <td>Annee</td>
                       <th>Trimestre</th>
                       <th>Payement</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr>
                           <td>{this.state.reference}</td>
                           <td>{this.state.montantapayer}</td>
                           <td>{this.state.anneeactuel}</td>
                           <td>{this.state.trimestreactuel}</td>
                           <td>
                               <Button
                                   variant="danger"
                                   target="_blank"
                                   onClick={(e) => this.payertrimestre(this.state.trimestreactuel,this.state.montantapayer,this.state.anneeactuel)}
                                   >Payer
                               </Button>
                           </td>
                       </tr>
                   </tbody>
               </Table>
               }
        
        </Container>
        </div>

       )
    }
    
}

export default PagePayementclient_Morabaha

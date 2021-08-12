import React, {Component,useRef} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import './App.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { Card, Button,Container,Row,Col,Image} from 'react-bootstrap';
import payer from './img/payer.png';

class listeprojetsencours extends Component {

  state = {
    web3: null,
    accounts: null,
    chainid: null,
    fonds : null,
    listeprojet : []
    
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
      
      const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
      var nb =  await engagementpromoteur.methods.getlisteprojetpromoteur().call()
     
      for (var i=0; i < nb; i++) {
      
            const account = await engagementpromoteur.methods.getaccountpromoteurprojet(i).call()
            const ref = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
            const debut = await engagementpromoteur.methods.getdebutdestravaux(i).call()
            const construction = await engagementpromoteur.methods.getconstruction_rez_de_chaussee(i).call()
            const grand = await engagementpromoteur.methods.getgrands_travaux(i).call()
            const fini = await engagementpromoteur.methods.getfinition(i).call()
            const livrais = await engagementpromoteur.methods.getlivraison(i).call()
        
            const list =[{
                accountpromoteur: account, 
                referencepromoteur : ref,
                debutdestravaux : debut,
                construction_rez_de_chaussee : construction,
                grands_travaux : grand,
                finition: fini, 
                livraison: livrais
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
    //calcul du montant
    const fonds = await this.loadContract("dev","Fonds")
    const promoteur = await this.loadContract("dev","Promoteur")
    const nbprojet =  await fonds.methods.listeprojet().call()
    var cout = 0
    var montant = 0
    for(var j=0;j<nbprojet;j++)
    {
        var refprojet =await fonds.methods.getRef(j).call()
        if(refprojet == ref){
            cout =await fonds.methods.getCout_estimation_travaux(j).call()
            montant = (cout*10)/100
        }

    }
    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
    var montantdollar = montant * 0.11
    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
    var montantether = parseInt(montantdollar * 0.00031)
    
    //envoi du montant 
    const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
    for(var i = 0;i<nb;i++){
        var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
        if(reference == ref){
            const _account = await engagementpromoteur.methods.getaccountpromoteurprojet(i).call()
            var result1 = await engagementpromoteur.methods.payer(_account,montantether).send({from: accounts[0]})
            var _message = " Remboursement de la somme associée à la 1 ère tranche qui est "+montantether+" en ether du projet avec la reference :"+ref+""
            var result2 = await engagementpromoteur.methods.modifierpayementdebutdestravaux(i).send({from: accounts[0]})
            var result = await promoteur.methods.ajouternotification(_message,_account).send({from: accounts[0]})
            alert("Message est envoyé au promoteur ") 
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
    //calcul du montant
    const fonds = await this.loadContract("dev","Fonds")
    const promoteur = await this.loadContract("dev","Promoteur")
    const nbprojet =  await fonds.methods.listeprojet().call()
    var cout = 0
    var montant = 0
    for(var j=0;j<nbprojet;j++)
    {
        var refprojet =await fonds.methods.getRef(j).call()
        if(refprojet == ref){
            cout =await fonds.methods.getCout_estimation_travaux(j).call()
            montant = (cout*20)/100
        }

    }
    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
    var montantdollar = montant * 0.11
    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
    var montantether = montantdollar * 0.00031
    //envoi du montant 
    const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
    for(var i = 0;i<nb;i++){
        var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
        if(reference == ref){
            const _account = await engagementpromoteur.methods.getaccountpromoteurprojet(i).call()
            var result1 = await engagementpromoteur.methods.payer(_account,montantether).send({from: accounts[0]})
            var _message = " Remboursement de la somme associée à la 2 ème tranche qui est "+montantether+" en ether du projet avec la reference :"+ref+""
            var result2 = await engagementpromoteur.methods.modifierpayementconstruction_rez_de_chaussee(i).send({from: accounts[0]})
            var result = await promoteur.methods.ajouternotification(_message,_account).send({from: accounts[0]})
            alert("Message est envoyé au promoteur ") 
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
    //calcul du montant
    const fonds = await this.loadContract("dev","Fonds")
    const promoteur = await this.loadContract("dev","Promoteur")
    const nbprojet =  await fonds.methods.listeprojet().call()
    var cout = 0
    var montant = 0
    for(var j=0;j<nbprojet;j++)
    {
        var refprojet =await fonds.methods.getRef(j).call()
        if(refprojet == ref){
            cout =await fonds.methods.getCout_estimation_travaux(j).call()
            montant = (cout*20)/100
        }

    }
    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
    var montantdollar = montant * 0.11
    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
    var montantether = montantdollar * 0.00031
    //envoi du montant 
    const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
    for(var i = 0;i<nb;i++){
        var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
        if(reference == ref){
            const _account = await engagementpromoteur.methods.getaccountpromoteurprojet(i).call()
            var result1 = await engagementpromoteur.methods.payer(_account,montantether).send({from: accounts[0]})
            var _message = " Remboursement de la somme associée à la 3 ème tranche qui est "+montantether+" en ether du projet avec la reference :"+ref+""
            var result2 = await engagementpromoteur.methods.modifierpayementgrands_travaux(i).send({from: accounts[0]})
            var result = await promoteur.methods.ajouternotification(_message,_account).send({from: accounts[0]})
            alert("Message est envoyé au promoteur ") 
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
    //calcul du montant
    const fonds = await this.loadContract("dev","Fonds")
    const promoteur = await this.loadContract("dev","Promoteur")
    const nbprojet =  await fonds.methods.listeprojet().call()
    var cout = 0
    var montant = 0
    for(var j=0;j<nbprojet;j++)
    {
        var refprojet =await fonds.methods.getRef(j).call()
        if(refprojet == ref){
            cout =await fonds.methods.getCout_estimation_travaux(j).call()
            montant = (cout*20)/100
        }

    }
    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
    var montantdollar = montant * 0.11
    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
    var montantether = montantdollar * 0.00031
    //envoi du montant 
    const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
    for(var i = 0;i<nb;i++){
        var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
        if(reference == ref){
            const _account = await engagementpromoteur.methods.getaccountpromoteurprojet(i).call()
            var result1 = await engagementpromoteur.methods.payer(_account,montantether).send({from: accounts[0]})
            var _message = " Remboursement de la somme associée à la 4 ème tranche qui est "+montantether+" en ether du projet avec la reference :"+ref+""
            var result2 = await engagementpromoteur.methods.modifierpayementfinition(i).send({from: accounts[0]})
            var result = await promoteur.methods.ajouternotification(_message,_account).send({from: accounts[0]})
            alert("Message est envoyé au promoteur ") 
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
    //calcul du montant
    const fonds = await this.loadContract("dev","Fonds")
    const promoteur = await this.loadContract("dev","Promoteur")
    const nbprojet =  await fonds.methods.listeprojet().call()
    var cout = 0
    var montant = 0
    for(var j=0;j<nbprojet;j++)
    {
        var refprojet =await fonds.methods.getRef(j).call()
        if(refprojet == ref){
            cout =await fonds.methods.getCout_estimation_travaux(j).call()
            montant = (cout*20)/100
        }

    }
    // transformer le montant en dollar 1 MAD ---> 0,11 dollar
    var montantdollar = montant * 0.11
    // transformer le montant en ether 1 dollar --> 0,00031 ETHER
    var montantether = montantdollar * 0.00031
    //envoi du montant 
    const engagementpromoteur = await this.loadContract("dev", "EngagamentPromoteur")
    var nb = await engagementpromoteur.methods.getlisteprojetpromoteur().call()
    for(var i = 0;i<nb;i++){
        var reference = await engagementpromoteur.methods.getreferencepromoteurprojet(i).call()
        if(reference == ref){
            const _account = await engagementpromoteur.methods.getaccountpromoteurprojet(i).call()
            var result1 = await engagementpromoteur.methods.payer(_account,montantether).send({from: accounts[0]})
            var _message = " Remboursement de la somme associée à la 5 ème tranche qui est "+montantether+" en ether du projet avec la reference :"+ref+""
            var result2 = await engagementpromoteur.methods.modifierpayementlivraison(i).send({from: accounts[0]})
            var result = await promoteur.methods.ajouternotification(_message,_account).send({from: accounts[0]})
            alert("Message est envoyé au promoteur ") 
            }  
        }
    
}
    render() {   

        return ( 
          <>
          <br/><br/>
          <Container>
            <Row>
          {this.state.listeprojet.map((list) =>
            
              <Col>
                  <Card>
                     <Card.Body className="detailscard">
                      <Card.Title className="classp" ><b>Référence :{list[0].reference}</b></Card.Title>
                      <Card.Text>
                      <p><b>Account promoteur :</b>&nbsp;{list[0].accountpromoteur} </p>
                    
                      <p><b>Debut des travaux :</b>&nbsp; {list[0].debutdestravaux}&nbsp; <b className="red">cliquez sur </b>
                      &nbsp;{list[0].debutdestravaux === 'oui' &&
                        <Image onClick={() => this.handledebutdestravaux(list[0].referencepromoteur)} src={payer} roundedCircle />
                      }&nbsp;<b className="red">pour remboursser la somme equivalente à cette tache </b>
                      </p>

                      <p><b>Construction du rez de chaussée: </b>&nbsp;{list[0].construction_rez_de_chaussee}&nbsp; <b className="red">cliquez sur </b>
                      &nbsp;{list[0].construction_rez_de_chaussee === 'oui' &&
                        <Image onClick={() => this.handleconstruction_rez_de_chaussee(list[0].referencepromoteur)} src={payer} roundedCircle />
                      }&nbsp;<b className="red">pour remboursser la somme equivalente à cette tache </b>
                      </p>

                      <p><b>Grands travaux: </b>&nbsp;{list[0].grands_travaux} &nbsp;<b className="red">cliquez sur </b>
                      &nbsp;{list[0].grands_travaux === 'oui' &&
                        <Image onClick={() => this.handlegrands_travaux(list[0].referencepromoteur)} src={payer} roundedCircle />
                      }&nbsp;<b className="red">pour remboursser la somme equivalente à cette tache </b>
                      </p>

                      <p><b>Finition </b>&nbsp;{list[0].finition} &nbsp;<b className="red">cliquez sur </b>
                      &nbsp;{list[0].finition === 'oui' &&
                        <Image onClick={() => this.handlefinition(list[0].referencepromoteur)} src={payer} roundedCircle />
                      }&nbsp;<b className="red">pour remboursser la somme equivalente à cette tache </b>
                      </p>

                      <p><b>Livraison: </b>&nbsp;{list[0].livraison}&nbsp; <b className="red">cliquez sur </b>
                      &nbsp;{list[0].livraison === 'oui' &&
                        <Image onClick={() => this.handlelivraison(list[0].referencepromoteur)} src={payer} roundedCircle />
                      }&nbsp;<b className="red">pour remboursser la somme equivalente à cette tache </b>
                     </p>
                      </Card.Text>
                    </Card.Body>
                  </Card> 
                  </Col>
           
          )}
           </Row>
            </Container>
     </>

       )
    }
    
}

export default listeprojetsencours

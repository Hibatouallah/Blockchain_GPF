
import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";
import {Image} from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { Auth } from "aws-amplify";

import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import React, { Component, Fragment} from "react";

import {getWeb3} from "./getWeb3"
import {getEthereum} from "./getEthereum"
import { combineReducers } from 'redux';
import map from "./artifacts/deployments/map.json"
import notification from './img/notification.png'
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
class App extends Component {
    
    state = {
        isAuthenticated: false,
        isAuthenticating: true,
        web3: null,
        accounts: null,
        fonds : null,
        chainid: null,
        nouser : true,
        nbnotificationfonds : 0
    };
    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: true });
    }
    handleLogout = async event => {
      localStorage.clear();
      localStorage.setItem('nouser',true);
      alert('vous avez déconnecté ');
      this.props.history.push("/");
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
        const fonds = await this.loadContract("dev","Fonds")
        const promoteur = await this.loadContract("dev","Promoteur")
        const client = await this.loadContract("dev","Client")
        localStorage.setItem('nouser',this.state.nouser);
   
        if(localStorage.getItem('userpromo') === 'true' || localStorage.getItem('userfonds') === 'true'){
          this.state.nouser = false
          localStorage.setItem('nouser',this.state.nouser);
        } 
        this.setState({ isAuthenticating: false });
        // FONDS
        var nbfonds =  await fonds.methods.getnbnotification().call()
        this.setState({nbnotificationfonds:nbfonds})
        localStorage.setItem('nbnotificationfonds',this.state.nbnotificationfonds)
        // PROMOTEUR
        var nbpromo =  await promoteur.methods.getnbnotification().call()
        this.setState({nbnotificationpromoteur:nbpromo})
        localStorage.setItem('nbnotificationpromoteur',this.state.nbnotificationpromoteur)
        // CLIENT
        var nbclient =  await client.methods.getnbnotification().call()
        console.log(nbclient)
        this.setState({nbnotificationclient:nbclient})
        localStorage.setItem('nbnotificationclient',this.state.nbnotificationclient)
        console.log(this.state.nbnotificationclient)
     
    }

    render() {
        const REACT_VERSION = React.version;

        const childProps = {
            isAuthenticatedPromo: this.state.isAuthenticatedPromo,
            userHasAuthenticated: this.userHasAuthenticated
          };

        return (
            !this.state.isAuthenticating &&
    <>
        <Nav>
        <NavLink to='/'>
          <img src={require('./img/logo.png')} alt='logo' />
        </NavLink>
        <Bars />
        <NavMenu>
             {localStorage.getItem('isAuthenticated') === 'true' 
            ?<Fragment>
              {localStorage.getItem('ispromoteur') === 'true' &&
                <NavLink to='/ProfilePromoteur' activeStyle>
                    Profile
                </NavLink>
                }
                {localStorage.getItem('ispromoteur') === 'true' &&
                <NavLink to="/promoteurcandidature" activeStyle>
                    Mes Candidatures
                </NavLink>
                 }
                 {localStorage.getItem('ispromoteur') === 'true' &&
                <NavLink to="/Listewishlist" activeStyle>
                    Mon Panier
                </NavLink>
                }
                {localStorage.getItem('ispromoteur') === 'true' &&
                <NavLink to="/Listeprojetspromoteur" activeStyle>
                    Mes projets
                </NavLink>
                }
                {localStorage.getItem('ispromoteur') === 'true' &&
                <NavLink to="/notificationPromoteur" activeStyle>
                    <Image   onClick={this.handlefonds} src={notification} roundedCircle />
                    <button className="badge">{localStorage.getItem('nbnotificationpromoteur')}</button>
                      
                </NavLink>
                }
                {localStorage.getItem('isclient') === 'true' &&
                <NavLink to='/Profileclient' activeStyle>
                    Profile
                </NavLink>
                }
                 {localStorage.getItem('isclient') === 'true' &&
                <NavLink to="/Listewishlistclient" activeStyle>
                    Mon Panier
                </NavLink>
                }
                {localStorage.getItem('isclient') === 'true' &&
                <NavLink to="/mesprojetsclients" activeStyle>
                    Mes projets
                </NavLink>
                }
                {localStorage.getItem('isclient') === 'true' &&
                <NavLink to="/notificationClient" activeStyle>
                  
                    <Image  onClick={this.handlefonds} src={notification} roundedCircle />
                      <button className="badge">{localStorage.getItem('nbnotificationclient')}</button>
                      
                </NavLink>
                }
                 {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listeprojets" activeStyle>
                    Les projets
                </NavLink>
                }
                {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listecontrats" activeStyle>
                     Les Contrats
                </NavLink>
                }
                  {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listepromoteurs" activeStyle>
                     Les promoteurs
                </NavLink>
                }
                  {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listeclients" activeStyle>
                     Les clients
                </NavLink>
                }
                  {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/notificationFonds" activeStyle>
                  
                    <Image  onClick={this.handlefonds} src={notification} roundedCircle />
                      <button className="badge">{localStorage.getItem('nbnotificationfonds')}</button>
                      
                </NavLink>
                }
                <NavLink onClick={this.handleLogout} activeStyle>
                    Se Déconnecter
                </NavLink>
                
          </Fragment>
          :<Fragment>
                <NavLink to='/Inscription' activeStyle>
                S'inscrire
                </NavLink>
                <NavLink to='/Login' activeStyle>
                     Se connecter
                </NavLink> 
          </Fragment>
          }
           { this.state.accounts  == "0xdb49fb381F46b3A6078Fec43f0F5A0695a6C715E" &&
                  <NavLink to='/listeprojets' activeStyle>
                    Mes Projets
                  </NavLink>
            }
        </NavMenu>
      </Nav>
    
      <Routes childProps={childProps} />
      <MDBFooter className="footerbg">
      <MDBContainer fluid className="text-center text-md-left">
          <br/>
        <MDBRow>
          <MDBCol md="6">
            <h5 className="title">ImmoTech</h5>
            <p className="title">
              Here you can use rows and columns here to organize your footer
              content.
            </p>
          </MDBCol>
          <MDBCol md="6">
            <h5 className="title">Links</h5>
            <ul>
              <li className="list-unstyled title">
                <a href="#!">Link 1</a>
              </li>
              <li className="list-unstyled title">
                <a href="#!">Link 2</a>
              </li>
              <li className="list-unstyled title">
                <a href="#!">Link 3</a>
              </li>
              <li className="list-unstyled title">
                <a href="#!">Link 4</a>
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer className="title" fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="https://www.mdbootstrap.com"> ImmoTech</a>
        </MDBContainer>
      </div>
    </MDBFooter>
    </>
  );
    }
}

export default withRouter(App);
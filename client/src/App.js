
import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";

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
import React, { Component, Fragment , useState } from "react";

import {getWeb3} from "./getWeb3"
import {getEthereum} from "./getEthereum"
import { combineReducers } from 'redux';


class App extends Component {

 
    state = {
        isAuthenticated: false,
        isAuthenticating: true,
        web3: null,
        accounts: null,
        chainid: null,
        nouser : true
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
      
        localStorage.setItem('nouser',this.state.nouser);
        alert(localStorage.getItem('isAuthenticated'))
        if(localStorage.getItem('userpromo') === 'true' || localStorage.getItem('userfonds') === 'true'){
          alert(localStorage.getItem('userpromo'))
          alert(localStorage.getItem('userfonds'))
          this.state.nouser = false
          localStorage.setItem('nouser',this.state.nouser);
        } 
        this.setState({ isAuthenticating: false });
        
        console.log(typeof(this.state.accounts[0]))

    }

    render() {

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
                <NavLink to="/ListeCandidature" activeStyle>
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
                <NavLink to="/Listeprojetspromoteur" activeStyle>
                    Mes projets
                </NavLink>
                }
                 {localStorage.getItem('isfonds') === 'true' &&
                <NavLink to="/listeprojets" activeStyle>
                    Mes projets
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
    </>
  );
    }
}

export default withRouter(App);
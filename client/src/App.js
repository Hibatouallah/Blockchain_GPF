
import Routes from "./Routes";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar,Form,FormControl,Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { Auth } from "aws-amplify";


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

    }

    render() {

        const childProps = {
            isAuthenticatedPromo: this.state.isAuthenticatedPromo,
            userHasAuthenticated: this.userHasAuthenticated
          };
       
        return (
            !this.state.isAuthenticating &&
    <>
      <Navbar collapseOnSelect classname ="navbar-inverse" expand="lg" bg="dark" variant="dark">
     
          <Navbar.Brand href="/">
            APP IMMO
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          { localStorage.getItem('userpromo') == 'true' &&
           <Nav className="ml-auto" >
          {localStorage.getItem('isAuthenticated') === 'true' 
            ?<Fragment>
                <Nav.Link  onClick={this.handleLogout} >Se déconnecter</Nav.Link>
                <LinkContainer to="/ProfilePromoteur">
                  <Nav.Link >Mon profile</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/ListeCandidature">
                  <Nav.Link >Mes Candidatures</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/Listewishlist">
                  <Nav.Link >Ma wishList</Nav.Link>
                  </LinkContainer>
                </Fragment> 
              : <Fragment>
                <LinkContainer to="/InscriptionPromoteur">
                    <Nav.Link>S'inscrire</Nav.Link>
                  </LinkContainer>
              <LinkContainer to="/Loginpromoteur">
                <Nav.Link>Se connecter</Nav.Link>
              </LinkContainer>
            </Fragment>
            }
                <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-info">Search</Button>
              </Form>
            </Nav>
          }
           { localStorage.getItem('userclient') == 'true' &&
           <Nav className="ml-auto" >
          {localStorage.getItem('isAuthenticated') === 'true' 
            ?<Fragment>
                <Nav.Link  onClick={this.handleLogout} >Se déconnecter</Nav.Link>
                <LinkContainer to="/ProfilePromoteur">
                  <Nav.Link >Mon profile</Nav.Link>
                  </LinkContainer>
                </Fragment> 
              : <Fragment>
                <LinkContainer to="/Inscriptionclient">
                    <Nav.Link>S'inscrire</Nav.Link>
                  </LinkContainer>
              <LinkContainer to="/Loginclient">
                <Nav.Link>Se connecter</Nav.Link>
              </LinkContainer>
            </Fragment>
            }
                <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-info">Search</Button>
              </Form>
            </Nav>
          }
          { localStorage.getItem('userfonds') == 'true' &&
        <Nav className="ml-auto" pullRight>
             {localStorage.getItem('isAuthenticated') === 'true'
              ?<Fragment>
                <Nav.Link  onClick={this.handleLogout} >Se déconnecter</Nav.Link>
                <LinkContainer to="/Profilefonds">
                  <Nav.Link >Mon profile</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/listeprojets">
                  <Nav.Link >Mes Projets</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/listeclients">
                  <Nav.Link >Les clients</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/listepromoteurs">
                  <Nav.Link >Les promoteurs</Nav.Link>
                </LinkContainer>
                </Fragment> 
              : <Fragment>
                  <LinkContainer to="/Loginfonds">
                    <Nav.Link>Se connecter</Nav.Link>
                  </LinkContainer>
                </Fragment>
               }
               <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-info">Search</Button>
              </Form>
          </Nav>
       }
       { localStorage.getItem('nouser') == 'true' &&
        <Nav className="ml-auto" pullRight>
            <Fragment>
                  <LinkContainer to="/inscription">
                    <Nav.Link>S'inscrire</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Se connecter</Nav.Link>
                  </LinkContainer>
           </Fragment>
           <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-info">Search</Button>
              </Form>
               
          </Nav>
       }
        </Navbar.Collapse>
      </Navbar>
      <Routes childProps={childProps} />

      
    </>

    
  );
    }
}

export default withRouter(App);
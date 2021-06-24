import React,{Component,Fragment} from 'react';
import {
  Nav,
  Navlink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';


import {getWeb3} from "./getWeb3"
import {getEthereum} from "./getEthereum"


class Navbar extends Component {
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
      
      
        this.setState({ isAuthenticating: false });

    }

    render() {
      this.setState({ isAuthenticating: false });
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
                <NavLink to='/ProfilePromoteur' activeStyle>
                    Profile
                </NavLink>
                <NavLink to="/ListeCandidature" activeStyle>
                    Mes Candidatures
                </NavLink>
                <NavLink to="/Listewishlist" activeStyle>
                    Mon Panier
                </NavLink>
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
        </NavMenu>
    
    
      </Nav>
    </>
  );
};
}

export default Navbar;
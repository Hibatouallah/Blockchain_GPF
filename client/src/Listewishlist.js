import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Card,Button,Row,Image,Col,Table} from "react-bootstrap"
import addicon from './img/add.png';
import deleteicon from './img/delete.png';
import updateicon from './img/update.png';

class Listewishlist extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        promoteurs : null,
        nbwishlist:0,
        wishlist:[]        
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
        const promoteurs = await this.loadContract("dev", "Promoteur")
        var nb =  await promoteurs.methods.listewishlist().call()
        console.log(nb)
        this.setState({nbwishlist:nb})

        for (var i=0; i < nb; i++) {
            const ref = await promoteurs.methods.getreferencewishlist(i).call()
            console.log(ref)
            const dateaj = await promoteurs.methods.getdateajout(i).call()            
            const list =[{
                reference: ref, 
                dateajout: dateaj
            }]
            this.setState({
                wishlist:[...this.state.wishlist,list] 
            })
        }
        console.log(this.state.wishlist)
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
        localStorage.setItem('refprojet', ref);
        this.props.history.push("/Ajoutercandidature");
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
           {localStorage.getItem('ispromoteur') != 'true' &&
             this.props.history.push("/Loginpromoteur")
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
                <thead>
                    <tr>
                    <th >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action</th>
                    <th>reference_projet</th>
                    <th>date_ajout</th>
                    <th>Candidature</th>

                    </tr>
                </thead>
                <tbody>
             
                {this.state.wishlist.map((list) =>
                    <tr>
                            <td><Image  onClick={this.handlepomoteur} src={deleteicon} roundedCircle />
                            <Image onClick={this.handlepomoteur} src={updateicon} roundedCircle /></td>
                            <td>{list[0].reference}</td>
                            <td>{list[0].dateajout}</td>
                            <td><Button variant="dark" onClick={() => this.handleChange(list[0].reference)}> Passer ?? la candidature</Button></td>
                            
                    </tr>
                    
                )}
                </tbody>
            </Table>
            
        </div>)
    }
}

export default Listewishlist

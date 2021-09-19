import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {Button,Table,Card} from "react-bootstrap"


class listeclientstotal extends Component {

    state = {
        web3: null,
        accounts: null,
        chainid: null,
        client : null,
        listeclient:[]        
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
        const client = await this.loadContract("dev", "Client")
        var nb =  await client.methods.listeclient().call()

        for (var i=0; i < nb; i++) {
            const ph = await client.methods.getphoto(i).call()
            const nom = await client.methods.getnom_prenom(i).call()
            const ci = await client.methods.getcin(i).call()
            const date = await client.methods.getdate_naissance(i).call()
            const tel = await client.methods.getnumtele(i).call()
            const add = await client.methods.getadresse(i).call()
            const em = await client.methods.getemail(i).call()
            const st = await client.methods.getstatusclient(i).call()
            const wallet = await client.methods.getwalletAddress(i).call()
            const pen = await client.methods.getPenalits_retard(i).call()
            const list =[{
                photo: ph,
                nom_prenom : nom,
                cin : ci,
                date_naissance : date,
                numtele : tel,
                adresse : add,
                email: em,
                status : st,
                walletAddress: wallet,
                Penalits_retard: pen
            }]
            this.setState({
                listeclient:[...this.state.listeclient,list] 
            })
       
        }
    }

    loadInitialContracts = async () => {
        if (this.state.chainid <= 42) {
            // Wrong Network!
            return
        }
        const client = await this.loadContract("dev", "Client")

        if (!client) {
            return
        }
        this.setState({
            client
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
    activer = async (accountclient) => {
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
        const client = await this.loadContract("dev", "Client")
        var nb =  await client.methods.listeclient().call()

        var n = 0
        for (var j = 0; j<nb; j++){
            const account = await client.methods.getwalletAddress(j).call()
            if(account == accountclient){
                var result = await client.methods.Activerclient(j).send({from: accounts[0]})
                var _message = "Félicitation , votre compte est activé "
                var result1 = await client.methods.ajouternotification(_message,account).send({from: accounts[0]})      
                alert("client activé")
                this.props.history.push("/listeclientstotal");
            }
        }
    }
    desactiver = async (accountclient) => {
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
         const client = await this.loadContract("dev", "Client")
         var nb =  await client.methods.listeclient().call()
            var n = 0
        for (var j = 0; j<nb; j++){
            const account = await client.methods.getwalletAddress(j).call()
            if(account == accountclient){
                var result = await client.methods.Desactiverclient(j).send({from: accounts[0]})
                var _message = "Votre compte est desactivé "
                var result1 = await client.methods.ajouternotification(_message,account).send({from: accounts[0]})      
                alert("client desactivé")
                this.props.history.push("/listeclientstotal");
            }
        }
    }
    render() {
    
        const {
            web3, accounts, chainid,client
        } = this.state

        if (!web3) {
            return <div>Loading Web3, accounts, and contracts...</div>
        }

        if (isNaN(chainid) || chainid <= 42) {
            return <div>Wrong Network! Switch to your local RPC "Localhost: 8545" in your Web3 provider (e.g. Metamask)</div>
        }

        if (!client) {
            return <div>Could not find a deployed contract. Check console for details.</div>
        }

        const isAccountsUnlocked = accounts ? accounts.length > 0 : false
     
        return (<div className="container">
           {localStorage.getItem('isfonds') != 'true' &&
             this.props.history.push("/LoginFonds")
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
                    <th>Confirmer</th>
                    <th>Photo</th>
                    <th>Nom&Prenom</th>
                    <th>Cin</th>
                    <th>Date_naissance</th>
                    <th>numtele</th>
                    <th>Adresse</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>WalletAddress</th>
                    <th>Penalité_retard</th>
                    </tr>
                </thead>
                <tbody>

                {this.state.listeclient.map((list) =>
                    <tr>
                            <td>
                            {list[0].status === 'Desactiver' &&
                             <Button variant="success" onClick={() => this.activer(list[0].walletAddress)} color="primary">
                             Activer
                           </Button>
                            }
                                {list[0].status === 'Activer' &&
                                    <Button variant="danger" onClick={(e) => this.desactiver(list[0].walletAddress)} color="primary">
                                    Desactiver
                                </Button>
                            }
                            </td>
                            <td><Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${list[0].photo}`}/></td>
                            <td>{list[0].nom_prenom}</td>
                            <td>{list[0].cin}</td>
                            <td>{list[0].date_naissance}</td>
                            <td>{list[0].numtele}</td>
                            <td>{list[0].adresse}</td>
                            <td>{list[0].email}</td>
                            <td>{list[0].status}</td>
                            <td>{list[0].walletAddress}</td>
                            <td>{list[0].Penalits_retard}</td>
                    </tr>
                    
                )}
                </tbody>
            </Table>
            <br/> <br/> <br/> <br/> <br/> <br/>
        </div>)
    }
}

export default listeclientstotal


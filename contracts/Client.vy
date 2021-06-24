#pragma line
# @version ^0.2.0
#Contract Client

#Informations sur le client
struct Client_info:
    photo:String[200]
    nom_prenom : String[100]
    cin : String[20]
    date_naissance : String[30]
    numtele : String [60]
    adresse : String[1000]
    email: String[100]
    password: String[100]
    walletAddress: address
    createdAt: String[20]
    updatedAt: String[20]


nextclientindex :public(uint256)  

@external
def __init__():
    self.nextclientindex = 0

clients: public(HashMap[address,Client_info])

@external
def inscription(_photo:String[200],_nom_prenom : String[100],_cin : String[20],_date_naissance : String[30],_numtele : String [60],_adresse : String[1000],_email:String[100], _password:String[100], _walletAddress:address):

    self.clients[_walletAddress] = Client_info({
        photo: _photo,
        nom_prenom : _nom_prenom,
        cin :  _cin,
        date_naissance : _date_naissance,
        numtele : _numtele,
        adresse : _adresse,
        email: _email,
        password: _password,
        walletAddress: _walletAddress,
        createdAt: " ",
        updatedAt: " "})
    self.nextclientindex = self.nextclientindex +1


@external
def authentification(_email:String[100], _password:String[100],_account:address) -> String[100]:
    res:String[100] = "r"
    if self.clients[_account].email == _email:
        res = _email
        if self.clients[_account].password == _password:
            res = "welcome"
        else:
            res = "invalide email ou mot de passe"
    return res

@external
def listeclient() -> uint256 :
    return self.nextclientindex

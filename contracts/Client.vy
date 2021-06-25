#pragma line
# @version ^0.2.0
#Contract Client
nextclientindex :public(uint256)  
nextwishlistindex : public(uint256)

@external
def __init__():
    self.nextclientindex = 0
    self.nextwishlistindex = 0

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

struct Wishlist:
    accountclient : address
    reference : String[200]
    dateajout : String[15]

mywishlist : public(HashMap[uint256,Wishlist])
clients: public(HashMap[uint256,Client_info])

@external
def ajouterwishlist(_reference : String[200],_accountclient : address,_dateajout: String[15]):
    self.mywishlist[self.nextwishlistindex] = Wishlist({
        accountclient :_accountclient,
        reference : _reference ,
        dateajout: _dateajout})
    self.nextwishlistindex = self.nextwishlistindex +1

@external
def inscription(_photo:String[200],_nom_prenom : String[100],_cin : String[20],_date_naissance : String[30],_numtele : String [60],_adresse : String[1000],_email:String[100], _password:String[100], _walletAddress:address):

    self.clients[self.nextclientindex] = Client_info({
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
def authentification(_nb:uint256,_email:String[100], _password:String[100]) -> String[100]:
    res:String[100] = "r"
    if self.clients[_nb].email == _email:
        if self.clients[_nb].password == _password:
            res = "welcome"
        else:
            res = "invalide password"
    else:
        res = "invalide email"
    return res

@external
def listeclient() -> uint256 :
    return self.nextclientindex

@external
def listewishlist() -> uint256 :
    return self.nextwishlistindex
@external
def getreferencewishlist(nb:uint256)->String[200]:
    return self.mywishlist[nb].reference
@external
def getdateajout(nb:uint256)->String[15]:
    return self.mywishlist[nb].dateajout

@external
def getwalletAddress(nb:uint256)->address:
    return self.clients[nb].walletAddress
@external
def getpassword(nb:uint256)->String[100]:
    return self.clients[nb].password
@external
def getemail(nb:uint256)->String[100]:
    return self.clients[nb].email
@external
def getadresse(nb:uint256)->String[1000]:
    return self.clients[nb].adresse
@external
def getnumtele(nb:uint256)->String[60]:
    return self.clients[nb].numtele
@external
def getdate_naissance(nb:uint256)->String[30]:
    return self.clients[nb].date_naissance
@external
def getnom_prenom(nb:uint256)->String[200]:
    return self.clients[nb].nom_prenom 
@external
def getcin(nb:uint256)->String[20]:
    return self.clients[nb].cin 
@external
def getphoto(nb:uint256)->String[200]:
    return self.clients[nb].photo


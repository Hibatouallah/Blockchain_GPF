#pragma line
# @version ^0.2.0
#Contract Client
nextclientindex :public(uint256)  
nextwishlistindex : public(uint256)
nbnotification :uint256
@external
def __init__():
    self.nextclientindex = 0
    self.nextwishlistindex = 0
    self.nbnotification  = 0

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
    status : String[15]

struct NotificationClient :
    accountclient : address
    message : String[30000]
    status : String[25]

mywishlist : public(HashMap[uint256,Wishlist])
clients: public(HashMap[uint256,Client_info])
notification :public(HashMap[uint256,NotificationClient])

@external
def ajouternotification(_message : String[30000],_accountclient:address):
    self.notification[self.nbnotification] = NotificationClient({
        accountclient : _accountclient,
        message : _message,
        status : 'Disponible'
    })
    self.nbnotification = self.nbnotification + 1
@external
def modifiernotification(_nb:uint256):
    self.notification[_nb].status = "Supprimer"

@external
def ajouterwishlist(_reference : String[200],_accountclient : address,_dateajout: String[15]):
    self.mywishlist[self.nextwishlistindex] = Wishlist({
        accountclient :_accountclient,
        reference : _reference ,
        dateajout: _dateajout,
        status : 'disponible'})
    self.nextwishlistindex = self.nextwishlistindex +1

@external
def modifierwishlist(_nb : uint256):
    self.mywishlist[_nb].status = 'Supprimer'
       
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
def modifierimage(nb:uint256,_photo:String[200])-> String[100]:
    res:String[100] = ""
    self.clients[nb].photo = _photo
    res = "Modification de l'image est effectuée avec succés"
    return res
@external
def modifierclientinfo(nb:uint256,_nom_prenom : String[100],_cin : String[20],_date_naissance : String[30],_numtele : String [60],_adresse : String[1000],_email:String[100], _walletAddress:address)->String[100]:
    res:String[100] = ""
    self.clients[nb].nom_prenom = _nom_prenom
    self.clients[nb].cin =  _cin
    self.clients[nb].date_naissance = _date_naissance
    self.clients[nb].numtele = _numtele
    self.clients[nb].adresse = _adresse
    self.clients[nb].email = _email
    self.clients[nb].walletAddress= _walletAddress
    res = "Modification de vos informations est effectuée avec succés"
    return res

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
def getnbnotification() -> uint256 :
    return self.nbnotification


@external
def getwalletAddresswishlist(nb:uint256)->address:
    return self.mywishlist[nb].accountclient
@external
def getreferencewishlist(nb:uint256)->String[200]:
    return self.mywishlist[nb].reference
@external
def getdateajout(nb:uint256)->String[15]:
    return self.mywishlist[nb].dateajout
@external
def getstatus(nb:uint256)->String[15]:
    return self.mywishlist[nb].status

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

#Notification

@external
def getmessage(nb:uint256)->String[30000]:
    return self.notification[nb].message
@external
def getstatusnotfication(nb:uint256)->String[25]:
    return self.notification[nb].status
@external
def getaccountclientnotification(nb:uint256)->address:
    return self.notification[nb].accountclient 
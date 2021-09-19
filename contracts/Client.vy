#pragma line
# @version ^0.2.0
#Contract Client
nextclientindex :public(uint256)  
nextwishlistindex : public(uint256)
nbnotification :uint256
indexListe_payement_historique : uint256
indexListe_contrat_client : uint256
@external
def __init__():
    self.nextclientindex = 0
    self.nextwishlistindex = 0
    self.nbnotification  = 0
    self.indexListe_payement_historique = 0
    self.indexListe_contrat_client = 0

  
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
    status : String[15]
    walletAddress: address
    Penalits_retard: String[20]
  
struct Wishlist:
    accountclient : address
    reference : String[200]
    dateajout : String[15]
    status : String[15]

struct NotificationClient :
    accountclient : address
    message : String[30000]
    status : String[25]

struct Payement_historique:
    cin : String[20]
    referenceprojet : String[200]
    description : String[30000]

struct  Contrat_client:
    cin: String[20]
    referenceprojet : String[200]
    contrat : String[300]

mywishlist : public(HashMap[uint256,Wishlist])
clients: public(HashMap[uint256,Client_info])
notification :public(HashMap[uint256,NotificationClient])
Listepayement_historique : public(HashMap[uint256,Payement_historique])
Listecontrat : public(HashMap[uint256,Contrat_client])

@external
def ajoutercontrat_client(_cin : String[20],_referenceprojet : String[200],_contrat : String[300]):
    self.Listecontrat[self.indexListe_contrat_client] = Contrat_client({
        cin: _cin,
        referenceprojet : _referenceprojet,
        contrat : _contrat
    })
    self.indexListe_contrat_client = self.indexListe_contrat_client +1

@external
def ajouterpayementhistorique(_cin : String[20],_referenceprojet : String[200],_description : String[30000]):
    self.Listepayement_historique[self.indexListe_payement_historique] = Payement_historique({
        cin : _cin,
        referenceprojet :_referenceprojet,
        description : _description,
    })
    self.indexListe_payement_historique = self.indexListe_payement_historique +1

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
def ajouterwishlist(_reference : String[200],_accountclient : address,_dateajout: String[15]) -> String[100]:
    res:String[100] = "Erreur"
    self.mywishlist[self.nextwishlistindex] = Wishlist({
        accountclient :_accountclient,
        reference : _reference ,
        dateajout: _dateajout,
        status : 'disponible'})
    self.nextwishlistindex = self.nextwishlistindex +1
    res = "Le projet est ajouté au panier"
    return res

@external
def modifierwishlist(_nb : uint256):
    self.mywishlist[_nb].status = 'Supprimer'
       
@external
def inscription(_photo:String[200],_nom_prenom : String[100],_cin : String[20],_date_naissance : String[30],_numtele : String [60],_adresse : String[1000],_email:String[100], _password:String[100], _walletAddress:address)-> String[1000]:
    res:String[1000] = ""
    self.clients[self.nextclientindex] = Client_info({
        photo: _photo,
        nom_prenom : _nom_prenom,
        cin :  _cin,
        date_naissance : _date_naissance,
        numtele : _numtele,
        adresse : _adresse,
        email: _email,
        password: _password,
        status : "Desactiver",
        walletAddress: _walletAddress,
        Penalits_retard: "0"
     })
    self.nextclientindex = self.nextclientindex +1
    res = "Vous etes inscri sur la plateforme ImmobiTech,attendez la confirmation du compte par l'admin"
    return res
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
    if self.clients[_nb].status == "Activer":
        if self.clients[_nb].email == _email:
            if self.clients[_nb].password == _password:
                res = "welcome"
            else:
                res = "invalide password"
        else:
            res = "invalide email"
    else:
        res = "Le compte n'est pas encore confirmer , veuillez attendre au max 24h"
    return res
@external
def Activerclient(nb:uint256):
    self.clients[nb].status = "Activer"
@external
def Desactiverclient(nb:uint256):
    self.clients[nb].status = "Desactiver"
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
def getliste_payement_historique() -> uint256:
    return self.indexListe_payement_historique
@external
def getliste_contrat_client() -> uint256:
    return self.indexListe_contrat_client

#Contrat client
@external
def getcinclient_contrat(nb:uint256)->String[20]:
    return self.Listecontrat[nb].cin
@external
def getreferenceprojet_contrat(nb:uint256)->String[200]:
    return self.Listecontrat[nb].referenceprojet
@external
def getcontrat_contrat(nb:uint256)->String[300]:
    return self.Listecontrat[nb].contrat
# Payement historique
@external
def getcinclient_historique(nb:uint256)->String[20]:
    return self.Listepayement_historique[nb].cin
@external
def getreference_historique(nb:uint256)->String[200]:
    return self.Listepayement_historique[nb].referenceprojet
@external
def getdescription_historique(nb:uint256)->String[30000]:
    return self.Listepayement_historique[nb].description
#WishList
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

#Compte Client
@external
def getPenalits_retard(nb:uint256)->String[20]:
    return self.clients[nb].Penalits_retard
@external
def getstatusclient(nb:uint256)->String[15]:
    return self.clients[nb].status
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
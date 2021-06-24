#pragma line
# @version ^0.2.0
#Contract Promoteur

#Informations sur le promoteur

nextpromoteurindex : uint256 
nextcandidatureindex : uint256
nextwishlistindex : uint256
@external
def __init__():
    self.nextpromoteurindex = 0
    self.nextcandidatureindex = 0
    self.nextwishlistindex = 0

struct Promoteur_info:
    photo: String[200]
    nom_prenom : String[100]
    activite : String[200]
    identifiant_commun_entreprise: uint256
    identifiant_fiscal: uint256
    numero_rc: uint256
    adresse : String[1000]
    email: String[100]
    password: String[100]
    status: String[10]
    walletAddress: address
    createdAt: String[20]
    updatedAt: String[20]
    Penalits_retard: String[20]
    assurances_responsabilites_civile: String[100]
    assurance_rique_chantier:  String[100]
    assurance_accident_travail:  String[100]

struct Candidature:
    accountpromoteur : address
    reference : String[200]
    cahier_prestation_speciale: String[200]
    bordereau_prix_detail_estimatif : String[200]
    present_reglement_consultation : String[200]
    modele_acte_engagement : String[200]
    modele_declaration_honneur : String[200]

struct Wishlist:
    accountpromoteur : address
    reference : String[200]
    dateajout : String[15]

mywishlist : public(HashMap[uint256,Wishlist])
mescandidatures : public(HashMap[uint256,Candidature])
promoteurs: public(HashMap[uint256,Promoteur_info])


@external
def ajouterwishlist(_reference : String[200],_accountpromoteur : address,_dateajout: String[15]):
    self.mywishlist[self.nextwishlistindex] = Wishlist({
        accountpromoteur :_accountpromoteur,
        reference : _reference ,
        dateajout:_dateajout})
    self.nextwishlistindex = self.nextwishlistindex +1

@external
def ajoutercandidature(_reference : String[200],_accountpromoteur : address,_cahier_prestation_speciale: String[200],_bordereau_prix_detail_estimatif : String[200],_present_reglement_consultation : String[200],_modele_acte_engagement : String[200],_modele_declaration_honneur : String[200]):
    self.mescandidatures[self.nextcandidatureindex] = Candidature({
        accountpromoteur :_accountpromoteur,
        reference : _reference ,
        cahier_prestation_speciale:_cahier_prestation_speciale,
        bordereau_prix_detail_estimatif:_bordereau_prix_detail_estimatif,
        present_reglement_consultation:_present_reglement_consultation,
        modele_acte_engagement: _modele_acte_engagement,
        modele_declaration_honneur : _modele_declaration_honneur})

    self.nextcandidatureindex = self.nextcandidatureindex +1
#functions
@external
def modifiercandidature(_nb:uint256,_reference : String[200],_accountpromoteur : address,_cahier_prestation_speciale: String[200],_bordereau_prix_detail_estimatif : String[200],_present_reglement_consultation : String[200],_modele_acte_engagement : String[200],_modele_declaration_honneur : String[200]):
    self.mescandidatures[_nb] = Candidature({
        accountpromoteur :_accountpromoteur,
        reference : _reference ,
        cahier_prestation_speciale:_cahier_prestation_speciale,
        bordereau_prix_detail_estimatif:_bordereau_prix_detail_estimatif,
        present_reglement_consultation:_present_reglement_consultation,
        modele_acte_engagement: _modele_acte_engagement,
        modele_declaration_honneur : _modele_declaration_honneur})

@external
def inscription(_photo: String[200],_nom_prenom : String[100],_activite : String[200],_identifiant_commun_entreprise : uint256,_identifiant_fiscal :uint256,_numero_rc:uint256,_adresse : String[1000],_email:String[100], _password:String[100], _walletAddress:address):

    self.promoteurs[self.nextpromoteurindex] = Promoteur_info({
        photo: _photo,
        nom_prenom :_nom_prenom,
        activite:_activite,
        identifiant_commun_entreprise:_identifiant_commun_entreprise,
        identifiant_fiscal:_identifiant_fiscal,
        numero_rc: _numero_rc,
        adresse : _adresse,
        email: _email,
        password : _password,
        status: 'Actif',
        walletAddress : _walletAddress ,
        createdAt : "0",
        updatedAt : "0",
        Penalits_retard: "",
        assurances_responsabilites_civile: " ",
        assurance_rique_chantier:  " ",
        assurance_accident_travail: " "})
    self.nextpromoteurindex = self.nextpromoteurindex +1


@external
def authentification(_nb:uint256,_email:String[100], _password:String[100]) -> String[100]:
    res:String[100] = "r"
    if self.promoteurs[_nb].email == _email:
        if self.promoteurs[_nb].password == _password:
            res = "welcome"
        else:
            res = "invalide password"
    else:
        res = "invalide email"
    return res


@external
def listewishlist() -> uint256 :
    return self.nextwishlistindex
@external
def listepromoteur() -> uint256 :
    return self.nextpromoteurindex
@external
def listecandidature() -> uint256 :
    return self.nextcandidatureindex
@external
def getassurance_accident_travail(nb:uint256)->String[100]:
    return self.promoteurs[nb].assurance_accident_travail
@external
def getassurance_rique_chantier(nb:uint256)->String[100]:
    return self.promoteurs[nb].assurance_rique_chantier
@external
def getphoto(nb:uint256)->String[200]:
    return self.promoteurs[nb].photo
@external
def getassurances_responsabilites_civile(nb:uint256)->String[100]:
    return self.promoteurs[nb].assurances_responsabilites_civile

@external
def getPenalits_retard(nb:uint256)->String[20]:
    return self.promoteurs[nb].Penalits_retard

@external
def getupdatedAt(nb:uint256)->String[20]:
    return self.promoteurs[nb].updatedAt

@external
def getcreatedAt(nb:uint256)->String[20]:
    return self.promoteurs[nb].createdAt

@external
def getwalletAddress(nb:uint256)->address:
    return self.promoteurs[nb].walletAddress

@external
def getstatus(nb:uint256)->String[10]:
    return self.promoteurs[nb].status

@external
def getpassword(nb:uint256)->String[100]:
    return self.promoteurs[nb].password

@external
def getemail(nb:uint256)->String[100]:
    return self.promoteurs[nb].email

@external
def getadresse(nb:uint256)->String[1000]:
    return self.promoteurs[nb].adresse

@external
def getnumero_rc(nb:uint256)->uint256:
    return self.promoteurs[nb].numero_rc

@external
def getidentifiant_fiscal(nb:uint256)->uint256:
    return self.promoteurs[nb].identifiant_fiscal

@external
def getnom_prenom(nb:uint256)->String[100]:
    return self.promoteurs[nb].nom_prenom

@external
def getactivite(nb:uint256)->String[200]:
    return self.promoteurs[nb].activite

@external
def getidentifiant_commun_entreprise(nb:uint256)->uint256:
    return self.promoteurs[nb].identifiant_commun_entreprise

@external
def getaccountpromoteur(nb:uint256)->address:
    return self.mescandidatures[nb].accountpromoteur
@external
def getcahier_prestation_speciale(nb:uint256)->String[200]:
    return self.mescandidatures[nb].cahier_prestation_speciale
@external
def getbordereau_prix_detail_estimatif(nb:uint256)->String[200]:
    return self.mescandidatures[nb].bordereau_prix_detail_estimatif
@external
def getpresent_reglement_consultation(nb:uint256)->String[200]:
    return self.mescandidatures[nb].present_reglement_consultation
@external
def getmodele_acte_engagement(nb:uint256)->String[200]:
    return self.mescandidatures[nb].modele_acte_engagement
@external
def getmodele_declaration_honneur(nb:uint256)->String[200]:
    return self.mescandidatures[nb].modele_declaration_honneur
@external
def getreference(nb:uint256)->String[200]:
    return self.mescandidatures[nb].reference

@external
def getreferencewishlist(nb:uint256)->String[200]:
    return self.mywishlist[nb].reference

@external
def getdateajout(nb:uint256)->String[15]:
    return self.mywishlist[nb].dateajout
    
#pragma line
# @version ^0.2.0
#Contract EngagamentPromoteur


indexlistepromoteurengage : uint256
indexliste_contrat_istisnaa : uint256
indexlisteprojetpromoteur : uint256

@external
def __init__():
    self.indexlistepromoteurengage = 0
    self.indexliste_contrat_istisnaa= 0
    self.indexlisteprojetpromoteur = 0

struct Promoteurengage :
    accountpromoteur: address
    referencepromoteur : String[200]
    assurances_responsabilites_civile: String[100]
    assurance_rique_chantier:  String[100]
    assurance_accident_travail:  String[100]

struct Projetpromoteur:
    accountpromoteur: address
    referencepromoteur : String[200]
    debutdestravaux : String[10]
    construction_rez_de_chaussee : String[10]
    grands_travaux : String[10]
    finition : String[10]
    livraison : String[10]
    payementdebutdestravaux : String[10]
    payementconstruction_rez_de_chaussee : String[10]
    payementgrands_travaux: String[10]
    payementfinition : String[10]
    payementlivraison : String[10]

struct Contratistisnaa : 
    numero_rc : uint256
    referenceprojet : String[200]
    date_commencement : String[20]
    date_livraison_bien : String[20]
    modalite_paiement : String[1000]
    nature_projet : String[50]


Listepromoteurengage : public(HashMap[uint256,Promoteurengage])
Listecontratistisnaa : public(HashMap[uint256,Contratistisnaa])
Listeprojetpromoteur : public(HashMap[uint256,Projetpromoteur])

@external
def payer(_account:address,montant : decimal):
    mt : uint256 = 0
    mt = convert(montant, uint256)
    send(_account,mt)
@external
def ajouterprojetpromoteur(_accountpromoteur:address,_referencepromoteur : String[200]):
    self.Listeprojetpromoteur[self.indexlisteprojetpromoteur] = Projetpromoteur({
        accountpromoteur: _accountpromoteur,
        referencepromoteur : _referencepromoteur,
        debutdestravaux : "non",
        construction_rez_de_chaussee : "non",
        grands_travaux : "non",
        finition : "non",
        livraison : "non",
        payementdebutdestravaux : "non",
        payementconstruction_rez_de_chaussee : "non",
        payementgrands_travaux: "non",
        payementfinition : "non",
        payementlivraison : "non",
    })
    self.indexlisteprojetpromoteur = self.indexlisteprojetpromoteur +1

@external
def modifierpayementlivraison(nb:uint256):
    self.Listeprojetpromoteur[nb].payementlivraison = "oui"
@external
def modifierpayementfinition(nb:uint256):
    self.Listeprojetpromoteur[nb].payementfinition = "oui"
@external
def modifierpayementgrands_travaux(nb:uint256):
    self.Listeprojetpromoteur[nb].payementgrands_travaux = "oui"
@external
def modifierpayementconstruction_rez_de_chaussee(nb:uint256):
    self.Listeprojetpromoteur[nb].payementconstruction_rez_de_chaussee = "oui"
@external
def modifierpayementdebutdestravaux(nb:uint256):
    self.Listeprojetpromoteur[nb].payementdebutdestravaux = "oui"

@external
def modifierdebutdestravaux(nb:uint256):
    self.Listeprojetpromoteur[nb].debutdestravaux = "oui"

@external
def modifierconstruction_rez_de_chaussee(nb:uint256):
    self.Listeprojetpromoteur[nb].construction_rez_de_chaussee = "oui"

@external
def modifiergrands_travaux(nb:uint256):
    self.Listeprojetpromoteur[nb].grands_travaux = "oui"

@external
def modifierfinition(nb:uint256):
    self.Listeprojetpromoteur[nb].finition = "oui"

@external
def modifierlivraison(nb:uint256):
    self.Listeprojetpromoteur[nb].livraison = "oui"

@external
def ajouterpromoteurengage(_accountpromoteur:address,_referencepromoteur : String[200],_assurances_responsabilites_civile: String[100],_assurance_rique_chantier: String[100],_assurance_accident_travail:  String[100]):
    self.Listepromoteurengage[self.indexlistepromoteurengage] = Promoteurengage({
        accountpromoteur: _accountpromoteur,
        referencepromoteur : _referencepromoteur,
        assurances_responsabilites_civile: _assurances_responsabilites_civile,
        assurance_rique_chantier:  _assurance_rique_chantier,
        assurance_accident_travail:  _assurance_accident_travail
    })
    self.indexlistepromoteurengage = self.indexlistepromoteurengage +1

@external
def modifierpromoteurengage(_nb:uint256,_accountpromoteur:address,_referencepromoteur : String[200],_assurances_responsabilites_civile: String[100],_assurance_rique_chantier: String[100],_assurance_accident_travail:  String[100]):
    self.Listepromoteurengage[_nb].accountpromoteur = _accountpromoteur
    self.Listepromoteurengage[_nb].referencepromoteur = _referencepromoteur
    self.Listepromoteurengage[_nb].assurances_responsabilites_civile = _assurances_responsabilites_civile
    self.Listepromoteurengage[_nb].assurance_rique_chantier = _assurance_rique_chantier
    self.Listepromoteurengage[_nb].assurance_accident_travail = _assurance_accident_travail
 
    
@external
def ajoutercontratisitisnaa_fonds(_referenceprojet : String[200],_date_commencement : String[20],_date_livraison_bien : String[20],_modalite_paiement : String[1000],_nature_projet : String[50]):
    self.Listecontratistisnaa[self.indexliste_contrat_istisnaa] = Contratistisnaa({
         numero_rc : 0,
         referenceprojet : _referenceprojet,
         date_commencement : _date_commencement,
         date_livraison_bien : _date_livraison_bien,
         modalite_paiement : _modalite_paiement,
         nature_projet : _nature_projet})

    self.indexliste_contrat_istisnaa = self.indexliste_contrat_istisnaa +1
@external
def modifiercontratisitisnaa_promoteur(_nb:uint256,_numero_rc:uint256):
    self.Listecontratistisnaa[_nb].numero_rc = _numero_rc


@external
def getlisteprojetpromoteur() -> uint256:
    return self.indexlisteprojetpromoteur
@external
def getlistepromoteurengage() -> uint256 :
    return self.indexlistepromoteurengage
@external
def getListecontratistisnaa() -> uint256 :
    return self.indexliste_contrat_istisnaa

#Projet Promoteur
@external
def getaccountpromoteurprojet(nb:uint256)->address:
    return self.Listeprojetpromoteur[nb].accountpromoteur
@external
def getreferencepromoteurprojet(nb:uint256)-> String[200]:
    return self.Listeprojetpromoteur[nb].referencepromoteur
@external
def getdebutdestravaux(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].debutdestravaux
@external
def getconstruction_rez_de_chaussee(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].construction_rez_de_chaussee     
@external
def getgrands_travaux(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].grands_travaux      
@external
def getfinition(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].finition   
@external
def getlivraison(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].livraison 
@external
def getpayementdebutdestravaux(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].payementdebutdestravaux 
@external
def getpayementconstruction_rez_de_chaussee(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].payementconstruction_rez_de_chaussee 
@external
def getpayementgrands_travaux(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].payementgrands_travaux 
@external
def getpayementfinition(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].payementfinition 
@external
def getpayementlivraison(nb:uint256)-> String[10]:
    return self.Listeprojetpromoteur[nb].payementlivraison 
     

#Promoteur engage
@external
def getaccountpromoteur(nb:uint256)->address:
    return self.Listepromoteurengage[nb].accountpromoteur
@external
def getreferencepromoteur(nb:uint256)->String[200]:
    return self.Listepromoteurengage[nb].referencepromoteur
@external
def getassurances_responsabilites_civile(nb:uint256)->String[100]:
    return self.Listepromoteurengage[nb].assurances_responsabilites_civile
@external
def getassurance_rique_chantier(nb:uint256)->String[100]:
    return self.Listepromoteurengage[nb].assurance_rique_chantier
@external
def getassurance_accident_travail(nb:uint256)->String[100]:
    return self.Listepromoteurengage[nb].assurance_accident_travail


#contrat isitisnaa

@external
def getnumero_rc_istisnaa(nb:uint256) -> uint256:
    return self.Listecontratistisnaa[nb].numero_rc
@external
def getreferenceprojet_istisnaa(nb:uint256) -> String[200]:
    return self.Listecontratistisnaa[nb].referenceprojet
@external
def getdate_commencement_istisnaa(nb:uint256) -> String[20]:
    return self.Listecontratistisnaa[nb].date_commencement
@external
def getdate_livraison_bien(nb:uint256) -> String[20]:
    return self.Listecontratistisnaa[nb].date_livraison_bien
@external
def getmodalite_paiement_bien(nb:uint256) -> String[1000]:
    return self.Listecontratistisnaa[nb].modalite_paiement
@external
def getnature_projet(nb:uint256) -> String[50]:
    return self.Listecontratistisnaa[nb].nature_projet
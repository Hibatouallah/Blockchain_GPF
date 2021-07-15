#pragma line
# @version ^0.2.0
#Contract EngagamentPromoteur


indexlistepromoteurengage : uint256
indexliste_contrat_istisnaa : uint256
@external
def __init__():
    self.indexlistepromoteurengage = 0
    self.indexliste_contrat_istisnaa= 0

    
struct Promoteurengage :
    numero_rc: uint256
    referencepromoteur : String[200]
    assurances_responsabilites_civile: String[100]
    assurance_rique_chantier:  String[100]
    assurance_accident_travail:  String[100]

struct Contratistisnaa : 
    numero_rc : uint256
    referenceprojet : String[200]
    date_commencement : String[20]
    date_livraison_bien : String[20]
    modalite_paiement : String[1000]
    nature_projet : String[50]


Listepromoteurengage : public(HashMap[uint256,Promoteurengage])
Listecontratistisnaa : public(HashMap[uint256,Contratistisnaa])


@external
def ajoutercontratisitisnaa_fonds(_referenceprojet : String[200],_date_commencement : String[20],_date_livraison_bien : String[20],_modalite_paiement : String[1000],_nature_projet : String[50]):
    self.Listecontratistisnaa[self.indexlistepromoteurengage] = Contratistisnaa({
         numero_rc : 0,
         referenceprojet : _referenceprojet,
         date_commencement : _date_commencement,
         date_livraison_bien : _date_livraison_bien,
         modalite_paiement : _modalite_paiement,
         nature_projet : _nature_projet})

    self.indexliste_contrat_istisnaa = self.indexliste_contrat_istisnaa +1
@external
def modifiercontratisitisnaa_promoteur(_assurance_accident_travail:String[100],_assurance_rique_chantier:String[100],_assurances_responsabilites_civile:String[100],_nb : uint256,_numero_rc: uint256,_referenceprojet : String[200],_date_commencement : String[20],_date_livraison_bien : String[20],_modalite_paiement : String[1000],_nature_projet : String[50]):
    self.Listecontratistisnaa[_nb] = Contratistisnaa({
         numero_rc : _numero_rc,
         referenceprojet : _referenceprojet,
         date_commencement : _date_commencement,
         date_livraison_bien : _date_livraison_bien,
         modalite_paiement : _modalite_paiement,
         nature_projet : _nature_projet})

    self.Listepromoteurengage[self.indexlistepromoteurengage] = Promoteurengage({
        numero_rc: _numero_rc,
        referencepromoteur : _referenceprojet,
        assurances_responsabilites_civile: _assurances_responsabilites_civile,
        assurance_rique_chantier:  _assurance_rique_chantier,
        assurance_accident_travail:  _assurance_accident_travail})

    self.indexlistepromoteurengage = self.indexlistepromoteurengage +1

@external
def getlistepromoteurengage() -> uint256 :
    return self.indexlistepromoteurengage
@external
def getListecontratistisnaa() -> uint256 :
    return self.indexliste_contrat_istisnaa

#Promoteur engage
@external
def getnumero_rc(nb:uint256)->uint256:
    return self.Listepromoteurengage[nb].numero_rc
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
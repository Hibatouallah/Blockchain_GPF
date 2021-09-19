#pragma line
# @version ^0.2.0
#Contract EngagementClient

#Informations 
indexlisteclientengage : uint256
indexliste_contrat_ijaramontahiyabitamlik : uint256
indexListe_contrat_vente : uint256
indexListe_contrat_morabaha : uint256

@external
def __init__():
    self.indexlisteclientengage = 0
    self.indexliste_contrat_ijaramontahiyabitamlik = 0
    self.indexListe_contrat_vente = 0
    self.indexListe_contrat_morabaha = 0


struct Clientengage :
    cin : String[20]
    referenceclient : String[200]
    typecontract : String[50]
    statuspayment : String[20]

struct Contrat_Morabaha:
    cinclient :  String[20]
    referenceprojet : String[200] 
    estimationpenalite : uint256
    coutderevien : String[20]
    marge : String[20]
    prixvente : String[20]
    duree_ammortissement : String[50]
    assurancetakaful : String[20]
    duree_contrat : String[50]
    type_payement : String[80]
    duree_payement : String[80]
    montantpaye : String[80]
    anneeactuelpayement: String[8]
    moisactuelpayement : String[8]
    trimestreactuelpayement : String[8]
    semestreactuelpayement : String[8]
    
   
struct  Contrat_Ijaramontahiyabitamlik:
    cinclient :  String[20]
    referenceprojet : String[200]
    duree_contrat : String[50]
    montant_loyer : String[50]
    date_resuliation : String[50]
    cession_du_bien : String[50]
    montantpartranche : String[20]
    type_payement : String[80]
    duree_payement : String[80]
    anneeactuelpayement: String[8]
    moisactuelpayement : String[8]
    trimestreactuelpayement : String[8]
    semestreactuelpayement : String[8]
    
 
struct Contrat_vente :
    cinclient :  String[20]
    referenceprojet : String[200] 
    datecontrat : String[50]  
    prixvente : String[20]

    
Liste_contrat_ijaramontahiyabitamlik : public(HashMap[uint256,Contrat_Ijaramontahiyabitamlik])
Liste_contrat_vente : public(HashMap[uint256,Contrat_vente])
Liste_contrat_morabaha : public(HashMap[uint256,Contrat_Morabaha])
Listeclientengage : public(HashMap[uint256,Clientengage])


@external
def ajouter_contrat(_nb : uint256,_status:String[20]):
    self.Listeclientengage[_nb].statuspayment = _status
#contrat mourabaha
@external
def modifiercontrat_morabaha_client(_type_payement:String[80],_duree_payement:String[80],_montantpaye:String[80],nb:uint256,_cinclient: String[20],_referenceprojet : String[200]):
    self.Liste_contrat_morabaha[nb].cinclient = _cinclient
    self.Liste_contrat_morabaha[nb].type_payement = _type_payement
    self.Liste_contrat_morabaha[nb].duree_payement = _duree_payement
    self.Liste_contrat_morabaha[nb].montantpaye = _montantpaye
    self.Listeclientengage[self.indexlisteclientengage] = Clientengage({
        cin : _cinclient,
        referenceclient : _referenceprojet,
        typecontract : "Morabaha",
        statuspayment : "Desactiver"})

    self.indexlisteclientengage = self.indexlisteclientengage +1
@external
def modifiercontrat_morabaha_fonds(nb : uint256,_referenceprojet : String[200],_estimationpenalite : uint256,_coutderevien : String[20],_marge : String[20],_prixvente : String[20],_duree_ammortissement : String[50],_assurancetakaful : String[20],_duree_contrat : String[50]):
    self.Liste_contrat_morabaha[nb].referenceprojet = _referenceprojet
    self.Liste_contrat_morabaha[nb].estimationpenalite = _estimationpenalite
    self.Liste_contrat_morabaha[nb].coutderevien = _coutderevien
    self.Liste_contrat_morabaha[nb].marge = _marge
    self.Liste_contrat_morabaha[nb].prixvente = _prixvente
    self.Liste_contrat_morabaha[nb].duree_ammortissement = _duree_ammortissement
    self.Liste_contrat_morabaha[nb].assurancetakaful = _assurancetakaful
    self.Liste_contrat_morabaha[nb].duree_contrat = _duree_contrat
 
@external
def ajoutercontrat_morabaha_fonds(_referenceprojet : String[200],_estimationpenalite : uint256,_coutderevien : String[20],_marge : String[20],_prixvente : String[20],_duree_ammortissement : String[50],_assurancetakaful : String[20],_duree_contrat : String[50]):
    self.Liste_contrat_morabaha[self.indexListe_contrat_morabaha] = Contrat_Morabaha({
        cinclient : "",
        referenceprojet : _referenceprojet ,
        estimationpenalite : _estimationpenalite,
        coutderevien : _coutderevien,
        marge : _marge,
        prixvente : _prixvente,
        duree_ammortissement : _duree_ammortissement,
        assurancetakaful : _assurancetakaful,
        duree_contrat : _duree_contrat,
        type_payement : "",
        duree_payement : "",
        montantpaye : "",
        anneeactuelpayement: "",
        moisactuelpayement : "",
        trimestreactuelpayement : "",
        semestreactuelpayement : ""
        })
    self.indexListe_contrat_morabaha = self.indexListe_contrat_morabaha +1

@external
def modifier_anneeactuelpayement(_nb : uint256,_anneeactuelpayement:String[8]):
    self.Liste_contrat_morabaha[_nb].anneeactuelpayement = _anneeactuelpayement
@external
def modifier_moisactuelpayement(_nb : uint256,_moisactuelpayement:String[8]):
    self.Liste_contrat_morabaha[_nb].moisactuelpayement = _moisactuelpayement
@external
def modifier_trimestreactuelpayement(_nb : uint256,_trimestreactuelpayement:String[8]):
    self.Liste_contrat_morabaha[_nb].trimestreactuelpayement = _trimestreactuelpayement
@external
def modifier_semestreactuelpayement(_nb : uint256,_semestreactuelpayement:String[8]):
    self.Liste_contrat_morabaha[_nb].semestreactuelpayement = _semestreactuelpayement

#contrat vente
@external
def modifiercontratvente_client(_nb : uint256 ,_cinclient : String[20], _referenceprojet : String[200]):
    self.Liste_contrat_vente[_nb].cinclient = _cinclient
    self.Listeclientengage[self.indexlisteclientengage] = Clientengage({
        cin : _cinclient,
        referenceclient : _referenceprojet,
        typecontract : "Vente",
        statuspayment : "Desactiver"})

    self.indexlisteclientengage = self.indexlisteclientengage +1

@external
def modifiercontratvente_fonds(_nb:uint256,_referenceprojet : String[200],_datecontrat : String[50],_prixvente : String[20]):
    self.Liste_contrat_vente[_nb].referenceprojet = _referenceprojet
    self.Liste_contrat_vente[_nb].datecontrat = _datecontrat
    self.Liste_contrat_vente[_nb].prixvente = _prixvente
 
@external
def ajoutercontratvente_fonds(_referenceprojet : String[200],_datecontrat : String[50],_prixvente : String[20]):
    self.Liste_contrat_vente[self.indexListe_contrat_vente] = Contrat_vente({
        cinclient : "",
        referenceprojet : _referenceprojet ,
        datecontrat : _datecontrat,
        prixvente : _prixvente })

    self.indexListe_contrat_vente = self.indexListe_contrat_vente +1

#contrat ijara

@external
def modifier_anneeactuelpayement_ijara(_nb : uint256,_anneeactuelpayement:String[8]):
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].anneeactuelpayement = _anneeactuelpayement
@external
def modifier_moisactuelpayement_ijara(_nb : uint256,_moisactuelpayement:String[8]):
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].moisactuelpayement = _moisactuelpayement
@external
def modifier_trimestreactuelpayement_ijara(_nb : uint256,_trimestreactuelpayement:String[8]):
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].trimestreactuelpayement = _trimestreactuelpayement
@external
def modifier_semestreactuelpayement_ijara(_nb : uint256,_semestreactuelpayement:String[8]):
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].semestreactuelpayement = _semestreactuelpayement

@external
def ajouterijaramontahiyabitamlik_fonds(_referenceprojet : String[200],_duree_contrat : String[50],_montant_loyer : String[50],_date_resuliation : String[50],_cession_du_bien : String[50],_montantpartranche : String[20]):
    self.Liste_contrat_ijaramontahiyabitamlik[self.indexliste_contrat_ijaramontahiyabitamlik] = Contrat_Ijaramontahiyabitamlik({
        cinclient : "",
        referenceprojet : _referenceprojet,
        duree_contrat : _duree_contrat,
        montant_loyer : _montant_loyer,
        date_resuliation : _date_resuliation,
        cession_du_bien : _cession_du_bien,
        montantpartranche : _montantpartranche,
        type_payement : "",
        duree_payement : "",
        anneeactuelpayement: "",
        moisactuelpayement : "",
        trimestreactuelpayement : "",
        semestreactuelpayement : ""})

    self.indexliste_contrat_ijaramontahiyabitamlik = self.indexliste_contrat_ijaramontahiyabitamlik +1
@external
def modifierijaramontahiyabitamlik_client(_type_payement:String[80],_duree_payement:String[80],_montantpartranche:String[20],_nb:uint256, _cinclient :  String[20],_referenceprojet : String[200]):
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].cinclient = _cinclient
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].type_payement = _type_payement
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].duree_payement = _duree_payement
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].montantpartranche = _montantpartranche
 
    self.Listeclientengage[self.indexlisteclientengage] = Clientengage({
        cin : _cinclient,
        referenceclient : _referenceprojet,
        typecontract : "Ijara",
        statuspayment : "Desactiver"})

    self.indexlisteclientengage = self.indexlisteclientengage +1

@external
def modifierijaramontahiyabitamlik_fonds(_nb:uint256,_referenceprojet : String[200],_duree_contrat : String[50],_montant_loyer : String[50],_date_resuliation : String[50],_cession_du_bien : String[50],_montantpartranche : String[20]):
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].referenceprojet = _referenceprojet
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].duree_contrat = _duree_contrat
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].montant_loyer = _montant_loyer
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].date_resuliation = _date_resuliation
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].cession_du_bien = _cession_du_bien
    self.Liste_contrat_ijaramontahiyabitamlik[_nb].montantpartranche = _montantpartranche
 

@external
def getlisteclientengage() -> uint256 :
    return self.indexlisteclientengage
@external
def getListecontratmorabaha()-> uint256:
    return self.indexListe_contrat_morabaha
@external
def getlistecontratvente()->uint256:
    return self.indexListe_contrat_vente
@external
def getliste_contrat_ijaramontahiyabitamlik() -> uint256:
    return self.indexliste_contrat_ijaramontahiyabitamlik


# Client engage
@external
def getcin(nb:uint256)->String[20]:
    return self.Listeclientengage[nb].cin
@external
def getreferenceclient(nb:uint256)->String[200]:
    return self.Listeclientengage[nb].referenceclient
@external
def gettypecontract(nb:uint256)->String[50]:
    return self.Listeclientengage[nb].typecontract
@external
def getstatuspayment(nb:uint256) -> String[20]:
    return self.Listeclientengage[nb].statuspayment


#Contrat Morabaha

@external
def getcinclient(nb:uint256)->  String[20]:
    return self.Liste_contrat_morabaha[nb].cinclient
@external
def getreferenceprojet(nb:uint256) -> String[200]:
    return self.Liste_contrat_morabaha[nb].referenceprojet
@external
def getestimationpenalite(nb:uint256) -> uint256:
    return self.Liste_contrat_morabaha[nb].estimationpenalite
@external
def getcoutderevien(nb:uint256) -> String[20]:
    return self.Liste_contrat_morabaha[nb].coutderevien
@external
def getmarge(nb:uint256) -> String[20]:
    return self.Liste_contrat_morabaha[nb].marge
@external
def getprixvente(nb:uint256) -> String[20]:
    return self.Liste_contrat_morabaha[nb].prixvente   
@external
def getduree_ammortissement(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].duree_ammortissement 
@external
def getassurancetakaful(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].assurancetakaful 
@external
def getduree_contrat(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].duree_contrat
@external
def gettype_payement(nb:uint256) -> String[80]:
    return self.Liste_contrat_morabaha[nb].type_payement
@external
def getduree_payement(nb:uint256) -> String[80]:
    return self.Liste_contrat_morabaha[nb].duree_payement
@external
def getmontantpaye(nb:uint256) -> String[80]:
    return self.Liste_contrat_morabaha[nb].montantpaye
@external
def getanneeactuelpayement(nb:uint256) -> String[8]:
    return self.Liste_contrat_morabaha[nb].anneeactuelpayement
@external
def getmoisactuelpayement(nb:uint256) -> String[8]:
    return self.Liste_contrat_morabaha[nb].moisactuelpayement
@external
def gettrimestreactuelpayement(nb:uint256) -> String[8]:
    return self.Liste_contrat_morabaha[nb].trimestreactuelpayement
@external
def getsemestreactuelpayement(nb:uint256) -> String[8]:
    return self.Liste_contrat_morabaha[nb].semestreactuelpayement


#Contrat Ijara Montahiya bitamlik

@external
def getcinclientijara(nb:uint256) ->  String[20]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].cinclient
@external
def getreferenceprojetijara(nb:uint256)->String[200]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].referenceprojet
@external
def getduree_contratijara(nb:uint256)->String[50]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].duree_contrat
@external
def getmontant_loyer(nb:uint256)->String[50]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].montant_loyer
@external
def getdate_resuliation(nb:uint256)->String[50]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].date_resuliation
@external
def getcession_du_bien(nb:uint256)->String[50]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].cession_du_bien
@external
def getmontantpartranche(nb:uint256)->String[20]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].montantpartranche
@external
def gettype_payement_ijara(nb:uint256) -> String[80]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].type_payement
@external
def getduree_payement_ijara(nb:uint256) -> String[80]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].duree_payement
@external
def getanneeactuelpayement_ijara(nb:uint256) -> String[8]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].anneeactuelpayement
@external
def getmoisactuelpayement_ijara(nb:uint256) -> String[8]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].moisactuelpayement
@external
def gettrimestreactuelpayement_ijara(nb:uint256) -> String[8]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].trimestreactuelpayement
@external
def getsemestreactuelpayement_ijara(nb:uint256) -> String[8]:
    return self.Liste_contrat_ijaramontahiyabitamlik[nb].semestreactuelpayement
#Contrat vente
@external
def getcinclientvente(nb:uint256) ->  String[20]:
    return self.Liste_contrat_vente[nb].cinclient
@external
def getreferenceprojetvente(nb:uint256) -> String[200] :
    return self.Liste_contrat_vente[nb].referenceprojet
@external
def getdatecontrat(nb:uint256) -> String[50] :
    return self.Liste_contrat_vente[nb].datecontrat
@external
def get_prixvente(nb:uint256) -> String[20] :
    return self.Liste_contrat_vente[nb].prixvente

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


struct Contrat_Morabaha:
    cinclient :  String[20]
    referenceprojet : String[200] 
    estimationpenalite : uint256
    coutderevien : String[20]
    marge : String[20]
    prixvente : String[20]
    duree_ammortissement : String[50]
    montantchoisi : String[20]
    montant_Mensuelle : String[20]
    montant_trimestriel : String[20]
    montant_semestriel : String[20]
    montant_annuel : String[20]
    assurancetakaful : String[20]
    duree_contrat : String[50]

struct  Contrat_Ijaramontahiyabitamlik:
    cinclient :  String[20]
    referenceprojet : String[200]
    duree_contrat : String[50]
    montant_loyer : String[50]
    date_resuliation : String[50]
    cession_du_bien : String[50]
    typepaiement :  String[50]
    montantpartranche : String[20]
 
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
def modifiercontrat_morabaha_client(nb:uint256,_montantchoisi : String[20],_cinclient: String[20],_referenceprojet : String[200],_estimationpenalite : uint256,_coutderevien : String[20],_marge : String[20],_prixvente : String[20],_duree_ammortissement : String[50],_montant_Mensuelle : String[20],_montant_trimestriel : String[20],_montant_semestriel : String[20],_montant_annuel : String[20],_assurancetakaful : String[20],_duree_contrat : String[50]):
    self.Liste_contrat_morabaha[nb] = Contrat_Morabaha({
        cinclient :_cinclient,
        referenceprojet : _referenceprojet ,
        estimationpenalite : _estimationpenalite,
        coutderevien : _coutderevien,
        marge : _marge,
        prixvente : _prixvente,
        duree_ammortissement : _duree_ammortissement,
        montantchoisi :_montantchoisi,
        montant_Mensuelle : _montant_Mensuelle,
        montant_trimestriel : _montant_trimestriel,
        montant_semestriel : _montant_semestriel,
        montant_annuel : _montant_annuel,
        assurancetakaful : _assurancetakaful,
        duree_contrat : _duree_contrat})
    self.Listeclientengage[self.indexlisteclientengage] = Clientengage({
        cin : _cinclient,
        referenceclient : _referenceprojet,
        typecontract : "Morabah"})

    self.indexlisteclientengage = self.indexlisteclientengage +1
@external
def ajoutercontrat_morabaha_fonds(_referenceprojet : String[200],_estimationpenalite : uint256,_coutderevien : String[20],_marge : String[20],_prixvente : String[20],_duree_ammortissement : String[50],_montant_Mensuelle : String[20],_montant_trimestriel : String[20],_montant_semestriel : String[20],_montant_annuel : String[20],_assurancetakaful : String[20],_duree_contrat : String[50]):
    self.Liste_contrat_morabaha[self.indexListe_contrat_morabaha] = Contrat_Morabaha({
        cinclient : "",
        referenceprojet : _referenceprojet ,
        estimationpenalite : _estimationpenalite,
        coutderevien : _coutderevien,
        marge : _marge,
        prixvente : _prixvente,
        duree_ammortissement : _duree_ammortissement,
        montantchoisi : "",
        montant_Mensuelle : _montant_Mensuelle,
        montant_trimestriel : _montant_trimestriel,
        montant_semestriel : _montant_semestriel,
        montant_annuel : _montant_annuel,
        assurancetakaful : _assurancetakaful,
        duree_contrat : _duree_contrat})

    self.indexListe_contrat_morabaha = self.indexListe_contrat_morabaha +1
@external
def modifiercontratvente_client(_nb : uint256 ,_cinclient : String[20], _referenceprojet : String[200],_datecontrat : String[50],_prixvente : String[20]):
    self.Liste_contrat_vente[_nb] = Contrat_vente({
        cinclient : _cinclient,
        referenceprojet : _referenceprojet ,
        datecontrat : _datecontrat,
        prixvente : _prixvente })
    self.Listeclientengage[self.indexlisteclientengage] = Clientengage({
        cin : _cinclient,
        referenceclient : _referenceprojet,
        typecontract : "Vente"})

    self.indexlisteclientengage = self.indexlisteclientengage +1
@external
def ajoutercontratvente_fonds(_referenceprojet : String[200],_datecontrat : String[50],_prixvente : String[20]):
    self.Liste_contrat_vente[self.indexListe_contrat_vente] = Contrat_vente({
        cinclient : "",
        referenceprojet : _referenceprojet ,
        datecontrat : _datecontrat,
        prixvente : _prixvente })

    self.indexListe_contrat_vente = self.indexListe_contrat_vente +1

@external
def ajouterijaramontahiyabitamlik_fonds(_referenceprojet : String[200],_duree_contrat : String[50],_montant_loyer : String[50],_date_resuliation : String[50],_cession_du_bien : String[50],_typepaiement :  String[50],_montantpartranche : String[20]):
    self.Liste_contrat_ijaramontahiyabitamlik[self.indexliste_contrat_ijaramontahiyabitamlik] = Contrat_Ijaramontahiyabitamlik({
        cinclient : "",
        referenceprojet : _referenceprojet,
        duree_contrat : _duree_contrat,
        montant_loyer : _montant_loyer,
        date_resuliation : _date_resuliation,
        cession_du_bien : _cession_du_bien,
        typepaiement :  _typepaiement,
        montantpartranche : _montantpartranche})

    self.indexliste_contrat_ijaramontahiyabitamlik = self.indexliste_contrat_ijaramontahiyabitamlik +1
@external
def modifierijaramontahiyabitamlik_client(_nb:uint256,_cinclient :  String[20],_referenceprojet : String[200],_duree_contrat : String[50],_montant_loyer : String[50],_date_resuliation : String[50],_cession_du_bien : String[50],_typepaiement :  String[50],_montantpartranche : String[20]):
    self.Liste_contrat_ijaramontahiyabitamlik[_nb] = Contrat_Ijaramontahiyabitamlik({
        cinclient : _cinclient,
        referenceprojet : _referenceprojet,
        duree_contrat : _duree_contrat,
        montant_loyer : _montant_loyer,
        date_resuliation : _date_resuliation,
        cession_du_bien : _cession_du_bien,
        typepaiement :  _typepaiement,
        montantpartranche : _montantpartranche})
    self.Listeclientengage[self.indexlisteclientengage] = Clientengage({
        cin : _cinclient,
        referenceclient : _referenceprojet,
        typecontract : "Ijara"})

    self.indexlisteclientengage = self.indexlisteclientengage +1


@external
def getlisteclientengage() -> uint256 :
    return self.indexlisteclientengage
@external
def getListecontratmorabah()-> uint256:
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
def getmontantchoisi(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].montantchoisi 
@external
def getmontant_Mensuelle(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].montant_Mensuelle
@external
def getmontant_trimestriel(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].montant_trimestriel
@external
def getmontant_annuel(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].montant_annuel
@external
def getmontant_semestriel(nb:uint256) -> String[50]:
    return self.Liste_contrat_morabaha[nb].montant_semestriel
 

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

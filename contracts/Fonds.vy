#pragma line
# @version ^0.2.0
#Contract Fonds

#Informations sur le fonds

email: String[100]
password: String[100]
walletAddress: address
nbprojet : uint256

@external
def __init__():
    self.email = "hiba@hotmail.com"
    self.password = "password"
    self.walletAddress = 0xdb06cfD3920e260FE3538D35AD1eE38fB336c953
    self.nbprojet = 0

struct Projet_infos:
    reference : String[200]
    image : String[200]
    imagedet1 : String[200]
    imagedet2 : String[200]
    imagedet3 : String[200]
    cout_estimation_travaux: String[30]
    delai_execution: uint256
    montant_caution_provisoire: String[30]
    duree_validite_offre: uint256
    mesures_securites_hygiene:String[200]
    reception_provisoire_travaux: String[200]
    reception_definitive:String[200]
    cahier_prestations_techniques: String[200]
    normes_mise_en_oeuvre: String[200]
    localisation:String[1000]
    descriptif:String[6000]
    superficier : String[20]
    type_projet: String[100]
    nb_chambre: uint256
    nb_client: uint256
    terasse : String[20]
    garage : String[20]
    piscine : String[20]
    etage : uint256
    jardin : String[20]
    balcon : String[20]
    mini_hopital : String[20]
    supermarche : String[20]
    hamam : String[20]
    mini_mosque : String[20]
    pharmacie : String[20]

projets: public(HashMap[uint256,Projet_infos])

@external
def ajouterProjet(_nb_client: uint256,_mini_hopital:String[20],_supermarche:String[20],_hamam:String[20],_mini_mosque:String[20],_pharmacie:String[20],_reference : String[200],_image : String[200],_imagedet1 : String[200],_imagedet2 : String[200],_imagedet3 : String[200],_cout_estimation_travaux:String[30],_delai_execution: uint256,_montant_caution_provisoire: String[30],_duree_validite_offre: uint256,_mesures_securites_hygiene:String[200],_reception_provisoire_travaux: String[200],_cahier_prestations_techniques: String[200],_normes_mise_en_oeuvre: String[200],_localisation:String[1000],_descriptif:String[6000],_superficier:String[20],_type_projet: String[100],_nb_chambre: uint256,_terasse : String[20],_garage : String[20],_piscine : String[20],_etage : uint256,_jardin:String[20],_balcon:String[20])-> String[50]:
    existe : String[50] = " "

    self.projets[self.nbprojet] = Projet_infos({
        reference : _reference,
        image : _image,
        imagedet1 : _imagedet1,
        imagedet2 : _imagedet2,
        imagedet3 :  _imagedet3,
        cout_estimation_travaux : _cout_estimation_travaux,
        delai_execution : _delai_execution,
        montant_caution_provisoire : _montant_caution_provisoire,
        duree_validite_offre : _duree_validite_offre,
        mesures_securites_hygiene : _mesures_securites_hygiene,
        reception_provisoire_travaux : _reception_provisoire_travaux,
        reception_definitive : " ",
        cahier_prestations_techniques : _cahier_prestations_techniques,
        normes_mise_en_oeuvre : _normes_mise_en_oeuvre,
        localisation : _localisation,
        descriptif: _descriptif,
        superficier : _superficier,
        type_projet : _type_projet,
        nb_chambre :  _nb_chambre,
        nb_client: _nb_client,
        terasse : _terasse,
        garage : _garage,
        piscine : _piscine,
        etage : _etage,
        jardin : _jardin,
        balcon : _balcon,
        mini_hopital : _mini_hopital,
        supermarche : _supermarche,
        hamam : _hamam,
        mini_mosque : _mini_mosque,
        pharmacie : _pharmacie    
        })
    existe = "Félicitation,vous êtes inscrit"
    self.nbprojet = self.nbprojet+1
    return existe

@external
def authentification(_email:String[100], _password:String[100],_account:address) -> String[100]:
    res:String[100] = "r"
    if self.email == _email:
        res = "emailok"
        if self.password == _password:
            res = "passwordok"
            if self.walletAddress == _account:
                res = "welcome"
            else:
                res = "invalide email ou mot de passe"
    return res

@external
def supprimerprojet(nb : uint256)-> String[50]:
    res: String[50]= ""
    self.projets[nb] = Projet_infos({
        reference : "",
        image : "",
        imagedet1 : "",
        imagedet2 : "",
        imagedet3 :  "",
        cout_estimation_travaux : "",
        delai_execution : 0,
        montant_caution_provisoire : "",
        duree_validite_offre : 0,
        mesures_securites_hygiene : "",
        reception_provisoire_travaux : "",
        reception_definitive : "",
        cahier_prestations_techniques : "",
        normes_mise_en_oeuvre : "",
        localisation : "",
        descriptif: "",
        superficier : "",
        type_projet : "",
        nb_chambre :  0,
        nb_client : 0,
        terasse : "",
        garage : "",
        piscine : "",
        etage : 0 ,
        jardin : "",
        balcon : "" ,
        mini_hopital : "",
        supermarche : "",
        hamam : "",
        mini_mosque : "",
        pharmacie : ""
             
    })
    res = "Projet supprimé "
    return res
@external
def modifierProjet(_nb_client:uint256,_mini_hopital:String[20],_supermarche:String[20],_hamam:String[20],_mini_mosque:String[20],_pharmacie:String[20],_reference : String[200],_image : String[200],_imagedet1 : String[200],_imagedet2 : String[200],_imagedet3 : String[200],_cout_estimation_travaux:String[30],_delai_execution: uint256,_montant_caution_provisoire: String[30],_duree_validite_offre: uint256,_mesures_securites_hygiene:String[200],_reception_provisoire_travaux: String[200],_reception_definitive:String[200],_cahier_prestations_techniques: String[200],_normes_mise_en_oeuvre: String[200],_localisation:String[1000],_descriptif:String[6000],_superficier:String[20],_type_projet: String[100],_nb_chambre: uint256,_terasse : String[20],_garage : String[20],_piscine : String[20],_etage : uint256,_jardin:String[20],_balcon:String[20])-> String[50]:
    existe : String[50] = " "
 
    self.projets[self.nbprojet] = Projet_infos({
        reference : _reference,
        image : _image,
        imagedet1 : _imagedet1,
        imagedet2 : _imagedet2,
        imagedet3 :  _imagedet3,
        cout_estimation_travaux : _cout_estimation_travaux,
        delai_execution : _delai_execution,
        montant_caution_provisoire : _montant_caution_provisoire,
        duree_validite_offre : _duree_validite_offre,
        mesures_securites_hygiene : _mesures_securites_hygiene,
        reception_provisoire_travaux : _reception_provisoire_travaux,
        reception_definitive : _reception_definitive,
        cahier_prestations_techniques : _cahier_prestations_techniques,
        normes_mise_en_oeuvre : _normes_mise_en_oeuvre,
        localisation : _localisation,
        descriptif: _descriptif,
        superficier : _superficier,
        type_projet : _type_projet,
        nb_chambre :  _nb_chambre,
        nb_client : _nb_client,
        terasse : _terasse,
        garage : _garage,
        piscine : _piscine,
        etage : _etage ,
        jardin : _jardin,
        balcon : _balcon,
        mini_hopital : _mini_hopital,
        supermarche : _supermarche,
        hamam : _hamam,
        mini_mosque : _mini_mosque,
        pharmacie : _pharmacie
        })
    existe = "Modification effectuée avec succès"
    return existe
@external
def listeprojet() -> uint256 :
    return self.nbprojet
@external
def getRef(nb:uint256)->String[200]:
    return self.projets[nb].reference

@external
def getCout_estimation_travaux(nb:uint256)->String[30]:
    return self.projets[nb].cout_estimation_travaux

@external
def getDelai_execution(nb:uint256)->uint256:
    return self.projets[nb].delai_execution

@external
def getMontant_caution_provisoire(nb:uint256)->String[30]:
    return self.projets[nb].montant_caution_provisoire 

@external
def getduree_validite_offre(nb:uint256)->uint256:
    return self.projets[nb].duree_validite_offre 

@external
def getmesures_securites_hygiene(nb:uint256)->String[200]:
    return self.projets[nb].mesures_securites_hygiene 

@external
def getreception_provisoire_travaux(nb:uint256)->String[200]:
    return self.projets[nb].reception_provisoire_travaux 
@external
def getreception_definitive(nb:uint256)->String[200]:
    return self.projets[nb].reception_definitive 
@external
def getcahier_prestations_techniques(nb:uint256)->String[200]:
    return self.projets[nb].cahier_prestations_techniques 
@external
def getnormes_mise_en_oeuvre(nb:uint256)->String[200]:
    return self.projets[nb].normes_mise_en_oeuvre 
@external
def getlocalisation(nb:uint256)->String[1000]:
    return self.projets[nb].localisation 
@external
def getsuperficier(nb:uint256)->String[20]:
    return self.projets[nb].superficier 

@external
def gettype_projet(nb:uint256)->String[100]:
    return self.projets[nb].type_projet 
@external
def getnb_chambre(nb:uint256)->uint256:
    return self.projets[nb].nb_chambre 
@external
def getterasse(nb:uint256)->String[20]:
    return self.projets[nb].terasse 
@external
def getgarage(nb:uint256)->String[20]:
    return self.projets[nb].garage 
@external
def getpiscine(nb:uint256)->String[20]:
    return self.projets[nb].piscine 
@external
def getetage(nb:uint256)->uint256:
    return self.projets[nb].etage 
@external
def getimage(nb:uint256)->String[200]:
    return self.projets[nb].image 
@external
def getimagedet1(nb:uint256)->String[200]:
    return self.projets[nb].imagedet1 
@external
def getimagedet2(nb:uint256)->String[200]:
    return self.projets[nb].imagedet2 
@external
def getimagedet3(nb:uint256)->String[200]:
    return self.projets[nb].imagedet3 
@external
def getdescriptif(nb:uint256)->String[6000]:
    return self.projets[nb].descriptif 
@external
def getjardin(nb:uint256)->String[20]:
    return self.projets[nb].jardin 
@external
def getbalcon(nb:uint256)->String[20]:
    return self.projets[nb].balcon 
@external
def getmini_hopital(nb:uint256)->String[20]:
    return self.projets[nb].mini_hopital 
@external
def getsupermarche(nb:uint256)->String[20]:
    return self.projets[nb].supermarche 
@external
def gethamam(nb:uint256)->String[20]:
    return self.projets[nb].hamam 
@external
def getmini_mosque(nb:uint256)->String[20]:
    return self.projets[nb].mini_mosque 
@external
def getpharmacie(nb:uint256)->String[20]:
    return self.projets[nb].pharmacie 

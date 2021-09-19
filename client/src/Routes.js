import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import Home from "./Home";
import Loginpromoteur from './Loginpromoteur';
import InscriptionPromoteur from './InscriptionPromoteur';
import NotFound from "./containers/NotFound";
import Homepromoteur from "./Homepromoteur";
import ProfilePromoteur from "./ProfilePromoteur";
import Loginfonds from "./Loginfonds";
import Profilefonds from "./Profilefonds";
import Homefonds from "./Homefonds";
import listeprojets from "./listeprojets";
import listeclients from "./listeclients";
import listepromoteurs from "./listepromoteurs";
import ajouterprojet from "./ajouterprojet";
import login from "./login";
import Inscription from "./Inscription";
import Loginclient from "./Loginclient";
import Inscriptionclient from "./Inscriptionclient";
import Detailprojet from "./detailprojet"
import Ajoutercandidature from "./Ajoutercandidature"
import ListeCandidature from "./ListeCandidature"
import Listeprojetspromoteur from "./Listeprojetspromoteur"
import Listewishlist from "./Listewishlist"
import Ajouterwishlist from "./Ajouterwishlist"
import Profileclient from "./Profileclient"
import Listewishlistclient from "./Listewishlistclient"
import Confirmerclient from "./Confirmerclient"
import ajoutercontratmorabaha from "./ajoutercontratmorabaha"
import ajoutercontratijara from "./ajoutercontratijara"
import ajoutercontratvente from "./ajoutercontratvente"
import ajoutercontratistisnaa from "./ajoutercontratistisnaa"
import ajouteravantcontrat from "./ajouteravantcontrat"
import ListeContratsmorabaha from "./ListeContratsmorabaha"
import listecontratijara from "./listecontratijara"
import listecontratvente from "./listecontratvente"
import listecontratistisnaa from "./listecontratistisnaa" 
import listecontrats from "./listecontrats"
import clientajoutcontratsmorabaha from "./clientajoutcontratsmorabaha"
import clientajoutcontratijara from "./clientajoutcontratijara"
import clientajoutcontratvente from "./clientajoutcontratvente"
import mesprojetsclients from "./mesprojetsclients"
import test from "./test"
import Modifierclientinfos from "./Modifierclientinfos"
import Modifierclientimage from "./Modifierclientimage"
import notificationFonds from "./notificationFonds"
import fondsmodifiercontratijara from "./fondsmodifiercontratijara"
import fondsmodifiercontratmourabaha from "./fondsmodifiercontratmourabaha"
import fondsmodifiercontratvente from "./fondsmodifiercontratvente"
import fondsmodifiercontratistisnaa from "./fondsmodifiercontratistisnaa"
import notificationPromoteur from "./notificationPromoteur"
import notificationClient from "./notificationClient"
import engagementdefinitif_promo from "./engagementdefinitif_promo"
import listepromoteurengageme from "./listepromoteurengageme"
import promoteurcandidature from "./promoteurcandidature"
import listeprojetsencours from "./listeprojetsencours"
import listetotalprojets from "./listetotalprojets"
import listepromoteurtotal from "./listepromoteurtotal"
import listeclientstotal from "./listeclientstotal"
import listeclientsengage from "./listeclientsengage"
import Payementclient from "./Payementclient"
import listepayementclient from "./listepayementclient"
import Listeclient_projet from "./Listeclient_projet"
import historiquepayementclient from "./historiquepayementclient"
import PagePayementclient_Morabaha from "./PagePayementclient_Morabaha"
import PagePayementclient_ijara from "./PagePayementclient_ijara"
export default ({ childProps }) =>
  <Switch>
    { /* routes */ }
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={login} props={childProps} />
    <AppliedRoute path="/Inscription" exact component={Inscription} props={childProps} />
    <AppliedRoute path="/detailprojet" exact component={Detailprojet} props={childProps} />
    <AppliedRoute path="/test" exact component={test} props={childProps} />

    { /* routes promoteur*/ }
    <AppliedRoute path="/Homepromoteur" exact component={Homepromoteur} props={childProps} />
    <AppliedRoute path="/Loginpromoteur" exact component={Loginpromoteur} props={childProps} />
    <AppliedRoute path="/InscriptionPromoteur" exact component={InscriptionPromoteur} props={childProps} />
    <AppliedRoute path="/ProfilePromoteur" exact component={ProfilePromoteur} props={childProps} />
    <AppliedRoute path="/Ajoutercandidature" exact component={Ajoutercandidature} props={childProps} />
    <AppliedRoute path="/Listewishlist" exact component={Listewishlist} props={childProps} />
    <AppliedRoute path="/Listeprojetspromoteur" exact component={Listeprojetspromoteur} props={childProps} />
    <AppliedRoute path="/Ajouterwishlist" exact component={Ajouterwishlist} props={childProps} />
    <AppliedRoute path="/notificationPromoteur" exact component={notificationPromoteur} props={childProps} />
    <AppliedRoute path="/promoteurcandidature" exact component={promoteurcandidature} props={childProps} />
    
    
    { /* routes fonds*/ }
    <AppliedRoute path="/Homefonds" exact component={Homefonds} props={childProps} />
    <AppliedRoute path="/Loginfonds" exact component={Loginfonds} props={childProps} />
    <AppliedRoute path="/Profilefonds" exact component={Profilefonds} props={childProps} />
    <AppliedRoute path="/listeprojets" exact component={listeprojets} props={childProps} />
    <AppliedRoute path="/listeclients" exact component={listeclients} props={childProps} />
    <AppliedRoute path="/listepromoteurs" exact component={listepromoteurs} props={childProps} />
    <AppliedRoute path="/ajouterprojet" exact component={ajouterprojet} props={childProps} />
    <AppliedRoute path="/ajouteravantcontrat" exact component={ajouteravantcontrat} props={childProps} />
    <AppliedRoute path="/ajoutercontratmorabaha" exact component={ajoutercontratmorabaha} props={childProps} />
    <AppliedRoute path="/ajoutercontratijara" exact component={ajoutercontratijara} props={childProps} />
    <AppliedRoute path="/ajoutercontratvente" exact component={ajoutercontratvente} props={childProps} />
    <AppliedRoute path="/ajoutercontratistisnaa" exact component={ajoutercontratistisnaa} props={childProps} />
    <AppliedRoute path="/ListeContratsmorabaha" exact component={ListeContratsmorabaha} props={childProps} />
    <AppliedRoute path="/listecontratijara" exact component={listecontratijara} props={childProps} />
    <AppliedRoute path="/listecontratvente" exact component={listecontratvente} props={childProps} />
    <AppliedRoute path="/listecontratistisnaa" exact component={listecontratistisnaa} props={childProps} />
    <AppliedRoute path="/listecontrats" exact component={listecontrats} props={childProps} />
    <AppliedRoute path="/notificationFonds" exact component={notificationFonds} props={childProps} />
    <AppliedRoute path="/fondsmodifiercontratijara" exact component={fondsmodifiercontratijara} props={childProps} />
    <AppliedRoute path="/fondsmodifiercontratmourabaha" exact component={fondsmodifiercontratmourabaha} props={childProps} />
    <AppliedRoute path="/fondsmodifiercontratvente" exact component={fondsmodifiercontratvente} props={childProps} />
    <AppliedRoute path="/fondsmodifiercontratistisnaa" exact component={fondsmodifiercontratistisnaa} props={childProps} />
    <AppliedRoute path="/engagementdefinitif_promo" exact component={engagementdefinitif_promo} props={childProps} />
    <AppliedRoute path="/listepromoteurengageme" exact component={listepromoteurengageme} props={childProps} />
    <AppliedRoute path="/ListeCandidature" exact component={ListeCandidature} props={childProps} />
    <AppliedRoute path="/listeprojetsencours" exact component={listeprojetsencours} props={childProps} />
    <AppliedRoute path="/listetotalprojets" exact component={listetotalprojets} props={childProps} />
    <AppliedRoute path="/listepromoteurtotal" exact component={listepromoteurtotal} props={childProps} />
    <AppliedRoute path="/listeclientstotal" exact component={listeclientstotal} props={childProps} />
    <AppliedRoute path="/listeclientsengage" exact component={listeclientsengage} props={childProps} />
    { /* routes client*/ }
    <AppliedRoute path="/Loginclient" exact component={Loginclient} props={childProps} />
    <AppliedRoute path="/Inscriptionclient" exact component={Inscriptionclient} props={childProps} />
    <AppliedRoute path="/Profileclient" exact component={Profileclient} props={childProps} />
    <AppliedRoute path="/Listewishlistclient" exact component={Listewishlistclient} props={childProps} />
    <AppliedRoute path="/Confirmerclient" exact component={Confirmerclient} props={childProps} />
    <AppliedRoute path="/clientajoutcontratsmorabaha" exact component={clientajoutcontratsmorabaha} props={childProps} />
    <AppliedRoute path="/clientajoutcontratijara" exact component={clientajoutcontratijara} props={childProps} />
    <AppliedRoute path="/clientajoutcontratvente" exact component={clientajoutcontratvente} props={childProps} />
    <AppliedRoute path="/mesprojetsclients" exact component={mesprojetsclients} props={childProps} />
    <AppliedRoute path="/Modifierclientinfos" exact component={Modifierclientinfos} props={childProps} />
    <AppliedRoute path="/Modifierclientimage" exact component={Modifierclientimage} props={childProps} />
    <AppliedRoute path="/notificationClient" exact component={notificationClient} props={childProps} />
    <AppliedRoute path="/Payementclient" exact component={Payementclient} props={childProps} />
    <AppliedRoute path="/listepayementclient" exact component={listepayementclient} props={childProps} />
    <AppliedRoute path="/Listeclient_projet" exact component={Listeclient_projet} props={childProps} />
    <AppliedRoute path="/historiquepayementclient" exact component={historiquepayementclient} props={childProps} />
    <AppliedRoute path="/PagePayementclient_Morabaha" exact component={PagePayementclient_Morabaha} props={childProps} />
    <AppliedRoute path="/PagePayementclient_ijara" exact component={PagePayementclient_ijara} props={childProps} />

    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>
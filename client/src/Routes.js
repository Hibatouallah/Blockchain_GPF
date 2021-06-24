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
export default ({ childProps }) =>
  <Switch>
    { /* routes */ }
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={login} props={childProps} />
    <AppliedRoute path="/Inscription" exact component={Inscription} props={childProps} />
    <AppliedRoute path="/detailprojet" exact component={Detailprojet} props={childProps} />

    { /* routes promoteur*/ }
    <AppliedRoute path="/Homepromoteur" exact component={Homepromoteur} props={childProps} />
    <AppliedRoute path="/Loginpromoteur" exact component={Loginpromoteur} props={childProps} />
    <AppliedRoute path="/InscriptionPromoteur" exact component={InscriptionPromoteur} props={childProps} />
    <AppliedRoute path="/ProfilePromoteur" exact component={ProfilePromoteur} props={childProps} />
    <AppliedRoute path="/Ajoutercandidature" exact component={Ajoutercandidature} props={childProps} />
    <AppliedRoute path="/ListeCandidature" exact component={ListeCandidature} props={childProps} />
    <AppliedRoute path="/Listewishlist" exact component={Listewishlist} props={childProps} />
    <AppliedRoute path="/Listeprojetspromoteur" exact component={Listeprojetspromoteur} props={childProps} />
    { /* routes fonds*/ }
    <AppliedRoute path="/Homefonds" exact component={Homefonds} props={childProps} />
    <AppliedRoute path="/Loginfonds" exact component={Loginfonds} props={childProps} />
    <AppliedRoute path="/Profilefonds" exact component={Profilefonds} props={childProps} />
    <AppliedRoute path="/listeprojets" exact component={listeprojets} props={childProps} />
    <AppliedRoute path="/listeclients" exact component={listeclients} props={childProps} />
    <AppliedRoute path="/listepromoteurs" exact component={listepromoteurs} props={childProps} />
    <AppliedRoute path="/ajouterprojet" exact component={ajouterprojet} props={childProps} />

    { /* routes client*/ }
    <AppliedRoute path="/Loginclient" exact component={Loginclient} props={childProps} />
    <AppliedRoute path="/Inscriptionclient" exact component={Inscriptionclient} props={childProps} />


    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>
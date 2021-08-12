import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import contrat from './img/contrat.png';


class listecontrats extends Component {

    handlemorabaha = async event => {
        this.props.history.push("/ListeContratsmorabaha");
      }
    handleiajarat = async event => {
        this.props.history.push("/listecontratijara");
    }
    handlevente = async event => {
        this.props.history.push("/listecontratvente");
    }
    handleistisnaa = async event => {
        this.props.history.push("/listecontratistisnaa");
    }
    render() {
        return (
            <div className="Login">
                 {localStorage.getItem('isfonds') != 'true' &&
             this.props.history.push("/Loginfonds")
            }
                <center>
          <Container>
            <Row className="justify-content-md-center">
                <Col xs={6} md={4}>
                    <Image onClick={this.handlemorabaha} src={contrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mourabaha</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handlevente}src={contrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Vente</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handleiajarat}src={contrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ijara Montahiya Bitamlik</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handleistisnaa}src={contrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Istissnaa</h3>
                </Col>
                
            </Row>
        </Container>
        </center>
        </div>
       )
    }
}

export default listecontrats

import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import contratchoisiclient from './img/contratchoisiclient.png';


class Confirmerclient extends Component {

    handlemorabaha = async event => {
        this.props.history.push("/clientajoutcontratsmorabaha");
      }
    handleiajarat = async event => {
        this.props.history.push("/clientajoutcontratijara");
    }
    handlevente = async event => {
        this.props.history.push("/clientajoutcontratvente");
    }

    render() {
        
        return (
            <div className="Login">
                <center>
                <h3>Choisir le type de contrat :</h3>
                <br/><br/>
          <Container>
            <Row className="justify-content-md-center">
                <Col xs={6} md={4}>
                    <Image onClick={this.handlemorabaha} src={contratchoisiclient} />
                    <br/><br/><br/>
                    <h3>&nbsp;Contrat Mourabaha</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handlevente}src={contratchoisiclient} />
                    <br/><br/><br/>
                    <h3>&nbsp;Contrat Vente</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handleiajarat}src={contratchoisiclient} />
                    <br/><br/><br/>
                    <h3>&nbsp;Contrat Ijara Montahiya Bitamlik</h3>
                </Col>
            </Row>
        </Container>
        </center>
        </div>
       )
    }
}

export default Confirmerclient

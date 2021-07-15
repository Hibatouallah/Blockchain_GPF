import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import addcontrat from './img/addcontrat.png';


class ajouteravantcontrat extends Component {

    handlemorabaha = async event => {
        this.props.history.push("/ajoutercontratmorabaha");
      }
    handleiajarat = async event => {
        this.props.history.push("/ajoutercontratijara");
    }
    handlevente = async event => {
        this.props.history.push("/ajoutercontratvente");
    }
    handleistisnaa = async event => {
        this.props.history.push("/ajoutercontratistisnaa");
    }
    render() {
        

        return (
            <div className="Login">
                <center>
          <Container>
            <Row className="justify-content-md-center">
                <Col xs={6} md={4}>
                    <Image onClick={this.handlemorabaha} src={addcontrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Mourabaha</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handlevente}src={addcontrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Vente</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handleiajarat}src={addcontrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ijara Montahiya Bitamlik</h3>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handleistisnaa}src={addcontrat} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Istissnaa</h3>
                </Col>
                
            </Row>
        </Container>
        </center>
        </div>
       )
    }
}

export default ajouteravantcontrat

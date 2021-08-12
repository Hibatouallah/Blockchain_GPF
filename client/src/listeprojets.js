import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import House1 from './img/house1.png';
import House2 from './img/house2.png';


class listeprojets extends Component {

    handlelisteprojetsencours= async event => {
        this.props.history.push("/listeprojetsencours");
    }
    handlelistetotalprojets = async event => {
        this.props.history.push("/listetotalprojets");
    }
    render() {
        return (
            <div className="Login">
          <Container>
              <center>
            <Row className="justify-content-md-center">
            <Col xs={6} md={4}>
                    <Image onClick={this.handlelisteprojetsencours} src={House2} roundedCircle />
                    <br/><br/><br/>
                    <h4>les projets en cours</h4>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handlelistetotalprojets}src={House2} roundedCircle />
                    <br/><br/><br/>
                    <h4>&nbsp;Tous les projets</h4>
                </Col>
                
            </Row></center>
            </Container>
        </div>
       )
    }
}

export default listeprojets



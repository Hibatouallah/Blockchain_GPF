import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import LISTE1 from './img/liste1.png';
import LISTE2 from './img/liste2.png';


class listepromoteurs extends Component {

    handlecandidatures = async event => {
        this.props.history.push("/ListeCandidature");
      }
      handlepromoteursengages = async event => {
        this.props.history.push("/listepromoteurengageme");
      }
    render() {
        return (
            <div className="Login">
          <Container>
              <center>
            <Row className="justify-content-md-center">
            <Col xs={6} md={4}>
                    <Image onClick={this.handlecandidatures} src={LISTE1} roundedCircle />
                    <br/><br/><br/>
                    <h4>les candidatures des promoteurs</h4>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handlepromoteursengages}src={LISTE2} roundedCircle />
                    <br/><br/><br/>
                    <h4>&nbsp;les promoteurs engagés</h4>
                </Col>
                
            </Row></center>
            </Container>
        </div>
       )
    }
}

export default listepromoteurs


import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import LISTE1 from './img/liste1.png';
import LISTE2 from './img/liste2.png';


class listeclients extends Component {


      handleclientsengages = async event => {
        this.props.history.push("/listeclientsengage");
      }
      handleclientstotal = async event => {
        this.props.history.push("/listeclientstotal");
      }
    render() {
        return (
            <div className="Login">
          <Container>
              <center>
            <Row className="justify-content-md-center">
            
                <Col xs={6} md={4}>
                    <Image onClick={this.handleclientsengages}src={LISTE2} roundedCircle />
                    <br/><br/><br/>
                    <h4>&nbsp;les clients engagés</h4>
                </Col>
                <Col xs={6} md={4}>
                    <Image onClick={this.handleclientstotal}src={LISTE1} roundedCircle />
                    <br/><br/><br/>
                    <h4>&nbsp;Tous les clients </h4>
                </Col>
                
            </Row></center>
            </Container>
        </div>
       )
    }
}

export default listeclients


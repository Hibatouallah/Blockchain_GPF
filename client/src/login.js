import React, {Component} from "react"
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import { Container,Row,Image,Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import promoteuricon from './img/promoteuricon.png';
import clienticon from './img/clienticon.png';


class login extends Component {

    handlepomoteur = async event => {
        localStorage.setItem('userpromo', 'true');
        localStorage.setItem('nouser',false);
        this.props.history.push("/Loginpromoteur");
      }
    handleclient = async event => {
        localStorage.setItem('userclient', 'true');
        localStorage.setItem('nouser',false);
        this.props.history.push("/Loginclient");
      }
    render() {
        

        return (
            <div className="Login">
          <Container>
            <Row className="justify-content-md-center">
                <Col xs lg="2">
                    <Image onClick={this.handlepomoteur} src={promoteuricon} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Promoteur</h3>
                </Col>
                <Col xs lg="2"></Col>
                <Col xs lg="2">
                    <Image onClick={this.handleclient}src={clienticon} roundedCircle />
                    <br/><br/><br/>
                    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Client</h3>
                </Col>
                
            </Row>
        </Container>
        </div>
       )
    }
}

export default login

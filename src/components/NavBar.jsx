
import React from 'react';
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';
import '../style/NavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import Logo from "../assets/images/logo.png";
import axios from "axios";
import { urlBase } from '../settings/urlbase';


export const NavBar = () => {

    const cookies = new Cookies();
    const navigate = useNavigate();
  
    const cerrarSession = async ()=>{
      try {
         await axios.get(`${urlBase.apiUrl}/users/Logout`);
       
        cookies.remove('id', {path: '/'});
        cookies.remove('firstName', {path: '/'});
        cookies.remove('lastName', {path: '/'});
        cookies.remove('userName', {path: '/'});
        cookies.remove('token', {path: '/'});
        cookies.remove('userType', {path: '/'});
    
        navigate('/');
      } catch (error) {
        console.error('Error al hacer la petición POST:', error);
      }
     
    }
  
    
    useEffect(()=> {
      if (!cookies.get('id')) {
        navigate('/');
      }
  
    }, [cookies.id, navigate])
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home"> <img className="logo" src={Logo} alt="logo"/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
           {cookies.get('userType') === 1 && (
              <>
                <Nav.Link href="/menu">Menu</Nav.Link>
                <Nav.Link href="/list">Vehiculos</Nav.Link>
                <Nav.Link href="/clients">Clientes</Nav.Link>
                <Nav className="ms-auto">
                  <NavDropdown title="Maestras">
                    <NavDropdown.Item href="/brands">Marcas</NavDropdown.Item>
                    <NavDropdown.Item href="/fases">Fases</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
            <Nav className="ms-auto user-nav">
                <NavDropdown title={ cookies.get('userName') } id='section-user'>
                <NavDropdown.Item href="/register">Registrar</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item  onClick={()=>cerrarSession()}>Carrar sesion </NavDropdown.Item>
                </NavDropdown>
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

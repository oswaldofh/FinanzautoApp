import { useEffect, useState } from "react";
import React  from 'react'
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';
import { Col, Form, Row, Container, Modal, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Menu.css';

import ImageInventario from "../assets/images/list.jpeg";
import ImageCrear from "../assets/images/crear.png";
import ImageModificar from "../assets/images/modificar.png";
import { NavBar } from "../components/NavBar";
import { CardMenu } from "../components/CardMenu";
import { urlBase } from '../settings/urlbase';

const Menu = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [inputPlate, setInputPlate] = useState("");
  
  const handleSubmit = async (event) => {

    event.preventDefault();

    try {
      const response = await axios.get(`${urlBase.apiUrl}/vehicles/${inputPlate}`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      const { data, status } = response

       if (status === 200) {
        setAlert(false);
        setShow(false);
        navigate(`/edit/${data.id}`);
      }
    } catch (error) {
      setAlert(true);
      setShow(true);
      console.error('Error de inicio de sesión:', error);
    }
    
  };
  
  useEffect(()=> {
    if (!cookies.get('id')) {
      navigate('/');
    }

  }, [cookies.id, navigate])


  return (
    <>
    <NavBar/>
      <Container className='mt-5 container-form'>
        <Row>
          <Col sm={4}>
            <CardMenu 
              title="Inventario" 
              text="Puedes visualizar todos los vehiclus registrados en nustra plataforma" 
              image={ImageInventario}
              route = "/list"
              button = "Ver inventario"
            />
          </Col>
          <Col sm={4}>
            <CardMenu 
              title="Crear vehiculo"
              text="Se pueden agregar los nuevos vehiculos al sistema para que esten visibles para nuestros clientes" 
              image={ImageCrear}
              route = "/create"
              button = "Crear"
            />
            </Col>
          <Col sm={4}>
            <Card style={{ width: '25rem', height: '28rm' }}>
              <Card.Img variant="top" src={ ImageModificar } />
              <Card.Body>
                <Card.Title>Editar vehiculo</Card.Title>
                <Card.Text>
                  Se pueden editar la información de los vehiculos, y realizar las configuraciones necesaria
                </Card.Text>
                  <Button variant="success" onClick={handleShow}>Gestionar</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton> 
          <Modal.Title>Buscar</Modal.Title>
        </Modal.Header>
        {alert ? 
          (<Alert className="mb-2" variant="danger" onClose={() => setAlert(false)} dismissible>
              No exixte un vehiculo con esa plaaca
            </Alert>
          ) : (
          <div />
        )}
        <Form className="shadow p-4 bg-white rounded" >
          <Modal.Body>
            <Form.Group className="mb-2" controlId="username">
              <Form.Label>Digite una placa</Form.Label>
              <Form.Control
                type="text"
                value={ inputPlate }
                onChange={(e) => setInputPlate(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={ handleClose }>Cancelar</Button>
              <Button variant="primary" onClick={ handleSubmit } >Buscar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
export default Menu;

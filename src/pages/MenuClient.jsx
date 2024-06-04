
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
 import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Menu.css';
import Swal from 'sweetalert2';
import { NavBar } from "../components/NavBar";
import { urlBase } from '../settings/urlbase';
import { CardVehiculo } from "../components/CardVehiculo";


export const MenuClient = () => {
  const cookies = new Cookies();
  
  const [vehicles, setVehicles] = useState([]);
  const [inputPlate, setInputPlate] = useState("");

  const getAll = async ()=>{
    try {
      const response = await axios.get(`${urlBase.apiUrl}/vehicles`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      const { data } = response;
      setVehicles(data);

    } catch (error) {
      console.error('Error al hacer la petición POST:', error);
      throw error;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${urlBase.apiUrl}/vehicles/${inputPlate}`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      const { data } = response
      console.log('datos de consulta', response);


      if (data !== null) {
        const idSearch = vehicles.filter(item => {
          return item.plate === data.plate;
        });
        setVehicles(idSearch);
      }
    } catch (error) {
      const { status, statusText } = error.response;
      if(status ===  404){
        Swal.fire(`No se encontro un vehiculo con la placa  ${ inputPlate }`);
      }else{
        Swal.fire(statusText);
      }
    }
  };

  useEffect(()=> {
    const fetchData = async () => {
      await getAll();
    };
    
    fetchData();

  }, [])

  return (
    <>
    <NavBar />
      <Container className='mt-5 container-form menu-cliente'>
        <Row className="mb-4">
          <Form >
            <Row style={{ float: 'inline-end' }}>
              <Col xs="auto">
                <Form.Control
                  type="text"
                  placeholder="ingresa la placa"
                  className="mr-sm-2 input-search"
                  value={ inputPlate }
                  onChange={(e) => setInputPlate(e.target.value)}
                  required
                />
              </Col>
              <Col xs="auto">
                <Button variant="primary" onClick={ handleSubmit } >Buscar</Button>
              </Col>
            </Row>
          </Form>
        </Row>

        { vehicles.length > 0 ? (
        <Row className="justify-content-center">
        
            {vehicles.map((item, index) => (
              <Col sm={4} key={index} className= "shadow p-1 bg-white rounded mb-2 mx-2">
                {item.images && item.images.length > 0 && <CardVehiculo images={item.images} id={item.id }/>}
              </Col>
            ))}
          
        </Row>
        ) : (
          <h4>No hay datos de marcas para mostrar.</h4>
        )}
      </Container>
    </>
  )
}

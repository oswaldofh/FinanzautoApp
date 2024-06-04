
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';
import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { NavBar } from "../components/NavBar";
import Cookies from "universal-cookie";


export const ListClient = () => {

  const cookies = new Cookies();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);;

  const getAll = async ()=>{
    try {
      const { data } = await axios.get(`${urlBase.apiUrl}/clients`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      setClients(data);

    } catch (error) {
      console.error('Error al hacer la petición POST:', error);
      throw error;
    }
  }

 
  useEffect(()=> {
    const fetchData = async () => {
      await getAll();
    };
    
    fetchData();

  }, [])
  const volver = ()=>{
    navigate('/menu');
}

  return (
    <>
    <NavBar/>
    <Container className='mt-5'>
      <Col>
        <Button color="secondary" className="mt-3" onClick={volver}>Volver</Button>
        <h4 className="mb-4">Clientes</h4>
      </Col>
      <Row className="shadow p-4 bg-white rounded">
      { clients.length > 0 ? (
        <Col sm={12}>
          <Table bordered striped hover>
            <thead  bg="primary">
              <tr>
                <th>Nombre</th>
                <th>Documento</th>
                <th>Celular</th>
                <th>Correo</th>
                <th>Vehiculo</th>
                <th>Precio</th>
                <th>Modelo</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((item) => (
                <tr key={item.id}>
                  <td>{item.fullName}</td>
                  <td>{item.document}</td>
                  <td>{item.cellPhone}</td>
                  <td>{item.email}</td>
                  <td>{item.vehicle.plate}</td>
                  <td>{item.vehicle.price}</td>
                  <td>{item.vehicle.year}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        ) : (
          <h4>No hay datos de marcas para mostrar.</h4>
        )}
      </Row>
   </Container>
   </>
  )
}

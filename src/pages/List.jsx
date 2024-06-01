
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import Swal from 'sweetalert2';

import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { Link } from 'react-router-dom';

const List = () => {
  const [cities, setCities] = useState([]);

  const getAll = async ()=>{
    try {
      const response = await axios.get(`${urlBase.apiUrl}/cities`);
  
      setCities(response.data);

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

  const eliminar = (id)=> {

    Swal.fire({
      title: "Estas seguro?",
      text: "Eliminar registro",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!"
    }).then( async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(`${urlBase.apiUrl}/cities/${id}`);
         const {data} = response;
        console.error('respuesta', data);
        if (data.isSuccess) {
          await getAll();
        }
      }
    });
  }

  return (
    <Container className='mt-5'>
      <Row>
        <Col sm={{size:8, offset:2}}>
          <h4>Lita de registros</h4>
          <hr/>
          <Link className="btn btn-success mb-3" to="/create">Nuevo registro</Link>
          
          <Table bordered>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                  <Link className="btn btn-primary me-2" to={`/edit/${item.id}`}>Editar</Link>
                  <Button className="btn btn-danger" onClick={()=> {eliminar(item.id)}}>
                    Eliminar
                  </Button>

                  </td>
                </tr>
              ))}
            </tbody>

          </Table>
        </Col>
      </Row>
   </Container>
  )
}
export default List;

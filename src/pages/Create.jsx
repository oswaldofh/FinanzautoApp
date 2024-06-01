import React, { useState } from "react";
import { Form, Button, Alert, Container, Row, Col, } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import Swal from 'sweetalert2';

import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Create = () => {

  const navigate = useNavigate();

  const create = async ( name ) => {

    try {
      const response = await axios.post(`${urlBase.apiUrl}/cities`, {
        name: name,
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al hacer la petición POST:', error);
      throw error;
    }
  };

  const [inputName, setInputName] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);


    try {
      const data = await create(inputName);

      let { isSuccess } = data;
      if (isSuccess) {
        

        navigate('/list');
      }
      console.log('Respuesta de guardar:', data);
      setLoading(false);
    } catch (error) {
      setShow(true);
      //console.error('Error de inicio de sesión:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el registro",
        icon: "warning"
      });
    }
    
  };

  const volver = ()=>{
    navigate('/');
  }

  return (
    <Container className='mt-5'>
    <Row>
      <Col sm={{size:8, offset:2}}>
        <h4>Nuevo Registro</h4>
        <hr/>
        <Button color="secondary" className="mb-4" onClick={volver}>Volver</Button>
        <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            No se guardo el registro.
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Ciudad</Form.Label>
          <Form.Control
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            required
          />
        </Form.Group>
        
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Guardar
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Guardando...
          </Button>
        )}
       
      </Form>
      </Col>
    </Row>
   </Container>
    
  );
};

export default Create;

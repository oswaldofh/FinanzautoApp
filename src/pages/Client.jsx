import React, { useState } from "react";
import { Form, Button, Container, Row, Col, } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import '../style/Create.css'
import Swal from 'sweetalert2';
import Cookies from "universal-cookie";

import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from "../components/NavBar";

export const Client = () => {
    const { id } = useParams();
    const cookies = new Cookies();

    const formDataInitial = {
        fullName: "",
        document: "",
        vehicleId: id,
        cellPhone: "",
        email: "",
    };
    const navigate = useNavigate();
    const [formData, setFormData] = useState(formDataInitial);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value
        });
    };

    const create = async ( form ) => {
        try {
          const response = await axios.post(`${urlBase.apiUrl}/clients`, form,
          { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
          );
      
          return response.data;
        } catch (error) {
          console.error('Error al hacer la petición POST:', error);
          throw error;
        }
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        setLoading(true);
    
        try {

          const { statusCode } = await create(formData);
    
            if (statusCode === 201) {

                Swal.fire({
                    title: "Gracias por su compra",
                    text: "Pronto un asesor se pondra en contacto con usted...",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Cerrar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/menuClient');
                    }
                });
            
            }
          
        } catch (error) {
    
          Swal.fire({
            title: "Error",
            text: "No se pudo guardar el registro",
            icon: "warning"
          });
        }
        
    };

    const volver = ()=>{
        navigate(`/viewVehicle/${id}`);
    }
    

  return (
    <>
    <NavBar/> 
    <Container className='mt-5 container-form'>
        <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
            <Col sm={12} className="mt-5">
            <h4 className="mb-5">Por favor digita tus datos</h4>
            </Col>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                </Col>
            
                <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control
                        type="text"
                        name="document"
                        value={formData.document}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Celular</Form.Label>
                    <Form.Control
                        type="text"
                        name="cellPhone"
                        value={formData.cellPhone}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                </Col>
            
                <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                </Col>
            </Row>
            {!loading ? (
                <Row className="row-button">
                <Col sm={6}>
                    <Button variant="danger"  onClick={volver}>Cancelar</Button>
                </Col>
                <Col sm={6}>
                    <Button variant="success" type="submit">Guardar</Button>
                </Col>
            </Row>
                
            ) : (
                <Button variant="success" type="submit" disabled>
                Guardando...
                </Button>
            )}
        </Form>
    </Container>
   </>
  )
}

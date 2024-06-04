import React, { useState } from "react";
import { Form, Button, Container, Row, Col, } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import '../style/Create.css'
import Swal from 'sweetalert2';
import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


export const Register = () => {;

    const formDataInitial = {
        email: "",
        firstName: "",
        lastName: "",
        document: "",
        password: "",
        passwordConfirm: "",
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

    const register = async ( form ) => {
        try {
             var response = await axios.post(`${urlBase.apiUrl}/users/CreateUser`, form);
             return response
        } catch (error) {
          console.error('Error al hacer la petición POST:', error);
        }
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        setLoading(true);
    
        try {

          const { statusCode } = await register(formData);
            if (statusCode === 201) {
                setLoading(false);

                Swal.fire({
                    title: "Creado",
                    text: `Usuario creado correctamente... usuario de ingreso es ${formData.email}`,
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Cerrar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login');
                    }
                });
            }
          
        } catch (error) {
            setLoading(false);
          Swal.fire({
            title: "Error",
            text: "No se pudo crear el usuario",
            icon: "warning"
          });
        }
    };
    
    const volver = ()=>{
        navigate('/login'); 
    }

  return (
     <Container className='mt-5 container-form'>
        <Row>
            <Col sm={12}>
                <h4 className="mb-5">Registro de usuario</h4>
            </Col>
        </Row>
        <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
            <Row>
                <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                </Col>
                <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                
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
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    </Form.Group>
                </Col>
            
                <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label>Confirmar contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="passwordConfirm"
                        value={formData.passwordConfirm}
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
                        <Button variant="success" type="submit">Registar</Button>
                    </Col>
               </Row>
            ) : (
                <Button variant="success" type="submit" disabled>
                Guardando...
                </Button>
            )}
        </Form>
   </Container>

  )
}

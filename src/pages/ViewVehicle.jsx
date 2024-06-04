import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { urlBase } from '../settings/urlbase';
import axios from "axios";
import Swal from 'sweetalert2';
import { Carrusel } from "../components/Carrusel";
import { NavBar } from "../components/NavBar";
import Cookies from "universal-cookie";

export const ViewVehicle = () => {
    const cookies = new Cookies();
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState("");

    const getRegister = async ()=>{
        try {
          const { data } = await axios.get(`${urlBase.apiUrl}/vehicles/${id}`,
          { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
          );
          setVehicle(data)

        } catch (error) {
          console.error('Error al consultar el registro con id', error);
          throw error;
        }
    }

    useEffect(()=> {
        const fetchData = async () => {
          await getRegister();
        };
        fetchData();
    }, [])

    const showFormClient =  () => {
        if (id) {
            navigate(`/client/${id}`);
        }else{
            Swal.fire("No se encontro un id de vehiculo");
        }
    };
    const volver = ()=>{
        navigate('/menuClient');
      }

  return (
    <>
    <NavBar/>
        <Row className="view-vehicle">
            <Col sm={12} className="mt-4">
                <h4>Información del vehiculo</h4>
            </Col>
            
            <Col sm={7}>
                <Container className='mt-5 container-form'>
                    <Row className="shadow p-4 bg-white rounded mt-4">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Card style={{ float: 'right', border: 'none'}} className='mb-3'>
                            {vehicle.images && vehicle.images.length > 0 && <Carrusel images = { vehicle.images }/>}
                        </Card>
                        </div>
                    </Row>
                </Container>
            </Col>
            <Col sm={5}>
                <Container className='mt-5 container-form'>
                    <Row className="shadow p-4 bg-white rounded mt-4">
                        <label>{vehicle.line}</label>
                        <label>{vehicle.year}</label>
                        <Row className="shadow p-4 bg-white rounded mt-4 mb-4">
                            <label> Placa: {vehicle.plate}</label>
                            <label>Color: {vehicle.color}</label>
                            <label>Marca: {vehicle.nameBrand}</label>
                            <label>Kilometros: {vehicle.mileage}</label>
                            <label>Precio: {vehicle.price}</label>
                            <label>Observación: {vehicle.observation}</label>
                        </Row>
                    
                        <Row className="row-button">
                            <Col sm={6}>
                                <Button variant="danger"  onClick={volver}>Cancelar</Button>
                            </Col>
                            <Col sm={6}>
                                <Button variant="primary"  onClick={ showFormClient }>Reservar</Button>
                            </Col>
                        </Row>
                    </Row>
                </Container>
            </Col>
            
        </Row>
    </>
  )
}

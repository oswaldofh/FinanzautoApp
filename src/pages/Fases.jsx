import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import { useNavigate } from 'react-router-dom';
import { urlBase } from '../settings/urlbase';
import axios from "axios";
import Swal from 'sweetalert2';
import { NavBar } from "../components/NavBar";
import Cookies from "universal-cookie";

export const Fases = () => {
  const cookies = new Cookies();

  const navigate = useNavigate();
  const [phases, setPhases] = useState([]);
  const [input, setInput] = useState("");

  const getAll = async ()=>{
    try {
      const { data } = await axios.get(`${urlBase.apiUrl}/phases`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      setPhases(data);

    } catch (error) {
      console.error('Error al hacer la petición POST:', error);
      throw error;
    }
  }

  const handleSubmit = async (event) => {

    event.preventDefault();
    try {
        await axios.post(`${urlBase.apiUrl}/phases`, { name: input },
        { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
        );
        const fetchData = async () => {
            await getAll();
        };
            
        fetchData();
        setInput("");

      } catch (error) {
        Swal.fire({
            title: "Error",
            text: "No se pudo guardar el registro",
            icon: "warning"
          });
        console.error('Error al hacer la petición POST:', error);
      }
    };

 
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
        <h4 className="mb-4">Fases</h4>
        </Col>
        <Row className="shadow p-4 bg-white rounded">
            <Col sm={12}>
                <Row>
                <Col sm={2}>
                    
                </Col>
                <Col sm={10}>
                    <Row className="mb-4">
                    <Form >
                        <Row style={{ float: 'inline-end' }}>
                        <Col xs="auto">
                            <Form.Control
                            type="text"
                            placeholder="ingresa la fase"
                            className="mr-sm-2 input-search"
                            value={ input }
                            onChange={(e) => setInput(e.target.value)}
                            required
                            />
                        </Col>
                        <Col xs="auto">
                            <Button variant="success" onClick={ handleSubmit } >Guardar </Button>
                        </Col>
                        </Row>
                    </Form>
                    </Row>
                </Col>
                </Row>
                { phases.length > 0 ? (
                <Table bordered striped hover>
                    <thead  bg="primary">
                        <tr>
                            <th>Id</th>
                            <th>Fase</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phases.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                ) : (
                  <h4>No hay datos de marcas para mostrar.</h4>
                )}
            </Col>
        </Row>
    </Container>
    </>
  )
}

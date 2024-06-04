
import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Table, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { Link } from 'react-router-dom';
import { NavBar } from "../components/NavBar";
import Cookies from "universal-cookie";

const List = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
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
        const searched = vehicles.filter(item => {
          return item.plate === data.plate;
        });
        setVehicles(searched);
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

  const eliminar = (id)=> {

    Swal.fire({
      title: "Estas seguro de borrar el vehiculo?",
      text: "Esta acción no se puede reversar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"

    }).then( async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(`${urlBase.apiUrl}/vehicles/${id}`,
        { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
        );
         const {data} = response;
        if (data.isSuccess) {
          await getAll();
        }
      }
    });
  }
  const volver = ()=>{
    navigate('/menu');
  }

  return (
    <>
    <NavBar/>
    <Container className='mt-5'>
      <Col>
        <Button color="secondary" className="mt-3" onClick={volver}>Volver</Button>
        <h4 className="mb-4">Inventario</h4>
      </Col>
      <Row className="shadow p-4 bg-white rounded">
        <Col sm={12}>
          <Row>
            <Col sm={2}>
              <Link className="btn btn-success mb-4 bl-3" to="/create">Nuevo registro</Link>
            </Col>
            <Col sm={10}>
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
                      <Button variant="primary" onClick={ handleSubmit } >
                        Buscar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Row>
            </Col>
          </Row>
          { vehicles.length > 0 ? (
            <Table bordered striped hover>
              <thead  bg="primary">
                <tr>
                  <th>Id</th>
                  <th>Placa</th>
                  <th>Color</th>
                  <th>Marca</th>
                  <th>Kilometro</th>
                  <th>Año</th>
                  <th>Precio</th>
                  <th>Linea</th>
                  <th>Estado</th>
                  <th>Observación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.plate}</td>
                    <td>{item.color}</td>
                    <td>{item.nameBrand}</td>
                    <td>{item.mileage}</td>
                    <td>{item.year}</td>
                    <td>{item.price}</td>
                    <td>{item.line}</td>
                    <td>{item.namePhase}</td>
                    <td>{item.observation}</td>
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
          ) : (
            <h4>No hay datos de marcas para mostrar.</h4>
          )}
        </Col>
      </Row>
   </Container>
   </>
  )
}
export default List;

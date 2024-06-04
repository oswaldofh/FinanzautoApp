import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import '../style/Create.css'
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { NavBar } from "../components/NavBar";


const Create = () => {
  const cookies = new Cookies();
  const formDataInitial = {
    plate: "",
    color: "",
    brandId: 0,
    phaseId: 0,
    line: "",
    year: 0,
    mileage: "",
    price: 0,
    observation: "",
    images: []
  }
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [phases, setPhases] = useState([]);
  const [formData, setFormData] = useState(formDataInitial);
  const [selectedImages, setSelectedImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (event) => {

    setFormData({
      ...formData,
      images: event.target.files
    });
    const files = event.target.files;
    
    const imagesArray = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagesArray.push(e.target.result);
        if (imagesArray.length === files.length) {
          setSelectedImages(imagesArray);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const getPhases = async ()=>{
    try {
      const response = await axios.get(`${urlBase.apiUrl}/phases`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      const result = response.data;
      setPhases(result);

    } catch (error) {
      console.error('Error al hacer la petición POST:', error);
      throw error;
    }
  }
  const getBrands = async ()=>{
    try {
      const response = await axios.get(`${urlBase.apiUrl}/brands`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      const result = response.data;
      setBrands(result);

    } catch (error) {
      console.error('Error al hacer la petición POST:', error);
      throw error;
    }
  }

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);

    const payload = new FormData();

    payload.append('plate', formData.plate);
    payload.append('color', formData.color);
    payload.append('brandId', formData.brandId);
    payload.append('phaseId', formData.phaseId);
    payload.append('line', formData.line);
    payload.append('year', formData.year);
    payload.append('mileage', formData.mileage);
    payload.append('price', formData.price);
    payload.append('observation', formData.observation);
    let nuevas = formData.images;
    
    for (let i = 0; i < nuevas.length; i++) {
      payload.append('images', nuevas[i]);
    }

    axios.post(`${urlBase.apiUrl}/vehicles`,  payload,
    { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
    )
    .then(response => {
      
      console.log('respuesta ', response.status);
        setLoading(false);

        Swal.fire({
          title: "Ok",
          text: "Vehiculo creado correctamente...",
          icon: "success",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#dc3545",
          showCancelButton: true,
          cancelButtonText: "Cerrar",
          confirmButtonText: "Enviar a reparación",
          reverseButtons: true
        }).then((result) => {
          
          if (result.isConfirmed) {
              navigate('/menu');
          }else{
            navigate('/menu');
          }
        });
      
    }).catch(error => {
      console.log('error ', error.response.data);
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el registro",
        icon: "warning"
      });
    });
  };

  
  useEffect(()=> {
    const fetchData = async () => {
      await getBrands();
      await getPhases();
    };
    fetchData();
  }, [])

  const volver = ()=>{
    navigate('/');
  }

  return (
    <>
    <NavBar/>
    <Row>
      <Col sm={8}>
        <Container className='mt-5 container-form'>
          <Row>
            <Col sm={12}>
              <h4 className="mb-5">Registrar vehiculo</h4>
            </Col>
          </Row>
          <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control
                    type="text"
                    name="plate"
                    value={formData.plate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Linea o vehiculo</Form.Label>
                  <Form.Control
                    type="text"
                    name="line"
                    value={formData.line}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Select 
                    className="mb-3" 
                    aria-label="Default select example"
                    name="brandId"
                    value={formData.brandId}
                    onChange={(e) => handleSelectChange("brandId", e.target.value)}
                  >
                    <option value={0}></option>
                    {brands.map((item, index) => (
                      <option value={ item.id } key={ index }>{ item.name }</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fase</Form.Label>
                  <Form.Select 
                    className="mb-3" 
                    aria-label="Default select example"
                    name="phaseId"
                    value={formData.phaseId}
                    onChange={(e) => handleSelectChange("phaseId", e.target.value)}
                  >
                    <option value={0}></option>
                    {phases.map((item, index) => (
                      <option value={ item.id } key={ index }>{ item.name }</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Select 
                      className="mb-3" 
                      aria-label="Default select example"
                      name="color"
                      value={formData.color}
                      onChange={(e) => handleSelectChange("color", e.target.value)}
                    >
                      <option value=""></option>
                      <option value="BLANCO">BLANCO</option>
                      <option value="ROJO">ROJO</option>
                      <option value="AZUL">AZUL</option>
                      <option value="NEGRO">NEGRO</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3">
                <Form.Label>Año</Form.Label>
                  <Form.Select  
                    aria-label="Default select example"
                    name="year"
                    value={formData.year}
                    onChange={(e) => handleSelectChange("year", e.target.value)}
                  >
                    <option></option>
                    <option value={2020}>2020</option>
                    <option value={2021}>2021</option>
                    <option value={2022}>2022</option>
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kilometros</Form.Label>
                  <Form.Control
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Observación</Form.Label>
                  <Form.Control
                    type="text"
                    name="observation"
                    value={formData.observation}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
              {!loading ? (
                <Row className="row-button">
                  <Col sm={6}>
                    <Button variant="danger" onClick={volver}>Cancelar</Button>
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
      </Col>
      <Col sm={4}>
        <Container className='mt-5 container-form'>
          <Col sm={12}> 
            <h4>Fotos</h4>
          </Col>
          <Row className="shadow p-4 bg-white rounded mt-5">
              <Col sm={12} className="custom-file-upload">
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <div className="mt-3">
                    {selectedImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Selected ${index}`}
                        style={{ maxWidth: '200px', margin: '5px' }}
                      />
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
        </Container>
      </Col>
    </Row>
    </>
  );
};

export default Create;

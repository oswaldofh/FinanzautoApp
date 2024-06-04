
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Edit.css';
import Swal from 'sweetalert2';
import { NavBar } from "../components/NavBar";
import { urlBase } from '../settings/urlbase';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from "universal-cookie";

const Edit = () => {
  const cookies = new Cookies();

  const { id } = useParams();
  const navigate = useNavigate();

  const formDataInitial = {
    id: id,
    plate: "",
    color: "",
    brandId: 0,
    phaseId: 0,
    line: "",
    year: "",
    mileage: "",
    price: 0,
    observation: "",
    images: []
  }

  const [brands, setBrands] = useState([]);
  const [phases, setPhases] = useState([]);
  const [formData, setFormData] = useState(formDataInitial);

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isCancelButtonEnabled, setIsCancelButtonEnabled] = useState(false);
  const [selectedPhaseId, setSelectedPhaseId] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesActual, setImagesActual] = useState([]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  
  useEffect(() => {
    if (show) {
      setTimeout(() => setIsCancelButtonEnabled(true), 10000);
    }
  }, [show]);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setSelectedPhaseId(checked ? parseInt(name) : 0);

    setFormData({
      ...formData,
      ['phaseId']: parseInt(name)
    });
  };

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
    console.log('ingreso')
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

  const update = async (formData) => {

    const payload = new FormData();

    payload.append('id', formData.id);
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

    try {
      const response = await axios.put(`${urlBase.apiUrl}/vehicles`, payload,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
  
      return response.data;
    } catch (error) {
      console.error('Error al hacer la petición Put:', error);
      throw error;
    }
  };

  
  const getPhases = async ()=>{
    try {
      const { data } = await axios.get(`${urlBase.apiUrl}/phases`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      setPhases(data);

    } catch (error) {
      console.error('Error al consultar las fases:', error);
      throw error;
    }
  }
  const getBrands = async ()=>{
    try {
      const { data } = await axios.get(`${urlBase.apiUrl}/brands`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );
      setBrands(data);

    } catch (error) {
      console.error('Error al consultar las marcas', error);
      throw error;
    }
  }
  
  const getRegister = async ()=>{
    try {
      const { data } = await axios.get(`${urlBase.apiUrl}/vehicles/${id}`,
      { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
      );

      setFormData(data)
      setSelectedPhaseId(data.phaseId);
      setImagesActual(data.images);

    } catch (error) {
      console.error('Error al consultar el registro con id', error);
      throw error;
    }
  }

  useEffect(()=> {
    const fetchData = async () => {
      await getRegister();
      await getBrands();
      await getPhases();
    };
    
    fetchData();

  }, [])

  

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);


    try {
      const { data } = await update(formData);
      console.log(data)
      setLoading(false);
      Swal.fire({
        title: "Actualizado",
        text: "Se actualizo el vehico correctamente...",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Cerrar"
      }).then((result) => {
          if (result.isConfirmed) {
              navigate('/list');
          }
      });
      
    } catch (error) {
      setLoading(false);

      Swal.fire({
        title: "Error",
        text: "No se pudo guardar el registro",
        icon: "warning"
      });
    }
    
  };

  const deleteImage = (id)=> {
    Swal.fire({
      title: "Estas seguro de borrar la imagen?",
      text: "Esta acción no se puede reversar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar"

    }).then( async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${urlBase.apiUrl}/vehicles/DeletePhoto/${id}`,
          { headers: { Authorization: `Bearer ${cookies.get('token')}`}}
          );
          const {data} = response;
          await getRegister();
          if (data.isSuccess) {
            //await getAll();
          }
        } catch (error) {
          console.error('Error al hacer la petición Put:', error);
          throw error;
        }
      }
    });
  }

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
                <h4>Modificar Registro</h4>
            </Col>
          </Row>
          <Form className="shadow p-4 bg-white rounded mt-3" onSubmit={handleSubmit}>
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
                  <Form.Label>Linea</Form.Label>
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
            </Row>
            <Row>
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
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                  </Form.Select>
                </Form.Group>
              </Col>
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
            </Row>
            <Row>
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
            {!loading ? (
              <Row className="row-button">
                <Col sm={6}>
                  <Button variant="danger"  onClick={volver}>Cancelar</Button>
                </Col>
                <Col sm={6}>
                  {/* <Button variant="success" type="submit">Guardar</Button> */}
                  <Button variant="success" onClick={handleShow}>Guardar</Button>
                </Col>
              </Row>
            ) : (
              <Button variant="success" type="submit" disabled>
                Modificando...
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
          { imagesActual.length > 0 ? (
          <Row className="shadow p-4 bg-white rounded mt-4">
            {imagesActual.map((item, index) => (
              <Col sm={6} key={index}>
                <Card className="card-edit-image shadow p-4 bg-white rounded">
                  <Card.Img variant="top" src={ item.image } id="image-vehicle"/>
                    <Button variant="danger" style={{ width: '75px', float: 'right' }} className="btn-sm" onClick={()=> {deleteImage(item.id)}}>
                    Eliminar
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
          ) : (
            <h4>No hay datos de marcas para mostrar.</h4>
          )}
        </Container>
      </Col>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton> 
          <Modal.Title>Seleccione la fase</Modal.Title>
        </Modal.Header>
        <Form className="shadow p-4 bg-white rounded" >
          <Modal.Body>
            <Row>
              
              {phases.map((phase, index) => (
                <Col sm={3} key={index}>
                  <Form.Group className="mb-2 form-checkme">
                    <Form.Label>{ phase.name }</Form.Label>
                    <Form.Check
                      key={phase.id} // Use the id as the key
                      type="checkbox"
                      name={phase.id.toString()} // Convert id to string for name
                      checked={selectedPhaseId === phase.id} // Check state based on selectedPhaseId and phase.id
                      onChange={handleChange}
                      id="check-fase"
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="danger" disabled={!isCancelButtonEnabled} onClick={ handleClose }>Cancelar</Button>
              <Button variant="primary" onClick={ handleSubmit } >Guardar cambios</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Row>
    </>
  )
}
export default Edit;
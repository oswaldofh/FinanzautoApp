import React from 'react'
import { Carrusel } from './Carrusel'
import { Button, Card } from "react-bootstrap";
import { Link } from 'react-router-dom';

export const CardVehiculo = ({ images, id }) => {
  return (
    <Card style={{ border: 'none'}} className='mb-3'>
      <Carrusel images = { images }/>
        <Card.Body>
          <Link to={`/viewVehicle/${id}`}>
              <Button variant="primary">Ver mas...</Button>
          </Link>
        </Card.Body>
    </Card>
  )
}

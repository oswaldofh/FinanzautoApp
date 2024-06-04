import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
export const Carrusel = ({ images }) => {

  return (
    
    <Carousel interval={null} slide={false}>
      {images.map((item, index) => (
        <Carousel.Item key={index}>
          <img className="d-block w-100" src={item.image} alt="First slide"/>
        </Carousel.Item>
      ))}
    </Carousel>
    
  )
}

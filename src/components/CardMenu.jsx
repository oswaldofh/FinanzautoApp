import React from 'react'
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

export const CardMenu = ({title, text, image, route, button}) => {
    return (
        <Card>
          <Card.Img variant="top" src={ image } />
          <Card.Body>
            <Card.Title>{ title }</Card.Title>
            <Card.Text>{ text }</Card.Text>
            <Link to={ route }>
                <Button variant="success">{ button }</Button>
            </Link>
          </Card.Body>
        </Card>
    );
}

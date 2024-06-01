import { useEffect } from "react";
import React  from 'react'
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();

  const cerrarSession = ()=>{

    cookies.remove('id', {path: '/'});
    cookies.remove('firstName', {path: '/'});
    cookies.remove('lastName', {path: '/'});
    cookies.remove('userName', {path: '/'});
    cookies.remove('token', {path: '/'});

    navigate('/');
  }

  
  useEffect(()=> {
    if (!cookies.get('id')) {
      navigate('/');
    }

  }, [cookies.id, navigate])


  return (
    <div>
      <button className='btn btn-danger' onClick={()=>cerrarSession()}>Carrar sesion</button>
      <h5>Usuario: {cookies.get('userName')}</h5>
      <br></br>
      <h5>Nombre: {cookies.get('firstName')}</h5>
      
    </div>
  )
}
export default Menu;

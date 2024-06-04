import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { urlBase } from '../settings/urlbase';
import BackgroundImage from "../assets/images/background.png";
import Logo from "../assets/images/logo.png";

const Login = () => {

  const cookies = new Cookies();
  const navigate = useNavigate();

  const login = async (username, password, rememberMe) => {
    try {
      const response = await axios.post(`${urlBase.apiUrl}/users/Login`, {
        username: username,
        password: password,
        rememberMe: rememberMe
      });
  
      return response.data;
    } catch (error) {
      console.error('Error al hacer la petición POST:', error);
    }
  };

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);

    try {
      const {isSuccess, result } = await login(inputUsername, inputPassword, rememberMe);

      if (isSuccess) {
        setLoading(false);

        //sessionStorage.setItem('token', result.token);
        cookies.set('id', result.result.id, {path: '/'});
        cookies.set('firstName', result.result.firstName, {path: '/'});
        cookies.set('lastName', result.result.lastName, {path: '/'});
        cookies.set('userName', result.result.userName, {path: '/'});
        cookies.set('token', result.token, {path: '/'});
        cookies.set('userType', result.result.userType, {path: '/'});
        if (result.result.userType === 1) {
          navigate('/menu');
        }else{
          navigate('/menuClient');
        }
      }
      

    } catch (error) {
      setShow(true);
      setLoading(false);
    }
    
  };

  const handlePassword = () => {
    navigate('/register');
  };

  useEffect(()=> {
    if (cookies.get('id')) {
      navigate('/menu');
    }
  }, [cookies.id, navigate])

  return (
     <div className="sign-in__wrapper" style={{ backgroundImage: `url(${ BackgroundImage })`}}>
    {/* </div><div className="sign-in__wrapper"> */}
      {/* <div className="sign-in__backdrop"></div>  */}
      
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <img className="img-thumbnail mx-auto d-block mb-2" src={Logo} alt="logo"/>
        <div className="h4 mb-2 text-center">Sign In</div>
        
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="email"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2 mt-2" controlId="checkbox">
          <Form.Check 
            type="checkbox" 
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </Form.Group>
        {!loading ? (
          <Button className="w-100 mt-2" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}

        <div className="d-grid justify-content-end">
          <Button className="text-muted px-0" variant="link" onClick={handlePassword} >
            Registrarme
          </Button>
        </div>
      </Form>
    </div>
  )
};

export default Login;

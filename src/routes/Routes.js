
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Menu  from '../pages/Menu';
import  Login  from '../pages/Login';
import List from '../pages/List';
import Edit from '../pages/Edit';
import  Create  from '../pages/Create';
import { MenuClient } from '../pages/MenuClient';
import { ViewVehicle } from '../pages/ViewVehicle';
import { Client } from '../pages/Client';
import { Register } from '../pages/Register';
import { ListClient } from '../pages/ListClient';
import { Brands } from '../pages/Brands';
import { Fases } from '../pages/Fases';



function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<Login />}/> 
        <Route exact path='/login' element={<Login />}/> 
        <Route exact path='/menu' element={<Menu />}/> 
        <Route exact path='/menuClient' element={<MenuClient />}/> 
        <Route exact path='/viewVehicle/:id' element={<ViewVehicle />}/> 
        <Route exact path='/list' element={<List />}/> 
        <Route exact path='/register' element={<Register />}/> 
        <Route exact path='/fases' element={<Fases />}/> 
        <Route exact path='/create' element={<Create />}/> 
        <Route exact path='/brands' element={<Brands />}/> 
        <Route exact path='/client/:id' element={<Client />}/> 
        <Route exact path='/clients' element={<ListClient />}/> 
        <Route exact path='/edit/:id' element={<Edit />}/> 
      </Routes>
    </Router>
  );
}

export default App;

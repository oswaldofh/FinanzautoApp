
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Menu  from '../pages/Menu';
import  Login  from '../pages/Login';
import List from '../pages/List';
import Edit from '../pages/Edit';
import  Create  from '../pages/Create';


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route exact path='/' element={<Login />}/>  */}
        <Route exact path='/' element={<List />}/> 
        <Route  path='/login' element={<Login />}/> 
        <Route exact path='/menu' element={<Menu />}/> 
        <Route  path='/list' element={<List />}/> 
        <Route  path='/create' element={<Create />}/> 
        <Route  path='/edit/:id' element={<Edit />}/> 
      </Routes>
    </Router>
  );
}

export default App;

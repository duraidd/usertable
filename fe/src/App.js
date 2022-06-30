import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from './Components/Usercard.js'
import UserTablePage from './Components/Usertable.js'



function App() {
  return (
<>
<BrowserRouter>
<Routes>
  <Route exact path='/' element={<Homepage/> } />
  <Route exact path='/usertable' element={<UserTablePage/>} />  
</Routes>
</BrowserRouter>
</>
    
  );
}

export default App;

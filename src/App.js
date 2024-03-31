import {Routes,Route,Link, useNavigate} from 'react-router-dom';
import './App.css'
import Nav from './Nav';
import Header from './Header';
import Home from './Home';
import NewPost from './NewPost';
import Postpage from './Postpage';
import About from './about';
import Missing from './Missing';
import Footer from './Footer';
import { DataProvider } from './context/DataContext.js';

function App() {

return (

<div className='App'>
  <DataProvider>
    <Header title={"SayIt"}/>
    <Nav/>

    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/header' element={<Home/>}/>
            
      <Route path='post'
        index element={<NewPost/>}/>
        <Route path="/post/:id" 
        element={<Postpage/>}/>
        <Route/>

        <Route path='/about' element={<About/>}/>
        <Route path='*' element={<Missing/>}/>
        
        </Routes>
        <Footer/>  
      </DataProvider>
      </div>
  )
  
}

export default App

import { useEffect, useState } from 'react'
import {Routes,Route,Link, useNavigate} from 'react-router-dom';
import { format } from 'date-fns'; 
import './App.css'
import Nav from './Nav';
import Header from './Header';
import Home from './Home';
import NewPost from './NewPost';
import Postpage from './Postpage';
import About from './about';
import Missing from './Missing';
import Footer from './Footer';
import api from './api/post.js'
import useAxiosFetch from './hooks/useAxiosFetch.js';


function App() {
   const [search,setSearch]=useState("")
   const [searchResults,setSearchResults]=useState([])
   const [postTitle, setPostTitle] = useState('');
   const [postBody, setPostBody] = useState('');
   const [posts,setPosts]=useState([])
   const navigate=useNavigate()
   const {data,fetchError,isLoading}=useAxiosFetch('http://localhost:3500/posts')

    
   useEffect(()=>{
    setPosts(data)
   },[data])
useEffect(()=>{
   const filteredResults =posts.filter((post)=>
   ((post.body).toLowerCase()).includes(search.toLowerCase())||((post.title).toLowerCase()).includes(search.toLowerCase()));
    setSearchResults(filteredResults.reverse());
  },[posts,search])
 
 
const handleSubmit = async (e) => {
      e.preventDefault();
      const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const newPost = { id, title: postTitle, datetime, body: postBody };
     
      try {
          const response = await api.post('/posts', newPost);
          const allPosts = [...posts, response.data];
          setPosts(allPosts);
          setPostTitle('');
          setPostBody('');
        
          
      } catch (err) {
          console.log(`Error: ${err.message}`);
      }
      navigate('/')
    }

    useEffect(()=>{
      const fetchPosts = async()=>{
        try{
          const response = await api.get('/posts')
         
          setPosts(response.data)
        }catch(err){
          console.log(err.message)
        }
        }
      fetchPosts()
    },[])

    const handleDelete = async (id) => {
      try {
          await api.delete(`/posts/${id}`)
          const updatePosts = posts.filter(post => post.id !== id)
          setPosts(updatePosts)
      } catch (err) {
          console.log(`Error: ${err.message}`);
      }
      navigate('/')
  }
return (

<div className='App'>
  <Header title={"SayIt"}/>
  <Nav search={search}
       setSearch={setSearch} 
  />

   <Routes>
     <Route path='/' element={<Home posts={searchResults}
     fetchError={fetchError}
     isLoading={isLoading}/>}/>
     <Route path='/header' element={<Home posts={<Header 
          title="Say"
          search={search}
          setSearch={setSearch}
        />}/>}/>
          
    <Route path='post'
       index element={<NewPost  handleSubmit={handleSubmit}
       postBody={postBody}
       setPostBody={setPostBody}
       postTitle={postTitle}
       setPostTitle={setPostTitle}      
        />}/>
      <Route path="/post/:id" 
      element={<Postpage posts={posts} 
      handleDelete={handleDelete}
      />}/>
      <Route/>

      <Route path='/about' element={<About/>}/>
      <Route path='*' element={<Missing/>}/>
      
      </Routes>
      <Footer/>  
      </div>
  )
  
}

export default App

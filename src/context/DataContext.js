import { createContext,useState,useEffect } from "react"
import { format } from "date-fns"
import api from "../api/post"
import useAxiosFetch from "../hooks/useAxiosFetch"
import { useNavigate } from "react-router-dom"
const DataContext=createContext({})

export const DataProvider=({children})=>{
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
  return(
    <DataContext.Provider value={{
  search,setSearch,searchResults,fetchError,isLoading,
  handleSubmit,postTitle,setPostTitle,postBody,setPostBody,handleDelete,posts
    }}>
     {children}
    </DataContext.Provider>
  )

}
export default DataContext
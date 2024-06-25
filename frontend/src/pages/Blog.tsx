
import { useUser } from "../hooks";
import { useParams } from "react-router-dom";
import BlogContainer from "../components/BlogContainer";
import DNASpiral from "../loaders/DNASpiral";

const Blog = () => {
  const {id} = useParams();


  const { userLoading } = useUser()

  if(userLoading){
    return <DNASpiral />
  }
console.log(id)
  
  return (
    <div>
      
      <BlogContainer id={id as string}/>
    </div>
  )
}

export default Blog

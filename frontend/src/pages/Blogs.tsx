import { useNavigate } from 'react-router-dom';
import Appbar from '../components/Appbar'
import BlogCard from '../components/BlogCard'
import { useBlogs, useUser } from '../hooks'
import DNASpiral from '../loaders/DNASpiral';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { blogData } from '../recoil/atom/blogAtom';

const Blogs = () => {

  const {loading} = useBlogs();
  const {  userLoading } = useUser()
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const posts= useRecoilValue(blogData)

  useEffect(() => {
     if (!token) {
       navigate("/signin")
     }

  },[token, navigate])
 

  if (userLoading || loading) {

    return (
        <DNASpiral />
    )
  }

  function stripHTML(html:any) {
    let doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-8 pb-10 ">
        <div>
    {posts.map((post)=>{
return (
  <BlogCard
    authorName={post.author.name}
    title={post.title}
    content={stripHTML(post.content)}
    publishedData={post.date}
    id={post.id}
    key={post.id}
  />
)
    })}
        </div>
      </div>
    </div>
  )
}

export default Blogs

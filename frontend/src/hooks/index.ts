import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/atom/userAtom";
import { blogData ,blogOldData} from "../recoil/atom/blogAtom";

export interface Blog { 
     "content": string
     "title": string;
     "id": string;
     "date": string;
     "author": {
        "name": string;
        "id": string
            }
}

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useRecoilState<Blog[]>(blogData)

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response =>{
            setBlogs(response.data.posts)
            setLoading(false)
        })
    },[])

    return {
        loading,
        blogs
    }
}



export const useMyBlogs = () => {
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/myblogs`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.posts)
        setLoading(false)
      })
  }, [])

  return {
    loading,
    blogs,
  }
}


export const useBlog = ({ id }:{ id: string }) =>{
   const [loading, setLoading] = useState(true)
   const [blog, setBlog] = useState<any>([])

   useEffect(() => {
     axios
       .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
         headers: {
           Authorization: localStorage.getItem("token"),
         },
       })
       .then((response) => {
         setBlog(response.data.post)
         setLoading(false)
       })
   }, [id])

   return {
     loading,
     blog,
   }

}

export const useUser = () => {
    const [userLoading, setUserLoading] = useState(true);
    const [user, setUser] = useRecoilState(userAtom);

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/user/me`,{
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response =>{
            setUser(response.data)
            setUserLoading(false)
        })
    },[])

    return {
        userLoading,
        user
    }
}

export const useUpdateBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true)
  const [oldblogData, setOldBlogData] = useRecoilState(blogOldData)
  

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setOldBlogData(response.data.post)
        setLoading(false)
      })
  }, [id])

  return {
    loading,
    oldblogData
  }
}



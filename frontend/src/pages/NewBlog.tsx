
import Appbar from "../components/Appbar"
import BlogEditor from "../components/BlogEditor"
import axios from "axios"
import { BACKEND_URL } from "../config"
import { useRecoilState, useRecoilValue } from "recoil"
import { blogContentAtom, blogTitleAtom } from "../recoil/atom/blogAtom"
import { useNavigate } from "react-router-dom"
import { useUser } from "../hooks"
import DNASpiral from "../loaders/DNASpiral"


const NewBlog = () => {
   
const [title, setTitle] = useRecoilState(blogTitleAtom)
const content = useRecoilValue(blogContentAtom)
const navigate = useNavigate()
const { userLoading } = useUser()

 if ( userLoading) {
   return <DNASpiral />
 }

  return (
    <div className="">
      <Appbar />
      <div className="pt-10 w-full  px-5 md:px-10 lg:px-20 ">
        <div className="text-slate-500 text-2xl font-semibold pb-3 ">
          Give your post a title.
        </div>
        <div className="max-w-3xl space-y-3 pb-10">
          <input
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            type="text"
            className="focus:outline-none py-1 px-4 block w-full border-gray-200 rounded-lg text-xl focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none text-slate-500 font-semibold"
            placeholder="Enter your title here"
          />
        </div>
        <div className="text-slate-500 text-2xl font-semibold pb-5">
          Start with your content
        </div>
        <div className="shadow-md rounded-xl h-auto p-2 text-slate-700 pb-12">
          <BlogEditor />
        </div>
        <button
          onClick={async () => {
            const response = await axios.post(
              `${BACKEND_URL}/api/v1/blog`,
              {
                title,
                content,
              },
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            )
            navigate(`/blog/${response.data.id}`)
          }}
          type="button"
          className="mt-5 text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Publish
        </button>
      </div>
    </div>
  )

  
}

export default NewBlog

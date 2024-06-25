import { useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useRecoilState, useRecoilValue } from "recoil"
import { blogContentAtom, blogTitleAtom } from "../recoil/atom/blogAtom"
import { useUpdateBlog, useUser } from "../hooks"
import Appbar from "../components/Appbar"
import UpdateBlogEditor from "../components/UpdateBlogEditor"
import DNASpiral from "../loaders/DNASpiral"
import { BACKEND_URL } from "../config"

const UpdateBlog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userLoading } = useUser()
  const { loading, oldblogData } = useUpdateBlog({ id: id || "" })

  const [title, setTitle] = useRecoilState(blogTitleAtom)
  const content = useRecoilValue(blogContentAtom)

  useEffect(() => {
  
    if (oldblogData) {
      setTitle(oldblogData.title)
    }
  }, [oldblogData, setTitle])

  const handlePublish = async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog/${id}`,
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
    } catch (error) {
      console.error("Error publishing blog:", error)

    }
  }

  if (loading || userLoading) {
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="focus:outline-none py-1 px-4 block w-full border-gray-200 rounded-lg text-xl focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none text-slate-500 font-semibold"
          />
        </div>
        <div className="text-slate-500 text-2xl font-semibold pb-5">
          Start with your content
        </div>
        <div className="shadow-md rounded-xl h-auto p-2 text-slate-700 pb-12">
          <UpdateBlogEditor />
        </div>
        <button
          onClick={handlePublish}
          type="button"
          className="mt-5 text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Publish
        </button>
      </div>
    </div>
  )
}

export default UpdateBlog

import { useEffect } from "react" 
import Appbar from "./Appbar"
import { useBlog, useUser } from "../hooks"
import { Avatar } from "./BlogCard"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import DNASpiral from "../loaders/DNASpiral"

const BlogContainer = ({ id }: { id: string }) => {
  const navigate = useNavigate()

  const { blog, loading: blogLoading } = useBlog({ id: id || "" })
  const { user, userLoading } = useUser()
 
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit],
  })

  useEffect(() => {
    if (blog && editor) {
      editor.commands.setContent(blog.content || "")
    }
  }, [blog, editor])


  if (blogLoading || userLoading) {
    return <DNASpiral />
  }

  console.log(blog)

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      navigate("/blogs")
    } catch (error) {
      console.error("Failed to delete blog:", error)
    }
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-5 md:pt-10 pb-20">
          <div className="col-span-12 lg:col-span-8">
            <div className="flex justify-between items-center">
              <div className="text-5xl font-extrabold">{blog.title}</div>
            </div>
            <div className="flex items-center pt-4">
              <div className="flex flex-col">
                <div className="flex lg:hidden">
                  <div className="lg:hidden pr-1">
                    <Avatar size="small" name={blog.author.name} />
                  </div>
                  <div className="text-md font-bold pr-2 lg:hidden">
                    {blog.author.name}
                  </div>
                </div>
                <div className="text-slate-500 lg:text-lg md:text-md text-sm pt-1">
                  {`Posted on ${blog.date}` || `Posted August 24 uk`}
                </div>
              </div>
              {user.id === blog.author.id && (
                <button
                  onClick={handleDelete}
                  type="button"
                  className="ml-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-3 py-1.5 text-center"
                >
                  Delete
                </button>
              )}
              {user.id === blog.author.id && (
                <button
                  onClick={() => navigate("/updateblog/" + blog.id)}
                  type="button"
                  className="ml-2 text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-1.5 text-center"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="pt-2">
              <EditorContent editor={editor} />
            </div>
          </div>

          <div className="hidden col-span-4 lg:block">
            <div className="text-slate-600 text-lg">Author</div>
            <div className="flex w-full">
              <div className="pl-1 pr-5 pt-2">
                <Avatar size="big" name={blog.author.name} />
              </div>
              <div>
                <div className="text-xl font-bold">{blog.author.name}</div>
                <div className="text-slate-500">
                  {blog.author.caption}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogContainer

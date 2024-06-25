
import Appbar from "../components/Appbar"
import BlogCard from "../components/BlogCard"
import { useMyBlogs, useUser } from "../hooks"
import DNASpiral from "../loaders/DNASpiral"

const MyBlogs = () => {
  const { loading, blogs } = useMyBlogs()
  const { user, userLoading } = useUser()

  if (userLoading || loading) {
    return (
       <DNASpiral/>
    )
  }

  function stripHTML(html: any) {
    let doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent || ""
  }

  return (
    <div>
      <Appbar />
      <div className="flex justify-center pt-8 ">
        <div>
          {blogs.map((blog) => {
            return (
              <BlogCard
                authorName={blog.author.name || "Anon"}
                title={blog.title}
                content={stripHTML(blog.content)}
                publishedData={blog.date || "Posted August 24 uk"}
                id={blog.id}
                key={blog.id}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MyBlogs

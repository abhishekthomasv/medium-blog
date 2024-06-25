
import { Link } from "react-router-dom"

interface BlogCardProps {
  authorName: string,
  title: string,
  content: string,
  publishedData: string,
  id:string
}

const BlogCard = ({authorName, title, content, publishedData, id}:BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="pl-10 lg:pl-0 p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-lg cursor-pointer">
        <div className="flex items-center">
          <Avatar name={authorName} size="small" />
          <div className="pl-1 pr-1 text-sm">{authorName}</div>
          <div className="px-1">
            <Circle />
          </div>
          <div className="pl-1 font-thin text-slate-500 text-sm">
            {publishedData}
          </div>
        </div>
        <div className="text-xl font-semibold pt-2">{title}</div>
        <div >{content.slice(0,100)}</div>
        <div className="text-slate-500 text-sm font-thin pt-4">{`${Math.ceil(
          content.length / 100
        )} minute(s) read`}</div>
        
      </div>
    </Link>
  )
}

function Circle(){
  return <div className='h-1 w-1 rounded-full bg-slate-600'>

  </div>
}

export function Avatar({name, size = "small" }:{name: string | null, size: "small" | "big"}){
  return (
    <div
      className={`relative inline-flex items-center justify-center ${
        size == "small" ? "w-6 h-6" : "w-10 h-10"
      }  overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}
    >
      <span
        className={`font-extralight text-gray-600 dark:text-gray-300 ${
          size == "small" ? "text-xs" : "text-md"
        }`}
      >
        {name?.slice(0, 1)}
      </span>
    </div>
  )

}

export default BlogCard

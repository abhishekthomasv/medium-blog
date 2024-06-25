import { BrowserRouter, Route, Routes } from "react-router-dom"
import  Signup  from "./pages/Signup"
import Signin from "./pages/Signin"
import Blog from "./pages/Blog"
import Blogs from "./pages/Blogs"
import NewBlog from "./pages/NewBlog"
import MyBlogs from "./pages/MyBlogs"
import UpdateBlog from "./pages/UpdateBlog"
import MyProfile from "./pages/MyProfile"


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/newblog" element={<NewBlog />} />
          <Route path="/myblogs" element={<MyBlogs />} />
          <Route path="/updateblog/:id" element={<UpdateBlog />} />
          <Route path="/myprofile" element={<MyProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

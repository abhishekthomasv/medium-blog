import { useState} from "react"
import { Avatar } from "./BlogCard"
import { useClickAway } from "@uidotdev/usehooks"
import { Link, useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { userAtom } from "../recoil/atom/userAtom"


const ProfileMenu = () => {

  const user = useRecoilValue(userAtom)
  const navigate = useNavigate()
  const [openDropdown, setOpenDropdown] = useState(false)
  
    const ref = useClickAway(() => {
      setOpenDropdown(false)
    })
 
     const handleOpenModal = () => {
       if (openDropdown === false) {
         setOpenDropdown(true)
        
       }
     }

    if(!user){
        return <div>loading</div>
    }

  return (
    <div>
      <button
        onClick={handleOpenModal}
        id="dropdownAvatarNameButton"
        data-dropdown-toggle="dropdownAvatarName"
        className="link flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-800 md:me-0 focus:ring-4 focus:ring-gray-100 "
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <div>
          <Avatar name={user.name} size={"big"} />
        </div>
        <div className="pl-2">{user.name}</div>

        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round" 
            strokeLinejoin="round"
            strokeWidth="2" 
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {openDropdown && (
        <div
          /*
      // @ts-ignore */
          ref={ref}
          id="dropdownAvatarName"
          className="z-10 absolute right-3 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-46 overflow-hidden "
        ><Link to={"/myprofile"}>
          <div className="px-4 py-3 text-sm text-gray-900 ">
            <div className="font-medium ">Username</div>
            <div className="truncate">{user.email}</div>
          </div>
          </Link>
          <Link to={"/newblog"}>
            <ul
              className="py-2 text-sm text-gray-700 "
              aria-labelledby="dropdownAvatarNameButton"
            >
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  Publish new blog
                </a>
              </li>
            </ul>
          </Link>
          <Link to={"/myblogs"}>
            <ul
              className="py-2 text-sm text-gray-700 "
              aria-labelledby="dropdownAvatarNameButton"
            >
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  My Blogs
                </a>
              </li>
            </ul>
          </Link>
          <Link to={"/myprofile"}>
            <ul
              className="py-2 text-sm text-gray-700 "
              aria-labelledby="dropdownAvatarNameButton"
            >
              <li>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                  My Profile
                </a>
              </li>
            </ul>
          </Link>

          <div className="py-2">
            <a
              onClick={() => {
                localStorage.clear()
                navigate("/signin")
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 "
            >
              Sign out
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu

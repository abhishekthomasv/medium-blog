import axios from 'axios'
import Appbar from '../components/Appbar'
import { useUser } from '../hooks'
import { BACKEND_URL } from '../config'
import {  useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DNASpiral from '../loaders/DNASpiral'

const MyProfile = () => {
    const { user, userLoading } = useUser()
  const navigate = useNavigate()
  
  const [userId, setUserId] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [caption, setCaption] = useState("")

 
  useEffect(() => {
    if (!userLoading && user) {
      setUserId(user.id || "")
      setEmail(user.email || "")
      setName(user.name || "")
      setCaption(user.caption || "")
    }
  }, [userLoading, user])

  if (userLoading) {
    return <DNASpiral />
  }

  console.log(user.id)
  async function handleUpdateProfile() {
    if (email || name || caption || userId) {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/update`,
        {
          email,
          name,
          caption,
          userId,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      )
      console.log(response)
      if (response.status === 200) {
        navigate("/blogs")
      }
    }
  }
  return (
    <div>
      <Appbar />
      <div className="bg-white w-full flex flex-col justify-center items-center md:flex-row text-[#161931]">

        
            <div className="w-full px-6 pb-8 mt-14 sm:max-w-xl sm:rounded-lg">
              <h2 className=" md:text-3xl font-bold sm:text-2xl pb-2 text-slate-600">
                My Profile
              </h2>

          

                <div className=" mt-8 sm:mt-14 text-[#202142]">
                  <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-8 sm:space-y-0 sm:mb-6">
                    <div className="w-full">
                      <label
                        htmlFor="first_name"
                        className="block mb-2 text-sm font-medium text-indigo-900 "
                      >
                        Your Name
                      </label>
                      <input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setName(e.target.value)
                        }
                        type="text"
                        id="first_name"
                        defaultValue={name}
                        className="bg-slate-50 border border-slate-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                        placeholder="Your first name"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-2 sm:mb-6">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-indigo-900 "
                    >
                      Your email
                    </label>
                    <input
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      type="email"
                      id="email"
                      defaultValue={email}
                      className="bg-slate-50 border border-slate-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                      placeholder="your.email@mail.com"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium text-indigo-900 "
                    >
                      Caption
                    </label>
                    <textarea
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCaption(e.target.value)
                      }
                      id="message"
                      defaultValue={caption}
                      rows={4}
                      className="block p-2.5 w-full text-sm text-indigo-900 bg-slate-50 rounded-lg border border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 "
                      placeholder="Write your bio here..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleUpdateProfile}
                      className="text-white bg-slate-700  hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

  )
}

export default MyProfile

import { ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { SignupInput } from '@abhishekthomasv/medium-common'
import axios from 'axios'
import { BACKEND_URL } from '../config'



const Auth = ({type}:{type: "signup" | "signin"}) => {

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [postInputs,setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: "",
        caption: "",
    })

    async function sendRequest(){
        try{
          const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type == "signup" ? "signup" : "signin"}`,postInputs);
          const jwt = response.data;
          localStorage.setItem("token",jwt); 
          navigate('/blogs')
        }
        catch(e){
            setError(true);
        }
    }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="px-10">
          <div className="text-3xl font-extrabold">
            {type == "signin" ? `Login to account` : `Don't have an account?`}
          </div>
          <div className="text-slate-500 ">
            {type == "signup"
              ? "Already have an account?"
              : "Don't have an account?"}
            <Link
              className="pl-2 underline"
              to={type == "signup" ? "/signin" : "/signup"}
            >
              {type == "signup" ? "Sign in" : "Sign up"}
            </Link>
          </div>
          <div className="pt-4">
            {type == "signup" && (
              <LabeledInput
                label="Name"
                placeholder="John Doe"
                onChange={(e) => {
                  setPostInputs((c) => ({
                    ...c,
                    name: e.target.value,
                  }))
                }}
              />
            )}
            <LabeledInput
              label="Email"
              placeholder="johndoe@email.com"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  email: e.target.value,
                }))
              }}
            />
            <LabeledInput
              label="Password"
              type="password"
              placeholder="**********"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  password: e.target.value,
                }))
              }}
            />
            {type == "signup" &&
            <LabeledInput
              label="caption"
              type="caption"
              placeholder="Write a caption"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  caption: e.target.value,
                }))
              }}
            />}
            <button
              onClick={sendRequest}
              type="button"
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
            >
              {type == "signup" ? "Sign up" : "Sign in"}
            </button>
            {error && (
              <div
                className=" mt-4 text-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400"
                role="alert"
              >
                {type == "signin"
                  ? "Incorrect Email or Password !"
                  : "Enter the details correctly !"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface LabeledInputType {
    label: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>)=> void,
    type?: string
}
const LabeledInput = ({label, placeholder, onChange, type}:LabeledInputType) =>{
    return (
      <div className='pt-4'>
        <label className="block mb-2 text-sm text-gray-900 font-semibold ">
          {label}
        </label>
        <input
          onChange={onChange}
         
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={placeholder}
          type={type || "text"}
          required
        />
      </div>
    )
}

export default Auth

import React, { useState } from "react";
import axios from "axios";
import {Link,useNavigate} from "react-router-dom";
import {ToastContainer,toast} from "react-toastify";

const RegisterPage=()=>{
  const [newUser,setNewUser]=useState({fullname:"",email:"",password:""});
  const navigate=useNavigate();
  function handleChange(name,value){
    setNewUser((prev)=>({...prev,[name]:value}));
  }
  async function handleSubmit(e){
    e.preventDefault();
    try{
      const baseUrl=import.meta.env.VITE_BASE_URL;
      const {data}=await axios.post(`${baseUrl}/auth/create`,newUser);
      const {success,message}=data;
      if(success){
        toast.success(message);
        setTimeout(()=>{
          navigate("/login-page");
        },2000);
      }
      else{
        toast.error(message);
      }
      setNewUser({fullname:"",email:"",password:""});
    }
    catch(err){
      console.log(err.message);
    }
  }
  return(
    <>
      <div className="h-screen w-full flex">
        <div className="flex flex-col w-[50%] bg-sky-200 px-20 py-20 justify-between items-center">
          <div className="flex flex-col gap-10 h-1/2">
            <div className="flex flex-col">
              <h1 className="text-8xl text-sky-800">FileNest</h1>
              <span className="w-70 h-1 bg-cyan-800 rounded-full"></span>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-semibold text-sky-900">
                All your files, one secure home.
              </h1>
              <p className="text-sky-900">
                Awesome, we've created the perfect place for you to store all your documents.
              </p>
            </div>
          </div>
          <div className="w-90 h-90">
            <img className="object-cover" src="/file-pic.png" alt=""/>
          </div>
        </div>
        <div className="flex flex-col px-20 py-40 w-[50%] bg-zinc-200">
            <div className="flex flex-col gap-8">
              <h1 className="text-3xl text-gray-800 font-semibold">Create Account</h1>
              <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-800">Full Name</label>
                  <input value={newUser.fullname} name="fullname" onChange={(e)=>handleChange("fullname",e.target.value)} type="text" placeholder="Enter your full name" required className="bg-gray-300 text-gray-500 outline-none rounded-md py-2 px-4 w-2/3"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-800">Email Address</label>
                  <input type="email" name="email" value={newUser.email} onChange={(e)=>handleChange("email",e.target.value)} placeholder="Enter your email address" required className="bg-gray-300 text-gray-500 outline-none rounded-md py-2 px-4 w-2/3"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-800">Password</label>
                  <input value={newUser.password} name="password" onChange={(e)=>handleChange("password",e.target.value)} type="password" placeholder="Enter your full name" required className="bg-gray-300 text-gray-500 outline-none rounded-md py-2 px-4 w-2/3"/>
                </div>
                <button type="submit" className="w-2/3 mt-5 px-5 py-2 rounded-full bg-blue-600 text-white cursor-pointer">Create Account</button>
                <p className="text-sm">Already have an account? <span className="text-blue-600 cursor-pointer"><Link to="/">Log In</Link></span></p>
              </form>
              <ToastContainer position="top-left" />
            </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
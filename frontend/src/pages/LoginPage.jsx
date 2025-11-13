import React, { useState } from "react";
import axios from "axios";
import {Link,useNavigate} from "react-router-dom";
import {ToastContainer,toast} from "react-toastify";

const LoginPage=()=>{
  const navigate=useNavigate();
  const [loginData,setLoginData]=useState({
    email:"",
    password:""
  });

  function handleChange(name,value){
    setLoginData((prev)=>{
      return{...prev,[name]:value}
    });
  }

  async function handleSubmit(e){
    e.preventDefault();
    try{
        const baseUrl=import.meta.env.VITE_BASE_URL;
        const {data}=await axios.post(`${baseUrl}/auth/login`,loginData,{
          withCredentials:true
        });
        const {success,message,user}=data;
        if(success){
            toast.success(message);
            localStorage.setItem("loggedInUser",JSON.stringify(user));
            setTimeout(()=>{
                navigate("/dashboard");
            },2000);
        }
        else{
            toast.error(message);
        }
    }
    catch(err){
      const message=err?.response?.data?.message||err.message||"Something went wrong.";
      toast.error(message);
    }
  }

  return(
    <>
      <div className="h-screen w-full flex">
        <div className="flex flex-col w-[50%] bg-sky-200 p-20 justify-between items-center">
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
              <h1 className="text-3xl text-gray-800 font-semibold">Log In</h1>
              <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-800">Email Address</label>
                  <input type="email" name="email" value={loginData.email} onChange={(e)=>handleChange("email",e.target.value)} required placeholder="Enter your email address" className="bg-gray-300 text-gray-500 outline-none rounded-md py-2 px-4 w-2/3"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-gray-800">Password</label>
                  <input type="password" name="password" value={loginData.password} onChange={(e)=>handleChange("password",e.target.value)} required placeholder="Enter password" className="bg-gray-300 text-gray-500 outline-none rounded-md py-2 px-4 w-2/3"/>
                </div>
                <button type="submit" className="w-2/3 mt-5 px-5 py-2 rounded-full bg-blue-600 text-white cursor-pointer">Log In</button>
                <p className="text-sm">Don't have an account? <span className="text-blue-600 cursor-pointer"><Link to="/signup-page">Create Account</Link></span></p>
              </form>
              <ToastContainer position="top-left" />
            </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
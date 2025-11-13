import React, { useState,useContext } from 'react'
import {Link} from "react-router-dom";
import axios from "axios";
import {ToastContainer,toast} from "react-toastify";
import {UpdateContext} from "../context/Update";

const FileUpload=()=>{
    const [file,setFile]=useState(null);
    const {setRefresh}=useContext(UpdateContext);
    const baseUrl=import.meta.env.VITE_BASE_URL;

    async function handleUpload(e){
        e.preventDefault();
        try{
            let user=JSON.parse(localStorage.getItem("loggedInUser"));
            if(!user){
                toast.error("No User");
                return;
            }
            const formData=new FormData();
            if(!file){
                toast.error("Upload the file first");
                return;
            }
            formData.append("uploaded-file",file);
            formData.append("user",JSON.stringify(user));
            const {data}=await axios.post(`${baseUrl}/user/upload`,formData,{
                withCredentials:true
            });
            const {success,message}=data;
            if(success){
                toast.success(message);
                setRefresh(true);
                setFile(null);
            }
            else toast.error(message);
        }
        catch(err){
            toast.error(err.message);
        }
    }
    return(
        <div className='flex flex-col gap-5 relative justify-center items-center main h-screen w-full bg-zinc-100 p-10'>
            <div className='px-5 py-1 rounded-md bg-blue-500 text-white absolute top-5 right-5 cursor-pointer'>
                <Link to="/dashboard">Back to dashboard</Link>
            </div>
            <h1 className='text-3xl text-sky-950 tracking-tighter'>Upload Your File</h1>
            <form onSubmit={handleUpload} encType="multipart/form-data" className='flex flex-col shadow-md shadow-black/10 justify-around items-center h-60 w-120 bg-white rounded-3xl p-5'>
                <label 
                className='cursor-pointer px-5 py-3 w-2/3 rounded-md outline-none border border-gray-800'
                >
                    <input
                    hidden
                    type="file"
                    onChange={(e)=>setFile(e.target.files[0])}
                    name="uploaded-file"
                    />
                    {file?`${file.name}`:"Drag & drop or Choose a file"}
                </label>
                <button type="submit" className="w-2/3 py-3 hover:bg-blue-500 shadow-md shadow-black/20 duration-300 ease-in-out bg-blue-600 cursor-pointer text-white rounded-xl">Upload</button>
            </form>
            <ToastContainer position="top-left"/>
        </div>
  )
}

export default FileUpload;
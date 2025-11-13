import React,{useState,useEffect,useContext} from 'react';
import {ToastContainer,toast} from "react-toastify";
import Navbar from "../components/Navbar";
import Doc from "../components/Doc";
import axios from "axios";
import Sidepanel from "../components/Sidepanel";
import {UpdateContext} from "../context/Update";

const Images=()=>{
    const [imageFiles,setImageFiles]=useState([]);
    const [query,setQuery]=useState("");
    const {setRefresh}=useContext(UpdateContext);
    const baseUrl=import.meta.env.VITE_BASE_URL;
    const fetchImages=async()=>{
        try{
            const {data}=await axios.get(`${baseUrl}/file/get-images`,{
                withCredentials:true
            });
            const {success,message,images}=data;
            if(success){
                setImageFiles(images);
            }
            else{
                toast.error(message);
            }
        }
        catch(err){
            toast.error(err.message);
        }
    }
    const deleteFile=async(filepath)=>{
        try{
            const res=await axios.delete(`${baseUrl}/file/delete`,{
                data:{filepath},
                withCredentials:true
            });
            const {success,message}=res.data;
            if(success){
                setRefresh(true);
                fetchImages();
            } 
            else toast.error(message);
        }
        catch(err){
            console.log(err.message);
        }
    }

    useEffect(()=>{
        fetchImages();
    },[]);
    
    const filteredImages=imageFiles.filter((image)=>{
        return image.originalname.toLowerCase().includes(query.toLowerCase());
    });
    return(
        <div className='flex w-full min-h-screen gap-5 bg-zinc-100'>
                <Sidepanel />
                <div className='flex flex-col min-h-screen w-[80%] rounded-md gap-1'>
                    <Navbar query={query} setQuery={setQuery} />
                    <div className='main flex flex-col p-5 gap-5 bg-blue-100 rounded-md min-h-screen justify-around'>
                        <h1 className="text-4xl">Images</h1>
                        <div className='flex gap-2 flex-wrap justify-start h-full w-full'>
                            {filteredImages.length===0?<p className='text-sm'>No image uploaded yet.</p>:
                            filteredImages.map((item,idx)=>{
                                return <Doc
                                key={idx}
                                filename={item.originalname}
                                filesize={item.fileSize}
                                filetype={item.fileType}
                                addedOn={item.addedOn}
                                publicUrl={item.publicUrl}
                                deleteFile={()=>deleteFile(item.path)}
                                />
                            })}
                        </div>
                    </div>
                </div>
            <ToastContainer position="top-left"/>
        </div>
    )
}

export default Images;
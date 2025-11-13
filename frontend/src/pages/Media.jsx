import React, { useEffect,useState,useContext } from 'react';
import {ToastContainer,toast} from "react-toastify";
import Navbar from "../components/Navbar";
import axios from "axios";
import Sidepanel from "../components/Sidepanel";
import Doc from "../components/Doc";
import {UpdateContext} from "../context/Update";

const Media=()=>{
	const [mediaFiles,setMediaFiles]=useState([]);
	const {setRefresh}=useContext(UpdateContext);
	const [query,setQuery]=useState("");
	const baseUrl=import.meta.env.VITE_BASE_URL;
	const fetchMediaFiles=async()=>{
		try{
			const res=await axios.get(`${baseUrl}/file/get-media`,{
				withCredentials:true
			});
			const {success,message,media}=res.data;
			if(success){
				setMediaFiles(media);
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
				fetchMediaFiles();
			}
			else toast.error(message);
		}
		catch(err){
			toast.error(err.message);
		}
	}

	useEffect(()=>{
		fetchMediaFiles();
	},[]);

	//No need of state as it is derived from query and media files
	const filteredMedia=mediaFiles.filter((media)=>{
		return media.originalname.toLowerCase().includes(query.toLowerCase());
	});
	return(
		<div className='flex w-full min-h-screen gap-5 bg-zinc-100'>
				<Sidepanel />
				<div className='flex flex-col min-h-screen w-[80%] rounded-md gap-1'>
					<Navbar query={query} setQuery={setQuery}/>
					<div className='main flex flex-col p-5 gap-5 bg-blue-100 rounded-md min-h-screen justify-around'>
						<h1 className="text-4xl">Multimedia</h1>
						<div className='flex gap-2 flex-wrap justify-start h-full w-full'>
							{filteredMedia.length===0?<p className='text-sm'>No file uploaded yet.</p>:
							filteredMedia.map((item,id)=>{
								return <Doc 
								key={id}
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
  );
}

export default Media;
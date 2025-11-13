import React, { useEffect,useState,useContext } from "react";
import axios from "axios";
import Doc from "../components/Doc";
import Navbar from "../components/Navbar";
import { ToastContainer,toast } from "react-toastify";
import {UpdateContext} from "../context/Update";
import Sidepanel from "../components/Sidepanel";

function Documents(){ 
	const [docs,setDocs]=useState([]);
	const [query,setQuery]=useState("");
	const {setRefresh}=useContext(UpdateContext);
	const baseUrl=import.meta.env.VITE_BASE_URL;

	async function fetchFiles(){
		try{
			const {data}=await axios.get(`${baseUrl}/file/get-docs`,{
				withCredentials:true
			});
			const {success,message,files}=data;
			if(success){
				setDocs(files);
			}
			else{
				toast.error(message);
			}
		}
		catch(err){
			toast.error(err.message);
		}
	}
	async function deleteFile(filepath){
		try{
			const {data}=await axios.delete(`${baseUrl}/file/delete`,{
				data:{filepath},
				withCredentials:true
			});
			const {success,message}=data;
			if(success){
				setRefresh(true);
				fetchFiles();
			}
			else{
				toast.error(message);
			}
		}
		catch(err){
			toast.error(err.message);
		}
	}
	useEffect(()=>{
		fetchFiles();
	},[])
	 
	const filteredDocs=docs.filter((doc)=>{
		return doc.originalname.toLowerCase().includes(query.toLowerCase());
	});
	return(
		<div className='flex w-full min-h-screen gap-5 bg-zinc-100'>
			<Sidepanel />
			<div className='flex flex-col min-h-screen w-[80%] rounded-md gap-1'>
				<Navbar query={query} setQuery={setQuery}/>
				<div className='main flex flex-col p-5 gap-5 bg-blue-100 rounded-md min-h-screen justify-around'>
					<h1 className="text-4xl">Documents</h1>
					<div className='flex gap-2 flex-wrap justify-start h-full w-full'>
						{filteredDocs.length===0?<p className="text-sm">No documents uploaded yet.</p>:
						filteredDocs.map((item,id)=>{
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

export default Documents;
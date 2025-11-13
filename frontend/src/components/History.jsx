import {useContext} from 'react';
import axios from "axios";
import {UpdateContext} from "../context/Update";
import ListItem from './ListItem';

const History=({uploadHistory})=>{
    const {setRefresh}=useContext(UpdateContext);
    const docType=["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.  document","text/plain","application/json","text/csv","text/markdown"];
    const imageType=["image/png","image/gif","image/jpeg","image/svg+xml","image/x-icon","image/webp"];
    const baseUrl=import.meta.env.VITE_BASE_URL;

    function getMinutesAgo(dateObj){
        const date=new Date(dateObj);
        const diff=(Date.now()-date)/1000/60;
        if(diff<1) return "now";
        if(diff<60) return `${Math.floor(diff)} mins ago`;
        if(diff<1440) return `${Math.floor(diff/60)} hrs ago`;
    }

    function renderIcon(type){
        if(docType.includes(type)){
            return "📕";
        }
        else if(imageType.includes(type)){
            return "🖼️";
        }
        else if(type.startsWith("video")){
            return "🎥";
        }
        else if(type.startsWith("audio")){
            return "🎵";
        }
        else if(type.includes("zip")){
            return "📦";
        }
        else return "📄";
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
			}
			else{
				toast.error(message);
			}
		}
		catch(err){
			toast.error(err.message);
		}
    }

    return(
      <div className='history bg-sky-200 rounded-xl px-5 flex flex-col h-screen/90 w-1/2 gap-5 py-5'>
          <h1 className='text-3xl font-semibold'>Todays Uploads</h1>
          {uploadHistory.length>0?
          <ul className='space-y-2'>
            {uploadHistory.map((item,idx)=>{
                return <ListItem
                item={item} 
                idx={idx} 
                getMinutesAgo={()=>getMinutesAgo(item.addedOn)} 
                renderIcon={()=>renderIcon(item.fileType)} 
                deleteFile={()=>deleteFile(item.path)}
                />
            })}
          </ul>:<p className='text-center text-sm'>No uploads today.</p>}
      </div>
    )
}

export default History;
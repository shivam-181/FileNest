import React,{useEffect,useState,useContext} from 'react';
import {UpdateContext} from "../context/Update";
import axios from "axios";
import {ToastContainer,toast} from "react-toastify";
import ProgressBar from '../components/ProgressBar';
import History from "../components/History";
import ContentBox from "../components/ContentBox";
import Navbar from "../components/Navbar";
import Sidepanel from "../components/Sidepanel";

function Dashboard(){
    const [usedStorage,setUsedStorage]=useState(0);
    const [eachSizes,setEachSizes]=useState({
        docSize:0,
        imageSize:0,
        mediaSize:0,
        otherSize:0
    });
    const [eachTimes,setEachTimes]=useState({
        docTime:null,
        imageTime:null,
        mediaTime:null,
        otherTime:null
    });
    const MB=1000000;
    const {refresh}=useContext(UpdateContext);
    const [uploadHistory,setUploadHistory]=useState([]);
    const baseUrl=import.meta.env.VITE_BASE_URL;

    async function fetchUsedStorage(){
        try{
            const {data}=await axios.get(`${baseUrl}/user/usedStorage`,{
                withCredentials:true
            });
            const {success,totalSize}=data;
            if(success) setUsedStorage(totalSize);
        }
        catch(err){
            toast.error(err.message);
        }
    }

    function getDateString(now){
        const shortMonths=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const day=String(now.getDate()).padStart(2,"0");
        const month=shortMonths[now.getMonth()];
        return `${day} ${month}`;
    }

    function getTimeStamp(now){
        let hours=now.getHours();
        const minutes=now.getMinutes().toString().padStart(2,"0");
        const ampm=hours>=12?"pm":"am";
        hours=hours%12;
        if(hours===0) hours=12;
        return `${hours}:${minutes} ${ampm}`;
    }

    async function fetchEachStorage(){
        try{
            const {data}=await axios.get(`${baseUrl}/file/eachStorage`,{
                withCredentials:true
            });
            const {
                success,
                message,
                docStorage,
                imageStorage,
                mediaStorage,
                otherStorage,
                docUpdate,
                imageUpdate,
                mediaUpdate,
                otherUpdate
            }=data;
            if(success){
                setEachSizes({
                    docSize:docStorage,
                    imageSize:imageStorage,
                    mediaSize:mediaStorage,
                    otherSize:otherStorage 
                });
                setEachTimes({
                    docTime:new Date(docUpdate),
                    imageTime:new Date(imageUpdate),
                    mediaTime:new Date(mediaUpdate),
                    otherTime:new Date(otherUpdate)
                });
            }
            else{
                toast.error(message);
            }
        }
        catch(err){
            toast.error(err.message);
        }
    }

    async function fetchUploadHistory(){
        try{
            const res=await axios.get(`${baseUrl}/user/getUploadHistory`,{
                withCredentials:true
            });
            const {success,message,files}=res.data;
            if(success) setUploadHistory(files);
            else toast.error(message);
        }
        catch(err){
            toast.error(err.message);
        }
    }
    
    //Run once, when component mounts
    useEffect(()=>{
        fetchUsedStorage();
        fetchEachStorage();
        fetchUploadHistory();
    },[]);

    //Run whenever refresh becomes true
    useEffect(()=>{
        if(refresh){
            fetchEachStorage();
            fetchUsedStorage();
            fetchUploadHistory();
        }
    },[refresh]);

    return(
        <div className='flex w-full min-h-screen bg-zinc-100'>
            <Sidepanel />
            <div className='flex flex-col min-h-screen w-[80%] rounded-md'>
            <Navbar />
            <div className='main flex rounded-2xl justify-between bg-zinc-100 px-10 py-5'>
                <div className='flex flex-col items-center justify-center w-1/2 px-12 gap-3 h-full'>
                <ProgressBar usedStorage={usedStorage} />
                <div className='flex gap-2 flex-wrap h-full w-full'>
                    <ContentBox title="Documents" storage={(eachSizes.docSize/MB).toFixed(2)} to="/documents" time={eachTimes.docTime?getTimeStamp(eachTimes.docTime):""} date={eachTimes.docTime?getDateString(eachTimes.docTime):""} />
                    <ContentBox title="Images" storage={(eachSizes.imageSize/MB).toFixed(2)} to="/images" time={eachTimes.imageTime?getTimeStamp(eachTimes.imageTime):""} date={eachTimes.imageTime?getDateString(eachTimes.imageTime):""} />
                    <ContentBox title="Media" storage={(eachSizes.mediaSize/MB).toFixed(2)} to="/media" time={eachTimes.mediaTime?getTimeStamp(eachTimes.mediaTime):""} date={eachTimes.mediaTime?getDateString(eachTimes.mediaTime):""} />
                    <ContentBox title="Others" storage={(eachSizes.otherSize/MB).toFixed(2)} to="/other" time={eachTimes.otherTime?getTimeStamp(eachTimes.otherTime):""} date={eachTimes.otherTime?getDateString(eachTimes.otherTime):""}/>
                </div>
                </div>
                <History uploadHistory={uploadHistory} />
            </div>
            </div>
            <ToastContainer position="top-left" />
        </div>
    )
}
export default Dashboard;
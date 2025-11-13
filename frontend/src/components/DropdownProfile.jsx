import {useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";
import {ToastContainer,toast} from "react-toastify";
import axios from "axios";

const DropdownProfile=()=>{
    const [open,setOpen]=useState(false);
    const [profileUrl,setProfileUrl]=useState("");
    const [profile,setProfile]=useState(null);
    const navigate=useNavigate();
    const username=JSON.parse(localStorage.getItem("loggedInUser")).fullname;
    const email=JSON.parse(localStorage.getItem("loggedInUser")).email;
    const baseUrl=import.meta.env.VITE_BASE_URL;

    async function handleLogout(){
        try{
            const res=await axios.post(`${baseUrl}/auth/logout`,{},{
                withCredentials:true //to send httpOnly cookie to backend
            });
            const {success,message}=res.data;
            if(success){
                toast.success(message);
                localStorage.removeItem("loggedInUser");
                setTimeout(()=>{
                    navigate("/login-page");
                },2000);
            }
            else{
                toast.error(message);
            }
       }
        catch(err){
            toast.error(err.message);
        }
    }

    async function handleProfile(e){
        e.preventDefault();
        try{
            const formData=new FormData();
            formData.append("profile",profile);
            const res=await axios.post(`${baseUrl}/user/uploadProfile`,formData,
            {
                withCredentials:true,
                headers:{"Content-Type":"multipart/form-data"}
            });
            const {success,message}=res.data;
            if(success){
                toast.success(message);
            }
            else{
                toast.error(message);
            }
        }
        catch(err){
            toast.error(err.message);
        }
    }

    async function fetchProfile(){
        try{
            const res=await axios.get(`${baseUrl}/user/getProfile`,{
                withCredentials:true
            });
            const {success,message,profileUrl}=res.data;
            if(success){
                setProfileUrl(profileUrl);
                localStorage.setItem("profile",profileUrl);
            }
            else{
                toast.error(message);
            }
        }
        catch(err){
            toast.error(err.message);
        }
    }

    async function handleAccountDelete(){
        try{
            const res=await axios.delete(`${baseUrl}/user/deleteAccount`,{
                withCredentials:true
            });
            const {success,message}=res.data;
            if(success){
                localStorage.clear();
                toast.success(message);
                setTimeout(()=>{
                    navigate("/signup-page");
                },2000);
            }
            else{
                toast.error(message);
            }
        }
        catch(err){
            toast.error(err.message);
        }
    }

    async function handleRemoveProfile(){
        try{
            const res=await axios.delete(`${baseUrl}/user/removeProfile`,{
                withCredentials:true
            });
            const {success,message}=res.data;
            if(success){
                localStorage.removeItem("profile");
                toast.success(message);
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
        let profilePicture=localStorage.getItem("profile");
        if(profilePicture&&profilePicture!=="null"){
            setProfileUrl(profilePicture);
        }
        else{
            fetchProfile();
        }
    },[]);

    return(
        <div className='relative flex flex-col gap-1 rounded-md z-[2]'>
            <button type="button" onClick={()=>setOpen(!open)} className='px-5 py-1 rounded-md shadow-sm hover:scale-103 duration-300 ease-in-out shadow-black/30 cursor-pointer bg-white active:scale-95'>👋 {username}</button>
            {
            open&&<div className='absolute top-10 right-10 h-90 w-90 flex flex-col gap-1 justify-between p-5 text-black bg-white rounded-md shadow-sm shadow-black/20 text-center font-semibold'>
                <div onClick={()=>setOpen(!open)} className='absolute hover:bg-red-500 hover:text-white duration-300 ease-in-out rounded-full top-5 right-5 cursor-pointer text-red-500'>
                    <IoMdCloseCircleOutline size={22} />
                </div>
                <form onSubmit={handleProfile} encType="multipart/form-data" className='flex flex-col gap-2 items-center justify-around'>
                    <h1 className='text-xs text-black/70'>{email}</h1>
                    <div className='profilePicture h-25 w-25 bg-cover border-none overflow-hidden rounded-full flex justify-center items-center'>
                        <img src={profileUrl||"/default-profile.jpg"} className='text-xs' alt="profile picture"/>
                    </div>
                    {profileUrl?<p onClick={handleRemoveProfile} className='px-5 text-sm cursor-pointer hover:scale-102 hover:bg-red-500 hover:text-white duration-300 ease-in-out rounded-md text-red-500 shadow-md shadow-black/10'>Remove profile</p>:
                    <>
                    <label>
                        <input type="file" hidden onChange={(e)=>setProfile(e.target.files[0])}/>
                        {!profile&&<p className='px-5 text-sm cursor-pointer hover:scale-102 hover:bg-blue-700 hover:text-white duration-300 ease-in-out rounded-full text-blue-600 shadow-md shadow-black/10'>Select profile</p>}
                    </label>
                    {profile&&<button type='submit' className='px-5 text-sm cursor-pointer hover:scale-102 hover:bg-green-700 hover:text-white duration-300 ease-in-out rounded-full text-green-600 shadow-md shadow-black/10'>Click to Add</button>}
                    </>}
                </form>
                <div className='flex flex-col gap-2'>
                    <div className='text-red-500 px-5 py-1 rounded-md shadow-md shadow-black/10 text-sm cursor-pointer hover:bg-red-500 hover:text-white duration-300 ease-in-out' onClick={handleLogout}>
                        <p>Log Out</p>
                    </div>
                    <div onClick={handleAccountDelete} className='text-red-500 shadow-md shadow-black/10 px-5 py-1 rounded-md text-sm cursor-pointer hover:bg-red-500 hover:text-white duration-300 ease-in-out'>
                        <p>Delete Account</p>
                    </div>
                </div>
                <ToastContainer position="top-left" />
            </div>
            }
        </div>
    )
}

export default DropdownProfile;
import {useState} from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineRemove } from "react-icons/md";

const ListItem=({item,idx,renderIcon,getMinutesAgo,deleteFile})=>{
    const [open,setOpen]=useState(false);
    return <li
        key={idx}
        className='flex w-full h-12 rounded-full px-5 items-center justify-between shadow-sm shadow-black/20 bg-white text-black text-xs'>
            <div className='flex justify-center items-center p-1 text-lg rounded-full'>{renderIcon()}</div>
            <p>You added <span className='font-semibold'>{item.originalname}</span></p>
            <p>{getMinutesAgo()}</p>
            <div className='cursor-pointer relative rounded-full p-1 bg-zinc-500 text-white' onClick={()=>setOpen(!open)}>
                {open?<MdOutlineRemove size={18}/>:<BsThreeDotsVertical size={18}/>}
                {open&&<div className='flex flex-col absolute -left-16 top-0 bg-sky-700 text-white rounded-md overflow-hidden duration-[300] ease-in-out'>
                    <a href={item.publicUrl} target="_blank" className='hover:bg-white px-3 py-1 text-center hover:text-blue-500 duration-300 ease-in-out font-semibold text-xs'>View</a>
                    <p onClick={()=>deleteFile(item.path)} className='hover:bg-white px-3 py-1 text-center hover:text-red-500 duration-300 ease-in-out font-semibold text-xs'>Delete</p>    
                </div>}
            </div>
        </li>
}

export default ListItem;
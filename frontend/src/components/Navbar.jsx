import React from 'react';
import { FiUploadCloud } from "react-icons/fi";
import {Link} from "react-router-dom";
import DropdownProfile from "../components/DropdownProfile";

const Navbar=({query,setQuery})=>{
  return(
    <div className='navbar flex w-full py-4 rounded-md px-5 justify-between items-center gap-2'>
        <input className='h-10 w-1/2 shadow-sm shadow-black/10 rounded-full outline-none bg-white px-5' type="text" placeholder="Find a file" name="search" onChange={(e)=>setQuery(e.target.value)} value={query} />
        <div className="flex gap-2 items-center">
            <Link to="/upload-file">
                <div className='flex self-end items-center gap-2 py-2 px-6 rounded-full hover:bg-sky-600 hover:scale-103 duration-300 ease-in-out bg-sky-700 shadow-md shadow-black/10 text-white'>
                <FiUploadCloud size={20} />
                <h1>Add File</h1>
                </div>
            </Link>
            <DropdownProfile />
        </div>
    </div>
  )
}

export default Navbar;
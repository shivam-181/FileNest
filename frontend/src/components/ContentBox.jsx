import React from 'react';
import { Link } from "react-router-dom";

//Images,Media,Others
const ContentBox=({title,storage,to,time,date})=>{
    const renderIcon=()=>{
        if(title==="Documents"){
            return <img src="/documentation.png" alt="docs" />
        }
        else if(title==="Images"){
            return <img src="/gallery.png" alt="images" />
        }
        else if(title==="Media"){
            return <img src="/multimedia.png" alt="media" />
        }
        else return <img src="/others.png" alt="others" />
    }
    return(
        <Link to={to}>
            <div className="contentBox w-55 h-45 bg-white hover:bg-sky-700 hover:text-white text-black shadow-md shadow-black/20 hover:scale-102 duration-600 ease-in-out rounded-lg flex flex-col py-4 px-5 gap-1">
                <div className='flex flex-col justify-between h-1/2 w-full items-center'>
                <div className='flex justify-between items-center w-full h-[10%]'>
                    <div className='h-9 w-9 p-1 rounded-full'>
                        {renderIcon()}
                    </div>
                    <p className='text-sm'>{storage} MB</p>
                </div>
                <h1 className='font-semibold text-xl'>{title}</h1>
                </div>
                <hr className='border-t'/>
                <div className='flex flex-col items-center mt-2 gap-1'>
                    <p className='text-xs'>Last Update on</p>
                    <p className='text-sm'>{!time?"Time":time}, {!date?"Date":date}</p>
                </div>
            </div>
        </Link>
    )
}

export default ContentBox;
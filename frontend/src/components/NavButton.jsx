import React from 'react'
import { Link } from 'react-router-dom';

const NavButton=({name,to,at})=>{
    function renderIcon(){
        if(name==="Documents"){
            return <img src="/documentation.png" alt="" />
        }
        else if(name==="Dashboard"){
            return <img src="/dashboard.png" alt="" />
        }
        else if(name==="Images"){
            return <img src="/gallery.png" alt="" />
        }
        else if(name==="Video, Audio"){
            return <img src="/multimedia.png" alt="" />
        }
        else return <img src="/others.png" alt="" />
    }
    return(
        <Link to={to}>
            <div className="p-3 rounded-full flex items-center bg-white hover:bg-sky-700 hover:text-white duration-500 hover:scale-102 ease-in-out shadow-sm shadow-black/10 justify-center gap-1 text-center">
            <div className='h-6 w-6 rounded-full'>
                {renderIcon()}
            </div>
            <p>{name}</p>
            </div>
        </Link>
    )
}

export default NavButton;
import React from 'react';
import NavButton from "./NavButton";
import Footer from "./Footer";

const Sidepanel=()=>{
    const links=[{
        name:"Dashboard",
        to:"/dashboard"
    },{
        name:"Documents",
        to:"/documents"
    },{
        name:"Images",
        to:"/images"
    },{
        name:"Video, Audio",
        to:"/media"
    },{
        name:"Other",
        to:"/other"
    }];

    return(
    <div className='sidepanel flex flex-col w-[20%] gap-10 p-5 min-h-screen'>
        <h1 className='text-4xl text-sky-950'>FileNest</h1>
        <div className='sidebar flex flex-col gap-5'>
            {links.map((item,id)=>{
                return <NavButton
                key={id}
                name={item.name} 
                to={item.to} 
                />
            })}
        </div>
        <Footer />
    </div>
  )
}

export default Sidepanel;
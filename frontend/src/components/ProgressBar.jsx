import React from 'react'
import {CircularProgressbar,buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressBar=({usedStorage})=>{
    const MB=1000000;
    const totalStorage=1000000000;
    return(
      <div className='progressCard hover:scale-102 duration-500 ease-in-out text-white bg-gradient-to-r from-blue-500 to-indigo-600 w-full h-50 flex justify-around px-2 py-3 items-center border-gray-800 rounded-xl'>
          <div style={{
              height:"10rem",
              width:"10rem",
          }}>
              <CircularProgressbar value={((usedStorage/1000000000)*100).toFixed(2)} text={`${((usedStorage/1000000000)*100).toFixed(2)}%`} styles={buildStyles({
              textColor:"white",
              trailColor:"#7dd3fc",
              pathColor:"orange"
              })}/>
          </div>
          <div className='flex flex-col gap-2 items-center w-1/2'>
            <h1 className='text-2xl'>{`${((usedStorage/totalStorage)*100).toFixed(2)}% storage used.`}</h1>
            <p className='tracking-tighter text-sm'>You have <span className='font-semibold text-lg'>{((totalStorage-usedStorage)/MB).toFixed(2)} MB</span> of space left.</p>
          </div>
      </div>
    )
}

export default ProgressBar;
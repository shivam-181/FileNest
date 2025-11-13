import React,{createContext,useState} from "react";
export const UpdateContext=createContext(null);
export const UpdateProvider=(prop)=>{
    const [refresh,setRefresh]=useState(false);
    return(
        <UpdateContext.Provider value={{
            refresh,
            setRefresh
        }}>
            {prop.children}
        </UpdateContext.Provider>
    )
}
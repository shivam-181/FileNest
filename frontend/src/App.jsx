import React from 'react'
import {Routes,Route,Navigate} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import FileUpload from "./pages/FileUpload";
import Documents from "./pages/Documents";
import Images from "./pages/Images";
import Media from "./pages/Media";
import Other from "./pages/Other";

const App=()=>{
  return(
    <Routes>
      <Route path="/upload-file" element={<FileUpload />}></Route>
      <Route path="/documents" element={<Documents />}></Route>
      <Route path="/login-page" element={<LoginPage />}></Route>
      <Route path="/" element={<Navigate to="/login-page"/>}></Route>
      <Route path="/signup-page" element={<RegisterPage />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/images" element={<Images />}></Route>
      <Route path="/media" element={<Media/>}></Route>
      <Route path="/other" element={<Other />}></Route>
    </Routes>
  )
}

export default App;
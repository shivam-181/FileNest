import { createRoot } from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import "react-toastify/ReactToastify.css";
import './index.css'
import App from './App.jsx'
import {UpdateProvider} from "./context/Update.jsx";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UpdateProvider>
    <App />
  </UpdateProvider>
  </BrowserRouter>
);
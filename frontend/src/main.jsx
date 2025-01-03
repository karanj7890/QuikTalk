import React from 'react';
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
<StrictMode>
   <BrowserRouter>
      <App/>
    </BrowserRouter>
</StrictMode>
     
  

);

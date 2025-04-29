import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import EntitiesProvider from "./contexts/EntitiesProvider.tsx";
import {CssBaseline} from "@mui/material";
import ClientProvider from "./contexts/ClientProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClientProvider>
        <EntitiesProvider>
          <CssBaseline/>
          <App/>
        </EntitiesProvider>
      </ClientProvider>
    </BrowserRouter>
  </StrictMode>,
)

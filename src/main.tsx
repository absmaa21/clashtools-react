import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import EntitiesProvider from "./contexts/EntitiesProvider.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import ClientProvider from "./contexts/ClientProvider.tsx";
import SettingsProvider from "./contexts/SettingsProvider.tsx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <ClientProvider>
          <EntitiesProvider>
            <ThemeProvider theme={darkTheme}>
              <CssBaseline/>
              <App/>
            </ThemeProvider>
          </EntitiesProvider>
        </ClientProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)

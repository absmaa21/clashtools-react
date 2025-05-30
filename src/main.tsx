import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import EntitiesProvider from "./contexts/EntitiesProvider.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import ClientProvider from "./contexts/ClientProvider.tsx";
import SettingsProvider from "./contexts/SettingsProvider.tsx";
import {AppProvider, NotificationsProvider} from "@toolpad/core";
import AccountEntityProvider from "./contexts/AccountEntityProvider.tsx";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <BrowserRouter>
        <SettingsProvider>
          <ClientProvider>
            <EntitiesProvider>
              <AccountEntityProvider>
                <ThemeProvider theme={darkTheme}>
                  <NotificationsProvider>
                    <CssBaseline/>
                    <App/>
                  </NotificationsProvider>
                </ThemeProvider>
              </AccountEntityProvider>
            </EntitiesProvider>
          </ClientProvider>
        </SettingsProvider>
      </BrowserRouter>
    </AppProvider>
  </StrictMode>,
)

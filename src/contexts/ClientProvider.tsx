import {ReactNode, useEffect, useState} from "react";
import { ClientContext } from "./contexts";
import {Storage} from "../utils/Storage"
import {base_url} from "../env.ts";
import axios from "axios";

interface ClientProviderProps {
  children: ReactNode,
}

function ClientProvider({children}: ClientProviderProps) {

  const [authToken, setAuthToken] = useState<string>('dfgh')
  const [refreshToken, setRefreshToken] = useState<string>('nbmvcfxghz')
  useEffect(() => {
    if (!authToken || !refreshToken) {
      console.log("Tokens invalid!")
      setAuthToken(Storage.load("auth_token") ?? '')
      setRefreshToken(Storage.load("refresh_token") ?? '')
    }
  }, [authToken, refreshToken]);


  function login(username: string, password: string) {
    axios.post(`${base_url}/api/auth/login`, {username, password}).then(r => {
      console.log(`LOGIN: ${JSON.stringify(r.data)}`)
      /*
      setAuthToken(username)
      setRefreshToken(password)
      Storage.save("auth_token", username)
      Storage.save("refresh_token", password)
       */
    })
    return true
  }


  function register(username: string, email: string, password: string) {
    axios.post(`${base_url}/api/auth/register`, {username, email, password}).then(r => {
      console.log(`REGISTER: ${r.data}`)
    })
    return true
  }


  function logout() {
    Storage.remove("auth_token")
    Storage.remove("refresh_token")
    setAuthToken('')
    setRefreshToken('')
  }


  function isLoggedIn(): boolean {
    return !!authToken && !!refreshToken
  }


  return (
    <ClientContext.Provider value={{authToken, refreshToken, login, register, logout, isLoggedIn}}>
      {children}
    </ClientContext.Provider>
  );
}

export default ClientProvider;
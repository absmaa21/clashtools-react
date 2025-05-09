import {ReactNode, useEffect, useState} from "react";
import { ClientContext } from "./contexts";
import {Storage} from "../utils/Storage"
import {base_url} from "../env.ts";
import axios from "axios";
import {useNotifications} from "@toolpad/core";
import {ErrorResponse} from "../types/ApiResponse.ts";
import {jwtDecode, JwtPayload} from "jwt-decode";

interface ClientProviderProps {
  children: ReactNode,
}

const emptyTokens: Tokens = {
  accessToken: '',
  refreshToken: '',
}

function ClientProvider({children}: ClientProviderProps) {

  const notify = useNotifications()

  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<Tokens>(emptyTokens)
  useEffect(() => {
    refreshToken()
    if (!isAccessTokenValid()) {
      const loaded_user = Storage.load("user")
      if (loaded_user) setUser(JSON.parse(loaded_user))
      const loaded_tokens = Storage.load('user_tokens')
      if (loaded_tokens) setTokens(JSON.parse(loaded_tokens))
    }
  }, [tokens]);


  async function login(username: string, password: string): Promise<ErrorResponse | string | null> {
    try {
      const response = await axios.post<Tokens>(`${base_url}/api/auth/login`, {username, password})
      setTokens(response.data)
      notify.show('Login successful.', {autoHideDuration: 1000, severity: 'success'})
      return null
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) return e.response.data
    }
    return 'Something went wrong'
  }


  async function register(username: string, email: string, password: string): Promise<ErrorResponse | string | null> {
    try {
      const response = await axios.post<string>(`${base_url}/api/auth/register`, {username, email, password})
      notify.show(response.data, {autoHideDuration: 1000, severity: 'success'})
      return null
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) return e.response.data
    }
    notify.show('Something went wrong.', {autoHideDuration: 3000, severity: 'error'})
    return null
  }


  async function logout() {
    Storage.remove("user_tokens")
    setTokens(emptyTokens)
    await axios.post(`${base_url}/api/auth/logout`)
  }


  function isLoggedIn(): boolean {
    return isAccessTokenValid()
  }


  async function refreshToken(): Promise<ErrorResponse | string | null> {
    try {
      const response = axios.post(`${base_url}/api/auth/refresh`, {refreshToken: tokens.refreshToken})
      console.log('Token refreshed')
      console.log(response)
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) {
        await logout()
        return e.response.data
      }
      console.error('refreshToken error was invalid!', e)
      return 'Something went wrong'
    }
    return null
  }


  function isAccessTokenValid(): boolean {
    if (tokens.accessToken.length === 0) return false
    try {
      console.log(tokens.accessToken)
      const decodedToken = jwtDecode<JwtPayload>(tokens.accessToken)
      console.log(decodedToken)
    } catch (e) {
      console.warn('Error while decoding Access Token ', e)
      return false
    }
    return true
  }


  return (
    <ClientContext.Provider value={{user, tokens, login, register, logout, isLoggedIn}}>
      {children}
    </ClientContext.Provider>
  );
}

export default ClientProvider;
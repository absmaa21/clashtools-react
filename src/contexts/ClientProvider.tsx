import {ReactNode, useEffect, useState} from "react";
import { ClientContext } from "./contexts";
import {base_url} from "../env.ts";
import axios from "axios";
import {useNotifications} from "@toolpad/core";
import {ErrorResponse} from "../types/ApiResponse.ts";
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie'

interface ClientProviderProps {
  children: ReactNode,
}

function ClientProvider({children}: ClientProviderProps) {

  const notify = useNotifications()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (isAccessTokenValid()) refreshUser()
    else refreshToken().then(r => r === null && console.log('Tokens refreshed.'))
  }, []);


  function isLoggedIn() {
    return user !== null && isAccessTokenValid()
  }


  function refreshUser(accessToken?: AccessToken) {
    if (!accessToken) {
      const raw = Cookies.get('access_token')!
      accessToken = jwtDecode<AccessToken>(raw)
    }

    setUser({
      username: accessToken.sub,
      roles: accessToken.roles,
    })
  }


  function setTokens(accessToken: string, refreshToken: string) {
    const decodedAccess = jwtDecode<AccessToken>(accessToken)
    Cookies.set('access_token', accessToken, { expires: decodedAccess.exp, sameSite: 'strict', secure: true })
    Cookies.set('refresh_token', refreshToken, { sameSite: 'strict', secure: true })
    refreshUser(decodedAccess)
  }


  async function login(username: string, password: string): Promise<ErrorResponse | string | null> {
    try {
      const response = await axios.post<Tokens>(`${base_url}/api/auth/login`, {username, password})
      setTokens(response.data.accessToken, response.data.refreshToken)
      notify.show('Login successful.', {autoHideDuration: 1000, severity: 'success'})
      return null
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) return e.response.data
      console.log(e)
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
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    // Thomas: "Braucht noch bissl Entwicklung"
    // await axios.post(`${base_url}/api/auth/logout`)
  }


  async function refreshToken(): Promise<ErrorResponse | string | null> {
    const refreshToken = Cookies.get('refresh_token')
    if (!refreshToken) {
      await logout()
      return 'No refresh token found'
    }

    try {
      const response = await axios.post<Tokens>(`${base_url}/api/auth/refresh`, {refreshToken: refreshToken})
      setTokens(response.data.accessToken, response.data.refreshToken)
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
    const accessToken = Cookies.get('access_token')
    if (!accessToken) return false

    try {
      const decoded = jwtDecode<AccessToken>(accessToken)
      return decoded.exp * 1000 > Date.now()
    } catch (e) {
      console.warn('Error while decoding Access Token ', e)
      return false
    }
  }


  return (
    <ClientContext.Provider value={{user, login, register, logout, isLoggedIn}}>
      {children}
    </ClientContext.Provider>
  );
}

export default ClientProvider;
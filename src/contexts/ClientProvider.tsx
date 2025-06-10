import {ReactNode, useCallback, useEffect, useState} from "react";
import { ClientContext } from "./contexts";
import {base_url, skipNetwork} from "../env.ts";
import axios, {isAxiosError} from "axios";
import {useNotifications} from "@toolpad/core";
import {ApiResponse, ErrorResponse} from "../types/ApiResponse.ts";
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie'

interface ClientProviderProps {
  children: ReactNode,
}

function ClientProvider({children}: ClientProviderProps) {

  const notify = useNotifications()
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])

  useEffect(() => {
    if (isAccessTokenValid()) refreshUser().then()
    else refreshToken().then(r => r === null && console.log('Tokens refreshed.'))
  }, []);


  const getAccounts = useCallback(async (userId: number) => {
    const response = await axios.get<Account[]>(`${base_url}/api/accounts/by-user/${userId}`)
    if (response.status / 200 === 1) {
      setAccounts(response.data)
      return
    }

    console.log(response)
  }, [])

  useEffect(() => {
    if (user) getAccounts(user.id).then()
  }, [getAccounts, user]);


  function isLoggedIn() {
    return user !== null && isAccessTokenValid()
  }


  async function refreshUser(accessToken?: AccessToken) {
    if (skipNetwork) {
      setUser({
        username: user?.username ?? 'DemoUser',
        roles: ['ROLE_ADMIN'],
        id: 1,
      })
      return
    }

    let userId: number = -1
    try {
      const response = await axios.get<ApiResponse<number>>(`${base_url}/api/user-info/current-user-id`, {withCredentials: true})
      const data = response.data.data
      if (response.status / 200 === 1 && data) userId = data
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Get UserInfo: AxiosError')
      notify.show(`Something went wrong getting UserInfo.`, {autoHideDuration: 2000, severity: 'error'})
    }

    if (!accessToken) {
      const raw = Cookies.get('access_token')!
      accessToken = jwtDecode<AccessToken>(raw)
    }

    setUser({
      username: accessToken.sub,
      roles: accessToken.roles,
      id: userId,
    })
  }


  function setTokens(accessToken: string, refreshToken: string) {
    const decodedAccess = jwtDecode<AccessToken>(accessToken)
    Cookies.set('refresh_token', refreshToken)
    refreshUser(decodedAccess).then()
  }


  async function login(username: string, password: string): Promise<ErrorResponse | string | null> {
    if (skipNetwork) {
      Cookies.set('access_token', 'asdasd')
      Cookies.set('refresh_token', 'cvbcvb')
      setUser({
        username: username,
        roles: ['ROLE_ADMIN'],
        id: 1,
      })
      return null
    }

    try {
      const response = await axios.post<ApiResponse<Tokens>>(`${base_url}/api/auth/login`, {username, password}, {withCredentials: true})
      const data = response.data
      if (!data.data) return 'No tokens! ' + response
      setTokens(data.data.accessToken, data.data.refreshToken)
      notify.show('Login successful.', {autoHideDuration: 1000, severity: 'success'})
      window.location.reload()
      return null
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) return e.response.data
      console.log(e)
    }
    return 'Something went wrong'
  }


  async function register(username: string, email: string, password: string): Promise<ErrorResponse | string | null> {
    try {
      const response = await axios.post<ApiResponse<null>>(`${base_url}/api/auth/register`, {username, email, password})
      if (response.data.success) {
        notify.show('Successfully registered', {autoHideDuration: 1000, severity: 'success'})
        return null
      }
    } catch (e) {
      if (axios.isAxiosError<ErrorResponse>(e) && e.response) return e.response.data
    }
    notify.show('Something went wrong.', {autoHideDuration: 3000, severity: 'error'})
    return null
  }


  async function logout() {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
    // Thomas: "braucht noch bissl arbeit"
    //await axios.post(`${base_url}/api/auth/logout`, {}, {withCredentials: true})
  }


  async function refreshToken(): Promise<ErrorResponse | string | null> {
    if (skipNetwork) return null

    const refreshToken = Cookies.get('refresh_token')
    if (!refreshToken) {
      await logout()
      console.log('No refresh token found!')
      return 'No refresh token found'
    }

    try {
      const response = await axios.post<ApiResponse<Tokens>>(`${base_url}/api/auth/refresh`, {refreshToken: refreshToken}, {withCredentials: true})
      const data = response.data.data
      if (!data) {
        console.log('Something went wrong refreshing tokens ', response)
        logout().then()
        return null
      }
      setTokens(data.accessToken, data.refreshToken)
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
    if (skipNetwork) return !!accessToken
    if (!accessToken) {
      console.log(`Access Token is undefined!`)
      return false
    }

    try {
      const decoded = jwtDecode<AccessToken>(accessToken)
      return decoded.exp * 1000 > Date.now()
    } catch (e) {
      console.warn('Error while decoding Access Token ', e)
      return false
    }
  }


  function isAdmin(): boolean {
    if (skipNetwork) return true
    return !!user && user.roles.includes('ROLE_ADMIN') && isAccessTokenValid()
  }


  async function createAccount(newAccount: AccountRequest): Promise<string | null> {
    if (skipNetwork) {
      setAccounts(p => [...p, {
        ...newAccount,
        id: -1,
        username: '',
        baseEntityIds: [],
      }])
      return null
    }

    try {
      const response = await axios.post<ApiResponse<Account>>(`${base_url}/api/accounts`, newAccount)
      const data = response.data.data
      if (!data) {
        console.log('Something went wrong creating account ', newAccount.accountName)
        return 'Something went wrong creating account ' + newAccount.accountName
      }
      setAccounts(p => [...p, data])
      return null
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        await logout()
        return `${e}`
      }
      console.error('refreshToken error was invalid!', e)
      return 'Something went wrong'
    }
  }


  return (
    <ClientContext.Provider value={{user, accounts, login, register, logout, isLoggedIn, isAdmin, createAccount}}>
      {children}
    </ClientContext.Provider>
  );
}

export default ClientProvider;
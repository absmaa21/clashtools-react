import {AccountEntityContext} from "./contexts.ts";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {ApiResponse, ErrorResponse} from "../types/ApiResponse.ts";
import {base_url, skipNetwork} from "../env.ts";
import axios, {isAxiosError} from "axios";
import {useNotifications} from "@toolpad/core";
import {demoAccountEntities} from "../services/demoData.ts";
import useClient from "../hooks/useClient.ts";
import {useNavigate, useParams} from "react-router";
import useEntities from "../hooks/useEntities.ts";

function AccountEntityProvider({children}: {children: ReactNode}) {

  const Client = useClient()
  const notify = useNotifications()
  const navigation = useNavigate()
  const {entities} = useEntities()
  const [accountEntities, setAccountEntities] = useState<AccountEntity[]>([])
  const { accountId } = useParams()
  
  const fetchUpgrades = useCallback(async (): Promise<ErrorResponse | string | null> => {
    if (skipNetwork) {
      setAccountEntities(p => p.length > 0 ? p : demoAccountEntities)
      return null
    }

    if (!location.pathname.includes('tracker')) return 'Not in tracker'

    const id: number | undefined = parseInt(accountId ?? location.pathname.split('/')[2]) ?? undefined
    if (!id) {
      console.log('no id')
      return 'No id in params!'
    }

    try {
      const response = await axios.get<ApiResponse<AccountEntityResponse[]>>(`${base_url}/api/account-entity/account/${id}`, {withCredentials: true})
      const data = response.data.data ?? []
      const accountEntities: AccountEntity[] = []
      console.log(data)
      for (const accEnt of data) {
        const foundEntity = entities.find(e => e.id === accEnt.entityId)
        if (!foundEntity) console.log(`Entity with id ${accEnt.entityId} not found!`)
        else accountEntities.push({
          ...accEnt,
          entity: foundEntity,
        })
      }
      if (data) setAccountEntities(accountEntities)
      else console.log('Error getting AccountEntities: ', response)
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Get AccountUpgrades: AxiosError')
      notify.show(`Something went wrong getting AccountEntities.`, {autoHideDuration: 2000, severity: 'error'})
    }
    return null
  }, [accountId, entities, notify, Client.user, navigation])

  useEffect(() => {
    fetchUpgrades().then()
  }, [fetchUpgrades]);

  async function startUpgrade(id: number): Promise<ErrorResponse | string | null> {
    const foundEntity = accountEntities.find(a => a.id === id)
    if (!foundEntity) return `Id '${id}' not found!`

    if (skipNetwork) {
      foundEntity.upgradeStart = Date.now()
      setAccountEntities(p => [...p.filter(a => a.id !== id), foundEntity])
      return null
    }

    try {
      const response = await axios.patch<ApiResponse<AccountEntity>>(`${base_url}/api/account-entity/${id}/upgrade-start`, {withCredentials: true}, {
        params: {"upgradeStart": Date.now()}
      })
      console.log(Date.now())
      const data = response.data.data
      if (data) fetchUpgrades().then()
      else console.log(`Error starting upgrade for ${id}: `, response)
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Start Upgrade: AxiosError')
      notify.show(`Something went wrong starting an upgrade.`, {autoHideDuration: 2000, severity: 'error'})
    }
    return null
  }


  async function editUpgrade(updatedUpgrade: AccountEntity): Promise<ErrorResponse | string | null> {
    if (!accountEntities.find(a => a.id === updatedUpgrade.id)) return `Id '${updatedUpgrade.id}' not found!`
    if (checkForFinish(updatedUpgrade.id)) {
      updatedUpgrade.level++
      updatedUpgrade.upgradeStart = undefined
    }

    if (skipNetwork) {
      setAccountEntities(p => [...p.filter(a => a.id !== updatedUpgrade.id), updatedUpgrade])
      return null
    }

    const accountEntityReq: AccountEntityRequestDTO = {
      accountId: parseInt(accountId ?? location.pathname.split('/')[2]),
      baseEntityId: updatedUpgrade.entity.id,
      currentLevel: updatedUpgrade.level,
      upgradeStart: updatedUpgrade.upgradeStart,
    }

    try {
      const response = await axios.put<ApiResponse<AccountEntity>>(`${base_url}/api/account-entity/${updatedUpgrade.id}`, accountEntityReq, {withCredentials: true})
      const data = response.data.data
      if (data) fetchUpgrades().then()
      else console.log(`Error starting upgrade for ${updatedUpgrade.id}: `, response)
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Edit Upgrade: AxiosError')
      notify.show(`Something went wrong editing an upgrade.`, {autoHideDuration: 2000, severity: 'error'})
    }
    return null
  }


  async function cancelUpgrade(id: number): Promise<ErrorResponse | string | null> {
    const foundEntity = accountEntities.find(a => a.id === id)
    if (!foundEntity) return `Id '${id}' not found!`

    if (skipNetwork) {
      foundEntity.upgradeStart = undefined
      setAccountEntities(p => [...p.filter(a => a.id !== id), foundEntity])
      return null
    }

    try {
      await editUpgrade({
        ...foundEntity,
        upgradeStart: undefined,
      })
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Cancel Upgrade: AxiosError')
      notify.show(`Something went wrong canceling an upgrade.`, {autoHideDuration: 2000, severity: 'error'})
    }
    return null
  }


  async function createAccountEntity(newAccountEntity: AccountEntityRequestDTO): Promise<ErrorResponse | string | null> {
    if (skipNetwork) {
      console.log('missing')
      return null
    }

    try {
      const response = await axios.post<ApiResponse<AccountEntity>>(`${base_url}/api/account-entity`, newAccountEntity, {withCredentials: true})
      const data = response.data.data
      if (data) fetchUpgrades().then()
      else console.log(`Error creating accountEntity: `, response)
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Create AccountEntity: AxiosError')
      notify.show(`Something went wrong creating an accountEntity.`, {autoHideDuration: 2000, severity: 'error'})
    }
    return null
  }


  function checkForFinish(id: number): boolean {
    const accountEntity = accountEntities.find(ae => ae.id === id)
    if (!accountEntity || !accountEntity.upgradeStart) return false

    const nextLevel: EntityLevel | undefined = accountEntity.entity.levels[accountEntity.level]
    if (!nextLevel) return false

    return Date.now() >= accountEntity.upgradeStart + nextLevel.upgradeTime * 1000
  }


  return (
    <AccountEntityContext.Provider value={{ accountEntities, startUpgrade, editUpgrade, cancelUpgrade, checkForFinish, createAccountEntity }}>
      {children}
    </AccountEntityContext.Provider>
  );
}

export default AccountEntityProvider;
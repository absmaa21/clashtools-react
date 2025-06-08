import {AccountEntityContext} from "./contexts.ts";
import {ReactNode, useEffect, useState} from "react";
import {ApiResponse, ErrorResponse} from "../types/ApiResponse.ts";
import {base_url, skipNetwork} from "../env.ts";
import axios, {isAxiosError} from "axios";
import {useNotifications} from "@toolpad/core";
import {demoAccountEntities} from "../services/demoData.ts";
import useClient from "../hooks/useClient.ts";
import {useParams} from "react-router";

function AccountEntityProvider({children}: {children: ReactNode}) {

  const Client = useClient()
  const notify = useNotifications()
  const [accountEntities, setAccountEntities] = useState<AccountEntity[]>([])
  const { accountId } = useParams<{ accountId: string }>()

  useEffect(() => {
    async function getAccountUpgrades(): Promise<ErrorResponse | string | null> {
      if (skipNetwork) {
        setAccountEntities(p => p.length > 0 ? p : demoAccountEntities)
        return null
      }

      if (!accountId) return 'No id in params!'

      try {
        const response = await axios.get<ApiResponse<AccountEntity[]>>(`${base_url}/api/account-entity/${accountId}`)
        const data = response.data.data
        if (data) setAccountEntities(data)
        else console.log('Error getting AccountEntities: ', response)
      } catch (e) {
        if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Get AccountUpgrades: AxiosError')
        notify.show(`Something went wrong getting AccountEntities.`, {autoHideDuration: 2000, severity: 'error'})
      }
      return null
    }
    getAccountUpgrades().then()
  }, [accountEntities, notify, Client.user, accountId]);


  async function startUpgrade(id: number): Promise<ErrorResponse | string | null> {
    const foundEntity = accountEntities.find(a => a.id === id)
    if (!foundEntity) return `Id '${id}' not found!`

    if (skipNetwork) {
      foundEntity.upgradeStart = Date.now()
      setAccountEntities(p => [...p.filter(a => a.id !== id), foundEntity])
      return null
    }

    try {
      const response = await axios.get<ApiResponse<AccountEntity>>(`${base_url}/api/account-entity/${id}/upgrade-start`)
      const data = response.data.data
      if (data) setAccountEntities(p => [...p.filter(ae => ae.id !== data.id), data])
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

    try {
      const response = await axios.put<ApiResponse<AccountEntity>>(`${base_url}/api/account-entity/${updatedUpgrade.id}`, updatedUpgrade)
      const data = response.data.data
      if (data) setAccountEntities(p => [...p.filter(ae => ae.id !== data.id), data])
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


  function checkForFinish(id: number): boolean {
    const accountEntity = accountEntities.find(ae => ae.id === id)
    if (!accountEntity || !accountEntity.upgradeStart) return false

    const nextLevel: EntityLevel | undefined = accountEntity.entity.levels[accountEntity.level]
    if (!nextLevel) return false

    return (Date.now() >= accountEntity.upgradeStart + nextLevel.upgradeTime * 1000)
  }


  return (
    <AccountEntityContext.Provider value={{ accountEntities, startUpgrade, editUpgrade, cancelUpgrade, checkForFinish }}>
      {children}
    </AccountEntityContext.Provider>
  );
}

export default AccountEntityProvider;
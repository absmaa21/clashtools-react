import {AccountEntityContext} from "./contexts.ts";
import {ReactNode, useEffect, useState} from "react";
import {ErrorResponse} from "../types/ApiResponse.ts";
import {skipNetwork} from "../env.ts";
import {isAxiosError} from "axios";
import {useNotifications} from "@toolpad/core";
import {demoAccountEntities} from "../services/demoData.ts";
import useClient from "../hooks/useClient.ts";

function AccountEntityProvider({children}: {children: ReactNode}) {

  const Client = useClient()
  const notify = useNotifications()
  const [accountEntities, setAccountEntities] = useState<AccountEntity[]>([])

  useEffect(() => {
    async function getAccountUpgrades(): Promise<ErrorResponse | string | null> {
      if (skipNetwork) {
        setAccountEntities(p => p.length > 0 ? p : demoAccountEntities)
        return null
      }

      try {
        console.warn('No fetch for getting all AccountEntities')
      } catch (e) {
        if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Get AccountUpgrades: AxiosError')
        notify.show(`Something went wrong getting AccountEntities.`, {autoHideDuration: 2000, severity: 'error'})
      }
      return null
    }
    getAccountUpgrades().then()
  }, [accountEntities, notify, Client.user]);


  async function startUpgrade(id: number): Promise<ErrorResponse | string | null> {
    const foundEntity = accountEntities.find(a => a.id === id)
    if (!foundEntity) return `Id '${id}' not found!`

    if (skipNetwork) {
      foundEntity.upgradeStart = Date.now()
      setAccountEntities(p => [...p.filter(a => a.id !== id), foundEntity])
      return null
    }

    try {
      console.warn('No fetch for getting starting an upgrade.')
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Start Upgrade: AxiosError')
      notify.show(`Something went wrong starting an upgrade.`, {autoHideDuration: 2000, severity: 'error'})
    }
    return null
  }


  async function editUpgrade(updatedUpgrade: AccountEntity): Promise<ErrorResponse | string | null> {
    if (!accountEntities.find(a => a.id === updatedUpgrade.id)) return `Id '${updatedUpgrade.id}' not found!`
    if (await checkForFinish(updatedUpgrade.id)) {
      updatedUpgrade.level++
      updatedUpgrade.upgradeStart = undefined
    }

    if (skipNetwork) {
      setAccountEntities(p => [...p.filter(a => a.id !== updatedUpgrade.id), updatedUpgrade])
      return null
    }

    try {
      console.warn('No fetch for getting editing an upgrade.')
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
      console.warn('No fetch for getting canceling an upgrade.')
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
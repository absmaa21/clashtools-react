import {AccountEntityContext} from "./contexts.ts";
import {ReactNode, useEffect, useState} from "react";
import {ErrorResponse} from "../types/ApiResponse.ts";
import {skipNetwork} from "../env.ts";
import {isAxiosError} from "axios";
import {useNotifications} from "@toolpad/core";
import {demoAccountEntities} from "../services/demoData.ts";

function AccountEntityProvider({children}: {children: ReactNode}) {

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
  }, [accountEntities, notify]);


  async function startUpgrade(id: string): Promise<ErrorResponse | string | null> {
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


  async function cancelUpgrade(id: string): Promise<ErrorResponse | string | null> {
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


  return (
    <AccountEntityContext.Provider value={{ accountEntities, startUpgrade, editUpgrade, cancelUpgrade }}>
      {children}
    </AccountEntityContext.Provider>
  );
}

export default AccountEntityProvider;
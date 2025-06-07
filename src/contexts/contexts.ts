import React, {createContext, SetStateAction} from "react";
import {ErrorResponse} from "../types/ApiResponse.ts";


export interface EntitiesContextProps {
  entities: Entity[],
  addEntity: (newEntity: Entity) => Promise<void>,
  updateEntity: (newEntity: Entity) => Promise<void>,
  removeEntity: (id: number) => Promise<void>,
  addLevel: (entity: Entity, newLevel: EntityLevel) => Promise<void>,
  editLevel: (entity: Entity, updatedLevel: EntityLevel) => Promise<void>,
  removeLevel: (entity: Entity, entityLevel: EntityLevel) => Promise<void>,
}
export const EntitiesContext = createContext<EntitiesContextProps | undefined>(undefined)


export interface ClientContextProps {
  user: User | null,
  accounts: Account[],
  login: (username: string, password: string) => Promise<ErrorResponse | string | null>,
  register: (username: string, email: string, password: string) => Promise<ErrorResponse | string | null>,
  logout: () => Promise<void>,
  isLoggedIn: () => boolean,
  isAdmin: () => boolean,
  createAccount: (newAccount: AccountRequest) => Promise<string | null>,
}
export const ClientContext = createContext<ClientContextProps | undefined>(undefined)


export interface SettingsContextProps {
  reducedMotion: boolean,
  setReducedMotion: React.Dispatch<SetStateAction<boolean>>,
  showFinishedCategories: boolean,
  toggleShowFinishedCategories: () => void,
}
export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)


export interface AccountEntityProps {
  accountEntities: AccountEntity[],
  startUpgrade: (id: number) => Promise<ErrorResponse | string | null>,
  editUpgrade: (updatedUpgrade: AccountEntity) => Promise<ErrorResponse | string | null>
  cancelUpgrade: (id: number) => Promise<ErrorResponse | string | null>,
  checkForFinish: (id: number) => boolean,
}
export const AccountEntityContext = createContext<AccountEntityProps | undefined>(undefined)
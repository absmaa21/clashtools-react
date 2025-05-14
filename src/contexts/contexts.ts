import React, {createContext, SetStateAction} from "react";
import {ErrorResponse} from "../types/ApiResponse.ts";


export interface EntitiesContextProps {
  entities: Entity[],
  addEntity: (newEntity: Entity) => void,
  updateEntity: (newEntity: Entity) => void,
  removeEntity: (id: string) => void,
  addLevel: (entity: Entity, newLevel: EntityLevel) => void,
  editLevel: (entity: Entity, updatedLevel: EntityLevel) => void,
  removeLevel: (entity: Entity, entityLevel: EntityLevel) => void,
}
export const EntitiesContext = createContext<EntitiesContextProps | undefined>(undefined)


export interface ClientContextProps {
  user: User | null,
  tokens: Tokens,
  login: (username: string, password: string) => Promise<ErrorResponse | string | null>,
  register: (username: string, email: string, password: string) => Promise<ErrorResponse | string | null>,
  logout: () => Promise<void>,
  isLoggedIn: () => boolean,
}
export const ClientContext = createContext<ClientContextProps | undefined>(undefined)


export interface SettingsContextProps {
  reducedMotion: boolean,
  setReducedMotion: React.Dispatch<SetStateAction<boolean>>,
}
export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)
import React, {createContext, SetStateAction} from "react";


export interface EntitiesContextProps {
  entities: Entity[],
  addEntity: (newEntity: Entity) => ServiceResponse,
  updateEntity: <T extends keyof Entity>(id: string, key: T, value: Entity[T]) => ServiceResponse,
}
export const EntitiesContext = createContext<EntitiesContextProps | undefined>(undefined)


export interface EntityStatsContextProps {
  stats: EntityStat[],
}
export const EntityStatsContext = createContext<EntityStatsContextProps | undefined>(undefined)


export interface ClientContextProps {
  user: User | null,
  authToken: string,
  refreshToken: string,
  login: (username: string, password: string) => boolean,
  register: (username: string, email: string, password: string) => boolean,
  logout: () => void,
  isLoggedIn: () => boolean,
}
export const ClientContext = createContext<ClientContextProps | undefined>(undefined)


export interface SettingsContextProps {
  reducedMotion: boolean,
  setReducedMotion: React.Dispatch<SetStateAction<boolean>>,
}
export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)
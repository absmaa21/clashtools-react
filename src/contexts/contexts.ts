import {createContext} from "react";


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
  authToken: string,
  refreshToken: string,
  login: (username: string, password: string) => void,
  register: (username: string, email: string, password: string) => void,
  logout: () => void,
}

export const ClientContext = createContext<ClientContextProps | undefined>(undefined)
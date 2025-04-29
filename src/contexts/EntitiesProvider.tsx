import {ReactNode, useState} from "react";
import {EntitiesContext} from "./contexts.ts";
import {demoEntities} from "../services/demoData.ts";

interface EntitiesProviderProps {
  children: ReactNode,
}

function EntitiesProvider({children}: EntitiesProviderProps) {

  const [entities, setEntities] = useState<Entity[]>(demoEntities)

  function addEntity(newBuilding: Entity): ServiceResponse {
    setEntities(p => [...p, newBuilding])
    return {type: 'success', message: 'Successfully added the building!'}
  }

  function updateEntity<T extends keyof Entity>(id: string, key: T, value: Entity[T]): ServiceResponse {
    const oldEntity = entities.find(e => e.id === id)

    if (!oldEntity) {
      return {type: 'error', message: `Buildings with id ${id} not found!`}
    }

    oldEntity[key] = value;
    setEntities(p => [...p.filter(e => e.id !== id), oldEntity])

    return {type: 'success', message: 'Successfully updated the building!'}
  }

  return (
    <EntitiesContext.Provider value={{entities, addEntity, updateEntity}}>
      {children}
    </EntitiesContext.Provider>
  );
}

export default EntitiesProvider;
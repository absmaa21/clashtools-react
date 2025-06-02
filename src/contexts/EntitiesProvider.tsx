import {ReactNode, useEffect, useState} from "react";
import {EntitiesContext} from "./contexts.ts";
import {demoEntities} from "../services/demoData.ts";
import {useNotifications} from "@toolpad/core";
import {skipNetwork, base_url} from "../env.ts";
import axios, {isAxiosError} from "axios";
import useClient from "../hooks/useClient.ts";

interface EntitiesProviderProps {
  children: ReactNode,
}

function EntitiesProvider({children}: EntitiesProviderProps) {

  const Client = useClient()
  const notify = useNotifications()
  const [entities, setEntities] = useState<Entity[]>([])
  const [refreshEntities, setRefreshEntities] = useState<boolean>(false)

  useEffect(() => {
    async function getEntities() {
      if (!refreshEntities) return
      if (skipNetwork) {
        setEntities(p => p.length > 0 ? p : demoEntities)
        return
      }

      try {
        const response = await axios.get<Entity[]>(`${base_url}/api/base-entities`)
        if (response.status === 200) setEntities(response.data)
        else console.log('GetAllEntities: Something went wrong. ', response)
      } catch (e) {
        if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response) : 'Get Entities: AxiosError')
        notify.show(`Something went wrong getting entities.`, {autoHideDuration: 2000, severity: 'error'})
      }
    }
    getEntities().then(() => setRefreshEntities(false))
  }, [refreshEntities, notify, Client.user]);

  useEffect(() => {
    setRefreshEntities(true)
  }, [entities]);


  async function addEntity(newEntity: Entity) {
    const newEntities: Entity[] = [...entities, newEntity]
    if (skipNetwork) {
      setEntities(newEntities)
      return
    }

    try {
      const response = await axios.post<Entity>(`${base_url}/api/base-entities`, newEntity)
      if (response.status === 200) {
        setEntities(p => [...p, response.data])
        notify.show(`Successfully added ${newEntity.name}`, {autoHideDuration: 1000, severity: 'success'})
      }
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Add Entity: AxiosError')
      notify.show(`Something went wrong adding ${newEntity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  /*
  function patchEntity<T extends keyof Entity>(id: string, key: T, value: Entity[T]) {
    const oldEntity = entities.find(e => e.id === id)

    if (!oldEntity) {
      notify.show(`Entity with id ${id} not found!`, {autoHideDuration: 2000, severity: 'error'})
      return
    }

    oldEntity[key] = value;
    setEntities(p => [...p.filter(e => e.id !== id), oldEntity])

    notify.show(`Successfully updated ${oldEntity.name}.`, {autoHideDuration: 1000, severity: 'success'})
  }
   */

  async function updateEntity(newEntity: Entity) {
    const oldEntity = entities.find(e => e.id === newEntity.id)
    if (!oldEntity) {
      notify.show(`Entity with id ${newEntity.id} not found!`, {autoHideDuration: 2000, severity: 'error'})
      return
    }

    const newEntities: Entity[] = [...entities.filter(e => e.id !== newEntity.id), newEntity]
    if (skipNetwork) {
      setEntities(newEntities)
      return
    }

    try {
      console.warn('No put for updating entities')
      //notify.show(`Successfully updated ${oldEntity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Update Entity: AxiosError')
      notify.show(`Something went wrong updating ${newEntity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function removeEntity(id: string) {
    const entity = entities.find(e => e.id === id)
    if (!entity) {
      notify.show(`Entity with id ${id} not found!`, {autoHideDuration: 2000, severity: 'error'})
      return
    }

    const newEntities: Entity[] = entities.filter(e => e.id !== id)
    if (skipNetwork) {
      setEntities(newEntities)
      return
    }

    try {
      console.warn('No delete for removing entities')
      //notify.show(`Successfully removed ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Remove Entity: AxiosError')
      notify.show(`Something went wrong updating ${entity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function addLevel(entity: Entity, newLevel: EntityLevel) {
    if (entity.levels.find(l => l.level === newLevel.level)) {
      notify.show(`Level ${newLevel.level} already exists!`, {autoHideDuration: 2000, severity: 'error'})
      return
    }

    entity.levels.push(newLevel)
    const newEntities: Entity[] = [...entities.filter(e => e.id !== entity.id), entity]
    if (skipNetwork) {
      setEntities(newEntities)
      return
    }

    try {
      console.warn('No post for adding a new entity level')
      //notify.show(`Successfully added Level ${newLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Add EntityLevel: AxiosError')
      notify.show(`Error while adding Level ${newLevel.level} for ${entity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function editLevel(entity: Entity, updatedLevel: EntityLevel) {
    entity.levels = [...entity.levels.filter(l => l.level !== updatedLevel.level), updatedLevel]
    const newEntities: Entity[] = [...entities.filter(e => e.id !== entity.id), entity]
    if (skipNetwork) {
      setEntities(newEntities)
      return
    }

    try {
      console.warn('No put for updating a entity level')
      //notify.show(`Successfully edited Level ${updatedLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Edit EntityLevel: AxiosError')
      notify.show(`Error while editing Level ${updatedLevel.level} for ${entity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function removeLevel(entity: Entity, entityLevel: EntityLevel) {
    entity.levels = [...entity.levels.filter(l => l.level !== entityLevel.level)]
    const newEntities: Entity[] = [...entities.filter(e => e.id !== entity.id), entity]
    if (skipNetwork) {
      setEntities(newEntities)
      return
    }

    try {
      console.warn('No delete for removing entity level')
      //notify.show(`Successfully deleted Level ${entityLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Remove EntityLevel: AxiosError')
      notify.show(`Error while removing Level ${entityLevel.level} for ${entity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  return (
    <EntitiesContext.Provider value={{entities, addEntity, updateEntity, addLevel, editLevel, removeLevel, removeEntity}}>
      {children}
    </EntitiesContext.Provider>
  );
}

export default EntitiesProvider;
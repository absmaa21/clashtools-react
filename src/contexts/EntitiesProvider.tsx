import {ReactNode, useEffect, useState} from "react";
import {EntitiesContext} from "./contexts.ts";
import {demoEntities} from "../services/demoData.ts";
import {useNotifications} from "@toolpad/core";
import {base_url, skipNetwork} from "../env.ts";
import axios, {isAxiosError} from "axios";
import useClient from "../hooks/useClient.ts";
import {BaseEntityLevelRequest} from "../types/DTOs/BaseEntityLevelRequest";

interface EntitiesProviderProps {
  children: ReactNode,
}

function EntitiesProvider({children}: EntitiesProviderProps) {

  const Client = useClient()
  const notify = useNotifications()
  const [entities, setEntities] = useState<Entity[]>([])
  const [refreshEntities, setRefreshEntities] = useState<boolean>(true)

  useEffect(() => {
    async function getEntities() {
      if (!refreshEntities) return
      if (skipNetwork) {
        setEntities(p => p.length > 0 ? p : demoEntities)
        return
      }

      try {
        const response = await axios.get<BaseEntityResponse[]>(`${base_url}/api/base-entities`)
        if (response.status === 200) {
          console.log(response.data)
          const newEntities: Entity[] = []
          response.data.forEach(e => newEntities.push({
            id: e.id,
            name: e.name,
            category: e.categoryId,
            levels: e.baseEntityLevels ?? [],
          }))
          setEntities(newEntities)
        }
        else console.log('GetAllEntities: Something went wrong. ', response)
      } catch (e) {
        if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response) : 'Get Entities: AxiosError')
        notify.show(`Something went wrong getting entities.`, {autoHideDuration: 2000, severity: 'error'})
      }
    }
    getEntities().then(() => setRefreshEntities(false))
  }, [refreshEntities, notify, Client.user]);


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
        setRefreshEntities(true)
        notify.show(`Successfully added ${newEntity.name}`, {autoHideDuration: 1000, severity: 'success'})
      }
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Add Entity: AxiosError')
      notify.show(`Something went wrong adding ${newEntity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function updateEntity(newEntity: Entity) {
    const oldEntity = entities.find(e => e.id === newEntity.id)
    if (!oldEntity) {
      notify.show(`Entity with id ${newEntity.id} not found!`, {autoHideDuration: 2000, severity: 'error'})
      return
    }

    if (skipNetwork) {
      setEntities(p => [...p.filter(e => e.id !== newEntity.id), newEntity])
      return
    }

    try {
      const response = await axios.put<Entity>(`${base_url}/api/base-entities/${oldEntity.id}`, newEntity)
      if (response.status !== 200) return
      setEntities(p => [...p.filter(e => e.id !== newEntity.id), response.data])
      setRefreshEntities(true)
      notify.show(`Successfully updated ${oldEntity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Update Entity: AxiosError')
      notify.show(`Something went wrong updating ${newEntity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function removeEntity(id: number) {
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
      const response = await axios.delete(`${base_url}/api/base-entities/${entity.id}`)
      if (response.status !== 204) {
        notify.show(`Error while deleting Entity: ${JSON.stringify(response.data)}`)
        return
      }
      setRefreshEntities(true)
      notify.show(`Successfully deleted ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
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

    if (skipNetwork) {
      entity.levels.push(newLevel)
      const newEntities: Entity[] = [...entities.filter(e => e.id !== entity.id), entity]
      setEntities(newEntities)
      return
    }

    try {
      const body: BaseEntityLevelRequest = {
        baseEntityId: entity.id,
        level: newLevel.level,
        attributeIds: [],
        resourceType: newLevel.resource,
        upgradeCost: newLevel.cost,
        upgradeTime: newLevel.upgradeTime,
        imgPath: newLevel.imgPath,
      }
      const response = await axios.post<EntityLevel[]>(`${base_url}/api/base-entity-levels`, body)
      if (response.status % 200 < 100) {
        notify.show(`Successfully added Level ${newLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
        /*
        entity.levels.push(newLevel)
        const newEntities: Entity[] = [...entities.filter(e => e.id !== entity.id), entity]
        setEntities(newEntities)
         */
        setRefreshEntities(true)
      }
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
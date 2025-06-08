import {ReactNode, useCallback, useEffect, useState} from "react";
import {EntitiesContext} from "./contexts.ts";
import {demoEntities} from "../services/demoData.ts";
import {useNotifications} from "@toolpad/core";
import {base_url, skipNetwork} from "../env.ts";
import axios, {isAxiosError} from "axios";
import {BaseEntityLevelRequest} from "../types/DTOs/BaseEntityLevelRequest";
import {ApiResponse} from "../types/ApiResponse.ts";
import {BaseEntityResponse} from "../types/DTOs/BaseEntityResponse";

interface EntitiesProviderProps {
  children: ReactNode,
}

function EntitiesProvider({children}: EntitiesProviderProps) {

  const notify = useNotifications()
  const [entities, setEntities] = useState<Entity[]>([])
  const [loading, setLoading] = useState(false);

  const fetchEntities = useCallback(async () => {
    if (loading) return
    if (skipNetwork) {
      setEntities(p => (p.length > 0 ? p : demoEntities));
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get<ApiResponse<BaseEntityResponse[]>>(`${base_url}/api/base-entities/with-levels`)
      const { success, data, message } = response.data

      if (success && data) {
        const newEntities: Entity[] = data.map(e => {
          const levels: EntityLevel[] = []
          for (const level of e.baseEntityLevels) {
            levels.push({
              ...level,
              cost: level.upgradeCost,
              resource: level.resourceType,
            })
          }
          return {
            id: e.id,
            name: e.name,
            category: e.categoryId,
            levels: levels,
          }
        })
        setEntities(newEntities);
      } else {
        console.error('GetAllEntities: Failed', message);
      }
    } catch (e) {
      if (isAxiosError(e)) console.error(e.response);
      notify.show(`Something went wrong getting entities.`, { autoHideDuration: 2000, severity: 'error' });
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchEntities().then()
  }, [fetchEntities])


  async function addEntity(newEntity: Entity) {
    const newEntities: Entity[] = [...entities, newEntity]
    if (skipNetwork) {
      setEntities(newEntities)
      return
    }

    try {
      const response = await axios.post<ApiResponse<Entity>>(`${base_url}/api/base-entities`, newEntity)

      if (isSuccessResponse(response.status)) {
        fetchEntities().then()
        notify.show(`Successfully added ${newEntity.name}`, {autoHideDuration: 1000, severity: 'success'})
      } else {
        console.log(response)
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
      const response = await axios.put<ApiResponse<Entity>>(`${base_url}/api/base-entities/${oldEntity.id}`, newEntity)
      if (isSuccessResponse(response.status)) return

      fetchEntities().then()
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
      if (!isSuccessResponse(response.status)) {
        notify.show(`Error while deleting Entity: ${JSON.stringify(response.data)}`)
        return
      }
      fetchEntities().then()
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
      const response = await axios.post<ApiResponse<EntityLevel[]>>(`${base_url}/api/base-entity-levels`, body)
      if (isSuccessResponse(response.status)) {
        notify.show(`Successfully added Level ${newLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
        fetchEntities().then()
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

  function isSuccessResponse(status: number) {
    return status >= 200 && status < 300
  }

  return (
    <EntitiesContext.Provider value={{entities, addEntity, updateEntity, addLevel, editLevel, removeLevel, removeEntity}}>
      {children}
    </EntitiesContext.Provider>
  );
}

export default EntitiesProvider;
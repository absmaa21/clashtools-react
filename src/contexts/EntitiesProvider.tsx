import {ReactNode, useEffect, useState} from "react";
import {EntitiesContext} from "./contexts.ts";
import {demoEntities} from "../services/demoData.ts";
import {useNotifications} from "@toolpad/core";
import {skipNetwork} from "../env.ts";
import {isAxiosError} from "axios";

interface EntitiesProviderProps {
  children: ReactNode,
}

function EntitiesProvider({children}: EntitiesProviderProps) {

  const notify = useNotifications()
  const [entities, setEntities] = useState<Entity[]>([])

  useEffect(() => {
    if (skipNetwork) setEntities(demoEntities)
    else {
      console.warn('No fetch for getting all entities')
    }
  }, []);

  async function addEntity(newEntity: Entity) {
    try {
      if (skipNetwork) setEntities(p => [...p, newEntity])
      else {
        console.warn('No post for adding a new entity')
      }
      notify.show(`Successfully added ${newEntity.name}`, {autoHideDuration: 1000, severity: 'success'})
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

    try {
      if (skipNetwork) setEntities(p => [...p.filter(e => e.id !== newEntity.id), newEntity])
      else {
        console.warn('No put for updating entities')
      }
      notify.show(`Successfully updated ${oldEntity.name}.`, {autoHideDuration: 1000, severity: 'success'})
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

    setEntities(p => [...p.filter(e => e.id !== id)])
    notify.show(`Successfully deleted ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})

    try {
      if (skipNetwork) setEntities(p => [...p.filter(e => e.id !== id)])
      else {
        console.warn('No delete for removing entities')
      }
      notify.show(`Successfully removed ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
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

    try {
      if (skipNetwork) {
        entity.levels.push(newLevel)
        setEntities(p => [...p.filter(e => e.id !== entity.id), entity])
      }
      else {
        console.warn('No post for adding a new entity level')
      }
      notify.show(`Successfully added Level ${newLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Add EntityLevel: AxiosError')
      notify.show(`Error while adding Level ${newLevel.level} for ${entity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function editLevel(entity: Entity, updatedLevel: EntityLevel) {
    try {
      if (skipNetwork) {
        entity.levels = [...entity.levels.filter(l => l.level !== updatedLevel.level), updatedLevel]
        setEntities(p => [...p.filter(e => e.id !== entity.id), entity])
      } else {
        console.warn('No put for updating a entity level')
      }
      notify.show(`Successfully edited Level ${updatedLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
    } catch (e) {
      if (isAxiosError(e)) console.log(e.response ? JSON.stringify(e.response.data) : 'Edit EntityLevel: AxiosError')
      notify.show(`Error while editing Level ${updatedLevel.level} for ${entity.name}.`, {autoHideDuration: 2000, severity: 'error'})
    }
  }

  async function removeLevel(entity: Entity, entityLevel: EntityLevel) {
    try {
      if (skipNetwork) {
        entity.levels = [...entity.levels.filter(l => l.level !== entityLevel.level)]
        setEntities(p => [...p.filter(e => e.id !== entity.id), entity])
      } else {
        console.warn('No delete for removing entity level')
      }
      notify.show(`Successfully deleted Level ${entityLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
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
import {ReactNode, useState} from "react";
import {EntitiesContext} from "./contexts.ts";
import {demoEntities} from "../services/demoData.ts";
import {useNotifications} from "@toolpad/core";

interface EntitiesProviderProps {
  children: ReactNode,
}

function EntitiesProvider({children}: EntitiesProviderProps) {

  const notify = useNotifications()
  const [entities, setEntities] = useState<Entity[]>(demoEntities)

  function addEntity(newEntity: Entity) {
    setEntities(p => [...p, newEntity])
    notify.show(`Successfully added ${newEntity.name}`, {autoHideDuration: 1000, severity: 'success'})
  }

  function updateEntity<T extends keyof Entity>(id: string, key: T, value: Entity[T]) {
    const oldEntity = entities.find(e => e.id === id)

    if (!oldEntity) {
      notify.show(`Entity with id ${id} not found!`, {autoHideDuration: 2000, severity: 'error'})
      return
    }

    oldEntity[key] = value;
    setEntities(p => [...p.filter(e => e.id !== id), oldEntity])

    notify.show(`Successfully updated ${oldEntity.name}.`, {autoHideDuration: 1000, severity: 'success'})
  }

  function addLevel(entity: Entity, newLevel: EntityLevel) {
    if (entity.levels.find(l => l.level === newLevel.level)) {
      notify.show(`Level ${newLevel.level} already exists!`, {autoHideDuration: 2000, severity: 'error'})
      return
    }

    entity.levels.push(newLevel)
    setEntities(p => [...p.filter(e => e.id !== entity.id), entity])
    notify.show(`Successfully added Level ${newLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
  }

  function editLevel(entity: Entity, updatedLevel: EntityLevel) {
    entity.levels = [...entity.levels.filter(l => l.level !== updatedLevel.level), updatedLevel]
    setEntities(p => [...p.filter(e => e.id !== entity.id), entity])
    notify.show(`Successfully edited Level ${updatedLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
  }

  function removeLevel(entity: Entity, entityLevel: EntityLevel) {
    entity.levels = [...entity.levels.filter(l => l.level !== entityLevel.level)]
    setEntities(p => [...p.filter(e => e.id !== entity.id), entity])
    notify.show(`Successfully deleted Level ${entityLevel.level} for ${entity.name}.`, {autoHideDuration: 1000, severity: 'success'})
  }

  return (
    <EntitiesContext.Provider value={{entities, addEntity, updateEntity, addLevel, editLevel, removeLevel}}>
      {children}
    </EntitiesContext.Provider>
  );
}

export default EntitiesProvider;
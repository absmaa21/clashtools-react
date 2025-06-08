import useEntities from "../../hooks/useEntities.ts";
import {Box, List, ListItem, ListItemButton, Modal, Tab, Tabs, Typography} from "@mui/material";
import {useState} from "react";
import {Category} from "../../enums/Category.ts";
import EntityLevelForm from "./EntityLevelForm.tsx";
import EntityForm from "./EntityForm.tsx";
import {ResourceType} from "../../enums/ResourceType.ts";

interface EditLevel {
  entityLevel: EntityLevel,
  entity: Entity,
}

function AdminDashboard() {

  const tabCategories = Object.values(Category).filter(c => typeof c === 'string')
  const [activeTab, setActiveTab] = useState<Category>(0)
  const [editEntityLevel, setEditEntityLevel] = useState<EditLevel>()
  const [editEntity, setEditEntity] = useState<Entity>()

  const {entities} = useEntities()

  function sortByLevel(a: EntityLevel, b: EntityLevel) {
    return b.level - a.level
  }

  function entitySort(a: Entity, b: Entity) {
    return a.name.localeCompare(b.name)
  }

  return (
    <Box sx={{width: '100%'}}>
      <Tabs
        value={activeTab} aria-label="entity-category-tabs"
        onChange={(_e, v: number) => setActiveTab(v)}
        variant={'scrollable'}
      >
        {tabCategories.map(c => <Tab key={c} label={c}/>)}
      </Tabs>

      <List>
        {entities.sort(entitySort).filter(e => e.category === activeTab).map(e =>
          <ListItem key={e.id} sx={{borderBottom: 1, borderColor: 'divider'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
              <ListItemButton onClick={() => setEditEntity(e)}>
                {e.name}
              </ListItemButton>

              <ListItemButton
                key={e.name + '-addnew'}
                onClick={() => setEditEntityLevel({
                  entity: e,
                  entityLevel: {
                    id: -1,
                    level: e.levels[e.levels.length - 1]?.level + 1 || 1,
                    cost: 0,
                    resource: e.levels[e.levels.length - 1]?.resource || ResourceType.GOLD,
                    upgradeTime: 0,
                    imgPath: e.levels[e.levels.length - 1]?.imgPath || '',
                  },
                })}>
                Add
              </ListItemButton>

              {e.levels.sort(sortByLevel).map(l => (
                <ListItemButton key={l.id} onClick={() => setEditEntityLevel({
                  entity: e,
                  entityLevel: l,
                })}>
                  <Box sx={{textAlign: 'center'}}>
                    <img src={l.imgPath} alt={e.name} height={48}/>
                    <Typography>Level {l.level}</Typography>
                  </Box>
                </ListItemButton>
              ))}
            </Box>

            <Modal
              open={!!editEntityLevel} onClose={() => setEditEntityLevel(undefined)}
              sx={{placeSelf: 'center'}}
            >
              {editEntityLevel ? <EntityLevelForm entity={editEntityLevel.entity} initEntityLevel={editEntityLevel.entityLevel}
                                                  closeModal={() => setEditEntityLevel(undefined)}/> : <></>}
            </Modal>
          </ListItem>
        )}

        <ListItem key={'new-entity-item'}>
          <ListItemButton onClick={() => setEditEntity({
            id: -1,
            name: '',
            category: activeTab,
            levels: [],
          })}>
            Add new Entity
          </ListItemButton>
        </ListItem>

        <Modal
          open={!!editEntity} onClose={() => setEditEntity(undefined)}
          sx={{placeSelf: 'center'}}
        >
          <EntityForm initEntity={editEntity!} closeModal={() => setEditEntity(undefined)}/>
        </Modal>
      </List>
    </Box>
  )
}

export default AdminDashboard;
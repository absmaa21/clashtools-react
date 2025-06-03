import useEntities from "../../hooks/useEntities.ts";
import {Box, List, ListItem, ListItemButton, Modal, Tab, Tabs, Typography} from "@mui/material";
import {useState} from "react";
import {Category} from "../../enums/Category.ts";
import EntityLevelForm from "./EntityLevelForm.tsx";
import EntityForm from "./EntityForm.tsx";
import {ResourceType} from "../../enums/ResourceType.ts";

function AdminDashboard() {

  const tabCategories = Object.values(Category).filter(c => typeof c === 'string')
  const [activeTab, setActiveTab] = useState<Category>(0)
  const [editEntityLevel, setEditEntityLevel] = useState<EntityLevel>()
  const [editEntity, setEditEntity] = useState<Entity>()

  const {entities} = useEntities()

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
        {entities.filter(e => e.category === activeTab).map(e => <div key={e.id}>
            <ListItem key={e.id} sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <ListItemButton onClick={() => setEditEntity(e)}>
                  {e.name}
                </ListItemButton>
                {e.levels.map(l => (
                  <ListItemButton key={l.id} onClick={() => setEditEntityLevel(l)}>
                    <Box sx={{textAlign: 'center'}}>
                      <img src={l.imgPath} alt={e.name} height={48}/>
                      <Typography>Level {l.level}</Typography>
                    </Box>
                  </ListItemButton>
                ))}

                <ListItemButton
                  key={e.name + '-addnew'}
                  onClick={() => setEditEntityLevel({
                    id: '',
                    level: e.levels[e.levels.length - 1]?.level + 1 || 1,
                    stats: e.levels[e.levels.length - 1]?.stats || [],
                    cost: 0,
                    resource: e.levels[e.levels.length - 1]?.resource || ResourceType.GOLD,
                    upgradeTime: 0,
                    imgPath: e.levels[e.levels.length - 1]?.imgPath || '',
                  })}>
                  Add
                </ListItemButton>
              </Box>
            </ListItem>

            <Modal
              open={!!editEntityLevel} onClose={() => setEditEntityLevel(undefined)}
              sx={{placeSelf: 'center'}}
            >
              <EntityLevelForm entity={e} initEntityLevel={editEntityLevel!}
                               closeModal={() => setEditEntityLevel(undefined)}/>
            </Modal>
          </div>
        )}

        <ListItem key={'new-entity-item'}>
          <ListItemButton onClick={() => setEditEntity({
            id: '',
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
import useEntities from "../../hooks/useEntities.ts";
import {Box, List, ListItem, ListItemButton, ListItemText, Modal, Tab, Tabs, Typography} from "@mui/material";
import {useState} from "react";
import {Category} from "../../enums/Category.ts";
import EntityLevelForm from "./EntityLevelForm.tsx";

function AdminDashboard() {

  const tabCategories = Object.values(Category).filter(c => typeof c === 'string')
  const [activeTab, setActiveTab] = useState<Category>(0)
  const [editEntityLevel, setEditEntityLevel] = useState<EntityLevel>()

  const {entities} = useEntities()

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={activeTab} onChange={(_e, v: number) => setActiveTab(v)} aria-label="basic tabs example">
          {tabCategories.map(c => <Tab key={c} label={c}/>)}
        </Tabs>

        <List>
          {entities.filter(e => e.category === activeTab).map(e => <>
              <ListItem key={e.id}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                  <ListItemText primary={e.name}/>
                  {e.levels.map(l => (
                    <ListItemButton key={l.id} onClick={() => setEditEntityLevel(l)}>
                      <Box sx={{textAlign: 'center'}}>
                        <img src={l.imgPath} alt={e.name} height={48}/>
                        <Typography>Level {l.level}</Typography>
                      </Box>
                    </ListItemButton>
                  ))}
                </Box>
              </ListItem>

              <ListItem key={'Add'}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                  <ListItemButton onClick={() => setEditEntityLevel({
                    id: '',
                    level: e.levels.length,
                    stats: e.levels[0].stats,
                    cost: 0,
                    resource: e.levels[0].resource,
                    upgradeTime: 0,
                    imgPath: e.levels[0].imgPath,
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
            </>
          )}
        </List>
      </Box>
    </Box>
  )
}

export default AdminDashboard;
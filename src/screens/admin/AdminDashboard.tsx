import useEntities from "../../hooks/useEntities.ts";
import {Box, List, ListItem, ListItemButton, ListItemText, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import {Category} from "../../enums/Category.ts";

function AdminDashboard() {

  const [activeTab, setActiveTab] = useState<number>(0)

  const {entities} = useEntities()

  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={activeTab} onChange={(_e, v: number) => setActiveTab(v)} aria-label="basic tabs example">
          {Object.values(Category).map(c => <Tab key={c} label={c}/>)}
        </Tabs>

        <List>
          {entities.filter(e => e.category === activeTab).map(e =>
            <ListItem key={e.id}>
              <Box sx={{display: 'flex', alignItems: 'center', gap: 2}} bgcolor={''}>
                <ListItemText primary={e.name}/>
                {e.levels.map(l => (
                  <ListItemButton key={l.id}>
                    Level {l.level}
                  </ListItemButton>
                ))}
              </Box>
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  )
}

export default AdminDashboard;
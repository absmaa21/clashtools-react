import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography, Box, Tab, Tabs,
} from '@mui/material';
import {Category} from "../enums/Category.ts";
import LevelCol from "../components/upgrade-tracker/LevelCol.tsx";
import UpgradeCol from "../components/upgrade-tracker/UpgradeCol.tsx";
import {useState} from "react";
import useAccountEntity from "../hooks/useAccountEntity.ts";
import useEntities from "../hooks/useEntities.ts";
import {snakeToHumanReadable} from "../utils/StringMethods.ts";

const UpgradeTracker = () => {

  const {entities} = useEntities()
  const {accountEntities} = useAccountEntity()
  const tabCategories = Object.values(Category).filter(c => typeof c === 'string')
  const [activeTab, setActiveTab] = useState<Category>(0)

  const availEntities: Entity[] = entities.filter(e => accountEntities.find(ae => ae.entity.id === e.id))

  return (
    <Container maxWidth="xl" style={{padding: 0, paddingBottom: 32}}>
      <Tabs
        value={activeTab} aria-label="accEntity-category-tabs"
        onChange={(_e, v: number) => setActiveTab(v)}
        variant={'scrollable'} style={{marginBottom: 32}}
      >
        {tabCategories.sort((a, b) => a.localeCompare(b)).map(c => <Tab key={c} label={snakeToHumanReadable(c)}/>)}
      </Tabs>

      <Box sx={{px: {xs: 0, lg: 4} }}>
        <TableContainer component={Paper}>
          <Table>
            <UpgradeTableHeader categoryName={tabCategories[activeTab]}/>

            <TableBody>
              {availEntities.map(e => accountEntities.filter(ae => e.id === ae.entity.id && Category[e.category] === tabCategories[activeTab]).map((ae, i) => (
                <TableRow key={`${ae.id}`}>
                  {i == 0 && (
                    <TableCell
                      rowSpan={accountEntities.filter(ae => e.id === ae.entity.id).length}
                      sx={{ borderRight: "solid 1px #0002", width: {xs: '25%', md: '20%'} }}
                    >
                      <Box sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                      }}>
                        <img src={e.levels[e.levels.length-1].imgPath} alt={`$${ae.id}-img`} height={64}/>
                        <Typography variant={'body2'}>{ae.entity.name}</Typography>
                      </Box>
                    </TableCell>
                  )}
                  <LevelCol accountEntity={ae}/>
                  <UpgradeCol accountEntity={ae}/>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

/*
<Typography variant={'body2'}>All upgrades done!</Typography>

{entities.filter(e => Category[e.category] === tabCategories[activeTab] && accountEntities.find(a => a.entity.id === e.id)).map(ae => {
                const availableAccountEntities = accountEntities.filter(a => a.entity.id === ae.id)
                return (
                  <>
                    {availableAccountEntities.map((a, i) => {
                      const nextLevel: EntityLevel | undefined = entities
                        .flatMap(e => e.levels) // get all levels from all entities
                        .filter(l => l.level > a.level) // only higher levels
                        .sort((a, b) => a.level - b.level)[0]; // pick the smallest higher level

                      if (!nextLevel) return (
                        <Typography variant={'body2'}>All upgrades finished!</Typography>
                      )

                      return (
                        <TableRow key={`${a.id}-${nextLevel.id}`}>
                          {i == 0 && (
                            <TableCell
                              rowSpan={availableAccountEntities.length}
                              sx={{ borderRight: "solid 1px #0002", width: {xs: '25%', md: '20%'} }}
                            >
                              <Box sx={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1
                              }}>
                                <img src={nextLevel.imgPath} alt={`${a.id}-${nextLevel.id}-img`} height={64}/>
                                <Typography variant={'body2'}>{a.entity.name}</Typography>
                              </Box>
                            </TableCell>
                          )}
                          <LevelCol entity={a.entity} entityLevel={nextLevel}/>
                          <UpgradeCol entityLevel={nextLevel}/>
                        </TableRow>
                      )
                    })}
                  </>
                )
              })}
 */


const UpgradeTableHeader = ({categoryName}: {categoryName: string}) => {
  return (
    <TableHead sx={{bgcolor: '#1565c0'}}>
      <TableRow>
        <TableCell sx={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>{snakeToHumanReadable(categoryName)}</TableCell>
        <TableCell colSpan={3} sx={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Level</TableCell>
        <TableCell colSpan={0} sx={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Details</TableCell>
      </TableRow>
    </TableHead>
  )
}

/*
{upgrades.map((upgrade) => (
              <>
                <TableRow key={upgrade.id}>
                  <TableCell>{upgrade.name}</TableCell>
                  <TableCell>{upgrade.level}</TableCell>
                  <TableCell>{upgrade.duration}</TableCell>
                </TableRow>
                <TableRow>
                 <TableCell colSpan={3} sx={{ padding: 0, borderBottom: 'none' }}>
                   <LinearProgress
                     variant="determinate"
                     value={upgrade.progress}
                     color={upgrade.completed ? 'success' : 'secondary'}
                     sx={{ height: 2 }}
                   />
                 </TableCell>
                </TableRow>
              </>
            ))}
 */

export default UpgradeTracker;
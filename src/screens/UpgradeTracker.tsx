import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography, Box,
} from '@mui/material';
import {Category} from "../enums/Category.ts";
import LevelCol from "../components/upgrade-tracker/LevelCol.tsx";

const entities: Entity[] = [
  {
    id: 'asdasd',
    name: 'Archer Tower',
    category: Category.DEFENSE,
    maxLevel: 21,
    levels: [
      {
        id: 'asdasd1',
        level: 1,
        stats: [],
      },
      {
        id: 'asdasd2',
        level: 2,
        timeUntilCompleted: 5643543,
        stats: [],
      },
    ],
  }
]


const UpgradeTracker = () => {

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{bgcolor: '#1565c0'}}>
            <TableRow>
              <TableCell sx={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Defense</TableCell>
              <TableCell colSpan={3} sx={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Level</TableCell>
              <TableCell colSpan={0} sx={{color: 'white', fontWeight: 'bold', textAlign: 'center'}}>Upgrades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entities.map(entity => entity.levels.map((entityLevel, i) => entityLevel.level < entity.maxLevel && (
              <TableRow key={entityLevel.id}>
                {i == 0 && <TableCell
                    rowSpan={entity.levels.length}
                    sx={{borderRight: "solid 1px #0002"}}
                >
                    <Box sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}>
                        <img src={'https://www.clash.ninja/images/entities/127_7.png'} alt={entity.name + " image"}
                             width={40}/>
                        <Typography variant={'body2'}>{entity.name}</Typography>
                    </Box>
                </TableCell>}
                <LevelCol entity={entity} entityLevel={entityLevel}/>
                <TableCell width={300}>
                  Lvl 11
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

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
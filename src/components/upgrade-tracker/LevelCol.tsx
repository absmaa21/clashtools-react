import {Box, Button, TableCell, Typography} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BuildIcon from "@mui/icons-material/Build";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  entity: Entity,
  entityLevel: EntityLevel,
}

function LevelCol({entity, entityLevel}: Props) {

  const handleUpgradePress = (entityLevel: EntityLevel) => {
    console.log(entityLevel.id)
  }

  return (
    <>
      <TableCell sx={{padding: 0, width: '10%' }}>
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <img src={'https://www.clash.ninja/images/entities/127_7.png'} alt={entity.name + " image"}
               width={24}/>
        </Box>
      </TableCell>

      <TableCell sx={{padding: 0, width: '10%'}}>
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <Typography variant={'body2'}>
            {entityLevel.level} / {entity.maxLevel}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{borderRight: "solid 1px #0002", padding: 0, width: { xs: 100, sm: '10%' } }}>
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <Button
            variant={'contained'}
            size={'small'}
            onClick={() => handleUpgradePress(entityLevel)}
            sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
            color={entityLevel.timeUntilCompleted ? 'warning' : 'primary'}
          >
            {!entityLevel.timeUntilCompleted
              ? <ArrowUpwardIcon fontSize={'small'}/>
              : <BuildIcon fontSize={'small'}/>
            }
          </Button>
          {entityLevel.timeUntilCompleted && <Button
              variant={'contained'}
              size={'small'}
              onClick={() => console.log("finish")}
              sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
              color={'success'}
          >
              <CheckIcon fontSize={'small'}/>
          </Button>}
        </Box>
      </TableCell>
    </>
  );
}

export default LevelCol;
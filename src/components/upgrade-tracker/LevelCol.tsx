import {Box, Button, TableCell, Typography, useTheme} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BuildIcon from "@mui/icons-material/Build";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  entity: Entity,
  entityLevel: EntityLevel,
}

function LevelCol({entity, entityLevel}: Props) {

  const Theme = useTheme()

  const handleUpgradePress = (entityLevel: EntityLevel) => {
    console.log(entityLevel.id)
  }

  return (
    <>
      <TableCell>
        <img src={'https://www.clash.ninja/images/entities/127_7.png'} alt={entity.name + " image"}
             width={24}/>
      </TableCell>
      <TableCell>
        <Typography variant={'body2'}>
          {entityLevel.level} / {entity.maxLevel}
        </Typography>
      </TableCell>
      <TableCell sx={{borderRight: "solid 1px #0002", paddingY: 0}}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 2 }}>
          <Button
            variant={'contained'}
            size={'small'}
            onClick={() => handleUpgradePress(entityLevel)}
            sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
          >
            {!entityLevel.timeUntilCompleted
              ? <ArrowUpwardIcon fontSize={'small'}/>
              : <BuildIcon fontSize={'small'} style={{backgroundColor: Theme.palette.warning}}/>
            }
          </Button>
          {entityLevel.timeUntilCompleted && <Button
              variant={'contained'}
              size={'small'}
              onClick={() => console.log("finish")}
              sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
          >
              <CheckIcon fontSize={'small'}/>
          </Button>}
        </Box>
      </TableCell>
    </>
  );
}

export default LevelCol;
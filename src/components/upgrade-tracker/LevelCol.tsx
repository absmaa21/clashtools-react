import {Box, Button, TableCell, Typography} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BuildIcon from "@mui/icons-material/Build";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  accountEntity: AccountEntity,
}

function LevelCol({accountEntity}: Props) {

  const displayLevel: EntityLevel = accountEntity.entity.levels
      .filter(ae => ae.level > accountEntity.level)
      .sort((a, b) => a.level - b.level)[0]
    ?? accountEntity.entity.levels.find(ae => ae.level === accountEntity.level)

  const handleUpgradePress = () => {
    console.log(displayLevel)
  }

  return (
    <>
      <TableCell sx={{padding: 0, width: '10%'}}>
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <img src={displayLevel.imgPath} alt={accountEntity.entity.name + " image"} height={48}/>
        </Box>
      </TableCell>

      <TableCell sx={{padding: 0, width: '10%'}}>
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          <Typography variant={'body2'}>
            {accountEntity.level} / {accountEntity.entity.maxLevel}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{borderRight: "solid 1px #0002", padding: 0, width: {xs: 100, sm: '10%'}}}>
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          {displayLevel.level !== accountEntity.level ? <>
            <Button
              variant={'contained'}
              size={'small'}
              onClick={handleUpgradePress}
              sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
              color={accountEntity.upgradeStart ? 'warning' : 'primary'}
            >
              {!accountEntity.upgradeStart
                ? <ArrowUpwardIcon fontSize={'small'}/>
                : <BuildIcon fontSize={'small'}/>
              }
            </Button>
            {accountEntity.upgradeStart && <Button
                variant={'contained'}
                size={'small'}
                onClick={() => console.log("finish")}
                sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
                color={'success'}
            >
                <CheckIcon fontSize={'small'}/>
            </Button>}
          </> : <CheckIcon color={'success'}/>}
        </Box>
      </TableCell>
    </>
  );
}

export default LevelCol;
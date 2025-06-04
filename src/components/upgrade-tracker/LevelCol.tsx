import {Box, Button, Modal, TableCell, Typography} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BuildIcon from "@mui/icons-material/Build";
import CheckIcon from "@mui/icons-material/Check";
import useAccountEntity from "../../hooks/useAccountEntity.ts";
import ConfirmationDialog from "../ConfirmationDialog.tsx";
import {useState} from "react";
import EditUpgrade from "./EditUpgrade.tsx";

interface Props {
  accountEntity: AccountEntity,
}

function LevelCol({accountEntity}: Props) {

  const {startUpgrade, editUpgrade} = useAccountEntity()
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [finishDialog, setFinishDialog] = useState<boolean>(false)
  const displayLevel: EntityLevel = accountEntity.entity.levels[accountEntity.level]
    ?? accountEntity.entity.levels[accountEntity.entity.levels.length-1]

  const handleStartUpgradePress = () => {
    if (accountEntity.upgradeStart) setEditDialog(true)
    else startUpgrade(accountEntity.id).then()
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
            {accountEntity.level} / {accountEntity.entity.levels.length}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{borderRight: "solid 1px #0002", padding: 0, width: {xs: 100, sm: '10%'}}}>
        <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
          {displayLevel.level !== accountEntity.level ? <>
            <Button
              variant={'contained'}
              size={'small'}
              onClick={handleStartUpgradePress}
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
                onClick={() => setFinishDialog(true)}
                sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
                color={'success'}
            >
                <CheckIcon fontSize={'small'}/>
            </Button>}
          </> : <CheckIcon color={'success'}/>}
        </Box>
      </TableCell>

      <ConfirmationDialog
        open={finishDialog}
        onClose={accepted => {
          if (accepted) {
            accountEntity.upgradeStart = Date.now() - displayLevel.upgradeTime
            editUpgrade(accountEntity).then()
          }
          setFinishDialog(false)
        }}
        title={`Finish ${accountEntity.entity.name} upgrade`}
        desc={`Are you sure you want to finish the ${accountEntity.entity.name} upgrade to level ${accountEntity.level+1}.`}
      />

      <Modal open={editDialog} onClose={() => setEditDialog(false)} sx={{placeSelf: 'center'}}>
        <EditUpgrade accountEntity={accountEntity} onClose={() => setEditDialog(false)}/>
      </Modal>
    </>
  );
}

export default LevelCol;
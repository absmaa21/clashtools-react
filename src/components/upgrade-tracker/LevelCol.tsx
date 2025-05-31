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

  const {startUpgrade, editUpgrade, cancelUpgrade} = useAccountEntity()
  const [editDialog, setEditDialog] = useState<boolean>(false)
  const [finishDialog, setFinishDialog] = useState<boolean>(false)
  const displayLevel: EntityLevel = accountEntity.entity.levels
      .filter(ae => ae.level > accountEntity.level)
      .sort((a, b) => a.level - b.level)[0]
    ?? accountEntity.entity.levels.find(ae => ae.level === accountEntity.level)

  const handleStartUpgradePress = () => {
    if (accountEntity.upgradeStart) setEditDialog(true)
    else startUpgrade(accountEntity.id).then()
  }

  const handleEditFinish = (result: 'cancel' | 'finish') => {
    if (result === 'finish') {
      accountEntity.upgradeStart = Date.now() - displayLevel.upgradeTime
      editUpgrade(accountEntity).then()
    } else {
      cancelUpgrade(accountEntity.id).then()
    }
    setEditDialog(false)
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
        <EditUpgrade accountEntity={accountEntity} onFinish={handleEditFinish}/>
      </Modal>
    </>
  );
}

export default LevelCol;
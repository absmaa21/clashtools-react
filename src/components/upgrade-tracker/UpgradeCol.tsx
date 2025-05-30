import {Box, LinearProgress, TableCell, Typography} from "@mui/material";

interface Props {
  accountEntity: AccountEntity,
}

function UpgradeCol({accountEntity}: Props) {

  const displayLevel: EntityLevel | undefined = accountEntity.entity.levels
    .filter(ae => ae.level > accountEntity.level)
    .sort((a, b) => a.level - b.level)[0]

  function getProgressInPercent(): number {
    if (!accountEntity.upgradeStart || !displayLevel) return 0

    const now = Date.now()
    const endTime = accountEntity.upgradeStart + displayLevel.upgradeTime
    const totalDuration = endTime - accountEntity.upgradeStart
    const elapsed = now - accountEntity.upgradeStart
    return Math.max(0, Math.min(100, elapsed / totalDuration))
  }

  if (!displayLevel) return (
    <TableCell sx={{ width: {sm: '33%', md: 200}, p: 0, position: 'relative' }}>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Typography variant={'body2'} color={'success'}>All upgrades done!</Typography>
      </Box>
    </TableCell>
  )

  return (
    <TableCell sx={{ width: {sm: '33%', md: 200}, p: 0, position: 'relative' }}>
      <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
        {accountEntity.upgradeStart
          ? `${new Date(accountEntity.upgradeStart + displayLevel.upgradeTime).toLocaleString()}`
          : `${displayLevel.upgradeTime}`}
      </Box>

      <LinearProgress
        variant="determinate"
        value={getProgressInPercent()}
        color={'primary'}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: accountEntity.upgradeStart ? .05 : 0,
        }}
      />
    </TableCell>
  )
}

export default UpgradeCol;
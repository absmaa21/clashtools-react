import {Box, LinearProgress, TableCell, Typography} from "@mui/material";
import {secondsToString} from "../../utils/StringMethods.ts";
import {getResourceByType} from "../../utils/CocAssets.ts";
import {useCallback, useEffect, useState} from "react";
import useAccountEntity from "../../hooks/useAccountEntity.ts";

interface Props {
  accountEntity: AccountEntity,
}

function UpgradeCol({accountEntity}: Props) {

  const {checkForFinish, finishUpgrade} = useAccountEntity()
  const [progressInPercent, setProgressInPercent] = useState<number>(0)
  const displayLevel: EntityLevel | undefined = accountEntity.entity.levels
    .filter(ae => ae.level > accountEntity.level)
    .sort((a, b) => a.level - b.level)[0]

  const getProgressInPercent = useCallback((): number => {
    if (!accountEntity.upgradeStart || !displayLevel) return 0

    const now = Date.now()
    const endTime = accountEntity.upgradeStart + displayLevel.upgradeTime * 1000
    const totalDuration = endTime - accountEntity.upgradeStart
    const elapsed = now - accountEntity.upgradeStart
    return Math.max(0, Math.min(100, elapsed / totalDuration))
  }, [accountEntity.upgradeStart, displayLevel])

  useEffect(() => {
    const secInterval = setInterval(async () => {
      setProgressInPercent(getProgressInPercent())
      if (checkForFinish(accountEntity)) finishUpgrade(accountEntity)
    }, 1000)
    return () => clearInterval(secInterval)
  }, [accountEntity, accountEntity.upgradeStart, checkForFinish, finishUpgrade, getProgressInPercent]);

  if (!displayLevel) return (
    <TableCell sx={{ width: {sm: '33%', md: 200}, p: 0, position: 'relative' }}>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Typography variant={'body2'} color={'success'}>All upgrades done!</Typography>
      </Box>
    </TableCell>
  )

  return (
    <TableCell sx={{ width: {sm: '33%', md: 200}, p: 0, position: 'relative' }}>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        {accountEntity.upgradeStart ? (
          new Date(accountEntity.upgradeStart + displayLevel.upgradeTime * 1000).toLocaleString()
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, py: 0.5 }}>
            <img
              src={getResourceByType(displayLevel.resource)}
              alt="cost icon"
              style={{
                width: 16,
                height: 16,
                objectFit: 'contain',
                marginRight: 6,
                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.2))',
              }}
            />
            <Typography component="span" fontSize={'small'} fontWeight={'bold'}>
              {displayLevel.cost}
            </Typography>
            <Typography component="span" fontSize={'small'} ml={2}>
              {secondsToString(displayLevel.upgradeTime)}
            </Typography>
          </Box>
        )}
      </Box>

      <LinearProgress
        variant="determinate"
        value={progressInPercent * 100}
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
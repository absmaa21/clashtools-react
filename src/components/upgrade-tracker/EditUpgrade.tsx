import {
  Button,
  Container,
  Divider, Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import {useState} from "react";
import {gemsToSeconds, secondsToGems} from "../../utils/CocMethods.ts";
import {getResourceByType} from "../../utils/CocAssets.ts";
import {ResourceType} from "../../enums/ResourceType.ts";
import { DoDisturb } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import ConfirmationDialog from "../ConfirmationDialog.tsx";
import useAccountEntity from "../../hooks/useAccountEntity.ts";

interface Props {
  accountEntity: AccountEntity,
  onClose: () => void,
}

function EditUpgrade({accountEntity, onClose}: Props) {

  const {editUpgrade, cancelUpgrade} = useAccountEntity()
  const [totalSeconds, setTotalSeconds] = useState<number>((Date.now() - accountEntity.upgradeStart!) / 1000)
  const [cancelDialog, setCancelDialog] = useState<boolean>(false)

  function secondsToDHMS(seconds: number) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return { days, hours, minutes, seconds };
  }

  function dhmsToSeconds(days: number, hours: number, minutes: number, seconds: number) {
    return days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;
  }

  const { days, hours, minutes, seconds } = secondsToDHMS(totalSeconds);

  function onDaysChange(newDays: number) {
    setTotalSeconds(dhmsToSeconds(newDays, hours, minutes, seconds));
  }
  function onHoursChange(newHours: number) {
    setTotalSeconds(dhmsToSeconds(days, newHours, minutes, seconds));
  }
  function onMinutesChange(newMinutes: number) {
    setTotalSeconds(dhmsToSeconds(days, hours, newMinutes, seconds));
  }
  function onSecondsChange(newSeconds: number) {
    setTotalSeconds(dhmsToSeconds(days, hours, minutes, newSeconds));
  }
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{p: 3}}>
        <Typography variant="h5" gutterBottom>
          Edit {accountEntity.entity.name} level {accountEntity.level}
        </Typography>

        <Divider sx={{my: 2}}/>

        <Grid container rowGap={3}>
          <Grid size={3} px={1}>
            <TextField
              label={'Days'} type={'number'} value={days.toFixed(0)} variant={'standard'} fullWidth
              onChange={e => onDaysChange(parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={3} px={1}>
            <TextField
              label={'Hour'} type={'number'} value={hours.toFixed(0)} variant={'standard'} fullWidth
              onChange={e => onHoursChange(parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={3} px={1}>
            <TextField
              label={'Minutes'} type={'number'} value={minutes.toFixed(0)} variant={'standard'} fullWidth
              onChange={e => onMinutesChange(parseInt(e.target.value))}
            />
          </Grid>
          <Grid size={3} px={1}>
            <TextField
              label={'Seconds'} type={'number'} value={seconds.toFixed(0)} variant={'standard'} fullWidth
              onChange={e => onSecondsChange(parseInt(e.target.value))}
            />
          </Grid>

          <Grid size={3} px={1} m={'auto'}>
            <Button
              variant={'contained'}
              size={'small'}
              onClick={() => setCancelDialog(true)}
              sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
              color={'error'}
            >
              <DoDisturb/>
            </Button>
          </Grid>
          <Grid size={6} px={1}>
            <TextField
              label={'Gems'} type={'number'} value={secondsToGems(totalSeconds).toFixed(0)} variant={'standard'} fullWidth
              onChange={e => setTotalSeconds(gemsToSeconds(parseInt(e.target.value) || 0))}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={getResourceByType(ResourceType.GEMS)} alt={'gems'} height={20} />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Grid>
          <Grid size={3} px={1} m={'auto'} textAlign={'right'}>
            <Button
              variant={'contained'}
              size={'small'}
              onClick={() => {
                editUpgrade({
                  ...accountEntity,
                  upgradeStart: Date.now() - totalSeconds * 1000,
                }).then(() => onClose())
              }}
              sx={{minWidth: 0, width: 28, aspectRatio: '1'}}
              color={'success'}
            >
              <CheckIcon/>
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <ConfirmationDialog
        open={cancelDialog}
        onClose={accepted => {
          if (accepted) cancelUpgrade(accountEntity.id).then(() => onClose())
          setCancelDialog(false)
        }}
        title={`Cancel ${accountEntity.entity.name} upgrade?`}
        desc={`Are you sure you want to cancel the ${accountEntity.entity.name} upgrade to level ${accountEntity.level+1}?`}
      />
    </Container>
  );
}

export default EditUpgrade;
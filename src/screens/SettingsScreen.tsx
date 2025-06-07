import {Box, Container, Divider, FormControlLabel, Paper, Switch, Typography } from "@mui/material";
import useSettings from "../hooks/useSettings.ts";

function SettingsScreen() {

  const Settings = useSettings()

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Accessibility
          </Typography>

          <ToggleSetting
            label="Reduced Motion" desc="Reduce animations and motion effects for better accessibility."
            checked={Settings.reducedMotion} toggle={Settings.setReducedMotion} autoFocus
          />

          <Typography variant="h6" gutterBottom mt={4}>
            Layout
          </Typography>

          <ToggleSetting
            label="Show Finished Categories" desc="Shows Categories even if they are already completed."
            checked={Settings.showFinishedCategories} toggle={Settings.toggleShowFinishedCategories}
          />
        </Box>
      </Paper>
    </Container>
  );
}

interface ToggleSettingProps {
  label: string,
  desc: string,
  checked: boolean,
  toggle: (newValue: boolean) => void,
  autoFocus?: boolean,
}

function ToggleSetting({label, desc, checked, toggle, autoFocus}: ToggleSettingProps) {
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={checked} autoFocus={autoFocus}
            onChange={e => toggle(e.target.checked)}
            color="primary"
          />
        }
        label={label}
        sx={{ mt: 1 }}
      />

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {desc}
      </Typography>
    </>
  )
}

export default SettingsScreen;
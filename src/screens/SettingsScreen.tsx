import {Box, Container, Divider, FormControlLabel, Paper, Switch, Typography } from "@mui/material";
import useSettings from "../hooks/useSettings.ts";

function SettingsScreen() {

  const Settings = useSettings()

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Accessibility
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={Settings.reducedMotion}
                onChange={e => Settings.setReducedMotion(e.target.checked)}
                color="primary"
              />
            }
            label="Reduced Motion"
            sx={{ mt: 1 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Reduce animations and motion effects for better accessibility.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default SettingsScreen;
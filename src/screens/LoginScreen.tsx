import {TextField, Button, Box, Typography} from '@mui/material';
import React, {useState} from "react";
import useClient from "../hooks/useClient.ts";

interface Props {
  onSuccess?: () => void,
}

const LoginScreen = ({onSuccess}: Props) => {
  const Client = useClient()

  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)
    // TODO error handling

    if (Client.login(formData.get('email') as string, formData.get('password') as string) && onSuccess) onSuccess()
    setError('Invalid data')
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        padding: {sx: 0, md: 1}
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin} style={{width: '100%'}}>
        <TextField
          fullWidth
          label="Email"
          variant="filled"
          margin="normal"
          name="email"
          required
          error={!!error}
        />
        <TextField
          fullWidth
          label="Password"
          variant="filled"
          margin="normal"
          type="password"
          name="password"
          required
          error={!!error}
          helperText={error ?? ' '}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{mt: 2}}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginScreen;

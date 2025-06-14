import {TextField, Button, Box, Typography} from '@mui/material';
import React, {useEffect, useState} from "react";
import useClient from "../hooks/useClient.ts";

interface Props {
  onSuccess?: () => void,
}

const RegisterScreen = ({onSuccess}: Props) => {
  const Client = useClient()

  const [errors, setErrors] = useState({username: '', email: '', password: '', conPassword: ''})

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget)

    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const conPassword = formData.get('conPassword') as string

    if (password !== conPassword) {
      setErrors(p => ({...p, conPassword: 'Passwords do not match!'}))
      return
    }

    Client.register(username, email, password).then(error => {
      if (typeof error !== 'string' && error) {
        setErrors(p => ({
          ...p,
          email: error.fieldErrors?.email || p.email,
          username: error.fieldErrors?.username || p.username,
          password: error.fieldErrors?.password || p.password
        }))
        return
      }
      if (onSuccess) onSuccess()
    })
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrors({username: '', email: '', password: '', conPassword: ''})
    }, 3000)
    return () => clearTimeout(timeout)
  }, [errors]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ width: '100%' }}>
        <TextField
          fullWidth required autoFocus
          label="Username"
          variant="outlined"
          margin="normal"
          name="username"
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          fullWidth required
          label="Email"
          variant="outlined"
          margin="normal"
          name="email"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth required
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          name="password"
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          fullWidth required
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          type="password"
          name="conPassword"
          error={!!errors.conPassword}
          helperText={errors.conPassword}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegisterScreen;

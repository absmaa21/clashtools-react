import {useState} from "react";
import {Box, Button, Container, Grid, IconButton, Paper, TextField, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import useClient from "../hooks/useClient.ts";
import {useNotifications} from "@toolpad/core";


interface Props {
  initAccount?: Account,
  closeModal: () => void,
}

function AccountForm({initAccount, closeModal}: Props) {

  const isNew = !initAccount
  const notify = useNotifications()
  const Client = useClient()
  const [account, setAccount] = useState<AccountRequest>(initAccount ? {...initAccount} : {
    userId: 1,
    accountName: '',
  })

  function handleChange<K extends keyof AccountRequest>(key: K, value: AccountRequest[K]) {
    setAccount(p => ({...p, [key]: value}))
  }

  return (
    <Container maxWidth={'md'}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container>
          <Grid size={1}/>
          <Grid size={10}>
            <Typography variant="h6" sx={{textAlign: 'center', mb: 3}}>
              {isNew ? `New Account` : `Edit Account ${initAccount.accountName}`}
            </Typography>
          </Grid>
          <Grid size={1}>
            {!isNew && (
              <IconButton onClick={() => console.warn('No account delete logic')} color="error">
                <Delete />
              </IconButton>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{xs: 12}}>
            <TextField
              fullWidth autoFocus
              label="Account Name"
              type="text"
              value={account.accountName}
              onChange={e => handleChange('accountName', e.target.value)}
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => {
            if (!initAccount) Client.createAccount(account).then(r => {
              if (r) notify.show(r, {severity: 'error', autoHideDuration: 3000})
              else closeModal()
            })
          }}>
            {!initAccount ? 'Add' : 'Save'}
          </Button>
          <Button variant="outlined" onClick={closeModal}>Cancel</Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default AccountForm;
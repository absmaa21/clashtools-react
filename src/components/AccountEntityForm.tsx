import {useState} from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel, MenuItem,
  Paper, Select,
  Typography
} from "@mui/material";
import {useNotifications} from "@toolpad/core";
import useEntities from "../hooks/useEntities.ts";
import {Category} from "../enums/Category.ts";
import useAccountEntity from "../hooks/useAccountEntity.ts";


interface Props {
  closeModal: () => void,
  category: Category,
  accountId: number,
}

function AccountEntityForm({closeModal, category, accountId}: Props) {

  const notify = useNotifications()
  const {createAccountEntity} = useAccountEntity()
  const {entities} = useEntities()
  const availEntities = entities.filter(e => e.category === category)
  const [account, setAccount] = useState<AccountEntityRequestDTO>({
    accountId: accountId,
    currentLevel: 0,
    baseEntityId: -1,
  })

  function handleChange<K extends keyof AccountEntityRequestDTO>(key: K, value: AccountEntityRequestDTO[K]) {
    setAccount(p => ({...p, [key]: value}))
  }

  const entity = availEntities.find(e => e.id === account.baseEntityId)

  return (
    <Container maxWidth={'md'}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{textAlign: 'center', mb: 3}}>
          New {Category[category]}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{xs: 12}}>
            <FormControl fullWidth>
              <InputLabel>Entity</InputLabel>
              <Select
                variant={'outlined'} autoFocus
                label={'Entity'}
                value={entity?.id ?? -1}
                onChange={e => typeof e.target.value === 'number' && handleChange('baseEntityId', e.target.value)}
              >
                {availEntities.map(e => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => {
            createAccountEntity(account).then(r => {
              if (typeof r === 'string') notify.show(r, {severity: 'error', autoHideDuration: 3000})
              else closeModal()
            })
          }}>
            Create
          </Button>
          <Button variant="outlined" onClick={closeModal}>Cancel</Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default AccountEntityForm;
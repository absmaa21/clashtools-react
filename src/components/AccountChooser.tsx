import useClient from "../hooks/useClient.ts";
import {Box, Button, Container, Modal, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import AccountForm from "./AccountForm.tsx";
import {useState} from "react";

function AccountChooser() {

  const Client = useClient()
  const navigate = useNavigate()
  const [accountFormOpen, setAccountFormOpen] = useState<boolean>(false)

  return (
    <Container maxWidth={"xl"} style={{padding: 0, paddingBottom: 32}}>
      <Box sx={{px: {xs: 0, lg: 4} }}>
        {Client.accounts.length > 0 ? (
          <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>
            <Typography variant={'h4'} mt={4}>
              Choose an account
            </Typography>
            {Client.accounts.map((a, i) => (
              <Button key={a.id} sx={{bgcolor: i % 2 == 1 ? '#0002' : '#0000', py: 2}} onClick={() => {
                navigate(`/upgrade-tracker/${a.id}`)
              }}>
                <Typography variant={'body1'} sx={{textAlign: 'center'}}>
                  {a.accountName}
                </Typography>
              </Button>
            ))}
          </Box>
          ) : (
            <>
              <Typography variant={'h4'} mt={4}>
                You have no accounts to display
              </Typography>
              <Button sx={{mt: 2}} onClick={() => setAccountFormOpen(true)}>
                Create account
              </Button>
            </>
        )}
      </Box>

      <Modal open={accountFormOpen} onClose={() => setAccountFormOpen(false)} sx={{ placeSelf: 'center', width: '100%' }}>
        <AccountForm closeModal={() => setAccountFormOpen(false)}/>
      </Modal>
    </Container>
  );
}

export default AccountChooser;
import {Container, Typography} from "@mui/material";
import AccountEntitiesTable from "../components/AccountEntitiesTable.tsx";

function Index() {
  return (
    <Container>
      <Typography variant={'h4'} my={2}>
        Next available Upgrades
      </Typography>

      <AccountEntitiesTable/>
    </Container>
  );
}

export default Index;
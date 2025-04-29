import { Outlet } from "react-router";
import Header from "./Header.tsx";
import {Container} from "@mui/material";

function Layout() {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 0,
      }}
    >
      <Header />
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flex: 1,
          padding: 0,
          overflow: 'auto',
          bgcolor: '#ffffff05'
        }}
      >
        <Outlet />
      </Container>
    </Container>
  );
}

export default Layout;
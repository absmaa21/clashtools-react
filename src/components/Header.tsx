import {AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import UserAvatar from "./UserAvatar";
import {useNavigate} from "react-router";

interface Page {
  title: string,
  path: string,
  subPages?: {
    title: string,
    path: string,
  }[],
}
const pages: Page[] = [
  {title: 'Dashboard', path: '/'},
  {title: 'Upgrade Tracker', path: '/tracker'},
  {title: 'Admin', path: '/admin'},
];

function Header() {
  const nav = useNavigate()
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth={'xl'}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ClashTools
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon/>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{display: {xs: 'block', md: 'none'}}}
            >
              {pages.map(page => (
                <MenuItem key={page.title} onClick={() => {
                  handleCloseNavMenu()
                  nav(page.path)
                }}>
                  <Typography sx={{textAlign: 'center'}}>{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/*MEDIUM DEVICES*/}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              display: {xs: 'flex', md: 'none'},
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ClashTools
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map(page => (
              <Button
                key={page.title}
                onClick={() => {
                  handleCloseNavMenu()
                  nav(page.path)
                }}
                sx={{my: 2, color: 'white', display: 'block'}}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          <UserAvatar/>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
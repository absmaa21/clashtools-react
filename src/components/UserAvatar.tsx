import {
  Avatar,
  Box,
  Button,
  Dialog, DialogActions,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  Typography, useTheme,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import LoginIcon from '@mui/icons-material/Login';
import useClient from "../hooks/useClient.ts";
import RegisterScreen from "../screens/RegisterScreen.tsx";
import LoginScreen from "../screens/LoginScreen.tsx";
import SettingsScreen from "../screens/SettingsScreen.tsx";

function UserAvatar() {

  const Client = useClient()
  const Theme = useTheme()

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [showDialog, setShowDialog] = useState<'register' | 'login' | null>(null)
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  }

  const handleOpenSettings = () => {
    handleCloseUserMenu()
    setShowDialog(null)
    setSettingsOpen(true)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    setShowDialog(null)
    Client.logout()
  }

  const handleOpenLogin = () => {
    setShowDialog('login')
  }

  const handleCloseDialog = () => {
    setShowDialog(null)
  }

  const handleOpenRegister = () => {
    setShowDialog('register')
  }

  useEffect(() => {
    handleCloseUserMenu()
    setShowDialog(null)
  }, [Client]);

  const textColor = Theme.palette.mode === 'light' ? Theme.palette.primary.contrastText : Theme.palette.primary.light

  // Show this if the user is not logged in
  if (!Client.isLoggedIn()) {
    return (
      <Box sx={{flexGrow: 0}}>
        <Dialog
          open={!!showDialog}
          onClose={handleCloseDialog}
        >
          <DialogContent>
            {showDialog === 'register' && <RegisterScreen onSuccess={handleOpenLogin}/>}
            {showDialog === 'login' && <LoginScreen onSuccess={handleCloseDialog}/>}
          </DialogContent>
          <DialogActions>
              <Button sx={{ml: 1}} onClick={showDialog === 'login' ? handleOpenRegister : handleOpenLogin}>
                {showDialog === 'login' ? 'Create an account' : 'Login existing account'}
              </Button>
          </DialogActions>
        </Dialog>

        <Tooltip title="Click to login">
          <Button onClick={handleOpenLogin} sx={{p: 1}}>
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: {xs: 'none', md: 'flex'},
                flexGrow: 1,
                textDecoration: 'none',
                color: textColor,
              }}
            >Login</Typography>
            <LoginIcon sx={{color: textColor}}/>
          </Button>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{flexGrow: 0}}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
          <Avatar alt={Client.user?.username}/>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{mt: '45px'}}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem key={'settings'} onClick={handleOpenSettings}>
          <Typography sx={{textAlign: 'center'}}>Settings</Typography>
        </MenuItem>
        <MenuItem key={'logout'} onClick={handleLogout}>
          <Typography sx={{textAlign: 'center'}}>Logout</Typography>
        </MenuItem>
      </Menu>

      <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)} sx={{ placeSelf: 'center', width: '100%' }}>
        <SettingsScreen/>
      </Modal>
    </Box>
  );
}

export default UserAvatar;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, Avatar, Menu, MenuItem } from '@mui/material';
import Signin from './Signin';
import Signup from './Signup';
import Settings from './Settings';

const navbarStyle = {
  root: {
    flexGrow: 1,
    position: 'fixed',
    width: '100%',
    top: 0,
    zIndex: 1000,
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    width: '50px',
    marginRight: '8px',
  },
  appBar: {
    backgroundColor: '#333',
    boxShadow: 'none',
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  navLink: {
    color: '#FFF',
    marginRight: '16px',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  activeNavLink: {
    color: '#FFD700',
    marginRight: '16px',
    textDecoration: 'none',
  },
  button: {
    color: '#FFF',
  },
  avatar: {
    backgroundColor: '#FFF',
    color: '#333',
    marginRight: '10px',
    cursor: 'pointer',
  },
  avatarMenu: {
    marginTop: '2px',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  settingsButton: {
    color: '#FFF',
    marginLeft: '10px',
  },
};

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [showSigninDialog, setShowSigninDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settingsKey, setSettingsKey] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedInUser(null);
    setAnchorEl(null);
    navigate('/'); // Redirect to home page
  };

  const handleSignupClick = () => {
    setShowSignupDialog(true);
  };

  const handleSigninClick = () => {
    setShowSigninDialog(true);
  };

  const handleCloseSignupDialog = () => {
    setShowSignupDialog(false);
  };

  const handleCloseSigninDialog = () => {
    setShowSigninDialog(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    if (loggedInUser) {
      setShowSettingsDialog(true);
      handleMenuClose();
      setSettingsKey((prevKey) => prevKey + 1);
    } else {
      console.error('No user logged in');
    }
  };

  const handleCloseSettingsDialog = () => {
    setShowSettingsDialog(false);
    setSettingsKey((prevKey) => prevKey + 1);
  };

  return (
    <div style={navbarStyle.root}>
      <AppBar position="static" style={navbarStyle.appBar}>
        <Toolbar style={navbarStyle.toolbar}>
          <img src="/logoM.png" alt="LogoM" style={navbarStyle.logo} />
          <Typography variant="h4" style={navbarStyle.title}>
            Agence Urbaine
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            style={location.pathname === '/' ? navbarStyle.activeNavLink : navbarStyle.navLink}
          >
            Accueil
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/services"
            style={location.pathname === '/services' ? navbarStyle.activeNavLink : navbarStyle.navLink}
          >
            Services
          </Button>
          {loggedInUser && (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/projets"
                style={location.pathname === '/projets' ? navbarStyle.activeNavLink : navbarStyle.navLink}
              >
                Projets
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/zones-urbaines"
                style={location.pathname === '/zones-urbaines' ? navbarStyle.activeNavLink : navbarStyle.navLink}
              >
                Zones Urbaines
              </Button>
              {loggedInUser && loggedInUser.fonction.toLowerCase() && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/users"
                  style={location.pathname === '/users' ? navbarStyle.activeNavLink : navbarStyle.navLink}
                >
                  Users
                </Button>
              )}
            </>
          )}
          <Button
            color="inherit"
            component={Link}
            to="/contact"
            style={location.pathname === '/contact' ? navbarStyle.activeNavLink : navbarStyle.navLink}
          >
            Contact
          </Button>
          {loggedInUser ? (
            <div style={navbarStyle.userContainer}>
              <Avatar onClick={handleAvatarClick} style={navbarStyle.avatar}>
                {loggedInUser.name.charAt(0).toUpperCase()}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                style={navbarStyle.avatarMenu}
              >
                <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <>
              <Button color="inherit" onClick={handleSignupClick} style={navbarStyle.button}>
                Sign Up
              </Button>
              <Button color="inherit" onClick={handleSigninClick} style={navbarStyle.button}>
                Sign In
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Dialog open={showSignupDialog} onClose={handleCloseSignupDialog}>
        <DialogTitle style={{ textAlign: 'center', backgroundColor: '#333', color: 'gold', padding: '20px' }}>
          Sign Up
        </DialogTitle>
        <DialogContent>
          <Signup onClose={handleCloseSignupDialog} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSigninDialog} onClose={handleCloseSigninDialog}>
        <DialogTitle style={{ textAlign: 'center', backgroundColor: '#333', color: 'gold', padding: '20px' }}>
          Sign In
        </DialogTitle>
        <DialogContent>
          <Signin setLoggedInUser={setLoggedInUser} onClose={handleCloseSigninDialog} />
        </DialogContent>
      </Dialog>
      <Dialog open={showSettingsDialog} onClose={handleCloseSettingsDialog}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Settings key={settingsKey} user={loggedInUser} onClose={handleCloseSettingsDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navbar;

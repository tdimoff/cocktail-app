import { useState } from "react";
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import ConnectWallet from "./ConnectWallet";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem component={RouterLink} to="/favorites">
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem>
          <ConnectWallet />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Button color="inherit" component={RouterLink} to="/">
              Cocktail Connoisseur
            </Button>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" component={RouterLink} to="/favorites" sx={{ mr: 3 }}>
              Favorites
            </Button>
            <ConnectWallet />
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
};

export default Header;

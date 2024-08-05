import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import ConnectWallet from "./ConnectWallet";
import { fetchRandomCocktail } from "../services/api";
import styles from "../styles/Header.module.scss";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleRandomDrink = async () => {
    try {
      const randomCocktail = await fetchRandomCocktail();
      navigate(`/cocktails/${randomCocktail.idDrink}`);
    } catch (error) {
      console.error("Error fetching random cocktail:", error);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className={styles["header__toolbar"]}>
          <Box>
            <Button color="inherit" component={RouterLink} to="/">
              Cocktail Connoisseur
            </Button>
          </Box>
          <Box className={styles["header__desktop-menu"]}>
            <Box mr={2}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/favorites"
                className={styles["header__menu-button"]}
                startIcon={<FavoriteIcon />}
              >
                Favorites
              </Button>
            </Box>
            <Box mr={2}>
              <Button
                color="inherit"
                onClick={handleRandomDrink}
                startIcon={<ShuffleIcon />}
                className={styles["header__menu-button"]}
              >
                Random Drink
              </Button>
            </Box>
            <ConnectWallet />
          </Box>
          <Box className={styles["header__mobile-menu"]}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          className={styles["header__drawer-list"]}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem component={RouterLink} to="/favorites">
              <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem onClick={handleRandomDrink}>
              <ListItemText primary="Random Drink" />
            </ListItem>
            <ListItem>
              <ConnectWallet />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;

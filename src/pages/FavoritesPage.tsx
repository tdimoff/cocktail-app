import { useState, useEffect } from 'react';
import { Typography, Box } from "@mui/material";
import CocktailList from "../components/CocktailList";
import { ICocktail } from "../interfaces/ICocktail.interface";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<ICocktail[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");

    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  const handleToggleFavorite = (cocktail: ICocktail) => {
    const updatedFavorites = favorites.filter(fav => fav.idDrink !== cocktail.idDrink);

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>
        Your Favorite Cocktails
      </Typography>
      {favorites.length === 0 ? (
        <Typography>You haven't added any favorites yet.</Typography>
      ) : (
        <CocktailList
          cocktails={favorites}
          handleToggleFavorite={handleToggleFavorite}
          favorites={favorites}
        />
      )}
    </Box>
  );
};

export default FavoritesPage;

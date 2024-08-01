import { Grid } from "@mui/material";
import CocktailItem from "./CocktailItem";
import { ICocktail } from "../interfaces/ICocktail.interface"

interface ICocktailListProps {
  cocktails: ICocktail[];
  handleToggleFavorite: (cocktail: ICocktail) => void;
  favorites: ICocktail[];
}

const CocktailList = ({
  cocktails,
  handleToggleFavorite,
  favorites,
}: ICocktailListProps) => (
  <Grid container spacing={4}>
    {cocktails.map((cocktail: ICocktail) => (
      <Grid item key={cocktail.idDrink} xs={12} sm={6} md={4}>
        <CocktailItem
          cocktail={cocktail}
          onToggleFavorite={() => handleToggleFavorite(cocktail)}
          isFavorite={favorites.some(fav => fav.idDrink === cocktail.idDrink)}
        />
      </Grid>
    ))}
  </Grid>
);

export default CocktailList;

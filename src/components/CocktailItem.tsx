import { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Rating
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ICocktail } from "../interfaces/ICocktail.interface";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styles from "../styles/CocktailItem.module.scss";

interface ICocktailItemProps {
  cocktail: ICocktail;
  isFavorite: boolean;
  onToggleFavorite: (cocktail: ICocktail) => void;
}

const CocktailItem = ({
  cocktail,
  isFavorite,
  onToggleFavorite,
}: ICocktailItemProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  const handleItemClick = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setTimeout(() => navigateToCocktailDetail(), 300);
        })
        .catch((error) => {
          console.error("Error playing sound:", error);
          navigateToCocktailDetail();
        });
    } else {
      navigateToCocktailDetail();
    }
  };

  const navigateToCocktailDetail = () => {
    navigate(`/cocktails/${cocktail.idDrink}`);
  };

  return (
    <Card className={styles["cocktail-item"]} onClick={handleItemClick}>
      <Box className={styles["cocktail-item__relative-box"]}>
        <Box className={styles["cocktail-item__image-container"]}>
          <CardMedia
            component="img"
            image={cocktail.strDrinkThumb}
            alt={cocktail.strDrink}
            className={styles["cocktail-item__image"]}
          />
        </Box>
        <CardContent className={styles["cocktail-item__content"]}>
          <Typography gutterBottom variant="h5" component="div" className={styles["cocktail-item__title"]}>
            {cocktail.strDrink}
          </Typography>
          <Typography variant="body2" color="text.secondary" className={styles["cocktail-item__category"]}>
            Category: {cocktail.strCategory}
          </Typography>
          <Rating name={`rating-${cocktail.idDrink}`} value={cocktail.rating || 0} readOnly className={styles["cocktail-item__rating"]} />
        </CardContent>
        <Box className={styles["cocktail-item__favorite-button"]}>
          <IconButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(cocktail);
            }}
            color={isFavorite ? "secondary" : "default"}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Box>
      <audio ref={audioRef} className={styles["cocktail-item__audio"]}>
        <source src="/sounds/ice-clink.mp3" type="audio/mpeg" />
      </audio>
    </Card>
  );
};

export default CocktailItem;

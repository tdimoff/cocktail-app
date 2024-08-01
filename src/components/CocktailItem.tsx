import { useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  CardActionArea,
  Rating
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ICocktail } from "../interfaces/ICocktail.interface";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

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

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          // Navigate after the sound starts playing
          setTimeout(() => navigate(`/cocktails/${cocktail.idDrink}`), 300);
        })
    } else {
      // If audio element is not available, just navigate
      navigate(`/cocktails/${cocktail.idDrink}`);
    }
  };

  return (
    <Card>
      <Box position="relative">
        <CardActionArea onClick={playSound}>
          <CardMedia
            component="img"
            height="140"
            image={cocktail.strDrinkThumb}
            alt={cocktail.strDrink}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {cocktail.strDrink}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Category: {cocktail.strCategory}
            </Typography>
            <Rating name={`rating-${cocktail.idDrink}`} value={4} readOnly />
          </CardContent>
        </CardActionArea>
        <Box
          position="absolute"
          top={8}
          right={8}
          sx={{
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "50%",
          }}
        >
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
      <audio ref={audioRef}>
        <source src="/sounds/ice-clink.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </Card>
  );
};

export default CocktailItem;

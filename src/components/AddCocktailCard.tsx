import { Card, CardContent, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "../styles/AddCocktailCard.module.scss";

interface AddCocktailCardProps {
  onClick?: () => void;
}

const AddCocktailCard = ({ onClick }: AddCocktailCardProps) => (
  <Card className={styles["add-cocktail-card"]} onClick={onClick}>
    <CardContent className={styles["add-cocktail-card__content"]}>
      <IconButton size="large">
        <AddIcon fontSize="large" />
      </IconButton>
    </CardContent>
  </Card>
);

export default AddCocktailCard;

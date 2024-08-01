import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Slider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useAddCocktailToContract } from "../services/api";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface AddCocktailFormProps {
  onCocktailAdded: () => void;
}

const AddCocktailForm = ({ onCocktailAdded }: AddCocktailFormProps) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [alcoholPercentage, setAlcoholPercentage] = useState(0);
  const [cocktailType, setCocktailType] = useState("");
  const [price, setPrice] = useState(0);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '' }]);
  const [instructions, setInstructions] = useState("");

  const { addCocktail, isPending } = useAddCocktailToContract();

  const handleIngredientChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientList = ingredients.map(ingredient => `${ingredient.name}: ${ingredient.amount}`);
    await addCocktail(name, ingredientList, instructions, imageUrl);
    setName("");
    setImageUrl("");
    setCategory("");
    setAlcoholPercentage(0);
    setCocktailType("");
    setPrice(0);
    setIngredients([{ name: '', amount: '' }]);
    setInstructions("");
    // Call the callback function to refresh the cocktail list
    onCocktailAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5">Add New Cocktail</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cocktail Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Alcohol Percentage</Typography>
          <Slider
            value={alcoholPercentage}
            onChange={(_, newValue) => setAlcoholPercentage(newValue as number)}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={100}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Cocktail Type"
            value={cocktailType}
            onChange={(e) => setCocktailType(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Ingredients</Typography>
          {ingredients.map((ingredient, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Ingredient Name"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, 'name', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Amount"
                  value={ingredient.amount}
                  onChange={(e) =>
                    handleIngredientChange(index, 'amount', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton
                  onClick={() => handleRemoveIngredient(index)}
                  disabled={ingredients.length === 1}
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddIngredient}
            startIcon={<AddIcon />}
          >
            Add Ingredient
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Cocktail"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddCocktailForm;

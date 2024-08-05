import { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Slider,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useWriteContract } from "wagmi";
import {
  COCKTAIL_CONTRACT_ABI,
  COCKTAIL_CONTRACT_ADDRESS,
} from "../contracts/CocktailContract";

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

  const { writeContract } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      writeContract({
        address: COCKTAIL_CONTRACT_ADDRESS,
        abi: COCKTAIL_CONTRACT_ABI,
        functionName: "addCocktail",
        args: [
          name,
          imageUrl,
          category,
          alcoholPercentage,
          cocktailType,
          price,
        ],
      });
      setName("");
      setImageUrl("");
      setCategory("");
      setAlcoholPercentage(0);
      setCocktailType("");
      setPrice(0);
      onCocktailAdded();
    } catch (error) {
      console.error("Error adding cocktail:", error);
    }
  };

  const categoryOptions = ["Alcoholic", "Non-alcoholic"];
  const cocktailTypeOptions = ["Light", "Medium", "Strong"];

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
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option.toLowerCase()}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <FormControl fullWidth required>
            <InputLabel>Cocktail Type</InputLabel>
            <Select
              value={cocktailType}
              onChange={(e) => setCocktailType(e.target.value)}
            >
              {cocktailTypeOptions.map((option) => (
                <MenuItem key={option} value={option.toLowerCase()}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            InputProps={{
              startAdornment: (<InputAdornment position="start">$</InputAdornment>),
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Add Cocktail
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddCocktailForm;

import { useParams } from "react-router-dom";
import { ICocktail } from "../interfaces/ICocktail.interface";
import { useEffect, useState } from "react";
import { fetchCocktailById } from "../services/api";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  Rating,
} from "@mui/material";
import { useWriteContract } from "wagmi";
import {
  COCKTAIL_CONTRACT_ABI,
  COCKTAIL_CONTRACT_ADDRESS,
} from "../contracts/CocktailContract";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "../config/wagmi";
import { useWaitForTransactionReceipt } from 'wagmi'

const CocktailDetailPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cocktail, setCocktail] = useState<ICocktail>();
  const [rating, setRating] = useState<number | null>(0);
  const { writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    const loadCocktail = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const data = await fetchCocktailById(id);
          setCocktail(data);
          setRating(data.rating || 0);
        } catch (error) {
          console.error("Error fetching cocktail details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadCocktail();
  }, [id]);

  const handleRating = async (newValue: number | null) => {
    if (newValue === null || !id) return;

    try {
      const { hash } = await writeContract({
        abi: COCKTAIL_CONTRACT_ABI,
        address: COCKTAIL_CONTRACT_ADDRESS,
        functionName: 'rateCocktail',
        args: [BigInt(id), BigInt(newValue)],
      });

      // Wait for the transaction to be mined
      const receipt = await waitForTransactionReceipt(config, { hash });

      if (receipt.status === 'success') {
        setRating(newValue);
        // Optionally, update the cocktail object with the new rating
        setCocktail(prev => prev ? {...prev, rating: newValue} : prev);
      } else {
        console.error("Transaction failed");
      }
    } catch (error) {
      console.error("Error rating cocktail:", error);
    }
  };

  return (
    <Box>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : cocktail ? (
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={cocktail.strImageSource}
            alt={cocktail.strDrink}
          />
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {cocktail.strDrink}
            </Typography>
            <Typography variant="subtitle1">
              Category: {cocktail.strCategory}
            </Typography>
            <Typography variant="subtitle1">
              Glass: {cocktail.strGlass}
            </Typography>
            <Rating
              name={`rating-${cocktail.idDrink}`}
              value={rating}
              onChange={(event, newValue) => handleRating(newValue)}
            />
          </CardContent>
        </Card>
      ) : (
        <Typography>Cocktail not found</Typography>
      )}
    </Box>
  );
};

export default CocktailDetailPage;

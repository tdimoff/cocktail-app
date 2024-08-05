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
  Container
} from "@mui/material";
import { useReadContract } from "wagmi";
import {
  COCKTAIL_CONTRACT_ABI,
  COCKTAIL_CONTRACT_ADDRESS,
} from "../contracts/CocktailContract";
import { transformBlockchainCocktail } from "../utils/cocktailTransformer";

const CocktailDetailPage = () => {
  const { id } = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cocktail, setCocktail] = useState<ICocktail | null>(null);

  const isBlockchainCocktail = id?.startsWith('blockchain-');
  const blockchainId = isBlockchainCocktail && id ? parseInt(id.split('-')[1], 10) : null;

  const { data: blockchainCocktail } = useReadContract({
    address: COCKTAIL_CONTRACT_ADDRESS,
    abi: COCKTAIL_CONTRACT_ABI,
    functionName: 'getCocktail',
    args: blockchainId !== null ? [blockchainId] : undefined,
  });

  useEffect(() => {
    const loadCocktail = async () => {
      if (id) {
        try {
          setIsLoading(true);

          if (isBlockchainCocktail) {
            if (blockchainCocktail) {
              const transformedCocktail = transformBlockchainCocktail(blockchainCocktail as string[], Number(blockchainId));
              setCocktail(transformedCocktail);
            }
          } else {
            const data = await fetchCocktailById(id);
            setCocktail(data);
          }
        } catch (error) {
          console.error("Error fetching cocktail details:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadCocktail();
  }, [id, isBlockchainCocktail, blockchainCocktail, blockchainId]);

  //TODO
  // const handleRating = async (newValue: number) => {
  //   if (newValue === null || !id) return;

  //   try {
  //     await writeContract({
  //       address: COCKTAIL_CONTRACT_ADDRESS,
  //       abi: COCKTAIL_CONTRACT_ABI,
  //       functionName: 'rateCocktail',
  //       args: [blockchainId !== null ? BigInt(blockchainId) : id, newValue],
  //     });
  //   } catch (error) {
  //     console.error("Error rating cocktail:", error);
  //   }
  // };
console.log(transformBlockchainCocktail)
  return (
    <Container maxWidth="sm">
      <Box>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : cocktail ? (
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={cocktail.strDrinkThumb}
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
                value={isBlockchainCocktail ? Number(cocktail.rating) : 0}
                // onChange={handleRating}
              />
            </CardContent>
          </Card>
        ) : (
          <Typography>Cocktail not found</Typography>
        )}
      </Box>
    </Container>
  );
};

export default CocktailDetailPage;

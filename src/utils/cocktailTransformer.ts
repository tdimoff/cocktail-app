import { ICocktail } from "../interfaces/ICocktail.interface";

export const transformBlockchainCocktail = (blockchainData: string[], id: number): ICocktail => ({
  idDrink: `blockchain-${id}`,
  strDrink: blockchainData[0],
  strDrinkThumb: blockchainData[1],
  strCategory: blockchainData[2],
  strInstructions: "Instructions not available from blockchain",
  strImageSource: "",
  strAlcoholic: "Alcoholic",
  strGlass: "Unknown glass",
  strIngredient1: null,
  strIngredient2: null,
  strIngredient3: null,
  strIngredient4: null,
  strIngredient5: null,
  strMeasure1: null,
  strMeasure2: null,
  strMeasure3: null,
  strMeasure4: null,
  strMeasure5: null,
  rating: Number(blockchainData[6]),
});

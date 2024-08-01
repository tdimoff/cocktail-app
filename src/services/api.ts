import axios from "axios";
import { useReadContract, useWriteContract } from 'wagmi'
import { COCKTAIL_CONTRACT_ABI, COCKTAIL_CONTRACT_ADDRESS } from "../contracts/CocktailContract";
import { ICocktail } from "../interfaces/ICocktail.interface";
import { COCKTAIL_DB_API_BASE_URL } from "../config/config";

export const fetchCocktails = async (): Promise<ICocktail[]> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/search.php?s=`);
  return response.data.drinks;
};

export const searchCocktails = async (searchTerm: string): Promise<ICocktail[]> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/search.php?s=${searchTerm}`);
  return response.data.drinks;
};

export const searchCocktailsByName = async (name: string): Promise<ICocktail[]> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/search.php?s=${name}`);
  return response.data.drinks || [];
};

export const searchCocktailsByIngredient = async (ingredient: string): Promise<ICocktail[]> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/filter.php?i=${ingredient}`);
  return response.data.drinks || [];
};

export const fetchCocktailById = async (id: string): Promise<ICocktail> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/lookup.php?i=${id}`);
  return response.data.drinks[0];
};

export const fetchRandomCocktail = async (): Promise<ICocktail> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/random.php`);
  return response.data.drinks[0];
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/list.php?c=list`);
  return response.data.drinks.map((category: { strCategory: string }) => category.strCategory);
};

export const fetchCocktailsByCategory = async (category: string): Promise<{ drinks: ICocktail[], category: string }> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  return { 
    drinks: response.data.drinks,
    category: category
  };
};

export const useAddCocktailToContract = () => {
  const { writeContract, isPending, isSuccess, error } = useWriteContract()

  const addCocktail = (name: string, ingredients: string[], instructions: string, imageUrl: string): void => {
    writeContract({
      address: COCKTAIL_CONTRACT_ADDRESS,
      abi: COCKTAIL_CONTRACT_ABI,
      functionName: 'addCocktail',
      args: [name, ingredients, instructions, imageUrl],
    })
  }

  return { addCocktail, isPending, isSuccess, error }
}

export const useFetchCocktailsFromContract = () => {
  const { data, isLoading, isError } = useReadContract({
    address: COCKTAIL_CONTRACT_ADDRESS,
    abi: COCKTAIL_CONTRACT_ABI,
    functionName: 'getCocktails',
  })

  return { cocktails: data as ICocktail[], isLoading, isError }
}

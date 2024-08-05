import axios from "axios";
import { ICocktail } from "../interfaces/ICocktail.interface";
import { COCKTAIL_DB_API_BASE_URL } from "../config/config";

export const fetchCocktails = async (): Promise<ICocktail[]> => {
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/search.php?s=`);
  return response.data.drinks;
};

export const searchCocktails = async (searchTerm: string, searchType: 'name' | 'ingredient'): Promise<ICocktail[]> => {
  const param = searchType === 'name' ? 's' : 'i';
  const response = await axios.get(`${COCKTAIL_DB_API_BASE_URL}/${searchType === 'name' ? 'search.php' : 'filter.php'}?${param}=${searchTerm}`);

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

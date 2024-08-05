import { useCallback, useEffect, useState } from "react";
import { Typography, Box, Chip, Grid } from "@mui/material";
import CocktailList from "../components/CocktailList";
import SearchBar from "../components/SearchBar";
import { ICocktail } from "../interfaces/ICocktail.interface";
import {
  fetchCocktails,
  searchCocktails,
  fetchCategories,
  fetchCocktailsByCategory,
} from "../services/api";
import { useAccount, useReadContract } from "wagmi";
import AddCocktailModal from "../components/AddCocktailModal";
import {
  COCKTAIL_CONTRACT_ABI,
  COCKTAIL_CONTRACT_ADDRESS,
} from "../contracts/CocktailContract";
import styles from "../styles/HomePage.module.scss";
import { transformBlockchainCocktail } from "../utils/cocktailTransformer";
import AddCocktailCard from "../components/AddCocktailCard";
import { useCocktailContract } from "../hooks/useCocktailContract";
import { blockchainCocktailFetchCount } from "../config/config";

const HomePage = () => {
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<ICocktail[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { isConnected } = useAccount();
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>("");
  const [currentSearchType, setCurrentSearchType] = useState<"name" | "ingredient">("name");

  const { data: cocktailCount } = useReadContract({
    address: COCKTAIL_CONTRACT_ADDRESS,
    abi: COCKTAIL_CONTRACT_ABI,
    functionName: "getCockltailCount",
  });

  const {
    data: blockchainCocktailsResults,
    isPending: isBlockchainCocktailLoading,
  } = useCocktailContract(blockchainCocktailFetchCount);

  const fetchBlockchainCocktails = useCallback(() => {
    if (blockchainCocktailsResults && isConnected) {
      const transformedCocktails = blockchainCocktailsResults
        .filter(
          (result): result is { status: "success"; result: string[] } =>
            result.status === "success" && Array.isArray(result.result)
        )
        .map((result, index) =>
          transformBlockchainCocktail(result.result, index)
        );
      setCocktails(transformedCocktails);
    }
  }, []);

  console.log(blockchainCocktailsResults);

  useEffect(() => {
    if (isConnected) {
      fetchBlockchainCocktails();
    } else {
      fetchAllCocktails();
    }
    loadFavorites();
    loadCategories();
  }, [isConnected, blockchainCocktailsResults, fetchBlockchainCocktails]);

  const loadCategories = async () => {
    try {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchAllCocktails = async () => {
    setIsLoading(true);
    setCurrentSearchTerm("");
    setSelectedCategory("");

    try {
      const data = await fetchCocktails();
      const cocktailsWithDefaultRating = data.map((cocktail) => ({
        ...cocktail,
        rating: 0,
      }));
      setCocktails(cocktailsWithDefaultRating);
    } catch (err) {
      console.error("Error fetching cocktails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (
    searchTerm: string,
    searchType: "name" | "ingredient"
  ) => {
    setIsLoading(true);
    setCurrentSearchTerm(searchTerm);
    setCurrentSearchType(searchType);

    try {
      const data = await searchCocktails(searchTerm, searchType);
      const cocktailsWithDefaultRating = data.map((cocktail) => ({
        ...cocktail,
        rating: 0,
      }));

      if (selectedCategory) {
        const filteredData = cocktailsWithDefaultRating.filter(
          (cocktail: ICocktail) =>
            cocktail.strCategory?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );
        setCocktails(filteredData);
      } else {
        setCocktails(cocktailsWithDefaultRating);
      }
    } catch (err) {
      console.error("Error searching cocktails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  };

  //TODO
  const handleCocktailAdded = () => {
    // Implement logic for when a cocktail is added
  };

  const handleToggleFavorite = (cocktail: ICocktail) => {
    const updatedFavorites = favorites.some(
      (fav) => fav.idDrink === cocktail.idDrink
    )
      ? favorites.filter((fav) => fav.idDrink !== cocktail.idDrink)
      : [...favorites, cocktail];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleCategoryClick = async (category: string) => {
    setIsLoading(true);

    let newSelectedCategory = category;

    if (selectedCategory === category) {
      newSelectedCategory = "";
    }

    setSelectedCategory(newSelectedCategory);

    try {
      let filteredCocktails;

      if (newSelectedCategory) {
        const { drinks } = await fetchCocktailsByCategory(newSelectedCategory);
        filteredCocktails = drinks;
      } else {
        if (currentSearchTerm) {
          filteredCocktails = await searchCocktails(
            currentSearchTerm,
            currentSearchType
          );
        } else {
          filteredCocktails = await fetchCocktails();
        }
      }

      const cocktailsWithDefaultRating = filteredCocktails.map((cocktail) => ({
        ...cocktail,
        rating: 0,
      }));

      if (currentSearchTerm && newSelectedCategory) {
        filteredCocktails = cocktailsWithDefaultRating.filter(
          (cocktail: ICocktail) =>
            cocktail.strDrink
              .toLowerCase()
              .includes(currentSearchTerm.toLowerCase())
        );
      }

      setCocktails(filteredCocktails);
    } catch (err) {
      console.error("Error filtering cocktails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCocktail = () => {
    setIsAddFormOpen(true);
  };

  return (
    <Box mt={2} className={styles["home-page"]}>
      <Box className={styles["home-page__search-bar"]}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      <Box className={styles["home-page__categories"]}>
        <Grid container spacing={1}>
          {categories.map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                onClick={() => handleCategoryClick(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
                className={styles["home-page__category-chip"]}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AddCocktailModal
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onCocktailAdded={handleCocktailAdded}
      />
      {isLoading || isBlockchainCocktailLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            {selectedCategory
              ? `${selectedCategory} Cocktails`
              : isConnected
              ? `All Cocktails (${
                  cocktailCount ? cocktailCount.toString() : "?"
                })`
              : "All Cocktails"}
          </Typography>
          <div className={styles["home-page__cocktail-list"]}>
            <Grid container spacing={4}>
              {isConnected && (
                <Grid item xs={12} sm={6} md={4}>
                  <AddCocktailCard onClick={handleAddCocktail} />
                </Grid>
              )}
              <CocktailList
                cocktails={cocktails}
                handleToggleFavorite={handleToggleFavorite}
                favorites={favorites}
              />
            </Grid>
          </div>
        </>
      )}
    </Box>
  );
};

export default HomePage;

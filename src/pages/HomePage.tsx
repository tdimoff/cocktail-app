import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  Chip,
  Grid,
} from "@mui/material";
import CocktailList from "../components/CocktailList";
import SearchBar from "../components/SearchBar";
import { ICocktail } from "../interfaces/ICocktail.interface";
import {
  fetchCocktails,
  searchCocktails,
  fetchRandomCocktail,
  fetchCategories,
  fetchCocktailsByCategory,
} from "../services/api";
import { useAccount, useReadContract } from "wagmi";
import { useFetchCocktailsFromContract } from "../services/api";
import AddCocktailModal from "../components/AddCocktailModal";
import { useCocktailContract } from "../config/wagmi";

const HomePage = () => {
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<ICocktail[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const { isConnected } = useAccount();
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>("");
  const { chain } = useAccount()
  const cocktailContract = useCocktailContract();

  console.log(cocktailContract)

  const { data: cocktailCount, isPending: isCocktailCountLoading } = useReadContract({
    ...cocktailContract,
    functionName: 'getCocktailCount',
  });

  console.log(cocktailCount)

  useEffect(() => {
    fetchAllCocktails();
    loadFavorites();
    loadCategories();
  }, []);

  useEffect(() => {
    if (isConnected) {
      useFetchCocktailsFromContract;
    } else {
      fetchAllCocktails();
    }
  }, [isConnected]);

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
      setCocktails(data);
    } catch (err) {
      console.error("Error fetching cocktails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setCurrentSearchTerm(searchTerm);

    try {
      let data;
      if (selectedCategory) {
        // If a category is selected, first get all cocktails in that category
        const categoryData = await fetchCocktailsByCategory(selectedCategory);
        // Then filter these results based on the search term
        data = categoryData.drinks.filter((cocktail: ICocktail) =>
          cocktail.strDrink.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        // If no category is selected, search all cocktails
        data = await searchCocktails(searchTerm);
      }
      setCocktails(data);
    } catch (err) {
      console.error("Error searching cocktails:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetRandomCocktail = async () => {
    setIsLoading(true);
    setCurrentSearchTerm("");
    setSelectedCategory("");

    try {
      const randomCocktail = await fetchRandomCocktail();

      setCocktails([randomCocktail]);
    } catch (err) {
      console.error("Error fetching random cocktail:", err);
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

  const handleCocktailAdded = () => {
    setShowAddForm(false);
    fetchAllCocktails(); // Refresh the cocktail list
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

  const handleCategoryClick = (category: string) => {
    setIsLoading(true);

    let newSelectedCategory = category;
    let filteredCocktails;

    if (selectedCategory === category) {
      newSelectedCategory = "";
    }

    setSelectedCategory(newSelectedCategory);

    try {
      if (newSelectedCategory) {
        // Filter the current cocktails list based on the selected category
        filteredCocktails = cocktails.filter(
          (cocktail: ICocktail) =>
            cocktail.strCategory.toLowerCase() ===
            newSelectedCategory.toLowerCase()
        );
      } else {
        // If no category is selected (or category was deselected), show all cocktails
        if (currentSearchTerm) {
          // If there's a current search term, we need to re-fetch the search results
          searchCocktails(currentSearchTerm)
            .then((data) => {
              setCocktails(data);
              setIsLoading(false);
            })
            .catch((err) => {
              console.error("Error searching cocktails:", err);
              setIsLoading(false);
            });
          return; // Exit the function here as we're handling the state update in the promise
        } else {
          // If no search term, revert to all cocktails
          fetchCocktails()
            .then((data) => {
              setCocktails(data);
              setIsLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching all cocktails:", err);
              setIsLoading(false);
            });
          return;
        }
      }

      setCocktails(filteredCocktails);
    } catch (err) {
      console.error("Error filtering cocktails by category:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mt={2}>
      {chain && <Typography>{chain.name}</Typography>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <SearchBar onSearch={handleSearch} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetRandomCocktail}
            fullWidth
          >
            Get Random Cocktail
          </Button>
        </Grid>
      </Grid>
      <Box mt={2}>
        {isCocktailCountLoading ? (
          <Typography>Loading cocktail count...</Typography>
        ) : (
          <Typography>
            Total cocktails in smart contract: {cocktailCount?.toString()}
          </Typography>
        )}
      </Box>
      <Box mt={2} mb={2}>
        <Grid container spacing={1}>
          {categories.map((category) => (
            <Grid item key={category}>
              <Chip
                label={category}
                onClick={() => handleCategoryClick(category)}
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
                style={{ borderRadius: "20px" }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {isConnected && (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsAddFormOpen(true)}
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginRight: "10px",
            }}
          >
            Add New Cocktail
          </Button>
          <AddCocktailModal
            isOpen={isAddFormOpen}
            onClose={() => setIsAddFormOpen(false)}
            onCocktailAdded={handleCocktailAdded}
          />
        </>
      )}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            {selectedCategory
              ? `${selectedCategory} Cocktails`
              : "All Cocktails"}
          </Typography>
          <CocktailList
            cocktails={cocktails}
            handleToggleFavorite={handleToggleFavorite}
            favorites={favorites}
          />
        </>
      )}
    </Box>
  );
};

export default HomePage;

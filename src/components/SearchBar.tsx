import { useState, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import styles from "../styles/SearchBar.module.scss";

interface ISearchBarProps {
  onSearch: (searchTerm: string, searchType: 'name' | 'ingredient') => void;
}

const SearchBar = ({ onSearch }: ISearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<'name' | 'ingredient'>('name');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (event: SelectChangeEvent<'name' | 'ingredient'>) => {
    setSearchType(event.target.value as 'name' | 'ingredient');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm, searchType);
  };

  return (
    <Box className={styles["search-bar"]}>
      <form onSubmit={handleSubmit} className={styles["search-bar__form"]}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search by ${searchType}...`}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Select
                  value={searchType}
                  onChange={handleSearchTypeChange}
                  displayEmpty
                  variant="standard"
                  disableUnderline
                  IconComponent={ArrowDropDownIcon}
                  className={styles["search-bar__select-wrapper"]}
                >
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="ingredient">Ingredient</MenuItem>
                </Select>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" aria-label="search">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Box>
  );
};

export default SearchBar;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Box } from "@mui/material";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import CocktailDetailPage from "./pages/CocktailDetailPage";
import Header from "./components/Header";

const App = () => (
  <Box>
    <Router>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/cocktails/:id" element={<CocktailDetailPage />} />
        </Routes>
      </Container>
    </Router>
  </Box>
);

export default App;

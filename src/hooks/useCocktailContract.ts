import { useReadContract } from "wagmi";
import {
  COCKTAIL_CONTRACT_ABI,
  COCKTAIL_CONTRACT_ADDRESS,
} from "../contracts/CocktailContract";

export function useCocktailContract() {
  return useReadContract({
    address: COCKTAIL_CONTRACT_ADDRESS,
    abi: COCKTAIL_CONTRACT_ABI,
  });
}

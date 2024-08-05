import { useReadContracts } from "wagmi";
import { Abi } from 'viem';
import {
  COCKTAIL_CONTRACT_ABI,
  COCKTAIL_CONTRACT_ADDRESS,
} from "../contracts/CocktailContract";

export function useCocktailContract(count: number = 10) {
  const contractCalls = Array.from({ length: count }, (_, index) => ({
    address: COCKTAIL_CONTRACT_ADDRESS as `0x${string}`,
    abi: COCKTAIL_CONTRACT_ABI as Abi,
    functionName: 'getCocktail',
    args: [index],
  }));

  return useReadContracts({
    contracts: contractCalls,
  });
}
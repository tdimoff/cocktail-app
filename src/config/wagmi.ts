import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { COCKTAIL_CONTRACT_ABI, COCKTAIL_CONTRACT_ADDRESS } from '../contracts/CocktailContract'
import { useContract } from '../hooks/useContract'
import { ALCHEMY_SEPOLIA_RPC_URL } from './config'

export const config = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(ALCHEMY_SEPOLIA_RPC_URL),
  },
})

export const useCocktailContract = () => {
  return useContract(COCKTAIL_CONTRACT_ADDRESS, COCKTAIL_CONTRACT_ABI)
}

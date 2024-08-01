import { useReadContract } from 'wagmi';
import { Address, Abi } from 'viem';

export function useContract(address: Address, abi: Abi) {
  return useReadContract({
    address,
    abi,
  });
}

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';

const ConnectWallet = () => {
 const { address, isConnected } = useAccount()
 const { connect, connectors } = useConnect()
 const { disconnect } = useDisconnect()

 const handleToggleConnection = () => {
   if (isConnected) {
     disconnect()
   } else {
     const connector = connectors[0]
     if (connector) {
       connect({ connector })
     }
   }
 }

 const shortenAddress = (addr: string) => {
   return `${addr.slice(0, 6)}...${addr.slice(-4)}`
 }

 return (
   <Button
     onClick={handleToggleConnection}
     variant="contained"
     color={isConnected ? "secondary" : "primary"}
     startIcon={isConnected ? <LogoutIcon /> : <AccountBalanceWalletIcon />}
   >
     {isConnected && address ? shortenAddress(address) : "Connect Wallet"}
   </Button>
 )
}

export default ConnectWallet;

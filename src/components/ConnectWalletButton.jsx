import React from 'react'
import { Button } from "@mantine/core"
import { disconnect } from "@wagmi/core";
import { useAccount, useConnect, useEnsName } from 'wagmi'

export const ConnectWalletButton = () => {
    const { address, isConnected } = useAccount();
    const { data } = useEnsName({ address });
    const { connectors, connect } = useConnect();


    const handleClick = () => {
        if (isConnected) {
          disconnect();
        } else {
          console.log(connectors)
          const injected = connectors[0].connect()
          connect({ injected });
        }
    }


    const renderConnectText = () => {
        if (isConnected) {
          const start = address?.slice(0,6);
          const end = address?.slice(address.length-4, address.length);
          return `${start}...${end}`;
        } else {
          return "Connect Wallet";
        }
    }


    return(
        <Button onClick={handleClick}>
            { renderConnectText() }
        </Button>
    )
}
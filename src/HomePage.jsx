import React from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import axios from 'axios';
import { Stack, Text, Title, Grid, Input, Button, Group, Space } from '@mantine/core'
import { notifications } from "@mantine/notifications";
import { ConnectWalletButton } from './components/ConnectWalletButton';
import { Addresses } from "./shared/addresses"
import abiPath from "./lib/abi/SimpleMultiplier.json"


const HomePage = () => {
    const [input0, setInput0] = React.useState("");
    const [input1, setInput1] = React.useState("");
    const { isConnected } = useAccount();

    const { data: hash, writeContract } = useWriteContract()

    const handleGenerateProofSendTransaction = async (e) => {
        e.preventDefault()

        const data = {
            input0,
            input1
        }

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        try{
            const res = await axios.post('http://localhost:3000/generate_proof', data, config)
            notifications.show({
                message: "Proof generated successfully! Submitting transaction...",
                color: "green"
            })

            const { proof, publicSignals } = res.data

            writeContract({
                address: Addresses.MULTIPLIER_ADDR, 
                abi: abiPath.abi, 
                functionName: 'submitProof', 
                args: [proof, publicSignals] 
            })

            if(hash){
                console.log(hash)
                notifications.show({
                    message: `Transaction succeeded! Tx Hash: ${hash}`,
                    color: "green",
                    autoClose: false,
                });
            }

        }catch(err){
            const statusCode = err?.response?.status;
            const errorMsg = err?.response?.data?.error;
            notifications.show({
                message: `Error ${statusCode}: ${errorMsg}`,
                color: "red",
            });
        }
    }


    const renderSubmitButton = () => {
        if(!isConnected){
            return <ConnectWalletButton />
        }else{
            return <Button type="submit">Generate Proof and Send Transaction</Button>
        }
    }


    return (
        <>
            {/* <Head> */}
                <title>ZK Multiplier</title>
            {/* </Head> */}
            <Stack justfiy="center" align="center" w="100vw" h="100vh" spacing={0}>
                <Stack align="center" spacing={0}>
                    <Group w="96vw" h="10vh" position="apart" align="center">
                        <Title order={3}>
                            ZK Multiplier
                        </Title>
                        <ConnectWalletButton />
                    </Group>
                    <Grid align="center" justify="center" mih="80vh">
                        <Grid.Col sm={8} md={6} lg={4}>
                            <Text>
                                {"Input two numbers between 0 and 5, inclusive. The two numbers must \
                                not be equal. We'll generate a ZK proof locally in the browser, and \
                                only the proof will be sent to the blockchain so that no one \
                                watching the blockchain will know the two numbers."}
                            </Text>
                            <Space h={20} />
                            <form onSubmit={handleGenerateProofSendTransaction}>
                                <Stack spacing="sm">
                                    <Input.Wrapper label="Input 0">
                                        <Input 
                                        placeholder="Number between 0 and 5" 
                                        value={input0} 
                                        onChange={(e) => setInput0(e.currentTarget.value)}
                                        />
                                    </Input.Wrapper>
                                    <Input.Wrapper label="Input 1">
                                    <Input 
                                        placeholder="Number between 0 and 5" 
                                        value={input1} 
                                        onChange={(e) => setInput1(e.currentTarget.value)}
                                        />
                                    </Input.Wrapper>
                                    <Space h={10} />
                                    { renderSubmitButton() }
                                </Stack>
                            </form>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Stack>
        </>
    )
}

export default HomePage
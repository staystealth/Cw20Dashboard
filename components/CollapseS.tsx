import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Badge, Box, Button, Collapse, Text, useColorModeValue, useDisclosure, useTimeout, useToast, Link, Input } from '@chakra-ui/react';
import { useWallet } from '@cosmos-kit/react';
import React, { useEffect, useState } from 'react'
import { Cw20Client } from '../codegen/Cw20.client';
import { cw20ContractAddress, explorerTX } from '../config';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useTokenInfo } from '../hooks/useTokenInfo';
import { hitFaucet } from '../scripts/helpers/hitFaucet';
import { malagaConfig } from '../scripts/helpers/networks';

function CollapseS() {
    const { isOpen, onToggle } = useDisclosure();
    const [showSend, setShowSend] = useState(false);
    const tokenInfo = useTokenInfo(cw20ContractAddress);
    const [amount, setAmount] = useState<string | undefined>(undefined);
    const [recipient, setRecipient] = useState<string | undefined>(undefined);
    const toast = useToast();

    const [txHash, setTxHash] = useState<string | undefined>(undefined); 
    const [cw20Client, setCw20Client] = useState<Cw20Client | undefined>(undefined);

    const [hasTimeElapsed, setHasTimeElapsed] = useState(false);
    
    const handleAmount = (event: any) => {
        setAmount(event.target.value);
    }
      
    const handleRecipient = (event: any) => {
        setRecipient(event.target.value);
    }

    useTimeout(() => {
        setHasTimeElapsed(true);
    }, 5000);
    

    const walletManager = useWallet();
    const { 
      getSigningCosmWasmClient,
      address,
      isWalletConnected,
      isWalletConnecting,
      isWalletDisconnected,
    } = walletManager;

    const handleFaucet = async () => {
        if(!address) {
            console.error("no address, please connect wallet");
            return;
        }
        const result = await hitFaucet(address, malagaConfig.feeToken, malagaConfig.faucetUrl);
        console.log(result);
    };

    useEffect(() => {
        if(isWalletConnected === true || isWalletConnecting === true) {
          getSigningCosmWasmClient().then(cosmWasmClient => {
            if (!cosmWasmClient || !address) {
                console.error("No cosmwasm client or no address");
                return;
            }
            const newClient = new Cw20Client(cosmWasmClient, address, cw20ContractAddress);
            setCw20Client(newClient);
          });
        } else if (hasTimeElapsed === true && isWalletDisconnected === true) {
          toast({
            title: 'Wallet not connected',
            description: 'There was a problem with connecting your wallet, refresh and try to connect it!',
            status: 'error',
            duration: 10000,
            isClosable: true,
            position: 'top',
          });
        }
      }, [address, getSigningCosmWasmClient]);

  const handleSend = async () => {
    if(!cw20Client) {
      console.error("no cw20client, please connect wallet");
      return;
    }

    if (!amount || !recipient) {
      console.error("no amount or recipient");
      return;
    }
    
    const result = await cw20Client.transfer({amount, recipient});

    setTxHash(result.transactionHash);
    if(result.transactionHash) {
      toast({
        position: 'top',
        render: () => (
            <Box>
              <Badge colorScheme='green'>Transaction Successful!</Badge>
                <Link href={`${explorerTX}${result.transactionHash}`} isExternal>
                  Check it out on explorer! <ExternalLinkIcon mx='2px' />
                </Link>
            </Box>
        ),
        isClosable: true,
        duration: 10000,
        status: 'success',
        variant: 'subtle',
      })
    }
  }
    return (
      <>
        <h1>Send Cw20 Tokens! ${tokenInfo.Symbol}</h1>
        <Button onClick={onToggle}>Toggle Send Props</Button>
        <Collapse in={isOpen} animateOpacity>
          <Box
            p='40px'
            color='white'
            mt='4'
            rounded='md'
            shadow='md'
          >
            <Box border="1px solid white">
                <Input border="hidden" placeholder="address" value={recipient} onChange={handleRecipient} />
                <Input border="hidden" placeholder="amount" value={amount} onChange={handleAmount} />
                <Button colorScheme="green" onClick={handleSend}>Send!</Button>
                <Button colorScheme="green" onClick={handleFaucet}>Hit faucet!</Button><br />
            </Box>
          </Box>
        </Collapse>
      </>
    )
  }

export default CollapseS
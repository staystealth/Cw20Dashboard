import { Badge, Box, Button, Collapse, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react'
import { cw20ContractAddress } from '../config';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useTokenInfo } from '../hooks/useTokenInfo';

function CollapseEx() {
    const { isOpen, onToggle } = useDisclosure();
    const tokenInfo = useTokenInfo(cw20ContractAddress);
    const balance = useTokenBalance(cw20ContractAddress);
    return (
      <>
        <div>
            <p>Your token balance is: {balance} ${tokenInfo.Symbol}<br />
            </p>
        </div>
        <Button onClick={onToggle}>Toggle Token Info</Button>
        <Collapse in={isOpen} animateOpacity>
          <Box
            p='40px'
            color='white'
            mt='4'
            rounded='md'
            shadow='md'
          >
            <Box border="1px solid white" borderRadius='lg' alignItems='left'>
                  <Badge colorScheme='green'>Token Name:</Badge> {tokenInfo.Name}<br />
                  <Badge colorScheme='green'>Token Symbol:</Badge> {tokenInfo.Symbol}<br />
                  <Badge colorScheme='green'>Token Decimals:</Badge> {tokenInfo.Decimals}<br />
                  <Badge colorScheme='green'>Token Total Supply:</Badge> {tokenInfo.Total}<br />
                <Text
                    as="span"
                    color={useColorModeValue('primary.500', 'primary.200')}
                >
                    To update Token Info provide Contract Address below and procced with "Query Contract" button!
                </Text>
            </Box>
          </Box>
        </Collapse>
      </>
    )
  }

export default CollapseEx
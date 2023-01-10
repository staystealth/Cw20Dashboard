import { Badge, Box, Button, Collapse, Input, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import { cw20ContractAddress } from '../config';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useTokenInfo } from '../hooks/useTokenInfo';

function CollapseQ() {
    const { isOpen, onToggle } = useDisclosure();
    const [queryAddress, setQueryAddress] = useState<string | undefined>(undefined);
    const [showQuery, setShowQuery] = useState(false);

    const handleQueryAddr = (event: any) => {
        setQueryAddress(event.target.value);
    };
      
    const handleQuery = async () => {
        if(!queryAddress) {
          console.error("No contract address provided for query!")
          return;
        }
        const tokenInfo = useTokenInfo(queryAddress);
    };

    return (
      <>
        <div>
            <h2>Current queried contract address:</h2>
        </div>
        <Button onClick={onToggle}>Toggle Contract Props</Button>
        <Collapse in={isOpen} animateOpacity>
          <Box
            p='40px'
            color='white'
            mt='4'
            rounded='md'
            shadow='md'
          >
            <Box border="1px solid white">
                <Input border="hidden" placeholder={cw20ContractAddress} value={queryAddress} onChange={handleQueryAddr}/>
                <Button colorScheme="green" onClick={handleQuery}>Query Contract</Button>
            </Box>
          </Box>
        </Collapse>
      </>
    )
  }

export default CollapseQ
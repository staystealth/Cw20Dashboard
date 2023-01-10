import { useTimeout } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { Cw20QueryClient } from "../codegen/Cw20.client";

export function useTokenBalance(contractAddress: string) {
    //offline signer
    const { getCosmWasmClient, address, isWalletDisconnected} = useWallet();
    const [cw20Client, setCw20Client] = useState<Cw20QueryClient | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [hasTimeElapsed, setHasTimeElapsed] = useState(false);

    useTimeout(() => {
        setHasTimeElapsed(true);
      }, 2000);

    //cw20 client
    useEffect(() => {
        getCosmWasmClient().then(cosmWasmClient => {
            if (hasTimeElapsed === true) {
                if (!cosmWasmClient) {
                    console.error('no cosmwasm client tokenbalance.ts');
                    return;
                }
                const newClient = new Cw20QueryClient(cosmWasmClient, contractAddress);
                setCw20Client(newClient);  
            }
        });
    }, [contractAddress, getCosmWasmClient, hasTimeElapsed]);

    //query and return token balanace
    useEffect(() => {
        if(cw20Client && address) {
            cw20Client.balance({ address }).then((res) => setBalance(res.balance));
        }
    });

    return balance ?? undefined;
}
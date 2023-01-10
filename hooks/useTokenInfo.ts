import { useTimeout } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { Cw20QueryClient } from "../codegen/Cw20.client";
import { Uint128 } from "../codegen/Cw20.types";

export function useTokenInfo(contractAddress: string) {
    //offline signer
    const { getCosmWasmClient, address } = useWallet();
    const [cw20Client, setCw20Client] = useState<Cw20QueryClient | null>(null);
    const [tokenName, setTokenName] = useState<string | null>(null);
    const [tokenTotal, setTokenTotal] = useState<Uint128 | null>(null);
    const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
    const [tokenDecimals, setTokenDecimals] = useState<number | null>(null);
    const [hasTimeElapsed, setHasTimeElapsed] = useState(false);

    const TokenInfo = {
        Name: tokenName,
        Total: tokenTotal,
        Symbol: tokenSymbol,
        Decimals: tokenDecimals,
    };

    useTimeout(() => {
        setHasTimeElapsed(true);
      }, 2000);

    //cw20 client
    useEffect(() => {
        getCosmWasmClient().then(cosmWasmClient => {
            if (hasTimeElapsed === true) {
                if (!cosmWasmClient) {
                    console.error('no cosmwasm client tokeninfo.ts');
                    return;
                }
                const newClient = new Cw20QueryClient(cosmWasmClient, contractAddress);
                setCw20Client(newClient);
            }});
        }, [contractAddress, address, getCosmWasmClient, hasTimeElapsed]);

    //query and return token info
    useEffect(() => {
        if(cw20Client && address) {
            cw20Client.tokenInfo().then((res) => {
                setTokenName(res.name);
                setTokenSymbol(res.symbol);
                setTokenTotal(res.total_supply);
                setTokenDecimals(res.decimals);
                })
            }
        });

    return TokenInfo ?? undefined;
}
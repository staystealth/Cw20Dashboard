import { assets } from 'chain-registry';
import { AssetList, Asset } from '@chain-registry/types';

export const chainName = 'cosmwasmtestnet';
export const stakingDenom = 'umlg';
export const feeDenom = 'uand';
export const explorerTX = 'https://block-explorer.malaga-420.cosmwasm.com/transactions/';

export const cw20ContractAddress = 'wasm1rf7ts0zphhkvpma9evy80plz6kchzrv3vfud4yhvev63flxqaf0sfw4n05'

export const chainassets: AssetList = assets.find(
    (chain) => chain.chain_name === chainName
) as AssetList;

export const coin: Asset = chainassets.assets.find(
    (asset) => asset.base === stakingDenom
) as Asset;
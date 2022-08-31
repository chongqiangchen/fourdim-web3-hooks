import { ethers } from "ethers";

export type Signer = ethers.Signer | ethers.providers.Provider | ethers.Wallet;
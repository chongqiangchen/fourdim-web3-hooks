import { BigNumber, ethers } from "ethers";
import { getMulticallContract } from "./contractHelpers";


const getBlockNumberTimestamp = async (signer: ethers.Signer | ethers.providers.BaseProvider): Promise<BigNumber> => {
    const contract = getMulticallContract(signer);
    return contract.getCurrentBlockTimestamp();
}

export default getBlockNumberTimestamp;
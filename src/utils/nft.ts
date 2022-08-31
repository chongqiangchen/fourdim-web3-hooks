import { TokenId } from '@/typings/nft';
import { Contract, ethers } from 'ethers';
import { getNFTContract } from './contractHelpers';

class NFT {
  private signer;

  public contract: Contract;

  constructor(nftAddress: string, signer: ethers.Signer | ethers.providers.Provider) {
    this.signer = signer;
    this.contract = getNFTContract(nftAddress, signer);
  }

  totalSupply() {
    return this.contract.totalSupply();
  }

  name() {
    return this.contract.name();
  }

  balanceOf(address: string) {
    return this.contract.balanceOf(address);
  }

  async balance() {
    if (this.signer instanceof ethers.providers.Provider) {
      return;
    }

    const selfAddress = await this.signer.getAddress();
    return this.contract.balanceOf(selfAddress);
  }

  async approve(to: string, tokenId: TokenId) {
    return this.contract.approve(to, tokenId);
  }

  async approveAll(to: string, approved: boolean) {
    return this.contract.setApprovalForAll(to, approved || true);
  }

  async transferFrom(from: string, to: string, tokenId: TokenId) {
    return this.contract['safeTransferFrom(address,address,uint256)'](from, to, tokenId);
  }

  async transfer(to: string, tokenId: TokenId) {
    return this.contract.transfer(to, tokenId);
  }

  async getTokenIds() {
    if (this.signer instanceof ethers.providers.Provider) {
      return;
    }

    const address = await this.signer.getAddress();
    const count_BN = await this.contract.balanceOf(address);
    const count_Number = Number(count_BN);
    const tokenIds = [];
    for (let index = 0; index < count_Number; index++) {
      const tokenId = await this.contract.tokenOfOwnerByIndex(address, index);
      tokenIds.push(tokenId);
    }
    return tokenIds;
  }

  async getInfo(tokenId: string) {
    return this.contract.tokenURI(tokenId);
  }

  async getInfos() {
    const tokenIds = await this.getTokenIds();
    const rqs = [];
    for (let id of tokenIds || []) {
      rqs.push(async () => ({
        info: await this.getInfo(id),
        id: id,
      }));
    }

    return Promise.all(rqs.map((rq) => rq()));
  }
}

export default NFT;

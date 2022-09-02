## Web3 Hooks

### 当前可用内容
 - utils: 
    1. callWithEstimateGas
    2. estimateGas
    3. multicall
    4. splitArray

### 待重构
 - hooks 部分待重构，调整参数引入方案（转化为context传入）,如provider, signer, chainId等
 - utils 中自主传入chainId
 - （*待确定*）拆分core和hooks，采用monorepo方式，考虑其他框架的扩展

### 计划内容

**Unit Test**
- [ ] unit test

**hooks**(待重构部分参数引入方式):
- [ ] useBlock
- [ ] useBlockInterval
- [ ] useNFT
- [ ] useSwap
- [ ] useToken
- [ ] useTransacctionDeadline

**utils**
 - [x] callWithEstimateGas
 - [x] estimateGas
 - [x] multicall
 - [ ] nft
 - [ ] token
 - [ ] price
 - [x] splitArray


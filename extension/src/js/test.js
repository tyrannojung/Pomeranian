$(function () {

    var randomSeed = ethers.Wallet.createRandom();
    console.log(randomSeed);

    var address = randomSeed.address;
    var mnemonic = randomSeed.mnemonic;
    var privateKey = randomSeed.privateKey;

    console.log(address);
    console.log(mnemonic);
    console.log(privateKey);

    // private key로 지갑에 대한 모든 정보 get
    let wallet = new ethers.Wallet(privateKey);
    console.log(wallet)

    // mnemonic key로 지갑에 대한 모든 정보 get
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log(mnemonicWallet);

    // 검증
    try {
        let testtest = ethers.Wallet.fromMnemonic("render size obtain copper scrap city zone august weekend tone exclude wrap");
        console.log('통과');
        console.log(testtest)
    } catch (error) {
        console.log(error);

    }


    // Ethers.js
    // let provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/~~61');
    // const balance = await provider.getBalance("0x80cb85F9262Bc72026775CD7689F42F0D00eDbcF");
    // console.log(balance);
    // const balanceInEth = ethers.utils.formatEther(balance);
    // console.log(balanceInEth);

    // Web3.js
    // let rpcUrl = "https://mainnet.infura.io/v3/~~";
    // var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    // var newAccount = web3.eth.accounts.create();
    // console.log(newAccount);
    // var address = newAccount.address
    // var privateKey = newAccount.privateKey
    // console.log(address);
    // console.log(privateKey);
});

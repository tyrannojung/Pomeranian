$(async function () {

    var randomSeed = ethers.Wallet.createRandom();
    console.log(randomSeed);

    var address = randomSeed.address;
    var mnemonic = randomSeed.mnemonic.phrase;
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

    // // 검증
    // try {
    //     let testtest = ethers.Wallet.fromMnemonic("render size obtain copper scrap city zone august weekend tone exclude wrap");
    //     console.log('통과');
    //     console.log(testtest)
    // } catch (error) {
    //     console.log(error);

    // }


    // Ethers.js
    let provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
    // const balance = await provider.getBalance("0x80cb85F9262Bc72026775CD7689F42F0D00eDbcF");
    // console.log(balance);
    // const balanceInEth = ethers.utils.formatEther(balance);
    // console.log(balanceInEth);

    // provider.getGasPrice().then((gasPrice) => {
    //     // gasPrice is a BigNumber; convert it to a decimal string
    //     gasPriceString = gasPrice.toString();

    //     console.log("Current gas price: " + gasPriceString);
    // });

    // get
    var contractAddress = "0x51a652a26B2BA5276321565B2ca4860184634940";
    const backupContract = new ethers.Contract(contractAddress, backupABI, provider);
    let currentValue = await backupContract.getBackupData("0xFCED72598d28d6e1AE8f4fA1CCB8b10669205823");
    console.log(currentValue);

    var adkey = "0xFCED72598d28d6e1AE8f4fA1CCB8b10669205823";
    var pkey = "0xa00f4235f6ad306b79d134fc185267489201fcc3d58eef5b245480f21509a73e";
    var bdata = "QmYPzADjrz1GV9M7MBYDthi7RwXRpBRpZZmF6y12YAAAAA"

    let wallet1 = new ethers.Wallet(pkey, provider);
    const backupContract2 = new ethers.Contract(contractAddress, backupABI, wallet1);

    adkey = "0x75845B0f972413C3f9D0B846f5e0F3fE473761a5";

    const estimatedGasLimit = await backupContract2.estimateGas.setBackupData(adkey, bdata);
    const gasPrice = await provider.getGasPrice();
    const finalGasPrice = gasPrice * estimatedGasLimit;
    console.log(ethers.utils.formatUnits(finalGasPrice));

    //성공햇드아.
    //const result = await backupContract2.setBackupData(adkey, bdata); // approves 1 USDT
    //console.log(result);


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

$(async function () {

    // var randomSeed = ethers.Wallet.createRandom();
    // console.log(randomSeed);

    // var address = randomSeed.address;
    // var mnemonic = randomSeed.mnemonic;
    // var privateKey = randomSeed.privateKey;

    // console.log(address);
    // console.log(mnemonic);
    // console.log(privateKey);

    // // private key로 지갑에 대한 모든 정보 get
    // let wallet = new ethers.Wallet(privateKey);
    // console.log(wallet)

    // // mnemonic key로 지갑에 대한 모든 정보 get
    // let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    // console.log(mnemonicWallet);

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
    var contractAddress = "0xC7ec28a973644F50DeE0EAB5E6e7e08d907D26DC";
    const backupContract = new ethers.Contract(contractAddress, backupABI, provider);
    let currentValue = await backupContract.getBackupData("0xFCED72598d28d6e1AE8f4fA1CCB8b10669205823");
    console.log(currentValue);

    var adkey = "0x75845B0f972413C3f9D0B846f5e0F3fE473761a5";
    var pkey = "0xc6db8ab944d39645292d9ee615ad4c0321d14d1b7a92f47a768568456f5413a6";
    var bdata = "QmYPzADjrz1GV9M7MBYDthi7RwXRpBRpZZmF6y12YkNrRr"

    let wallet = new ethers.Wallet(pkey, provider);
    const backupContract2 = new ethers.Contract(contractAddress, backupABI, wallet);
    const estimatedGasLimit = await backupContract2.setBackupData(adkey, bdata); // approves 1 USDT



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

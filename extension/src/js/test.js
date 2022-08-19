$(function(){
    let rpcUrl = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
    var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  
    var newAccount = web3.eth.accounts.create();
    console.log(newAccount);
    var address = newAccount.address
    var privateKey = newAccount.privateKey
    console.log(address);
    console.log(privateKey);
});

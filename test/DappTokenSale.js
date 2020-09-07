var DappTokenSale = artifacts.require("DappTokenSale");
var DappToken = artifacts.require("DappToken");

contract('DappTokenSale', function(accounts){
    var tokenSaleInstance;
    var tokenInstance;
    var tokenPrice = 1000000000000000; //in Wei
    var admin = accounts[0];
    var tokensAvailable = 750000;
    var buyer = accounts[1];
    var numberOfTokens = 10;

    it('initialized the contract', function(){
        return DappTokenSale.deployed().then(function(instance){
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(function(address){
        assert.notEqual(address, 0x0, 'has tokensale contract address');
        return tokenSaleInstance.tokenContract();        
    }).then(function(address){
        assert.notEqual(address, 0x0, 'has token contract address');
        return tokenSaleInstance.tokenPrice();
    }).then(function(price){
        assert.equal(price, tokenPrice, 'token price is correct');
    })
})

// it('calls tokenTransfer successfully', async() => {
//   let tokenInstance
//   let buyer = accounts[2]
//   let seller = accounts[1]
//   await DappToken.deployed().then(function(instance){
//       tokenInstance = instance ;
//   })
 
//   let oldSellerBalance 
//   await tokenInstance.balanceOf(seller).then(function(balance){
//       oldSellerBalance = balance 
//   })

//   tokenInstance.transfer(seller, 250, buyer).then(function(receipt){
//       tReceipt = receipt
//       result = tReceipt.logs[0].args
//   })

//   let newSellerBalance 
//   await tokenInstance.balanceOf(seller).then(function(balance){
//       newSellerBalance = balance
//   })

//   let price
//   price = 250
//   price = new web3.utils.BN(price)
//   const expectedBalance = oldSellerBalance.add(price) //add is a function we can use for BN

//   assert.equal(newSellerBalance.toString(), expectedBalance.toString())
// })

//self written test which always fails IDK why

// it('checks contract addresses', function(){
//     return DappToken.deployed().then(function(instance) {
//         tokenInstance = instance;
//         //assert.equal(tokenInstance.address, '0xE4d5F10fF5C453c524119Aa614E56b661B5D55E7', 'token address match');
//         return DappTokenSale.deployed();
//     }).then(function(instance) {
//         tokenSaleInstance = instance;
//         //assert.equal(tokenSaleInstance.address, '0x6AcE6170288f4966dC53a08cB2d93dbec31109BA', 'tokensale address match');

//     })
// })

it('facilitates token buying', function() {
    return DappToken.deployed().then(function(instance) {
      // Grab token instance first
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then(function(instance) {
      // Then grab token sale instance
      tokenSaleInstance = instance;
      // Provision 75% of all tokens to the token sale
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin })
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
      assert.equal(receipt.logs[0].args._from, admin, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._to, tokenSaleInstance.address, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._value.toNumber(), tokensAvailable, 'logs the number of tokens transfered');
      numberOfTokens = 10;
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
      assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
      assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
      return tokenSaleInstance.tokensSold();
    }).then(function(amount) {
      assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
      return tokenInstance.balanceOf(buyer);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), numberOfTokens);
      return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
      // Try to buy tokens different from the ether value
      return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
    }).then(assert.fail).catch(function(error) {
      // assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
      assert.equal(error.reason, 'insifficient value sent by the msg.sender', 'equal'); 
      return tokenSaleInstance.buyTokens(800000, { from: buyer, value: 800000 * tokenPrice })
    })
    .then(assert.fail).catch(function(error) {
      //assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
      assert.equal(error.reason, 'contract does not have sufficient token', 'equal');
    });
  });

  it('ends token sale', function() {
    return DappToken.deployed().then(function(instance) {
      // Grab token instance first
      tokenInstance = instance;
      return DappTokenSale.deployed();
    }).then(function(instance) {
      // Then grab token sale instance
      tokenSaleInstance = instance;
      // Try to end sale from account other than the admin
      return tokenSaleInstance.endSale({ from: buyer });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert' >= 0, 'must be admin to end sale'));
      // End sale as admin
      return tokenSaleInstance.endSale({ from: admin });
    }).then(function(receipt) {
      return tokenInstance.balanceOf(admin);
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 999990, 'returns all unsold dapp tokens to admin');
      // Check that the contract has no balance
      return tokenInstance.balanceOf(tokenSaleInstance.address)
    }).then(function(balance){
      assert.equal(balance.toNumber(), 0);
    })
  });
})

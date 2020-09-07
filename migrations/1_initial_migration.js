const Migrations = artifacts.require("Migrations");
// const Migrations = artifacts.require('../src/contracts/Migrations');

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};

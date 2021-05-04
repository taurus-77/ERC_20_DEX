const Migrations = artifacts.require("Migrations");
const SafeMath = artifacts.require("SafeMath");
const DEX = artifacts.require("DEX");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, DEX)
  deployer.deploy(DEX);
};

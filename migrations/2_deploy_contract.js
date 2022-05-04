const Tether = artifacts.require('Tether'); 
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');




module.exports = async function(deployer, network, accounts){
    await deployer.deploy(Tether); 
    const tether = await Tether.deployed();

    await deployer.deploy(RWD); 
    const rwd = await RWD.deployed();

    await deployer.deploy(DecentralBank, rwd.address, tether.address); 
    const decentralBank = await DecentralBank.deployed();


    //Transfer all reward tokens to decentral bank
    rwd.transfer(decentralBank.address, '1000000000000000000000000');

    //Transfer 100 usm to all customers 
    tether.transfer(accounts[1], "100000000000000000000"); 


}
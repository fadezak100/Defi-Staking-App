const { assert } = require('chai');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');



require('chai').use(require('chai-as-promised')).should()


contract('DecentralBank', ([owner, customer]) => {

    

    let tether, rwd, decentralBank; 

    function tokens(number) {
        return web3.utils.toWei(number);
    }
    
    before(async() => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);
        

        //Transfering all rewds tokens to decentral bank address
        await rwd.transfer(decentralBank.address, tokens("1000000"));
        
        //Transfer 100 tokens to customers
        await tether.transfer(customer, tokens("100"), {from: owner}); 

        });

        describe('Tether Token Deployment', async()  => {
            it("Matches the name successfully", async () => {
                const name = await tether.name();
                assert.equal(name, "Mock Tether", 'Names don\'t match'); 
            });

            it("Mathches the totalSupply", async() => {
                let totalSupply = await tether.totalSupply();
                assert.equal(totalSupply, tokens("1000000")); 
            });

    
        });

        describe("Decentral Bank Deployment Test", async() => {
            it("Checks the Decentral Bank Balance", async()=> {
                let result = await rwd.balanceOf(decentralBank.address); 
                assert.equal(result.toString(), tokens("1000000"), "The Balance of the Decentral Bank is Incorrect");
            }); 
        });


        describe("Yield Farming Testing", async() => {
            let result; 
            it("Checks the balance of the customer before staking", async() => {
                result = await tether.balanceOf(customer); 
                assert.equal(result.toString(), tokens("100"), "The User Balance Before Staking is Incorrect");

            });

            it("Checks staking, and the balance of the decentral bank after staking", async() => {
                 await tether.approve(decentralBank.address, tokens("100"), {from: customer});
                 await decentralBank.depositeTokens(tokens("100"), {from: customer}); 

                 result = await tether.balanceOf(decentralBank.address); 
                 assert.equal(result.toString(), tokens("100"));


                 result = await tether.balanceOf(customer); 
                 assert.equal(result.toString(), tokens("0"));
 

            });

            it("Checks issuing tokens", async() => {
                await decentralBank.issueTokens({from: owner}); 
                await decentralBank.issueTokens({from: customer}).should.be.rejected;
                
                 result = await rwd.balanceOf(customer);

                 let rwdBal = await tether.balanceOf(decentralBank.address)/9; 
                 assert.equal(result, rwdBal, 'RWD Balance is Incorrect');
            
            }); 

            it("Checks the unstaking function", async() => {
                await decentralBank.unstake({from: customer});

                //check the updated balance of the customer
                let result = await tether.balanceOf(customer); 
                assert.equal(result, tokens("100")); 
            }); 

                
              
        }); 


});
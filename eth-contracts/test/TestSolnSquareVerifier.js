const Verifier = artifacts.require('Verifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssert = require('truffle-assertions');

const proofFromFile = require("../../zokrates/code/square/proof.json");

contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

   
    before(async() => { 
        let verifier = await Verifier.new({from: accounts[0]});
        solnSquareVerifier = await SolnSquareVerifier.new(verifier.address, 'Real Estates', 'RE', {from: accounts[0]});
    });


    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('can add solution', async function(){
        let eventEmitted = false;

        solnSquareVerifier.getPastEvents("SolutionAdded",  (error, result) => {
            eventEmitted = true;
        });
    
        await solnSquareVerifier.mintToken(
            account_one,
            10,
            proofFromFile.proof.A,
            proofFromFile.proof.A_p,
            proofFromFile.proof.B,
            proofFromFile.proof.B_p,
            proofFromFile.proof.C,
            proofFromFile.proof.C_p,
            proofFromFile.proof.H,
            proofFromFile.proof.K,
            proofFromFile.input,
            { from: account_one }
        );
        assert.equal(eventEmitted, true, "Solution is added");
      
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('can mint token with solution', async function(){
        let balance_one = await solnSquareVerifier.balanceOf.call(account_one);  

        assert.equal(balance_one.toNumber(), 1, "Token is minted");
    })

});





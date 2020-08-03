var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const name = 'Real Estates';
    const symbol = 'RE';
    const base_uri = 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/';

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name, symbol, {from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, {from: account_one});
            await this.contract.mint(account_one, 2, {from: account_one});
            await this.contract.mint(account_one, 3, {from: account_one});
            await this.contract.mint(account_two, 4, {from: account_one});
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply();
            assert.equal(totalSupply, 4, 'Incorrect total supply');
        })

        it('should get token balance', async function () { 
            let balance_one = await this.contract.balanceOf.call(account_one);
            let balance_two =  await this.contract.balanceOf.call(account_two);

            assert.equal(balance_one, 3, 'Incorrect balance for account one!')
            assert.equal(balance_two, 1, 'Incorrect balance for account two!')
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let id = 1;
            let token_uri = await this.contract.tokenURI(id);

            assert.equal(token_uri, base_uri + id, 'Incorrect token uri');
        })

        it('should transfer token from one owner to another', async function () { 
            id = 2;
            await this.contract.transferFrom(account_one, account_two, id);
            let newOwner = await this.contract.ownerOf.call(id);
            assert.equal(newOwner, account_two, 'Token not successfully transferred!');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name, symbol, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let reverted = false;
            try {
                await this.contract.mint(account_two, 6, {from: account_two});
            } catch(e) {
                reverted = true;
            }

            assert.equal(reverted, true, 'Only contact owner can mint new tokens!')

        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call();

            assert.equal(owner, account_one, 'Owner is set incorrectly!')
        })

    });
})
pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721MintableComplete {
    Verifier private verifier;

// TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 solutionId;
        address solutionAddress;
        // bool minted; //flag to indicate if this solution has been used in token minting
    }

// TODO define an array of the above struct
    Solution[] private solutionsArray;

// TODO define a mapping to store unique solutions submitted
    mapping (bytes32 => Solution) uniqSolutions;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 index, address solutionAddress);

    constructor(address verifierAddress, string memory name, string memory symbol)
        ERC721MintableComplete(name, symbol)  public {
        verifier = Verifier(verifierAddress);
    }

// TODO Create a function to add the solutions to the array and emit the event
    function addSolution(address solutionAddress, uint256 solutionId, bytes32 key) public {
        Solution memory solution = Solution({
            solutionId: solutionId,
            solutionAddress: solutionAddress
        });

        solutionsArray.push(solution);
        uniqSolutions[key] = solution;
        emit SolutionAdded(solutionId, solutionAddress);
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address to, uint256 tokenId,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input) public {
        bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));
        require(uniqSolutions[key].solutionId == 0, 'Solution is not unique!');
        require(verifier.verifyTx(a,a_p,b,b_p,c,c_p,h,k,input)," Solution is not valid!");

        addSolution(to, tokenId, key);
        super.mint(to, tokenId);
    }


    function mintWithoutSolution(address to, uint256 tokenId) public onlyOwner {
        super.mint(to, tokenId);
    }


}



























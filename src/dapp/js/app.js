App = {
    web3Provider: null,
    contracts: {},
    
    init: async () => {
        return await App.initWeb3();
    },

    initWeb3: async () => {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access");
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
            console.log('Using localhost ganache as provider!');
        }

        App.getMetaskAccountID();

        return App.initContracts();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            //console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initContracts: async() => {
        /// Source the truffle compiled smart contracts
        var jsonAppContract ='../../eth-contracts/build/contracts/SolnSquareVerifier.json';
        var proofFromFile = "../../zokrates/code/square/proof.json";

        /// JSONfy the smart contracts
        $.getJSON(jsonAppContract, (data) => {
            console.log('data', data);
            var ContractArtifact = data;
            App.contracts.AppContract = TruffleContract(ContractArtifact);
            App.contracts.AppContract.setProvider(App.web3Provider);
            App.getContractOwner()
        });

        $.getJSON(proofFromFile, (data) => {
            console.log('data', data);
            App.correctProof = data;
        });

        return App.bindEvents();

    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async (event) => {
        App.getMetaskAccountID();
        
        var processId = parseInt($(event.target).data('id'));
        switch (processId) {
            case 1:          
                return await App.mint(event);

        }
    },


    getContractOwner: async(event) => {
        try {
            const instance = await App.contracts.AppContract.deployed(); 
            App.owner = await instance.owner();
            console.log('Get Sols Square Verifier Contract Owner', App.owner);
        } catch(err) {
            console.log(err.message);
        };
    },


    mint: async(event) => {
        console.log(App.correctProof);
        try {
            event.preventDefault();
            const instance = await App.contracts.AppContract.deployed();
            const mintTokenId = $("#minttokenid").val();

            const result = await instance.mintWithoutSolution(
                App.owner,
                mintTokenId,
                { from: App.owner }
            );
            console.log(`Mint tokenid ${mintTokenId} to ${App.owner}`);
        } catch(err) {
            console.log(err.message);
        };
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});

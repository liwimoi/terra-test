App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    // $.getJSON('../pets.json', function(data) {
    //   var petsRow = $('#petsRow');
    //   var petTemplate = $('#petTemplate');
    //
    //   for (i = 0; i < data.length; i ++) {
    //     petTemplate.find('.panel-title').text(data[i].name);
    //     petTemplate.find('img').attr('src', data[i].picture);
    //     petTemplate.find('.pet-breed').text(data[i].breed);
    //     petTemplate.find('.pet-age').text(data[i].age);
    //     petTemplate.find('.pet-location').text(data[i].location);
    //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
    //
    //     petsRow.append(petTemplate.html());
    //   }
    // });

    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    console.log("initWeb3");
    return App.initContract();
  },

  initContract: function() {
    console.log("initContract");
    $.getJSON('EIP20.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var EIP20Artifact = data;
      App.contracts.EIP20 = TruffleContract(EIP20Artifact);

      // Set the provider for our contract
      App.contracts.EIP20.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.checkBalances();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  getEIP20Instance : function() {
    var eip20instance;

    App.contracts.EIP20.deployed().then(function(instance) {
      eip20instance = instance;
      return instance
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  test : function() {
    console.log("Iterating through blocks...");
    window.contracts = []
    for (var i = 0; i <= web3.eth.blockNumber; i++) {
      console.log("block:" + i);
      var block = web3.eth.getBlock(i,true);
      if(block != null && block.transactions != null) {
        block.transactions.forEach( function(e) {
          console.log("  tx hash          : " + e.hash + "\n"
            + "   nonce           : " + e.nonce + "\n"
            + "   blockHash       : " + e.blockHash + "\n"
            + "   blockNumber     : " + e.blockNumber + "\n"
            + "   transactionIndex: " + e.transactionIndex + "\n"
            + "   from            : " + e.from + "\n"
            + "   to              : " + e.to + "\n"
            + "   value           : " + e.value + "\n"
            + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
            + "   gasPrice        : " + e.gasPrice + "\n"
            + "   gas             : " + e.gas + "\n"
            + "   input           : " + e.input);
            var receipt = web3.eth.getTransactionReceipt(e.hash);
            if (receipt.contractAddress) {
              contracts.push(receipt.contractAddress);
            }
          });
      } else {
        console.log("null block");
      };
    }
  },
  //
  // 0x15b2dd7da27c046d584bcaf67519f4a6c87ab6f4

  checkBalances: function(adopters, account) {
    var eip20Instance;

    App.contracts.EIP20.deployed().then(function(instance) {
      eip20Instance = instance;

      window.a = eip20Instance;

      return eip20Instance.balanceOf.call("0x67e0a90df9c038043f9d59cdb31aee34a0f2ab8a", {from: "0x67e0a90df9c038043f9d59cdb31aee34a0f2ab8a"});
    }).then(function(balance) {
      console.log(balance.toNumber());
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  transfer: function(adopters, account) {
    var eip20Instance;
    console.log("transfer");
    App.contracts.EIP20.deployed().then(function(instance) {
      eip20Instance = instance;

      window.a = eip20Instance;

      return eip20Instance.transfer.call("0x15b2dd7da27c046d584bcaf67519f4a6c87ab6f4", 1 , {from: "0x67e0a90df9c038043f9d59cdb31aee34a0f2ab8a"});
    }).then(function(balance) {
      console.log(balance);
    }).catch(function(err) {
      console.log(err.message);
    });
  },


  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.EIP20.deployed().then(function(instance) {
        eip20Instance = instance;

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

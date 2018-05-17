App = {
  web3Provider: null,
  contracts: {},
  factoryInstance: null,
  owners: null,
  tokenABI: null,
  tokens: [],

  init: function() {
    App.addEventListner();
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

    return App.initContract();
  },

  initContract: () => {

    $.getJSON('TerraFactory.json', (data) => {
      var eip20FactoryArtifact = data;
      App.contracts.TerraFactory = TruffleContract(eip20FactoryArtifact);
      App.contracts.TerraFactory.setProvider(App.web3Provider);

      return App.deployFactory();
    });
  },

  deployFactory: () => {

    App.contracts.TerraFactory
      .deployed()
      .then((instance) => {
        App.factoryInstance = instance;
        App.addWatchListner();

        return App.setTokenAbi();
      });
  },

  addWatchListner: () => {

    App.factoryInstance
      .NewRegistry()
      .watch((err, response) => {
        if (err) {
          throw new Error('NewRegistry error.');
        }

        var data = response.args;
        var addr = data.contractAddress;

        var contract = App.createTokenInstance(addr);
        var token = App.getTokenInfo(contract);

        App.storeContract(contract);
        App.tokens.push(token);
        App.renderToken(token);


        console.log(data);
      });
  },

  setTokenAbi: () => {
    $.get('TerraToken.json', (data)=> {
      console.log('success setTokens ABI');
      App.tokenABI = data.abi;
      return App.createTokens();
    });
  },

  createTokens: () => {
    var owners = App.owners;
    var factoryInstance = App.factoryInstance;

    factoryInstance
      .getTokens()
      .then(addrs => {
          for (let addr of addrs) {
            var contract = App.createTokenInstance(addr);
            var token = App.getTokenInfo(contract);

            App.storeContract(contract);
            App.tokens.push(token);
            App.renderToken(token);
          }
      });
  },

  createTokenInstance: (addr) => {

    var abi = App.tokenABI;
    var contract = web3.eth.contract(abi).at(addr);

    return contract;
  },

  storeContract: (contract) => {
    var name = contract.name();
    App.contracts[name] = contract;
  },

  getTokenInfo: (contract) => {
    var name = contract.name();
    var symbol = contract.symbol();

    return  {
      contractAddress: contract.address,
      name,
      symbol
    };
  },

  renderToken: (token) => {
    var idx = App.tokens.indexOf(token);
    var template = `
    <li data-idx="${idx}">
      name: ${token.name} symbol: ${token.symbol} <br/>
      contractAddress: ${token.contractAddress}
    </li>`;

    $('#list').prepend(template);
  },

  addEventListner: () => {

    $('#register').on('click', (e)=> {
      var name = $('#name').val();
      var symbol = $('#symbol').val();

      if (name.trim().length === 0) return;
      if (symbol.trim().length === 0) return;
      if (!App.factoryInstance) return;

      App.factoryInstance
        .createTerraToken(name, symbol, {from: web3.eth.coinbase, gas: 10000000000, gasPrice: 10000})
        .then(e => {
            console.log('create token: ' + name);
            $('#name').val('');
            $('#symbol').val('');
        })
    });

    $('#list').on('click', 'li', (e) => {
      var target = e.target;
      var $target = $(target);
      var idx = $target.attr('data-idx');
      var token =  App.tokens[idx];
      console.log(`click li[${idx}]`, token);
      var $tokenDetail = $('#token-detail');
      $tokenDetail.empty();
      $tokenDetail.append(JSON.stringify(token));
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

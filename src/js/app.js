App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.render();
  },

  initContract: function () {
    $.getJSON("Consumer.json", function (consumer) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Consumer = TruffleContract(consumer);
      // Connect provider to interact with contract
      App.contracts.Consumer.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },
  listenForEvents: function () {
    App.contracts.Consumer.deployed().then(function (i) {
      i.ClaimEvent({}, { fromBlock: 0, toBlock: 'latest' }).watch(function (error, event) {
        console.log("Event triggered", event);
        App.render();
      });
    });
  },
  render: function () {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.hide();
    content.show();
    
    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    
  },
  submitClaim: function () {
    var resourceLink = $('#resourceUrl').val();
    var amount = $('#amount').val();
    var duration = $('#duration').val();
    var Migrations = artifacts.require("./Consumer.sol");

    module.exports = function(deployer) {
    deployer.deploy(Migrations);
    
    };
    console.log("Contract Deployed Successfully!");
    App.initContract();

  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

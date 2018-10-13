App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  balance:null,

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
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Consumer.json", function (consumer) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Consumer = TruffleContract(consumer);
      // Connect provider to interact with contract
      App.contracts.Consumer.setProvider(App.web3Provider);
      console.log(App.contracts.Consumer);
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

    
    web3.eth.getBalance(App.account, (err, wei) => {
      balance = wei / 10 ** 18;
      $("#accountBalance").html("Your Account Balance: " + balance);
    });

  },
  submitClaim: function () {
    //Getting Claim information

    
    

    var resourceLink = $('#resourceUrl').val();
    var amount = $('#amount').val();
    var duration = $('#duration').val();
    var instance;

    var claimNo = null;
    if (balance > amount) {
      App.contracts.Consumer.deployed().then(function (i) {
        instance = i;
        instance.createClaim(resourceLink, amount, duration, App.account, { from: App.account }).then((error, result) => {
          claimNo = result;
        });
        return instance.claimCount();

      }).then(function (claimCount) {
        console.log("Contract Deployed Successfully! Claim Number=" + claimCount);
        $("#claimMessage").html("Contract Deployed Successfully! Claim Number= " + claimCount);
      });
    } else {
      $("#claimMessage").html("Insufficient Balance");
    }




  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

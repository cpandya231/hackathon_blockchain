App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  balance: null,
  returnClaims: [],

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
    var localAct;
    loader.hide();
    content.show();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        localAct = account;
        $("#accountAddress").html("Your Account: " + localAct);
        web3.eth.getBalance(localAct, (err, wei) => {
          balance = wei / 10 ** 18;
          $("#accountBalance").html("Your Account Balance: " + balance);
        });
      }
    });

    App.findAllClaims();



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

  },
  findClaims: function () {
    returnClaims = [];
    var instance;
    App.contracts.Consumer.deployed().then(function (i) {
      instance = i;
      return instance.findClaims(App.account);


    }).then(function (claims) {
      console.log(claims.length);
      for (i = 0; i < claims.length; i++) {
        //console.log("Claim id "+claims[i].c);
        var claim;
        instance.claims(claims[i].c).then(function (res) {
          claim = res
          console.log("Resource Link " + claim[0] + " Amount to be spend " + claim[1] + " Wait time " + claim[2]);
        });

        //returnClaims.push(claims[i].c);
      }
      console.log(returnClaims);
      //returnClaims.push(claims[4].c);
    });

  },
  findAllClaims: function () {
    var claimInfo = $("#claimInfo");
    claimInfo.empty();
    returnClaims = [];
    var instance;
    App.contracts.Consumer.deployed().then(function (i) {
      instance = i;
      return instance.claimCount();
    }).then(function (claimCount) {
      console.log(claimCount);
      for (i = 0; i < claimCount; i++) {
        var claim;
        instance.claims(i).then(function (res) {
          claim = res
          console.log("Resource Link " + claim[0] + " Amount to be spend " + claim[1] + " Wait time " + claim[2]);
          var claimTemplate = "<tr><th><a href=" + claim[0] + ">" + claim[0] + "</th><td><button class='button-success pure-button researcher'>Researcher</button></td><td><button class='button-error pure-button verifier'>Verifier</button></td><td><button onclick=window.location.href='witnessed.html' class=button-warning pure-button witnessed>Witness</button></td></tr>"
          //var claimTemplate = "<tr><th><a href=" + claim[0] + ">"+ claim[0] +"</th><td>"+claim[1]+"</td><td>"+claim[2]+"</td></tr>"
          claimInfo.append(claimTemplate);
        });
      }
    });
  },
  voteAndCalculateTruthScore: function () {
    var radio1;
    var credibilityScore=$("#credibilityScore");
    
    if($('#radio1').is(':checked')){
       radio1=1;
    } else{
      radio1=2;
    }
    var instance;
    App.contracts.Consumer.deployed().then(function (i) {
      instance = i;
      instance.calculateTruthScore(radio1,0,0,1,App.account,{ from: App.account }).then(function(error, result)  {
        console.log("Result from Truth Score"+result);
      });
      return instance.getTruth(1);
    }).then(function(truth){
      console.log("The News is  "+truth);
      if(truth){
        //$("#credibilityScore").html("The News is Real")
      } else{
        //$("#credibilityScore").html("The News is Fake")
      }
      
      instance.witnesses(App.account).then(function(witness){
        console.log("Witness truth Score "+witness[0]);
        $("#credibilityScore").html("Your Credibility Score "+ witness[0]);
      });
    });


  }


};

$(function () {
  $(window).load(function () {
    App.init();
  });
});

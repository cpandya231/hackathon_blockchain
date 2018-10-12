var Election=artifacts.require("./Election.sol");

contract("Election",function(accounts){
    it("Initialization of 2 candidates",function(){
        return Election.deployed().then(function(i){
            return i.candidateCount();
        }).then(function(count){
            assert.equal(count,2);
        });
    });
});
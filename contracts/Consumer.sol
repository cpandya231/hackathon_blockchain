pragma solidity ^0.4.2;

contract Consumer {
    struct Claim {
        string resourceLink;
        int256 priceAmount;
        uint256 waitTime;
    }
    Claim claim;
    event ClaimEvent(uint _candidateId);
    
    constructor() public{
        
    }
    
    function createClaim (string _resourceLink,int256 _priceAmount, uint256 _waitTime){
        claim.resourceLink =_resourceLink;
        claim.priceAmount=_priceAmount;
        claim.waitTime=_waitTime;
    }
}
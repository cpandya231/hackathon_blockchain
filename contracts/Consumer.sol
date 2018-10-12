pragma solidity ^0.4.2;

contract Consumer {
    struct Claim {
        string resourceLink;
        int256 priceAmount;
        uint256 waitTime;
        
    }
    Claim public claim;
    uint256 public claimNo;
    
    event ClaimEvent(uint256 _claimNo);
    constructor() public {
        
    }
    
    function createClaim (string _resourceLink,int256 _priceAmount, uint256 _waitTime){
        claimNo++;
        claim.resourceLink =_resourceLink;
        claim.priceAmount=_priceAmount;
        claim.waitTime=_waitTime;
        ClaimEvent(claimNo);
        return claimNo;
    }
}
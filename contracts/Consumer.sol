pragma solidity ^0.4.2;

contract Consumer {
    struct Claim {
        string resourceLink;
        int256 priceAmount;
        uint256 waitTime;
        address consumerAddress;
    }
    mapping(uint256 => Claim) public claims;
    
    uint256 public claimCount;
    event ClaimEvent(uint256 _claimNo);
    constructor() public{
        
    }
    
    function createClaim (string _resourceLink,int256 _priceAmount, uint256 _waitTime,address _consumerAddress) returns (uint256) {
        claimCount++;
        claims[claimCount].resourceLink =_resourceLink;
        claims[claimCount].priceAmount=_priceAmount;
        claims[claimCount].waitTime=_waitTime;
        claims[claimCount].consumerAddress=_consumerAddress;
        emit ClaimEvent(claimCount);
        return claimCount;
    }
}
pragma solidity ^0.4.2;

contract Consumer {
    struct Claim {
        string resourceLink;
        int256 priceAmount;
        uint256 waitTime;
        address consumerAddress;
        bool isReal;
    }
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public consumerClaims;
    
    uint256 public claimCount;
    
    struct Witness{
        int256 truthScore;
        int256 ans1;
        int256 ans2;
        int256 ans3;
        address witnessAddress;
    }
    
    mapping(uint256 => Witness) public witnessMapping;
    mapping(address => Witness) public witnesses;
    uint256 public witnessCount;
    uint256 public x11;
    uint256 public x12;
    uint256 public x1;
    
    
    event ClaimEvent(uint256 _claimNo);
    constructor() public{
        
    }
    
    function createClaim (string _resourceLink,int256 _priceAmount, uint256 _waitTime,address _consumerAddress) returns (uint256) {
        claimCount++;
        claims[claimCount].resourceLink =_resourceLink;
        claims[claimCount].priceAmount=_priceAmount;
        claims[claimCount].waitTime=_waitTime;
        claims[claimCount].consumerAddress=_consumerAddress;
        consumerClaims[_consumerAddress].push(claimCount);
        emit ClaimEvent(claimCount);
        return claimCount;        
    }
    
    function findClaims(address _consumerAddress) view public returns (uint256[]){
       
        return consumerClaims[_consumerAddress];
    }
    
    function calculateTruthScore(int256 _ans1, int256 _ans2, int256 _ans3,uint256 _claimNo, address _witnessAddress)  public returns (bool){
        witnessCount++;
        
        witnessMapping[witnessCount].ans1=_ans1;
        witnessMapping[witnessCount].ans2=_ans2;
        witnessMapping[witnessCount].ans3=_ans3;
        witnessMapping[witnessCount].witnessAddress=_witnessAddress;
        witnesses[_witnessAddress]= witnessMapping[witnessCount];
        
        if(_ans1==1){
          x11++;  
        } else{
            x12++;
        }
        if(x11>x12){
             if(_ans1==1)
             {
                 witnesses[_witnessAddress].truthScore++;
             } else{
                 witnesses[_witnessAddress].truthScore--;
             }
             claims[_claimNo].isReal=false;
            return false;
        } else{
            if(_ans1==2)
             {
                 witnesses[_witnessAddress].truthScore++;
             } else{
                 witnesses[_witnessAddress].truthScore--;
             }
            claims[_claimNo].isReal=true;
            return true;
        }
        
    }
    
    function getTruth(uint256 _claimNo) view public returns (bool){
        return claims[_claimNo].isReal;
    }
   
    
    
}
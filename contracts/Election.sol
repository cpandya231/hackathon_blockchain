pragma solidity ^0.4.2;

contract Election{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }
    mapping(uint => Candidate) public candidates ;
    mapping(address => bool) public voters;
    uint public candidateCount;
    event VoteEvent(uint _candidateId);
    constructor() public {
     createCandidate("BJP");
     createCandidate("Congress");
     
    }
    

    function createCandidate(string _name) private{
        candidateCount++;
        candidates[candidateCount].id = candidateCount;
        candidates[candidateCount].name = _name;
        candidates[candidateCount].voteCount = 0;
    }

    function vote(uint _candidateId) public{
        require(!voters[msg.sender],"You have already voted");
        require(_candidateId>0 && _candidateId<=candidateCount,"Invalid candidate id");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        VoteEvent(_candidateId);
    }

}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    bool public voteCompleted;
    uint public yesCounter;
    uint public noCounter;
    address[] public voters;
    uint public votingDeadline;
    address public contractOwner;
    uint public voterLimit = 100;
    mapping(address => bool) public voterVoted;

    event VoteCasted(address indexed voter, bool vote);
    event VotingReset(uint newDeadline);

    constructor() {
        contractOwner = msg.sender;
        voteCompleted = false;
    }

    function vote(bool _vote) public {
        require(!voteCompleted, "Voting has been completed.");
        require(authenticate(), "Authentication failed.");
        require(block.timestamp < votingDeadline, "Voting deadline has passed.");
        require(voters.length < voterLimit, "Voter limit has been reached.");
        require(!voterVoted[msg.sender], "This voter has already voted.");

        voters.push(msg.sender);
        voterVoted[msg.sender] = true;

        if (_vote) {
            yesCounter++;
        } else {
            noCounter++;
        }

        emit VoteCasted(msg.sender, _vote);
    }

    function authenticate() internal pure returns (bool) {
        // A real authentication process should be implemented here.
        // For example, you can communicate with an external authentication service.
        // In this example, it is assumed that every user is authenticated and true is returned.
        return true;
    }

    function resetVoting(uint _duration) public {
        require(msg.sender == contractOwner, "Not the contract owner.");
        require(!voteCompleted, "Voting has already started.");

        voteCompleted = true;
        yesCounter = 0;
        noCounter = 0;
        for (uint i = 0; i < voters.length; i++) {
            voterVoted[voters[i]] = false;
        }
        delete voters;
        votingDeadline = block.timestamp + _duration;

        emit VotingReset(votingDeadline);
    }

    function voteResults() public view returns (uint, uint, address[] memory) {
        return (yesCounter, noCounter, voters);
    }
}

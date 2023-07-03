// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Voter {
        bool voted;
        bool vote;
    }

    uint256 public yesCounter;
    uint256 public noCounter;
    uint256 public votingDeadline;
    address public contractOwner;
    mapping(address => Voter) public voters;

    event VoteCasted(address indexed voter, bool vote);
    event VotingStarted(uint256 deadline);
    event VotingEnded();

    constructor() {
        contractOwner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Not the contract owner.");
        _;
    }

    modifier votingInProgress() {
        require(block.timestamp < votingDeadline, "Voting deadline has passed.");
        _;
    }

    function vote(bool _vote) public votingInProgress {
        require(!voters[msg.sender].voted, "This voter has already voted.");

        if (_vote) {
            yesCounter++;
        } else {
            noCounter++;
        }

        voters[msg.sender].voted = true;
        voters[msg.sender].vote = _vote;

        emit VoteCasted(msg.sender, _vote);
    }

    function startVoting(uint256 _duration) public onlyOwner {
        yesCounter = 0;
        noCounter = 0;
        delete voters;
        votingDeadline = block.timestamp + _duration;

        emit VotingStarted(votingDeadline);
    }

    function voteResults()
        public
        view
        returns (string memory result, uint256 yesVotes, uint256 noVotes)
    {
        if (yesCounter > noCounter) {
            result = "Yes";
        } else if (noCounter > yesCounter) {
            result = "No";
        } else {
            result = "Equal";
        }
        yesVotes = yesCounter;
        noVotes = noCounter;
    }

    function getRemainingDeadline() public view returns (uint256) {
        if (block.timestamp < votingDeadline) {
            return votingDeadline - block.timestamp;
        } else {
            return 0;
        }
    }

    function endVoting() public onlyOwner {
        require(block.timestamp >= votingDeadline, "Voting deadline has not passed yet.");

        emit VotingEnded();
        delete votingDeadline;
    }
}

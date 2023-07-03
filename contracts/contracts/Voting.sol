// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    enum VoteOption {
        No,
        Yes
    }

    struct Voter {
        bool voted;
        VoteOption vote;
    }

    uint256 public yesCounter;
    uint256 public noCounter;
    uint256 public votingDeadline;
    address public contractOwner;
    address[] public voterAddresses;
    mapping(address => Voter) public voters;

    event VoteCasted(address indexed voter, VoteOption vote);
    event VotingStarted(uint256 indexed deadline);
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

    modifier votingNotStarted() {
        require(votingDeadline == 0, "Voting has already started.");
        _;
    }

    function castVote(VoteOption _vote) public votingInProgress {
        require(!voters[msg.sender].voted, "This voter has already voted.");

        if (_vote == VoteOption.Yes) {
            yesCounter++;
        } else if (_vote == VoteOption.No) {
            noCounter++;
        } else {
            revert("Invalid vote option.");
        }

        voters[msg.sender].voted = true;
        voters[msg.sender].vote = _vote;

        voterAddresses.push(msg.sender); // Add the voter's address to the array

        emit VoteCasted(msg.sender, _vote);
    }

    function startVoting(uint256 _duration) public onlyOwner votingNotStarted {
        yesCounter = 0;
        noCounter = 0;

        // Clear voters mapping
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            delete voters[voterAddresses[i]];
        }
        delete voterAddresses;

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

    function finalizeVoting() public onlyOwner {
        require(block.timestamp >= votingDeadline, "Voting deadline has not passed yet.");

        emit VotingEnded();
        delete votingDeadline;
    }
}

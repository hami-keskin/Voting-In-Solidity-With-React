// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    uint256 public yesCounter;
    uint256 public noCounter;
    address[] public voters;
    uint256 public votingDeadline;
    address public contractOwner;
    mapping(address => bool) public voterVoted;

    event VoteCasted(address indexed voter, bool vote);
    event VotingStarted(uint256 deadline);

    constructor() {
        contractOwner = msg.sender;
    }

    function vote(bool _vote) public {
        require(
            block.timestamp < votingDeadline,
            "Voting deadline has passed."
        );
        require(!voterVoted[msg.sender], "This voter has already voted.");

        if (_vote) {
            yesCounter++;
        } else {
            noCounter++;
        }

        voters.push(msg.sender);
        voterVoted[msg.sender] = true;

        emit VoteCasted(msg.sender, _vote);
    }

    function startVoting(uint256 _duration) public {
        require(msg.sender == contractOwner, "Not the contract owner.");

        yesCounter = 0;
        noCounter = 0;

        // Clear voters array
        for (uint256 i = 0; i < voters.length; i++) {
            delete voterVoted[voters[i]];
        }
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
}

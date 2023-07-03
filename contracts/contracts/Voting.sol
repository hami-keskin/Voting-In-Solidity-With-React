// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    bool public voteCompleted;
    uint256 public yesCounter;
    uint256 public noCounter;
    address[] public voters;
    uint256 public votingDeadline;
    address public contractOwner;
    mapping(address => bool) public voterVoted;

    event VoteCasted(address indexed voter, bool vote);
    event VotingReset(uint256 newDeadline);
    event VotingCompleted();

    constructor() {
        contractOwner = msg.sender;
        voteCompleted = false;
    }

    function vote(bool _vote) public {
        require(!voteCompleted, "Voting has been completed.");
        require(authenticate(), "Authentication failed.");
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

    function authenticate() internal pure returns (bool) {
        // A real authentication process should be implemented here.
        // For example, you can communicate with an external authentication service.
        // In this example, it is assumed that every user is authenticated and true is returned.
        return true;
    }

    function startVoting(uint256 _duration) public {
        require(msg.sender == contractOwner, "Not the contract owner.");
        require(!voteCompleted, "Voting has already started.");

        yesCounter = 0;
        noCounter = 0;
        delete voters;
        votingDeadline = block.timestamp + _duration;

        emit VotingReset(votingDeadline);
    }

    function voteResults()
        public
        view
        returns (
            string memory result,
            uint256 yesVotes,
            uint256 noVotes
        )
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
        return (result, yesVotes, noVotes);
    }

    function getRemainingDeadline() public view returns (uint256) {
        if (block.timestamp < votingDeadline) {
            return votingDeadline - block.timestamp;
        } else {
            return 0;
        }
    }
}

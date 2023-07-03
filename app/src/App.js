import React, { useEffect, useState } from "react";
import { Sepolia } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";

function App() {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
      <Component />
    </ThirdwebProvider>
  );
}

function Component() {
  const contractAddress = "0xd1de7abe3851bf918169dacbC6234D63Ac5cD2de";
  const { contract, isLoading: contractLoading } = useContract(contractAddress);

  const [contractReady, setContractReady] = useState(false);

  useEffect(() => {
    if (contract) {
      setContractReady(true);
    }
  }, [contract]);

  const { data: contractOwner } = useContractRead(contract, "contractOwner", []);
  const { data: getRemainingDeadline } = useContractRead(contract, "getRemainingDeadline", []);
  const { data: voteResults } = useContractRead(contract, "voteResults", []);

  const { mutateAsync: startVoting, isLoading: startVotingLoading } = useContractWrite(
    contract,
    "startVoting"
  );

  const { mutateAsync: endVoting, isLoading: endVotingLoading } = useContractWrite(
    contract,
    "endVoting"
  );

  const { mutateAsync: vote, isLoading: voteLoading } = useContractWrite(contract, "vote");

  const [duration, setDuration] = useState(20);
  const [voteValue, setVoteValue] = useState(0);

  const handleStartVoting = async () => {
    try {
      const data = await startVoting({ args: [duration] });
      console.info("Start Voting contract call success", data);
    } catch (err) {
      console.error("Start Voting contract call failure", err);
    }
  };

  const handleEndVoting = async () => {
    try {
      const data = await endVoting();
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const handleVote = async () => {
    try {
      const data = await vote({ args: [voteValue] });
      console.info("Vote contract call success", data);
    } catch (err) {
      console.error("Vote contract call failure", err);
    }
  };

  return (
    <div>
      {contractLoading ? (
        <p>Loading contract...</p>
      ) : contractReady ? (
        <>
          <h1>Voting Contract</h1>
          <p>Contract Owner: {contractOwner && contractOwner.toString()}</p>
          <p>
            Get Remaining Deadline:{" "}
            {getRemainingDeadline && getRemainingDeadline.toString()}
          </p>
          <p>Vote Results: {voteResults && voteResults.toString()}</p>
          <label>
            Duration (in seconds):
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </label>
          <button onClick={handleStartVoting} disabled={startVotingLoading}>
            {startVotingLoading ? "Starting Voting..." : "Start Voting"}
          </button>
          <br />
          <br />
          <label>
            Vote Value:
            <input
              type="number"
              value={voteValue}
              onChange={(e) => setVoteValue(Number(e.target.value))}
            />
          </label>
          <button onClick={handleVote} disabled={voteLoading}>
            {voteLoading ? "Voting..." : "Vote"}
          </button>
          <br />
          <br />
          <button onClick={handleEndVoting} disabled={endVotingLoading}>
            {endVotingLoading ? "Ending Voting..." : "End Voting"}
          </button>
        </>
      ) : (
        <p>Contract not found.</p>
      )}
    </div>
  );
}

export default App;

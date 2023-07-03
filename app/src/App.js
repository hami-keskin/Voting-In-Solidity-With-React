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
  const contractAddress = "0x06Eb9F83DF91113627875D07De6b60676Ceb4102";
  const { contract, isLoading: contractLoading } = useContract(contractAddress);

  const [contractReady, setContractReady] = useState(false);
  const [duration, setDuration] = useState(10); // Set the default value to 10
  const [vote, setVote] = useState(false); // Track the voting status

  useEffect(() => {
    if (contract) {
      setContractReady(true);
    }
  }, [contract]);

  const { data: contractOwner } = useContractRead(
    contract,
    "contractOwner",
    []
  );
  const { data: getRemainingDeadline } = useContractRead(
    contract,
    "getRemainingDeadline",
    []
  );
  const { data: voteCompleted } = useContractRead(
    contract,
    "voteCompleted",
    []
  );
  const { data: voteResults } = useContractRead(contract, "voteResults", []);

  const { mutateAsync: startVoting, isLoading: startVotingLoading } =
    useContractWrite(contract, "startVoting");
  const { mutateAsync: castVote, isLoading: castVoteLoading } =
    useContractWrite(contract, "vote");

  const handleStartVoting = async () => {
    try {
      const data = await startVoting({ args: [duration] });
      console.info("Contract call success:", data);
    } catch (error) {
      console.error("Contract call failed:", error);
    }
  };

  const handleVote = async (vote) => {
    try {
      await castVote({ args: [vote] });
      setVote(true);
      console.info("Vote casted successfully.");
    } catch (error) {
      console.error("Vote casting failed:", error);
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
            Get Voting Deadline:{" "}
            {getRemainingDeadline && getRemainingDeadline.toString()}
          </p>
          <p>Vote Completed: {voteCompleted && voteCompleted.toString()}</p>
          <p>Vote Results: {voteResults && voteResults.toString()}</p>
          {voteCompleted && (
            <div>
              <label htmlFor="duration">Voting Duration:</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <button onClick={handleStartVoting} disabled={startVotingLoading}>
                Start Voting
              </button>
            </div>
          )}
          {!voteCompleted && !vote && (
            <div>
              <h2>Cast Your Vote</h2>
              <button
                onClick={() => handleVote(true)}
                disabled={castVoteLoading}
              >
                Yes
              </button>
              <button
                onClick={() => handleVote(false)}
                disabled={castVoteLoading}
              >
                No
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Contract not found.</p>
      )}
    </div>
  );
}

export default App;

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
  const {
    mutateAsync: checkVotingCompletion,
    isLoading: checkVotingCompletionLoading,
  } = useContractWrite(contract, "checkVotingCompletion");

  const handleStartVoting = async () => {
    try {
      const data = await startVoting({ args: [duration] });
      console.info("Contract call success:", data);
    } catch (error) {
      console.error("Contract call failed:", error);
    }
  };

  const handleCheckVotingCompletion = async () => {
    try {
      const data = await checkVotingCompletion({ args: [] });
      console.info("Contract call success:", data);
    } catch (error) {
      console.error("Contract call failed:", error);
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
          <div>
            <button
              onClick={handleCheckVotingCompletion}
              disabled={checkVotingCompletionLoading}
            >
              Check Voting Completion
            </button>
          </div>
        </>
      ) : (
        <p>Contract not found.</p>
      )}
    </div>
  );
}

export default App;

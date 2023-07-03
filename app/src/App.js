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
  const contractAddress = "0xEcd8158587988bb9975e4e69a65bBAA76B3b9C26";
  const { contract, isLoading: contractLoading } = useContract(contractAddress);

  const [contractReady, setContractReady] = useState(false);

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
  const { data: voteResults } = useContractRead(contract, "voteResults", []);

  const { mutateAsync: startVoting, isLoading } = useContractWrite(
    contract,
    "startVoting"
  );

  const [duration, setDuration] = useState(20);

  const handleStartVoting = async () => {
    try {
      const data = await startVoting({ args: [duration] });
      console.info("Contract call success", data);
    } catch (err) {
      console.error("Contract call failure", err);
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
          <button onClick={handleStartVoting} disabled={isLoading}>
            Start Voting
          </button>
        </>
      ) : (
        <p>Contract not found.</p>
      )}
    </div>
  );
}

export default App;

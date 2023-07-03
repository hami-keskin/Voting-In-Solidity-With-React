import React, { useEffect, useState } from "react";
import { Sepolia } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider,
  useContract,
  useContractRead,
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

  useEffect(() => {
    if (contract) {
      setContractReady(true);
    }
  }, [contract]);

  const { data: contractOwner } = useContractRead(contract, "contractOwner", []);
  const { data: getRemainingDeadline } = useContractRead(contract, "getRemainingDeadline", []);
  const { data: voteCompleted } = useContractRead(contract, "voteCompleted", []);
  const { data: voteResults } = useContractRead(contract, "voteResults", []);

  return (
    <div>
      {contractLoading ? (
        <p>Loading contract...</p>
      ) : contractReady ? (
        <>
          <h1>Voting Contract</h1>
          <p>Contract Owner: {contractOwner && contractOwner.toString()}</p>
          <p>Get Voting Deadline: {getRemainingDeadline && getRemainingDeadline.toString()}</p>
          <p>Vote Completed: {voteCompleted && voteCompleted.toString()}</p>
          <p>Vote Results: {voteResults && voteResults.toString()}</p>
        </>
      ) : (
        <p>Contract not found.</p>
      )}
    </div>
  );
}

export default App;

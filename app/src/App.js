import React, { useState, useEffect } from "react";
import {
  ThirdwebProvider,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

import "./styles/Home.css";

export default function Home() {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
      <Voting />
    </ThirdwebProvider>
  );
}
function Voting() {
  const contractAddress = "0xDb2Ad82DB40ECb514e0b65668FA552E76eabbCc9";

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
  const { data: noCounter } = useContractRead(contract, "noCounter", []);
  const { data: voteCompleted } = useContractRead(
    contract,
    "voteCompleted",
    []
  );
  const { data: voteResults } = useContractRead(contract, "voteResults", []);
  const { data: voterLimit } = useContractRead(contract, "voterLimit", []);
  const { data: voterVoted } = useContractRead(contract, "voterVoted", []);
  const { data: voters } = useContractRead(contract, "voters", []);
  const { data: votingDeadline } = useContractRead(
    contract,
    "votingDeadline",
    []
  );
  const { data: yesCounter } = useContractRead(contract, "yesCounter", []);

  const { mutateAsync: resetVoting, isLoading: isResetting } = useContractWrite(
    contract,
    "resetVoting"
  );
  const { mutateAsync: vote, isLoading: isVoting } = useContractWrite(
    contract,
    "vote"
  );

  const handleResetVoting = async (duration) => {
    try {
      const data = await resetVoting({ args: [duration] });
      console.log("resetVoting success:", data);
    } catch (err) {
      console.error("resetVoting error:", err);
    }
  };

  const handleVote = async (voteValue) => {
    try {
      const data = await vote({ args: [voteValue] });
      console.log("vote success:", data);
    } catch (err) {
      console.error("vote error:", err);
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
          <p>No Counter: {noCounter && noCounter.toString()}</p>
          <p>Vote Completed: {voteCompleted ? "Yes" : "No"}</p>
          <p>Vote Results: {voteResults && voteResults.toString()}</p>
          <p>Voter Limit: {voterLimit && voterLimit.toString()}</p>
          <p>Voter Voted: {voterVoted && voterVoted.toString()}</p>
          <p>Voters: {voters && voters.toString()}</p>
          <p>Voting Deadline: {votingDeadline && votingDeadline.toString()}</p>
          <p>Yes Counter: {yesCounter && yesCounter.toString()}</p>

          <button
            onClick={() => handleResetVoting(3600)}
            disabled={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset Voting"}
          </button>
          <button onClick={() => handleVote(true)} disabled={isVoting}>
            {isVoting ? "Voting..." : "Vote Yes"}
          </button>
          <button onClick={() => handleVote(false)} disabled={isVoting}>
            {isVoting ? "Voting..." : "Vote No"}
          </button>
        </>
      ) : (
        <p>Contract not found.</p>
      )}
    </div>
  );
}

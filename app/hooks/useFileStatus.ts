import { useNetworkStore, useWalletStore } from "@/app/core";
import { ethers } from "ethers";
import { useState, useEffect, useCallback } from "react";
import DataLiquidityPool from "@/app/contracts/DataLiquidityPool.json";

export const useFileStatus = (fileId: number | null) => {
  const [isFinalized, setIsFinalized] = useState(false);
  const [reward, setReward] = useState(0);
  const [isClaimable, setIsClaimable] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = useNetworkStore((state) => state.contract);
  const walletAddress = useWalletStore((state) => state.walletAddress);

  const checkFileStatus = useCallback(async () => {
    if (!contractAddress || !walletAddress || fileId === null) {
      setError("Wallet not connected, contract address not set, or file ID not available");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DataLiquidityPool.abi, signer);

      const fileInfo = await contract.files(fileId);
      setIsFinalized(fileInfo.finalized);
      setReward(Number(ethers.formatEther(fileInfo.reward)));
      setIsClaimable(fileInfo.finalized && fileInfo.rewardWithdrawn === BigInt(0));
      setError(null);
    } catch (err) {
      console.error("Error checking file status:", err);
      setError("Failed to check file status");
    }
  }, [fileId, contractAddress, walletAddress]);

  useEffect(() => {
    if (fileId !== null) {
      checkFileStatus();
      const interval = setInterval(checkFileStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [fileId, checkFileStatus]);

  const claimReward = async () => {
    if (!contractAddress || !walletAddress || fileId === null) {
      setError("Wallet not connected, contract address not set, or file ID not available");
      return;
    }

    setIsClaiming(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, DataLiquidityPool.abi, signer);

      const tx = await contract.claimContributionReward(fileId);
      await tx.wait();
      setIsClaimable(false);
      setError(null);
      await checkFileStatus(); // Refresh the status after claiming
    } catch (err: any) {
      console.error("Error claiming reward:", err);
      setError(`Failed to claim reward: ${err.message || 'Unknown error'}`);
    } finally {
      setIsClaiming(false);
    }
  };

  return { isFinalized, reward, isClaimable, isClaiming, claimReward, error };
};

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { coinAddress, coinAbi } from "../../artifacts/StakeCoin";
import { hardPoolAddress, poolAbi } from "../../artifacts/StakePools";

import { HardPoolIndicator } from "../SoftHardIndicators";
import { TextM, Text4XL, BigInfoLabel } from "../../theme/texts";
import { Box } from "../HomeContent/Box";
import { Input } from "../Input";
import { LoadingButton, PrimaryButton, SecondaryButton } from "../Button";
import doubleToken from "../../assets/images/logo-double.png";
import TokensStakedModal from "../Modal/TokensStakedModal";
import WinModal from "../Modal/WinModal";
import LossModal from "../Modal/LossModal";
import MinimumDurationModal from "../Modal/MinimumDurationModal";

const ContentWrapper = styled.div`
  margin: 120px 200px 0 200px;
`;

const PoolTitle = styled(Text4XL)`
  color: ${({ theme }) => theme.color.brick600};
  font-weight: 800;
`;

const PoolFullLogo = styled.div`
  display: flex;
  align-items: center;
`;

const PoolInfo = styled(TextM)`
  color: ${({ theme }) => theme.color.brick400};
  font-weight: 700;
  white-space: nowrap;
  margin-left: 14px !important;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 48px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

const StyledBigInfoLabel = styled(BigInfoLabel)`
  color: ${({ theme }) => theme.color.brick300};
`;

const BigInfoData = styled(BigInfoLabel)`
  color: ${({ theme }) => theme.color.brick500};
`;

const InputWrapper = styled.div`
  flex-grow: 1;
`;

export default function SoftContent() {
  // Layout
  const [isStakingExpanded, setIsStakingExpanded] = useState(false);
  const [isMyPositionExpanded, setIsMyPositionExpanded] = useState(false);
  const [isTokensStakedModalOpen, setIsTokensStakedModalOpen] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isLossModalOpen, setIsLossModalOpen] = useState(false);
  const [isMinimumDurationModalOpen, setIsMinimumDurationModalOpen] =
    useState(false);
  const [isInputNumberValid, setIsInputNumberValid] = useState(false);
  const [isAllowanceEnough, setIsAllowanceEnough] = useState(false);

  // Data
  const [allowance, setAllowance] = useState(0n);
  const [myPosition, setMyPosition] = useState(0n);
  const [stakeInputValue, setStakeInputValue] = useState("0");
  const valueToSendToSmartContract = ethers.parseEther(stakeInputValue);
  const [poolBalance, setPoolBalance] = useState<number | "error">(0);
  const [yieldPerSec, setYieldPerSec] = useState<number | "error">(0);
  const [lossPerSec, setLossPerSec] = useState<number | "error">(0);

  // Wagmi hooks
  const { openConnectModal } = useConnectModal();
  const { isConnected, address: userAddress } = useAccount();

  // Pool stats hooks
  const { refetch: refetchPoolBalance } = useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "poolBalance",
    onSuccess(data) {
      setPoolBalance(Number(ethers.formatEther(data)));
    },
    onError(err) {
      console.log(`Error setting pool balance: ${err}`);
      setPoolBalance("error");
    },
  });

  useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "yieldPercentagePerSec",
    onSuccess(data) {
      setYieldPerSec(Number(ethers.formatEther(data)));
    },
    onError(err) {
      console.log(`Error setting yield percentage: ${err}`);
      setYieldPerSec("error");
    },
  });

  useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "lossPercentagePerSec",
    onSuccess(data) {
      setLossPerSec(Number(ethers.formatEther(data)));
    },
    onError(err) {
      console.log(`Error setting yield percentage: ${err}`);
      setLossPerSec("error");
    },
  });

  // Stake tokens hooks
  useContractRead({
    address: coinAddress,
    abi: coinAbi,
    functionName: "allowance",
    args: [userAddress as `0x${string}`, hardPoolAddress],
    onSuccess(data) {
      setAllowance(data);
    },
    onError(err) {
      console.log(err);
    },
  });

  // Minimum staking duration hook
  const { data: elapsedTimeData } = useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "getElapsedTime",
    args: [userAddress as `0x${string}`],
    enabled: myPosition > 0n,
  });

  const { config: approveConfig } = usePrepareContractWrite({
    address: coinAddress,
    abi: coinAbi,
    functionName: "approve",
    args: [hardPoolAddress, 100_000_000n],
    enabled: !isAllowanceEnough,
  });
  const { write: writeApprove, data: writeApproveData } =
    useContractWrite(approveConfig);
  const { isLoading: approvalIsLoading, isSuccess: isApprovalSuccess } =
    useWaitForTransaction({
      hash: writeApproveData?.hash,
    });

  const { config: stakeConfig } = usePrepareContractWrite({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "stakeTokens",
    args: [valueToSendToSmartContract],
    enabled: isAllowanceEnough && !myPosition,
  });
  const { write: writeStakeTokens, data: stakeTokensData } =
    useContractWrite(stakeConfig);
  const { isLoading: isStakeTokensLoading, isSuccess: isStakeTokenSuccess } =
    useWaitForTransaction({
      hash: stakeTokensData?.hash,
    });

  // View my positions hooks
  const {
    data: getCurrentPositionData,
    status: getCurrentPositionStatus,
    refetch: refetchGetCurrentPosition,
  } = useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "getCurrentRewardAmount",
    args: [userAddress as `0x${string}`],
    onError() {
      setMyPosition(0n);
    },
  });

  // Claim reward hooks
  const { config: claimRewardConfig } = usePrepareContractWrite({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "claimReward",
    enabled: myPosition > 0n && (elapsedTimeData as bigint) < 15 * 60,
  });
  const { write: writeClaimReward, data: writeClaimRewardData } =
    useContractWrite(claimRewardConfig);
  const { isLoading: isClaimRewardLoading } = useWaitForTransaction({
    hash: writeClaimRewardData?.hash,
  });

  // Button click handlers
  function handleStakeButton() {
    writeStakeTokens?.();
  }
  function handleApproveButton() {
    writeApprove?.();
  }
  async function handleViewPositionButton() {
    if (isMyPositionExpanded) {
      setIsMyPositionExpanded(false);
    } else {
      await refetchGetCurrentPosition();
      setIsMyPositionExpanded(true);
      if (getCurrentPositionStatus === "error") {
        setMyPosition(0n);
      }
    }
  }
  function handleClosePositionButton() {
    if (elapsedTimeData) {
      if (elapsedTimeData < 15 * 60) {
        setIsMinimumDurationModalOpen(true);
      } else {
        writeClaimReward?.();
      }
    }
  }
  async function handleCloseTokensStakedModalButton() {
    setIsTokensStakedModalOpen(false);
    await refetchGetCurrentPosition();
  }
  async function handleCloseWinModalButton() {
    setIsWinModalOpen(false);
    await refetchGetCurrentPosition();
  }
  async function handleCloseLossModalButton() {
    setIsLossModalOpen(false);
    await refetchGetCurrentPosition();
  }
  async function handleMinimumDurationModalButton() {
    setIsMinimumDurationModalOpen(false);
    await refetchGetCurrentPosition();
  }
  function handleInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    const valueAsNumber = Number(e.target.value);

    if (valueAsNumber >= 1 && valueAsNumber < Number.MAX_SAFE_INTEGER) {
      setStakeInputValue(e.target.value);
      setIsInputNumberValid(true);
    } else {
      console.log("Error in input value");
      setIsInputNumberValid(false);
      // ADD UX VALIDATION
    }

    if (Number(ethers.formatEther(allowance)) >= Number(e.target.value)) {
      setIsAllowanceEnough(true);
    } else {
      setIsAllowanceEnough(false);
    }
  }

  // Tokens staked, win or loss listeners
  useContractEvent({
    address: hardPoolAddress,
    abi: poolAbi,
    eventName: "TokensStaked",
    listener(logs) {
      if (logs[0].args.userAddress === userAddress) {
        setIsTokensStakedModalOpen(true);
      }
    },
  });
  useContractEvent({
    address: hardPoolAddress,
    abi: poolAbi,
    eventName: "Win",
    listener(logs) {
      if (logs[0].args.userAddress === userAddress) {
        setIsWinModalOpen(true);
      }
    },
  });
  useContractEvent({
    address: hardPoolAddress,
    abi: poolAbi,
    eventName: "Loss",
    listener(logs) {
      if (logs[0].args.userAddress === userAddress) {
        setIsLossModalOpen(true);
      }
    },
  });
  useContractEvent({
    address: coinAddress,
    abi: coinAbi,
    eventName: "Approval",
    listener(log) {
      if (log[0].args.owner === userAddress) {
        writeStakeTokens?.();
      }
    },
  });

  // Refetch when "view my position" button is expanding
  useEffect(() => {
    refetchGetCurrentPosition();
    setMyPosition(getCurrentPositionData as bigint);
  }, [getCurrentPositionData, refetchGetCurrentPosition]);

  // Scroll when staking controls expanded
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [isStakingExpanded]);

  // Switch from approval button to stake button
  useEffect(() => {
    if (isApprovalSuccess) {
      setIsAllowanceEnough(true);
    }
  }, [isApprovalSuccess]);

  // Refetch pool balance after staking
  useEffect(() => {
    if (isStakeTokenSuccess) {
      refetchPoolBalance();
    }
  }, [isStakeTokenSuccess, refetchPoolBalance]);

  // console.log("allowance " + allowance)
  return (
    <>
      <TokensStakedModal
        isModalOpen={isTokensStakedModalOpen}
        closingFunction={() => setIsTokensStakedModalOpen(false)}
        closingButton={handleCloseTokensStakedModalButton}
      />
      <WinModal
        isModalOpen={isWinModalOpen}
        closingFunction={() => setIsWinModalOpen(false)}
        closingButton={handleCloseWinModalButton}
      />
      <LossModal
        isModalOpen={isLossModalOpen}
        closingFunction={() => setIsLossModalOpen(false)}
        closingButton={handleCloseLossModalButton}
      />
      <MinimumDurationModal
        isModalOpen={isMinimumDurationModalOpen}
        closingFunction={() => setIsMinimumDurationModalOpen(false)}
        closingButton={handleMinimumDurationModalButton}
        elapsedTimeData={elapsedTimeData as bigint}
      />

      <ContentWrapper>
        <HardPoolIndicator
          style={{ marginBottom: "30px", padding: "6px 36px" }}
        >
          HARD POOL
        </HardPoolIndicator>
        <PoolTitle style={{ marginBottom: "30px" }}>
          Hard Risk $STK Pool
        </PoolTitle>
        <StyledBox>
          <Row>
            <PoolFullLogo>
              <img src={doubleToken} width="80px" />
              <PoolInfo>$STK / $STK</PoolInfo>
            </PoolFullLogo>
            <SecondaryButton onClick={handleViewPositionButton}>
              View my positions
            </SecondaryButton>
          </Row>
          {getCurrentPositionStatus === "success" &&
            isMyPositionExpanded &&
            (!myPosition ? (
              <Row>
                <BigInfoData>You don't have any position</BigInfoData>
              </Row>
            ) : (
              <Row>
                <StyledBigInfoLabel>Your staking position:</StyledBigInfoLabel>
                <BigInfoData>{ethers.formatEther(myPosition)}</BigInfoData>
              </Row>
            ))}
          {(getCurrentPositionStatus === "idle" ||
            getCurrentPositionStatus === "error") &&
            isMyPositionExpanded && (
              <Row>
                <BigInfoData>You don't have any position</BigInfoData>
              </Row>
            )}
          <Row>
            <StyledBigInfoLabel>TOTAL STAKED</StyledBigInfoLabel>
            <BigInfoData>{poolBalance} $STK</BigInfoData>
          </Row>
          <Row>
            <StyledBigInfoLabel>HOURLY PERCENTAGE YIELD</StyledBigInfoLabel>
            <BigInfoData>
              {typeof yieldPerSec == "number"
                ? Math.floor(yieldPerSec * 60 * 60)
                : "error"}
              %
            </BigInfoData>
          </Row>
          <Row>
            <StyledBigInfoLabel>RISK GENERATED HOURLY</StyledBigInfoLabel>
            <BigInfoData>
              {typeof lossPerSec == "number"
                ? Math.floor(lossPerSec * 60 * 60)
                : "error"}
              %
            </BigInfoData>
          </Row>
          <Row>
            <StyledBigInfoLabel>CURRENT APR</StyledBigInfoLabel>
            <BigInfoData>
              {typeof yieldPerSec == "number"
                ? yieldPerSec * 60 * 60 * 24 * 365
                : "error"}
              %
            </BigInfoData>
          </Row>
        </StyledBox>

        <StyledBox style={{ margin: "20px 0" }}>
          {(Number(getCurrentPositionData) === 0 ||
            getCurrentPositionStatus === "idle" ||
            getCurrentPositionStatus === "error" ||
            getCurrentPositionStatus === "loading") &&
            isStakingExpanded && (
              <>
                <Row>
                  <InputWrapper style={{ paddingRight: "40px" }}>
                    <StyledBigInfoLabel>
                      # OF TOKENS TO STAKE
                    </StyledBigInfoLabel>
                    <Input
                      type="number"
                      style={{
                        marginTop: "20px",
                      }}
                      isInputValid={isInputNumberValid}
                      onChange={handleInputValue}
                      min={1}
                      max={Number.MAX_SAFE_INTEGER}
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <StyledBigInfoLabel>RISK PERCENTAGE</StyledBigInfoLabel>
                    <Input
                      type="number"
                      readOnly={true}
                      style={{ marginTop: "20px", outline: "none" }}
                      placeholder="1.63%"
                    />
                  </InputWrapper>
                </Row>
              </>
            )}
          <Row
            style={{
              justifyContent: "center",
            }}
          >
            {myPosition > 0 && !isClaimRewardLoading && (
              <PrimaryButton onClick={handleClosePositionButton}>
                Close my position
              </PrimaryButton>
            )}

            {myPosition > 0 && isClaimRewardLoading && <LoadingButton />}

            {!myPosition && !isStakingExpanded && (
              <PrimaryButton onClick={() => setIsStakingExpanded(true)}>
                Begin Staking
              </PrimaryButton>
            )}
            {!myPosition && isStakingExpanded && (
              <>
                {!isConnected && (
                  <PrimaryButton onClick={openConnectModal}>
                    Connect
                  </PrimaryButton>
                )}

                {isConnected && !isAllowanceEnough && !approvalIsLoading && (
                  <PrimaryButton onClick={handleApproveButton}>
                    Approve
                  </PrimaryButton>
                )}

                {isConnected && !isAllowanceEnough && approvalIsLoading && (
                  <LoadingButton />
                )}

                {isConnected && isAllowanceEnough && !isStakeTokensLoading && (
                  <PrimaryButton
                    onClick={isConnected ? handleStakeButton : openConnectModal}
                  >
                    Stake
                  </PrimaryButton>
                )}
                {isConnected && isAllowanceEnough && isStakeTokensLoading && (
                  <LoadingButton />
                )}
              </>
            )}
          </Row>
        </StyledBox>
      </ContentWrapper>
    </>
  );
}

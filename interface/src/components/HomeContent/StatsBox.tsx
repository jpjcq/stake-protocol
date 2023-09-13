import styled from "styled-components";
import { Box } from "./Box";
import { Text } from "rebass";
import { useContractRead } from "wagmi";
import { useState } from "react";
import {
  hardPoolAddress,
  poolAbi,
  softPoolAddress,
} from "../../artifacts/StakePools";
import { ethers } from "ethers";
import { BigInfoLabel } from "../../theme/texts";

const StatsBoxWrapper = styled(Box)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  grid-area: 1 / 1 / 1 / 1;
  padding: 26px 28px 36px 28px;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    padding: 26px 28px;
  }
`;

const Info = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    align-items: center;
  }
`;

const StyledBigStat = styled(Text)`
  color: ${({ theme }) => theme.colors.secondaryFont};
  font-size: 48px;
  font-weight: 900;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    font-size: 30px;
    font-weight: 900;
  }
`;

const StyledBigInfoLabel = styled(BigInfoLabel)`
  color: ${({ theme }) => theme.colors.white};

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    font-size: 14px !important;
  }
`;

function getReducedNumber(input: number | string) {
  const number = Number(input);

  if (number < 10_000) {
    return `${number}`;
  }
  if (number >= 10_000) {
    return `${Math.round(number / 1000)}K`;
  }
  if (number >= 1_000_000) {
    return `${Math.round(number / 1_000_000)}M`;
  }
  if (number >= 1_000_000_000) {
    return `${Math.round(number / 1_000_000_000)}B`;
  }
}

export default function StatsBox() {
  const [softPoolBalance, setSoftPoolBalance] = useState("0");
  const [hardPoolBalance, setHardPoolBalance] = useState("0");
  const [totalBurnt, setTotalBurnt] = useState(0);
  let totalBalance;
  useContractRead({
    address: softPoolAddress,
    abi: poolAbi,
    functionName: "poolBalance",
    onSuccess(data) {
      setSoftPoolBalance(ethers.formatEther(data));
    },
    onError(err) {
      console.log(`Error getting soft pool balance: ${err}`);
      setSoftPoolBalance("error");
    },
  });
  useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "poolBalance",
    onSuccess(data) {
      setHardPoolBalance(ethers.formatEther(data));
    },
    onError(err) {
      console.log(`Error getting hard pool balance: ${err}`);
      setHardPoolBalance("error");
    },
  });
  useContractRead({
    address: softPoolAddress,
    abi: poolAbi,
    functionName: "totalBurnt",
    onSuccess(data) {
      setTotalBurnt(
        (totalBurnt) => Number(ethers.formatEther(data)) + totalBurnt
      );
    },
    onError(err) {
      console.log(`Error getting soft pool total burnt: ${err}`);
    },
  });
  useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "totalBurnt",
    onSuccess(data) {
      setTotalBurnt(
        (totalBurnt) => Number(ethers.formatEther(data)) + totalBurnt
      );
    },
    onError(err) {
      console.log(`Error getting hard pool total burnt: ${err}`);
    },
  });

  // Define total balance
  if (softPoolBalance === "error" || hardPoolBalance === "error") {
    totalBalance = "NaN";
  } else {
    totalBalance = Number(softPoolBalance) + Number(hardPoolBalance);
  }

  return (
    <StatsBoxWrapper>
      <Info>
        <StyledBigInfoLabel>$STK FARMING</StyledBigInfoLabel>
        <StyledBigStat>{getReducedNumber(totalBalance)}</StyledBigStat>
      </Info>
      <Info>
        <StyledBigInfoLabel>TOTAL $STK BURNT</StyledBigInfoLabel>
        <StyledBigStat>{getReducedNumber(totalBurnt)}</StyledBigStat>
      </Info>
    </StatsBoxWrapper>
  );
}

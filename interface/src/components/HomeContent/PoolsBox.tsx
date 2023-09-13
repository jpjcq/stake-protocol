import { useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import styled, { useTheme } from "styled-components";
import { useContractRead } from "wagmi";
import doubleToken from "../../assets/images/double-logo.png";
import { Box } from "./Box";
import { BigInfoLabel, TextM } from "../../theme/texts";
import { SoftPoolIndicator, HardPoolIndicator } from "../SoftHardIndicators";
import {
  hardPoolAddress,
  poolAbi,
  softPoolAddress,
} from "../../artifacts/StakePools";
import useWindowWidth from "../../hooks/useWindowWidth";
import { ThemeType } from "../../theme";

const PoolsBoxWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 26px 28px 46px 28px;
  grid-area: 2 / 1 / 2 / 3;
`;

const Labels = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  
  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.tablet}px) {
    display: flex;
    justify-content: space-between;
  }
`;

const Pools = styled.div`
  height: 100%;
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const StyledBigInfoLabel = styled(BigInfoLabel)`
  color: ${({ theme }) => theme.colors.white};
`;

const HardPool = styled(Link)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 25px 20px;
  align-items: center;
  text-align: center;
  border: 1px solid #30363d;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: 0.1255s scale ease-in-out;
  text-decoration: none;

  &:hover {
    scale: 1.006;
    transition: 0.1255s scale ease-in-out;
  }

  @media screen and (min-width: ${({ theme }) => theme.BREAKPOINT.tablet}px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.tablet}px) {
    margin-bottom: 20px;
    padding: 25px 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

const SoftPool = styled(Link)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 25px 20px;
  align-items: center;
  text-align: center;
  border: 1px solid #30363d;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: 0.1255s scale ease-in-out;
  text-decoration: none;
  margin-bottom: 20px;

  &:hover {
    scale: 1.006;
    transition: 0.1255s scale ease-in-out;
  }

  @media screen and (min-width: ${({ theme }) => theme.BREAKPOINT.tablet}px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.tablet}px) {
    padding: 15px 25px 25px 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
`;

const PoolLabel = styled.div`
  display: flex;
  align-items: center;
`;

const PoolInfo = styled(TextM)`
  color: #9cabbb;
  font-weight: 500;
  white-space: nowrap;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.tablet}px) {
    margin: 20px 0 20px 14px !important;
  }
`;

export default function PoolsBox() {
  const width = useWindowWidth();
  const theme = useTheme() as ThemeType;

  const [softPoolYield, setSoftPoolYield] = useState(0);
  const [softPoolRisk, setSoftPoolRisk] = useState(0);
  const [hardPoolYield, setHardPoolYield] = useState(0);
  const [hardPoolRisk, setHardPoolRisk] = useState(0);

  useContractRead({
    address: softPoolAddress,
    abi: poolAbi,
    functionName: "yieldPercentagePerSec",
    onSuccess(data) {
      setSoftPoolYield(Number(ethers.formatEther(data)));
    },
    onError(err) {
      console.log(`Error getting soft pool yield stat: ${err}`);
      setSoftPoolYield(0);
    },
  });
  useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "yieldPercentagePerSec",
    onSuccess(data) {
      setHardPoolYield(Number(ethers.formatEther(data)));
    },
    onError(err) {
      console.log(`Error getting hard pool yield stat: ${err}`);
      setHardPoolYield(0);
    },
  });
  useContractRead({
    address: softPoolAddress,
    abi: poolAbi,
    functionName: "lossPercentagePerSec",
    onSuccess(data) {
      setSoftPoolRisk(Number(ethers.formatEther(data)));
    },
    onError(err) {
      console.log(`Error getting soft pool risk stat: ${err}`);
      setSoftPoolRisk(0);
    },
  });
  useContractRead({
    address: hardPoolAddress,
    abi: poolAbi,
    functionName: "lossPercentagePerSec",
    onSuccess(data) {
      setHardPoolRisk(Number(ethers.formatEther(data)));
    },
    onError(err) {
      console.log(`Error getting hard pool risk stat: ${err}`);
      setHardPoolRisk(0);
    },
  });
  return (
    <PoolsBoxWrapper>
      <Labels>
        <StyledBigInfoLabel>POOL</StyledBigInfoLabel>
        <StyledBigInfoLabel>HPY% / APY%</StyledBigInfoLabel>
        {width > theme.BREAKPOINT.tablet && (
          <StyledBigInfoLabel>RPH%</StyledBigInfoLabel>
        )}
        <StyledBigInfoLabel>POOL TYPE</StyledBigInfoLabel>
      </Labels>
      <Pools>
        <SoftPool to="/soft-pool">
          <PoolLabel>
            <img src={doubleToken} width="80px" />
            <PoolInfo style={{ marginLeft: "14px" }}>$STK / $STK</PoolInfo>
          </PoolLabel>
          <PoolInfo>
            {(softPoolYield * 60 * 60).toFixed(2)}% /{" "}
            {(softPoolYield * 60 * 60 * 24 * 365).toFixed(2)}%
          </PoolInfo>
          {width > theme.BREAKPOINT.tablet && (
            <PoolInfo>{(softPoolRisk * 60 * 60).toFixed(2)}%</PoolInfo>
          )}
          <SoftPoolIndicator>SOFT POOL</SoftPoolIndicator>
        </SoftPool>
        <HardPool to="/hard-pool">
          <PoolLabel>
            <img src={doubleToken} width="80px" />
            <PoolInfo style={{ marginLeft: "14px" }}>$STK / $STK</PoolInfo>
          </PoolLabel>
          <PoolInfo>
            {(hardPoolYield * 60 * 60).toFixed(2)}% /{" "}
            {(hardPoolYield * 60 * 60 * 24 * 365).toFixed(2)}%
          </PoolInfo>
          {width > theme.BREAKPOINT.tablet && (
            <PoolInfo>{(hardPoolRisk * 60 * 60).toFixed(2)}%</PoolInfo>
          )}
          <HardPoolIndicator>HARD POOL</HardPoolIndicator>
        </HardPool>
      </Pools>
    </PoolsBoxWrapper>
  );
}

import styled, { useTheme } from "styled-components";
import { Box } from "../HomeContent/Box";
import { FlexCenter } from "../Utils/Flex";
import { Text5XL } from "../../theme/texts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useEffect, useState } from "react";
import { coinAddress, coinAbi } from "../../artifacts/StakeCoin";
import { HexValue } from "../../types/hardhat";
import { PrimaryButton, SmallPrimaryButton } from "../Button";
import Modal from "../Modal";
import { FlexModal, ModalText, ModalTitle } from "../Modal/ModalComponents";
import { Link } from "react-router-dom";
import { ThemeType } from "../../theme";
import { SyncLoader } from "react-spinners";

const MintContentWrapper = styled(Box)`
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 80px;
  text-align: center;
  border: none;
`;

const Title = styled(Text5XL)`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.secondaryFont};
  margin-bottom: 30px !important;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    font-size: 36px !important;
  }
`;

const PrimaryButtonLink = styled(Link)`
  width: fit-content;
  background-color: ${({ theme }) => theme.colors.blueLogo};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  padding: 18px 77px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: 0.125s scale ease-in-out;
  &:hover {
    scale: 1.025;
    transition: 0.125s scale ease-in-out;
  }
`;

export default function MintContent() {
  const theme = useTheme() as ThemeType;

  const [hasMintedModalOpen, setHasMintedModalOpen] = useState(false);

  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [hasMinted, setHasMinted] = useState(false);
  const [isMintEnabled, setIsMintEnabled] = useState(false);
  const { isConnected, address: userAddress } = useAccount();

  // isWhitelisted and hasMinted hooks
  useContractRead({
    address: coinAddress,
    abi: coinAbi,
    args: [userAddress as HexValue],
    functionName: "isWhitelisted",
    onSuccess(data) {
      setIsWhitelisted(data);
    },
    onError(err) {
      console.log(err);
    },
  });
  useContractRead({
    address: coinAddress,
    abi: coinAbi,
    args: [userAddress as HexValue],
    functionName: "hasMinted",
    onSuccess(data) {
      setHasMinted(data);
    },
    onError(err) {
      console.log(err);
    },
  });

  // Mint hook
  const { config } = usePrepareContractWrite({
    address: coinAddress,
    abi: coinAbi,
    functionName: "mint",
    enabled: isMintEnabled,
  });
  const { write: writeMint, data: mintTransactionData } =
    useContractWrite(config);

  // Wait for mint
  const { isLoading: isMintLoading } = useWaitForTransaction({
    hash: mintTransactionData?.hash,
  });

  // HasMinted event
  useContractEvent({
    address: coinAddress,
    abi: coinAbi,
    eventName: "HasMinted",
    listener(log) {
      if (log[0].args.userAddress === userAddress) {
        setHasMintedModalOpen(true);
      }
    },
  });

  // Modal close function
  function closeHasMintedModal() {
    setHasMintedModalOpen(false);
    setHasMinted(true);
  }

  // Button click handlers
  function closeModalHasMintedModalButton() {
    closeHasMintedModal();
  }

  //Check if mint can be enabled
  useEffect(
    function () {
      if (isWhitelisted && !hasMinted) {
        setIsMintEnabled(true);
      }
    },
    [isWhitelisted, hasMinted]
  );

  return (
    <>
      <Modal
        isModalOpen={hasMintedModalOpen}
        closingFunction={closeHasMintedModal}
      >
        <FlexModal>
          <ModalTitle>Token mint successfull</ModalTitle>
          <ModalText style={{ marginTop: "20px" }}>
            Your 100 000 $STK has been minted!
          </ModalText>
          <SmallPrimaryButton
            onClick={closeModalHasMintedModalButton}
            style={{ marginTop: "20px" }}
          >
            Close
          </SmallPrimaryButton>
        </FlexModal>
      </Modal>

      <FlexCenter>
        {isMintLoading ? (
          <MintContentWrapper>
            <SyncLoader color={theme.colors.secondaryFont} size={20} />
          </MintContentWrapper>
        ) : (
          <MintContentWrapper>
            {!isConnected && (
              <>
                <Title>Check if your address is whitelisted!</Title>
                <ConnectButton />
              </>
            )}
            {isConnected && !isWhitelisted && (
              <Title>This wallet is not whitelisted!</Title>
            )}
            {isConnected && isWhitelisted && !hasMinted && (
              <>
                <Title>This wallet is whitelisted, claim now</Title>
                <PrimaryButton onClick={() => writeMint?.()}>
                  Claim
                </PrimaryButton>
              </>
            )}
            {isConnected && isWhitelisted && hasMinted && (
              <>
                <Title>You already have minted</Title>
                <PrimaryButtonLink to="/">Go to pools</PrimaryButtonLink>
              </>
            )}
          </MintContentWrapper>
        )}
      </FlexCenter>
    </>
  );
}

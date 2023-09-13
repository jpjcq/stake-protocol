import styled from "styled-components";
import { Box } from "./Box";
import { BigInfoLabel } from "../../theme/texts";
import { Text } from "rebass";

const SocialsBoxWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 26px 28px 46px 28px;
  grid-area: 1 / 2 / 1 / 2;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    margin: 20px 0;
    padding: 26px 28px 26px 28px;
    justify-content: center;
  }
`;

const StyledBigInfoLabel = styled(BigInfoLabel)`
  color: ${({ theme }) => theme.colors.white};
`;

const Info = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    align-items: center;
  }
`;

const TwitterHandle = styled(Text)`
  color: ${({ theme }) => theme.colors.secondaryFont};
  font-size: 36px;
  font-weight: 900;

  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    font-size: 24px;
    font-weight: 900;
  }
`;

export default function SocialsBox() {
  return (
    <SocialsBoxWrapper>
      <Info>
        <StyledBigInfoLabel>FOLLOW US ON TWITTER</StyledBigInfoLabel>
        <TwitterHandle fontWeight={900}>@STAKE_PROTOCOL</TwitterHandle>
      </Info>
    </SocialsBoxWrapper>
  );
}

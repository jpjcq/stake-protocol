import styled from "styled-components";
import StatsBox from "./StatsBox";
import SocialsBox from "./SocialsBox";
import PoolsBox from "./PoolsBox";

const MainWrapper = styled.main`
  margin-top: 170px;
  padding: 0 10px 20px 10px;

  @media screen and (min-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    display: grid;
    padding: 0 80px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 2fr;
    gap: 20px;
  }

  @media screen and (max-width: ${({theme}) => theme.BREAKPOINT.laptop}px) {
    margin-top: 90px;
  }
`;

export default function Content() {
  return (
    <MainWrapper>
      <StatsBox />
      <SocialsBox />
      <PoolsBox />
    </MainWrapper>
  );
}

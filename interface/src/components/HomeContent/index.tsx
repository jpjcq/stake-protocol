import styled from "styled-components";
import StatsBox from "./StatsBox";
import SocialsBox from "./SocialsBox";
import PoolsBox from "./PoolsBox";

const MainWrapper = styled.main`
  width: 100%;
  height: 70vh;
  margin-top: 170px;
  padding: 0 80px;
  @media screen and (min-width: ${({ theme }) => theme.BREAKPOINT.lg}px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 2fr;
    gap: 20px;
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

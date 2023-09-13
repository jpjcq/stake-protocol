import { Link } from "react-router-dom";
import stakeLogo from "../../assets/images/blue-stake-logo.png";
import styled, { useTheme } from "styled-components";
import useWindowWidth from "../../hooks/useWindowWidth";
import { ThemeType } from "../../theme";

const TextLogo = styled.span`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap");
  font-family: "Montserrat", sans-serif;
  color: ${({ theme }) => theme.colors.white};
  font-size: 26px;
  letter-spacing: 2px;
  margin-left: 13px;
  font-weight: 800;
  @media screen and (max-width: ${({ theme }) => theme.BREAKPOINT.laptop}px) {
    font-size: 16px;
  }
`;

const FullLogoWrapper = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  cursor: pointer;
  transition: 0.05s scale ease-in-out;
  text-decoration: none;
  &:hover {
    scale: 1.003;
    transition: 0.05s scale ease-in-out;
  }
`;

export default function FullLogo() {
  const width = useWindowWidth();
  const theme = useTheme() as ThemeType;

  return (
    <FullLogoWrapper to="/">
      <img
        src={stakeLogo}
        height={width < theme.BREAKPOINT.laptop ? "30px" : "37px"}
        width={width < theme.BREAKPOINT.laptop ? "30px" : "37px"}
      />
      <TextLogo>
        {width < theme.BREAKPOINT.laptop ? (
          <>
            STAKE
            <br />
            PROTOCOL
          </>
        ) : (
          "STAKE PROTOCOL"
        )}
      </TextLogo>
    </FullLogoWrapper>
  );
}

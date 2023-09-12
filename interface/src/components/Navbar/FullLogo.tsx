import { Link } from "react-router-dom";
import stakeLogo from "../../assets/images/blue-stake-logo.png";
import styled from "styled-components";

const TextLogo = styled.span`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap");
  font-family: "Montserrat", sans-serif;
  color: ${({theme}) => theme.colors.white};
  font-size: 26px;
  letter-spacing: 2px;
  margin-left: 13px;
  font-weight: 800;
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
  return (
    <FullLogoWrapper to="/">
      <img src={stakeLogo} height="37px" width="37px" />
      <TextLogo>STAKE PROTOCOL</TextLogo>
    </FullLogoWrapper>
  );
}

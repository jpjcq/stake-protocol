import { Link } from "react-router-dom";
import stakeLogo from "../../assets/images/brick-stake-logo.png"
import styled from "styled-components";

const TextLogo = styled.span`
  color: ${({ theme }) => theme.color.brick500};
  font-size: 26px;
  margin-left: 13px;
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
      <TextLogo className="text-logo">STAKE PROTOCOL</TextLogo>
    </FullLogoWrapper>
  );
}

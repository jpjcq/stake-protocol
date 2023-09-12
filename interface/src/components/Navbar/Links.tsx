import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const LinkWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
`;

export const StyledNavLink = styled(NavLink)`
  color:#9CABBB;
  font-size: 1rem;
  font-weight: 700;
  margin-right: 30px;
  cursor: pointer;
  transition: 0.125s scale ease-in-out;
  text-decoration: none;
  &:hover {
    scale: 1.025;
    transition: 0.125s scale ease-in-out;
  }
`;

export default function Links() {
  return (
    <LinkWrapper>
      <StyledNavLink to="/mint">Mint</StyledNavLink>
      <StyledNavLink to="/">Get $STK</StyledNavLink>
      <ConnectButton />
    </LinkWrapper>
  );
}

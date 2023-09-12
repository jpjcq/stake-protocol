import styled from "styled-components";
import FullLogo from "./FullLogo";
import Links from "./Links";

const NavbarWrapper = styled.header`
  backdrop-filter: blur(10px); /* Apply blur */
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 20px;
  z-index: 9999;
`;

export default function Navbar() {
  return (
    <NavbarWrapper>
      <FullLogo />
      <Links />
    </NavbarWrapper>
  );
}

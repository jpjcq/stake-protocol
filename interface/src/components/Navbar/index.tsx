import styled, { useTheme } from "styled-components";
import HamburgerIcon from "../../assets/icons/HamburgerIcon";
import FullLogo from "./FullLogo";
import Links from "./Links";
import useWindowWidth from "../../hooks/useWindowWidth";
import { ThemeType } from "../../theme";
import Menu from "../Menu";
import { useState } from "react";

const NavbarWrapper = styled.header`
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px 15px 20px;
  z-index: 9999;
`;

export default function Navbar() {
  const width = useWindowWidth();
  const theme = useTheme() as ThemeType;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <NavbarWrapper>
        <FullLogo />
        {width < theme.BREAKPOINT.laptop ? (
          !isMenuOpen && (
            <HamburgerIcon
              onClick={() => {
                setIsMenuOpen((state) => !state);
              }}
            />
          )
        ) : (
          <Links />
        )}
      </NavbarWrapper>
    </>
  );
}

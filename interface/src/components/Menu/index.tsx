import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import CrossIcon from "../../assets/icons/CrossIcon";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NavLink } from "react-router-dom";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: #080b117f;
  z-index: 20;
`;

const Content = styled(motion.div)<{ isMenuOpen: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
  width: 310px;
  padding: 40px;

  top: 0;
  bottom: 0;
  z-index: 99999;
`;

const MenuNavlink = styled(NavLink)`
  color: #9cabbb;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.125s scale ease-in-out;
  text-decoration: none;
  &:hover {
    scale: 1.025;
    transition: 0.125s scale ease-in-out;
  }
`;

const LinksWrapper = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

interface MenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Menu({ isMenuOpen, setIsMenuOpen }: MenuProps) {
  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      <Content
        isMenuOpen={isMenuOpen}
        initial={{ x: -310 }}
        animate={{ x: isMenuOpen ? 0 : -310 }}
        transition={{ type: "tween" }}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close"
          style={{
            border: "none",
            backgroundColor: "transparent",
            position: "absolute",
            top: "25px",
            right: "25px",
          }}
        >
          <CrossIcon onClick={() => setIsMenuOpen(false)} />
        </button>

        <LinksWrapper>
          <MenuNavlink to="/mint">Mint</MenuNavlink>
          <MenuNavlink to="/">Get $STK</MenuNavlink>
          <ConnectButton />
        </LinksWrapper>
      </Content>
    </>
  );
}

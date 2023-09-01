import { ReactNode } from "react";
import ReactModal from "react-modal";
import { useTheme } from "styled-components";
import { ThemeType } from "../../theme";

interface ModalProps {
  children: ReactNode;
  isModalOpen: boolean;
  closingFunction: () => void;
  afterCloseFunction?: () => void;
}

export default function Modal({
  children,
  isModalOpen,
  closingFunction,
  afterCloseFunction
}: ModalProps) {
  const theme = useTheme() as ThemeType;
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme.color.cream100,
      color: theme.color.brick700,
      zIndex: 99999
    },
    overlay: {
      background: "rgba(13, 17, 28, 0.72)",
      zIndex: 100000
    },
  };

  return (
    <ReactModal
      isOpen={isModalOpen}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
      onRequestClose={closingFunction}
      onAfterClose={afterCloseFunction}
    >
      {children}
    </ReactModal>
  );
}

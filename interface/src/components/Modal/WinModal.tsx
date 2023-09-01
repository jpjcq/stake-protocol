import Modal from ".";
import { FlexModal, ModalText, ModalTitle } from "./ModalComponents";
import { SmallPrimaryButton } from "../Button";

interface TokensStakedProps {
  isModalOpen: boolean;
  closingFunction: () => void;
  closingButton: () => Promise<void>;
}

export default function WinModal({
  isModalOpen,
  closingFunction,
  closingButton,
}: TokensStakedProps) {
  return (
    <Modal isModalOpen={isModalOpen} closingFunction={closingFunction}>
      <FlexModal>
        <ModalTitle>Woop! You won!</ModalTitle>
        <ModalText style={{ marginTop: "20px" }}>Enjoy your reward</ModalText>
        <SmallPrimaryButton
          style={{ marginTop: "20px" }}
          onClick={closingButton}
        >
          Close
        </SmallPrimaryButton>
      </FlexModal>
    </Modal>
  );
}

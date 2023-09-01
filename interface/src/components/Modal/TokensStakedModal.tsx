import Modal from ".";
import { FlexModal, ModalText, ModalTitle } from "./ModalComponents";
import { SmallPrimaryButton } from "../Button";

interface TokensStakedProps {
  isModalOpen: boolean;
  closingFunction: () => void;
  closingButton: () => Promise<void>;
}

export default function TokensStakedModal({
  isModalOpen,
  closingFunction,
  closingButton,
}: TokensStakedProps) {
  return (
    <Modal isModalOpen={isModalOpen} closingFunction={closingFunction}>
      <FlexModal>
        <ModalTitle>Tokens staked</ModalTitle>
        <ModalText style={{ marginTop: "20px" }}>
          15 minutes minimum before destaking
        </ModalText>
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

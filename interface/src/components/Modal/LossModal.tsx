import Modal from ".";
import { FlexModal, ModalText, ModalTitle } from "./ModalComponents";
import { SmallPrimaryButton } from "../Button";

interface TokensStakedProps {
  isModalOpen: boolean;
  closingFunction: () => void;
  closingButton: () => Promise<void>;
}

export default function LossModal({
  isModalOpen,
  closingFunction,
  closingButton,
}: TokensStakedProps) {
  return (
    <Modal isModalOpen={isModalOpen} closingFunction={closingFunction}>
      <FlexModal>
        <ModalTitle>So bad, you lost!</ModalTitle>
        <ModalText style={{ marginTop: "20px" }}>
          Maybe luckier next time
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

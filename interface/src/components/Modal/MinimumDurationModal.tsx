import Modal from ".";
import { FlexModal, ModalText, ModalTitle } from "./ModalComponents";
import { SmallPrimaryButton } from "../Button";

interface MinimumDurationProps {
  isModalOpen: boolean;
  closingFunction: () => void;
  closingButton: () => Promise<void>;
  elapsedTimeData: bigint;
}

export default function MinimumDurationModal({
  isModalOpen,
  closingFunction,
  closingButton,
  elapsedTimeData,
}: MinimumDurationProps) {
  return (
    <Modal isModalOpen={isModalOpen} closingFunction={closingFunction}>
      <FlexModal>
        <ModalTitle>Wait a bit more</ModalTitle>
        <ModalText style={{ marginTop: "20px" }}>
          15 minutes minimum before destaking
        </ModalText>
        <ModalText>
          {Math.round(15 - Number(elapsedTimeData) / 60)}min remaining
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

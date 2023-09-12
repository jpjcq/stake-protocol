import styled from "styled-components";
import { FlexCenter } from "../Utils/Flex";
import { Text4XL, TextM } from "../../theme/texts";

export const FlexModal = styled(FlexCenter)`
  flex-direction: column;
  padding: 20px 50px;
`;

export const ModalTitle = styled(Text4XL)`
  font-weight: 900;
  color: ${({ theme }) => theme.colors.secondaryFont};
`;

export const ModalText = styled(TextM)`
  color: ${({ theme }) => theme.colors.secondaryFont};
`;

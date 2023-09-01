import styled, { useTheme } from "styled-components";
import { SyncLoader } from "react-spinners";
import { ThemeType } from "../../theme";

export const PrimaryButton = styled.button`
  width: fit-content;
  background-color: ${({ theme }) => theme.color.brick50};
  color: ${({ theme }) => theme.color.cream50};
  font-weight: 700;
  padding: 18px 77px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: none;
  cursor: pointer;
  transition: 0.125s scale ease-in-out;
  &:hover {
    scale: 1.025;
    transition: 0.125s scale ease-in-out;
  }
`;

export const SmallPrimaryButton = styled.button`
  width: fit-content;
  background-color: ${({ theme }) => theme.color.brick50};
  color: ${({ theme }) => theme.color.cream50};
  font-weight: 700;
  padding: 9px 30px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: none;
  cursor: pointer;
  transition: 0.125s scale ease-in-out;
  &:hover {
    scale: 1.025;
    transition: 0.125s scale ease-in-out;
  }
`;

export const SecondaryButton = styled.button`
  background-color: #ded6b6;
  color: ${({ theme }) => theme.color.olive300};
  font-weight: 700;
  padding: 18px 45px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: none;
  cursor: pointer;
  transition: 0.125s scale ease-in-out;
  &:hover {
    scale: 1.025;
    transition: 0.125s scale ease-in-out;
  }
`;

export function LoadingButton() {
  const theme = useTheme() as ThemeType;
  return (
    <PrimaryButton>
      <SyncLoader color={theme.color.brick500} size={5} />
    </PrimaryButton>
  );
}

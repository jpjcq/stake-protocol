import styled from "styled-components";

export const Input = styled.input<{ isInputValid?: boolean }>`
  width: 100%;
  height: 50px;
  padding: 0 20px;
  text-align: center;
  color: ${({ theme }) => theme.color.brick500};
  font-size: 20px;
  font-weight: 700;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: none;
  &:focus {
    outline-color: ${({ theme }) => theme.color.brick50};
    outline-color: ${(props) =>
      props.isInputValid
        ? props.theme.color.validationGreen100
        : props.theme.color.validationRed100};
  }
`;

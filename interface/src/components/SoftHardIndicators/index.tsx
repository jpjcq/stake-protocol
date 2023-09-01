import styled from "styled-components";

export const SoftPoolIndicator = styled.div`
  width: 160px;
  color: ${({ theme }) => theme.color.validationGreen100};
  background-color: ${({ theme }) => theme.color.validationGreen50};
  font-size: 16px;
  font-weight: 700;
  padding: 10px 35px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  white-space: nowrap;
  justify-self: center;
`;

export const HardPoolIndicator = styled.div`
  width: 160px;
  color: ${({ theme }) => theme.color.validationRed100};
  background-color: ${({ theme }) => theme.color.validationRed50};
  font-size: 16px;
  font-weight: 700;
  padding: 10px 35px;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  white-space: nowrap;
  justify-self: center;
`;

import styled from "styled-components";

export const Box = styled.div`
  border: 1px solid ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.lightBackground};;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

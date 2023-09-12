import styled from "styled-components";

export const GradientBackground = styled.div`
  background: ${({ theme }) => theme.colors.background};
  position: fixed;
  z-index: -1;
  inset: 0;
`;

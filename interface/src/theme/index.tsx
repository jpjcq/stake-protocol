import { ReactNode } from "react";
import {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
} from "styled-components";
import { color, colors } from "./color";
import boxShadow from "./boxShadow";
import borderRadius from "./borderRadius";

const BREAKPOINT = {
  mobileS: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
  laptopL: 1440,
  desktop: 1920,
};

const baseTheme = { boxShadow, borderRadius, BREAKPOINT };

const theme = {
  ...baseTheme,
  color,
  colors,
};

export type ThemeType = typeof theme;

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <StyledComponentsThemeProvider theme={theme}>
      {children}
    </StyledComponentsThemeProvider>
  );
}

export const GlobalStyles = createGlobalStyle`
  html body {
    font-family: Poppins, sans-serif;
    margin: 0 !important;
    background: ${({ theme }) => (theme as ThemeType).colors.background};
  }
  html body .text-logo {
    font-family: Permanent Marker, cursive;
  }
`;

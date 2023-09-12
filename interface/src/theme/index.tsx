import { ReactNode } from "react";
import {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
} from "styled-components";
import { color, colors } from "./color";
import boxShadow from "./boxShadow";
import borderRadius from "./borderRadius";

const BREAKPOINT = {
  xs: 396,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  xxxl: 1920,
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
  }
  html body .text-logo {
    font-family: Permanent Marker, cursive;
  }
`;

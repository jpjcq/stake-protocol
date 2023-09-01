import { Text, TextProps } from "rebass";

import styled from "styled-components";

const TextWrapper = styled(Text).withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: keyof string }>`
  color: ${({ color, theme }) => theme[color]};
`;

export function TextXS(props: TextProps) {
  return <TextWrapper fontSize={12} {...props} />;
}

export function TextS(props: TextProps) {
  return <TextWrapper fontSize={14} {...props} />;
}

export function TextM(props: TextProps) {
  return <TextWrapper fontSize={16} {...props} />;
}

export function TextL(props: TextProps) {
  return <TextWrapper fontSize={18} {...props} />;
}

export function TextXL(props: TextProps) {
  return <TextWrapper fontSize={20} {...props} />;
}

export function Text2XL(props: TextProps) {
  return <TextWrapper fontSize={24} {...props} />;
}

export function Text3XL(props: TextProps) {
  return <TextWrapper fontSize={30} {...props} />;
}

export function Text4XL(props: TextProps) {
  return <TextWrapper fontSize={36} {...props} />;
}

export function Text5XL(props: TextProps) {
  return <TextWrapper fontSize={48} {...props} />;
}

export function Text6XL(props: TextProps) {
  return <TextWrapper fontSize={60} {...props} />;
}

export function BigInfoLabel(props: TextProps) {
  return <TextM fontWeight={700} {...props} />;
}

export function BigStat(props: TextProps) {
  return <Text5XL fontWeight={900} {...props} />;
}

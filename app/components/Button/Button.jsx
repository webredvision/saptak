"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import ButtonTheme1 from "./button-theme1.jsx";
import ButtonTheme2 from "./button-theme2.jsx";
import ButtonTheme3 from "./button-theme3.jsx";
import ButtonTheme4 from "./button-theme4.jsx";
import ButtonTheme5 from "./button-theme5.jsx";

const buttonMap = {
  theme1: ButtonTheme1,
  theme2: ButtonTheme2,
  theme3: ButtonTheme3,
  theme4: ButtonTheme4,
  theme5: ButtonTheme5,
};

export default function Button({
  text,
  onClick,
  type,
  Icon,
  className,
  link,
  disabled,
  variant
}) {
  const { theme } = useTheme();

  const ThemedButton = buttonMap[theme] || ButtonTheme1;

  return (
    <ThemedButton
      text={text}
      onClick={onClick}
      type={type}
      Icon={Icon}
      link={link}
      className={className}
      disabled={disabled}
      variant={variant}
    />
  );
}

"use client";

import { useTheme } from "@/app/ThemeProvider.js";
import ResetPasswordTheme1 from "./reset-password-theme1.jsx";
import ResetPasswordTheme2 from "./reset-password-theme2.jsx";

const ResetPasswordMap = {
  theme1: ResetPasswordTheme1,
  theme2: ResetPasswordTheme2,
};

export default function ResetPasswordClient({ status, requestId }) {
  const { theme } = useTheme();
  const ThemedResetPassword =
    ResetPasswordMap[theme] || ResetPasswordTheme1;

  return (
    <ThemedResetPassword
      status={status}
      requestId={requestId}
    />
  );
}

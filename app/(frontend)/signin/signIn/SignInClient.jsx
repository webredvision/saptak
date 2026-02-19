"use client";

import { useTheme } from "@/app/ThemeProvider";
import signinTheme1 from "./signin-theme1";
import signinTheme2 from "./signin-theme2";
import signinTheme3 from "./signin-theme3";
import signinTheme4 from "./signin-theme4";
import signinTheme5 from "./signin-theme5";

const SignInClient = () => {
  const { theme } = useTheme();
 
  const signMap = {
    theme1: signinTheme1,
    theme2: signinTheme2,
    theme3: signinTheme3,
    theme4: signinTheme4,
    theme5: signinTheme5,
  };
  const AdminLogin = signMap[theme] || signinTheme1;
  return <AdminLogin />;
};

export default SignInClient;

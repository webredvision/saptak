"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import LoginTheme1 from "./login-theme1.jsx";
import LoginTheme2 from "./login-theme2.jsx";
import LoginTheme3 from "./login-theme3.jsx";
import LoginTheme4 from "./login-theme4.jsx";
import LoginTheme5 from "./login-theme5.jsx";

const loginMap = {
    theme1: LoginTheme1,
    theme2: LoginTheme2,
    theme3: LoginTheme3,
    theme4: LoginTheme4,
    theme5: LoginTheme5,
};

export default function LoginClient({ roboUser, sitedata, login }) {
    const { theme } = useTheme();
    const ThemedLogin = loginMap[theme] || LoginTheme1;

    return <ThemedLogin roboUser={roboUser} sitedata={sitedata} login={login} />;
}

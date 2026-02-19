"use client";
import { useTheme } from "@/app/ThemeProvider.js"
import RegistrationTheme1 from "./registration-theme1.jsx";
import RegistrationTheme2 from "./registration-theme2.jsx";
import RegistrationTheme3 from "./registration-theme3.jsx";
import RegistrationTheme4 from "./registration-theme4.jsx";
import RegistrationTheme5 from "./registration-theme5.jsx";

const RegistrationMap = {
    theme1: RegistrationTheme1,
    theme2: RegistrationTheme2,
    theme3: RegistrationTheme3,
    theme4: RegistrationTheme4,
    theme5: RegistrationTheme5,
};

export default function RegistrationClient({ sitedata, login, roboUser }) {
    const { theme } = useTheme();
    const ThemedRegistration = RegistrationMap[theme] || RegistrationTheme1;

    return <ThemedRegistration sitedata={sitedata} login={login && login[0]} roboUser={roboUser} />;
}

"use client";
import { useTheme } from "@/app/ThemeProvider";
import ImportantTheme1 from "./important-theme1";
import ImportantTheme2 from "./important-theme2";
import ImportantTheme3 from "./important-theme3";
import ImportantTheme4 from "./important-theme4";
import ImportantTheme5 from "./important-theme5";

const contactMap = {
    theme1: ImportantTheme1,
    theme2: ImportantTheme2,
    theme3: ImportantTheme3,
    theme4: ImportantTheme4,
    theme5: ImportantTheme5,
};

export default function ImportantClient() {
    const { theme } = useTheme();
    const ThemedContact = contactMap[theme] || ImportantTheme1;

    return <ThemedContact />;
}

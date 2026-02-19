"use client";
import { useTheme } from "@/app/ThemeProvider.js";
import axios from "axios";
import { useEffect, useState } from "react";
import PrivacyPolicyTheme1 from "./privacy-policy-theme1.jsx";
import PrivacyPolicyTheme2 from "./privacy-policy-theme2.jsx";
import PrivacyPolicyTheme3 from "./privacy-policy-theme3.jsx";
import PrivacyPolicyTheme4 from "./privacy-policy-theme4.jsx";
import PrivacyPolicyTheme5 from "./privacy-policy-theme5.jsx";

const themeMap = {
  theme1: PrivacyPolicyTheme1,
  theme2: PrivacyPolicyTheme2,
  theme3: PrivacyPolicyTheme3,
  theme4: PrivacyPolicyTheme4,
  theme5: PrivacyPolicyTheme5,
};

export default function PrivacyClient({ sitedata }) {
  const { theme } = useTheme();
  const ThemedPrivacyPolicy = themeMap[theme] || PrivacyPolicyTheme1;
  const [privacyData, setPrivacyData] = useState("");

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/privacy-policy`
        );
        if (response.status === 200 && response.data && response.data[0]) {
          setPrivacyData(response.data[0].pvp);
        }
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      }
    };

    fetchPolicy();
  }, []);

  return <ThemedPrivacyPolicy sitedata={sitedata} privacyData={privacyData} />;
}

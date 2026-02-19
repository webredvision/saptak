"use client";

import axios from "axios";
import { useEffect, useState } from "react";

const DEFAULT_LOGO = '/images/logo.png';

export default function useLogoSrc() {
  const [logoSrc, setLogoSrc] = useState(DEFAULT_LOGO);

  const loadLogo = async () => {
    const localLogo = localStorage.getItem("custom-logo");
    if (localLogo) {
      setLogoSrc(localLogo);
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/site-logo`
      );
      // axios returns data in res.data, no need for .json()
      const backendLogo = res.data?.logoUrl;
      setLogoSrc(backendLogo || DEFAULT_LOGO);
    } catch (err) {
      console.error("Failed to load logo:", err);
      setLogoSrc(DEFAULT_LOGO);
    }
  };

  useEffect(() => {
    loadLogo();

    const handleLogoUpdate = () => {
      loadLogo();
    };

    window.addEventListener("logo-updated", handleLogoUpdate);

    return () => {
      window.removeEventListener("logo-updated", handleLogoUpdate);
    };
  }, []);

  return logoSrc;
}

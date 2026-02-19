"use client";
import React from "react";
import ServicesTheme1 from "./services-theme1";
import ServicesTheme2 from "./services-theme2";
import ServicesTheme3 from "./services-theme3";
import ServicesTheme4 from "./services-theme4";
import ServicesTheme5 from "./services-theme5";
import { useTheme } from "@/app/ThemeProvider";

const servicesMap = {
    theme1: ServicesTheme1,
    theme2: ServicesTheme2,
    theme3: ServicesTheme3,
    theme4: ServicesTheme4,
    theme5: ServicesTheme5,
};

export default function ServicesClient({ service }) {
    const { theme } = useTheme();
    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-8">
                <div>
                    <h1 className="font-bold mb-4">Service Not Found</h1>
                    <p className="text-[var(--rv-gray-dark)]">
                        The service you’re looking for doesn’t exist or is currently unavailable.
                    </p>
                </div>
            </div>
        );
    }

    const ThemedService = servicesMap[theme] || ServicesTheme1;
    return <ThemedService data={service} />;
}

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
 
import RiskProfile from "@/app/components/Riskprofile/RiskProfile";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const RiskProfilePage = () => {
    const [isDark, setIsDark] = useState(false);
    const [roboUser, setRoboUser] = useState(null);
    const [sitedata, setSitedata] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [roboRes, siteRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo`),
                    axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`)
                ]);
                if (roboRes.data.success) setRoboUser(roboRes.data.data);
                if (siteRes.status === 200) setSitedata(siteRes.data[0]);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };
        fetchInitialData();
    }, []);

    return (
        <div className={isDark ? "" : "bg-[var(--rv-bg-white)]"}>
            <InnerPage title="Risk Profile" />
            <RiskProfile roboUser={roboUser} sitedata={sitedata} isDark={isDark} />
        </div>
    );
};

export default RiskProfilePage;

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
 
import Loader from "@/app/(admin)/admin/common/Loader";

const AdminServices = () => {
    const [services, setServices] = useState([]); // all versions + services
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]); // track selected services
    const [selectedVersion, setSelectedVersion] = useState(""); // selected version slug
    const [savedServices, setSavedServices] = useState([]);
    const [saving, setSaving] = useState(false);
    const fetchSaved = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services?version=${selectedVersion}`);
        setSavedServices(res.data.data || []);
    };
    useEffect(() => {
        if (selectedVersion) fetchSaved();
    }, [selectedVersion]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/services`);
                setServices(res.data || []);

                if (res.data && res.data.length > 0) {
                    setSelectedVersion(res.data[0].slug);
                }
                const saved = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services`);
                if (!saved.data.data.length && res.data.length) {
                    await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services`, {
                        version: res.data[0].slug,
                        services: selected,
                    });
                    const reSaved = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services`);
                    setSelected(saved.data.data.filter(s => s.status).map(s => s.superServiceId.toString()));
                } else {
                    const versionToUse = saved.data.data[0]?.versionSlug || (res.data.length > 0 ? res.data[0].slug : "");
                    setSelectedVersion(versionToUse);
                    setSelected(saved.data.data.filter(s => s.status).map(s => s.superServiceId.toString()));
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch services");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const toggleService = (srvId) => {
        setSelected((prev) => {
            if (prev.includes(srvId)) {
                return prev.filter((id) => id !== srvId);
            } else {
                return [...prev, srvId];
            }
        });
    };

    const currentVersion = services.find((v) => v.slug === selectedVersion) || null;

    return (
        < div>
            <ToastContainer />
            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold ">Select Services</h2>

                 {loading && services.length === 0 ? (
                    <Loader />
                ) : (
                    <>
                        <div className="">
                            <label className="block mb-2 font-medium text-[var(--rv-black-dark)]">
                                Select Version
                            </label>
                            <select
                                value={selectedVersion}
                                onChange={(e) => setSelectedVersion(e.target.value)}
                                className="border border-[var(--rv-gray)] px-3 py-2 rounded w-full "
                            >
                                <option value="">-- Select Version --</option>
                                {services.map((version) => (
                                    <option className="text-[var(--rv-black-dark)]" key={version.slug} value={version.slug}>
                                        {version.slug}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedVersion && currentVersion && (
                            <div className="border p-4 rounded-lg bg-[var(--rv-bg-white)] border-[var(--rv-gray)] shadow-sm flex flex-col gap-5">
                                <h3 className=" font-bold text-[var(--rv-gray-dark)]">
                                    Version: <span className="text-[var(--rv-bg-primary)]">{currentVersion.slug}</span>
                                </h3>

                                <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4 w-full">
                                    {currentVersion?.services?.map((srv) => (
                                        <label
                                            key={srv._id}
                                            className={`group flex items-start gap-3 p-2 border rounded-lg cursor-pointer transition-all ${selected.includes(srv._id.toString())
                                                ? "bg-[var(--rv-bg-blue-light)] border-[var(--rv-bg-primary)]"
                                                : "bg-[var(--rv-bg-white)] border-[var(--rv-gray)]"
                                                }`}
                                        >
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selected.includes(srv._id.toString())}
                                                    onChange={() => toggleService(srv._id)}
                                                    className="peer hidden"
                                                    id={`chk-${srv._id}`}
                                                />
                                                <span className="h-5 w-5 flex items-center justify-center border-2 border-[var(--rv-gray)] rounded-md peer-checked:bg-[var(--rv-bg-primary)] peer-checked:border-[var(--rv-bg-primary)] transition">
                                                    <svg
                                                        className="w-3 h-3 text-[var(--rv-white)] opacity-0 peer-checked:opacity-100 transition"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                            </div>

                                            <span className="font-medium text-[var(--rv-gray-dark)] leading-snug    line-clamp-1">
                                                {srv.name}
                                            </span>
                                        </label>

                                    ))}
                                </div>

                                <div className="flex items-start w-full">
                                    <button
                                        className="px-6 py-2 bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-primary)] text-[var(--rv-white)] font-semibold rounded-lg shadow transition disabled:opacity-50 flex items-center gap-2"
                                        onClick={async () => {
                                            try {
                                                setSaving(true); // ✅ start loading
                                                const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services`, {
                                                    version: selectedVersion,
                                                    services: selected,
                                                });
                                                if (res.status === 200) {
                                                    await fetchSaved(selectedVersion);
                                                    toast.success("Services saved to admin project!");
                                                }
                                            } catch (error) {
                                                console.error(error);
                                                toast.error("Failed to save services");
                                            } finally {
                                                setSaving(false); // ✅ stop loading
                                            }
                                        }}
                                        disabled={!selectedVersion || selected.length === 0 || saving}
                                    >
                                        {saving ? (
                                            <>
                                                 <FaSpinner className="animate-spin h-4 w-4 mr-2" /> Saving...
                                            </>
                                        ) : (
                                            "Save Selection"
                                        )}
                                    </button>
                                </div>

                            </div>
                        )}
                    </>
                )}
                {/* <div className="border p-2 px-4 rounded-lg bg-[var(--rv-bg-white)] border-[var(--rv-gray)] shadow-sm flex flex-col gap-5">
                    <ServicesTable1 services={savedServices} onDelete={() => fetchSaved(selectedVersion)} />
                </div> */}
            </div>
        </ div>
    );
};

export default AdminServices;

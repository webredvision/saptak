"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import Image from "next/image";
import Loader from "@/app/(admin)/admin/common/Loader";
import { IoMdAdd } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AdminServices = () => {
    const { id, slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [savedServices, setSavedServices] = useState([]);
    const [saving, setSaving] = useState({});
    const fetchSaved = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services/${id}?version=${slug}`);
            setSavedServices(res.data.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, []);

    const handleEditField = (srvIdx, field, value) => {
        setSavedServices((prev) => {
            const updated = [...prev];
            updated[srvIdx] = { ...updated[srvIdx], [field]: value };
            return updated;
        });
    };

    const handleNestedEditField = (srvIdx, key, idx, field, value) => {
        setSavedServices((prev) => {
            const updated = [...prev];
            const nested = [...(updated[srvIdx][key] || [])];
            nested[idx] = { ...nested[idx], [field]: value };
            updated[srvIdx] = { ...updated[srvIdx], [key]: nested };
            return updated;
        });
    };

    const appendIcon = (formData, key, icon) => {
        if (!icon) return;

        if (icon instanceof File) {
            formData.append(key, icon);
        } else if (typeof icon === "object" && (icon.public_id || icon.url)) {
            formData.append(key, icon.public_id || icon.url);
        } else if (typeof icon === "string") {
            formData.append(key, icon);
        } else {
            formData.append(key, "");
        }
    };

    const saveService = async (serviceId, serviceData) => {
        try {
            setSaving((prev) => ({ ...prev, [serviceId]: true }));

            const formData = new FormData();
            formData.append("serviceId", serviceId);
            formData.append("name", serviceData.name || "");
            formData.append("description", serviceData.description || "");
            formData.append("metaTitle", serviceData.metaTitle || "");
            formData.append("metaDescription", serviceData.metaDescription || "");
            formData.append("metaKeywords", serviceData.metaKeywords || "");

            appendIcon(formData, "icon", serviceData.icon);
            appendIcon(formData, "image", serviceData.image);

            serviceData.features?.forEach((feat, fIdx) => {
                formData.append(`features[${fIdx}][title]`, feat.title || "");
                formData.append(`features[${fIdx}][description]`, feat.description || "");
                appendIcon(formData, `features[${fIdx}][icon]`, feat.icon);
            });

            serviceData.benefits?.forEach((ben, bIdx) => {
                formData.append(`benefits[${bIdx}][title]`, ben.title || "");
                formData.append(`benefits[${bIdx}][description]`, ben.description || "");
                appendIcon(formData, `benefits[${bIdx}][icon]`, ben.icon);
            });

            const res = await axios.put(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services/${serviceId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                toast.success("Service updated successfully ✅");
                fetchSaved();
            } else {
                toast.error("Failed to update service ❌");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while vice ❌");
        } finally {
            setSaving((prev) => ({ ...prev, [serviceId]: false }));
        }
    };


    const handleImageUpload = (e, idx) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Please upload a JPEG, PNG, or WEBP image.",
            });
            return;
        }
        if (file.size > 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "Image too large",
                description: "Please select an image smaller than 1MB.",
            });
            return;
        }
        setSavedServices((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], image: file };
            return updated;
        });
    };

    const handleIconUpload = (e, idx) => {
        const file = e.target.files[0];
        if (!file) return;
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            toast({
                variant: "destructive",
                title: "Invalid file type",
                description: "Please upload a JPEG, PNG, or WEBP icon.",
            });
            return;
        }
        if (file.size > 500 * 1024) {
            toast({
                variant: "destructive",
                title: "Icon too large",
                description: "Please select an icon smaller than 500KB.",
            });
            return;
        }
        setSavedServices((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], icon: file };
            return updated;
        });
    };

    if (loading) return <Loader />;

    return (
        <div>
            <ToastContainer />
            <div className="flex flex-col gap-5">
                <h6 className="font-semibold">Saved Services (Editable)</h6>
                <div className="grid grid-cols-1 gap-6 w-full">
                    {savedServices.map((srv, idx) => (
                        <div key={srv._id} className="flex flex-col gap-5 items-start w-full">

                            <div className="bg-[var(--rv-bg-white)] p-4 rounded-md w-full">
                                <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                    Service Name
                                </label>
                                <input
                                    type="text"
                                    value={srv.name}
                                    onChange={(e) => handleEditField(idx, "name", e.target.value)}
                                    className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                    placeholder="Service Name"
                                />

                                <label className="block mb-1  ">Service Description</label>
                                <div className="mb-2">
                                    <JoditEditor
                                        value={srv.description}
                                        onChange={(val) => handleEditField(idx, "description", val)}
                                    />
                                </div>

                                <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    value={srv.metaTitle || ""}
                                    onChange={(e) => handleEditField(idx, "metaTitle", e.target.value)}
                                    className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                    placeholder="Meta Title"
                                />

                                <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                    Meta Description
                                </label>
                                <textarea
                                    value={srv.metaDescription || ""}
                                    onChange={(e) =>
                                        handleEditField(idx, "metaDescription", e.target.value)
                                    }
                                    className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                    placeholder="Meta Description"
                                />

                                <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                    Meta Keywords
                                </label>
                                <textarea
                                    value={srv.metaKeywords || ""}
                                    onChange={(e) =>
                                        handleEditField(idx, "metaKeywords", e.target.value)
                                    }
                                    className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                    placeholder="Meta Description"
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="mb-2">
                                        <label className="block mb-1 font-medium">Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, idx)}
                                            className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                        />
                                        {srv.image ? (
                                            srv.image instanceof File ? (
                                                <Image
                                                    src={URL.createObjectURL(srv.image)}
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                />
                                            ) : typeof srv.image === "string" ? (
                                                <Image src={srv.image} alt="Preview" width={50} height={50} />
                                            ) : srv.image.url ? (
                                                <img
                                                    src={
                                                        srv.image.status
                                                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${srv.image.url}`
                                                            : `${process.env.NEXT_PUBLIC_DATA_API}${srv.image.url}`
                                                    }
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                    className="w-16 h-16 object-cover rounded mb-2 border border-[var(--rv-gray)]"
                                                />
                                            ) : null
                                        ) : null}
                                    </div>


                                    <div className="mb-2">
                                        <label className="block mb-1 font-medium">Icon</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleIconUpload(e, idx)}
                                            className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"

                                        />
                                        {srv.icon ? (
                                            srv.icon instanceof File ? (
                                                <Image
                                                    src={URL.createObjectURL(srv.icon)}
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                />
                                            ) : typeof srv.icon === "string" ? (
                                                <Image src={srv.icon} alt="Preview" width={50} height={50} />
                                            ) : srv.icon.url ? (
                                                <img
                                                    src={
                                                        srv.icon.status
                                                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${srv.icon.url}`
                                                            : `${process.env.NEXT_PUBLIC_DATA_API}${srv.icon.url}`
                                                    }
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                    className="w-16 h-16 object-cover rounded mb-2 border border-[var(--rv-gray)]"
                                                />
                                            ) : null
                                        ) : null}
                                    </div>
                                </div>
                            </div>


                            <div className="bg-[var(--rv-bg-white)] p-4 rounded-md w-full">
                                <h6 className="mb-4 font-semibold">Features</h6>
                                {srv.features?.map((feat, fIdx) => (
                                    <div
                                        key={feat._id || fIdx}
                                        className=" mb-4 rounded"
                                    >
                                        <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                            Feature Title
                                        </label>
                                        <input
                                            type="text"
                                            value={feat.title}
                                            onChange={(e) =>
                                                handleNestedEditField(idx, "features", fIdx, "title", e.target.value)
                                            }
                                            className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                            placeholder="Feature Title"
                                        />

                                        <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                            Feature Description
                                        </label>
                                        <div className="mb-2">
                                            <JoditEditor
                                                value={feat.description}
                                                onChange={(val) =>
                                                    handleNestedEditField(idx, "features", fIdx, "description", val)
                                                }
                                            />
                                        </div>
                                        <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                            Feature Icon
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleNestedEditField(idx, "features", fIdx, "icon", file);
                                                }
                                            }}
                                            className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                        />
                                        {feat.icon ? (
                                            feat.icon instanceof File ? (
                                                <Image
                                                    src={URL.createObjectURL(feat.icon)}
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                />
                                            ) : typeof feat.icon === "string" ? (
                                                <Image src={feat.icon} alt="Preview" width={50} height={50} />
                                            ) : feat.icon.url ? (
                                                <img
                                                    src={
                                                        feat.icon.status
                                                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${feat.icon.url}`
                                                            : `${process.env.NEXT_PUBLIC_DATA_API}${feat.icon.url}`
                                                    }
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                    className="w-16 h-16 object-cover rounded mb-2 border border-[var(--rv-gray)]"
                                                />
                                            ) : null
                                        ) : null}
                                        <button
                                            type="button"
                                            className="border border-[var(--rv-red-dark)] text-[var(--rv-red-dark)] mt-1 p-2 rounded flex items-center gap-1"
                                            onClick={() => {
                                                setSavedServices(prev => {
                                                    const updated = [...prev];
                                                    const service = updated[idx];
                                                    service.features = service.features || [];
                                                    service.features.splice(fIdx, 1);
                                                    updated[idx] = { ...service };
                                                    return updated;
                                                });
                                            }}
                                        >
                                            <IoCloseSharp /> Delete
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="border border-[var(--rv-green-dark)] text-[var(--rv-green-dark)] mt-1 p-2 rounded flex items-center gap-1"
                                    onClick={() => {
                                        setSavedServices(prev => {
                                            const updated = [...prev];
                                            const service = updated[idx];
                                            service.features = service.features || [];
                                            const last = service.features[service.features.length - 1];
                                            if (last && !last.title && !last.description && !last.icon) return updated;
                                            service.features.push({ title: "", description: "", icon: "" });
                                            updated[idx] = { ...service };
                                            return updated;
                                        });
                                    }}
                                >
                                    <IoMdAdd /> Add Feature
                                </button>
                            </div>

                            <div className="bg-[var(--rv-bg-white)] p-4 rounded-md w-full">
                                <h6 className="mb-4 font-semibold">Benefits/Types</h6>
                                {srv.benefits?.map((ben, bIdx) => (
                                    <div
                                        key={ben._id || bIdx}
                                        className="mb-4 rounded"
                                    >
                                        <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                            Benefit Title
                                        </label>
                                        <input
                                            type="text"
                                            value={ben.title}
                                            onChange={(e) =>
                                                handleNestedEditField(idx, "benefits", bIdx, "title", e.target.value)
                                            }
                                            className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                            placeholder="Benefit Title"
                                        />

                                        <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                            Benefit Description
                                        </label>
                                        <div className="mb-2">
                                            <JoditEditor
                                                value={ben.description}
                                                onChange={(val) =>
                                                    handleNestedEditField(idx, "benefits", bIdx, "description", val)
                                                }
                                            />
                                        </div>

                                        <label className="block font-medium text-[var(--rv-gray-dark)] mb-1">
                                            Benefit Icon
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleNestedEditField(idx, "benefits", bIdx, "icon", file);
                                                }
                                            }}
                                            className="w-full border border-[var(--rv-gray)] px-3 py-2 mb-2 rounded"
                                        />
                                        {ben.icon ? (
                                            ben.icon instanceof File ? (
                                                <Image
                                                    src={URL.createObjectURL(ben.icon)}
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                />
                                            ) : typeof ben.icon === "string" ? (
                                                <Image src={ben.icon} alt="Preview" width={50} height={50} />
                                            ) : ben.icon.url ? (
                                                <img
                                                    src={
                                                        ben.icon.status
                                                            ? `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${ben.icon.url}`
                                                            : `${process.env.NEXT_PUBLIC_DATA_API}${ben.icon.url}`
                                                    }
                                                    alt="Preview"
                                                    width={100}
                                                    height={100}
                                                    className="w-16 h-16 object-cover rounded mb-2 border border-[var(--rv-gray)]"
                                                />
                                            ) : null
                                        ) : null}
                                        <button
                                            type="button"
                                            className="border border-[var(--rv-red-dark)] text-[var(--rv-red-dark)] mt-1 p-2 rounded flex items-center gap-1"
                                            onClick={() => {
                                                setSavedServices(prev => {
                                                    const updated = [...prev];
                                                    const service = updated[idx];
                                                    service.benefits = service.benefits || [];
                                                    service.benefits.splice(bIdx, 1);
                                                    updated[idx] = { ...service };
                                                    return updated;
                                                });
                                            }}
                                        >
                                            <IoCloseSharp /> Delete
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="border border-[var(--rv-green-dark)] text-[var(--rv-green-dark)] mt-1 p-2 rounded flex items-center gap-1"
                                    onClick={() =>
                                        setSavedServices(prev => {
                                            const updated = [...prev];
                                            const service = updated[idx];
                                            service.benefits = service.benefits || [];
                                            const last = service.benefits[service.benefits.length - 1];
                                            if (last && !last.title && !last.description && !last.icon) return updated;
                                            service.benefits.push({ title: "", description: "", icon: "" });
                                            updated[idx] = { ...service };
                                            return updated;
                                        })
                                    }
                                >
                                    <IoMdAdd /> Add Benefit
                                </button>
                            </div>
                            <button
                                onClick={() => saveService(srv._id, srv)}
                                disabled={saving[srv._id]}
                                className="px-4 py-2 bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving[srv._id] ? (
                                    <>
                                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminServices;

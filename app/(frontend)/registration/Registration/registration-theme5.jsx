// import React, { useState } from 'react'
// import InnerPage from "@/app/components/InnerBanner/InnerPage"
// import { FaMailBulk, FaSpinner } from 'react-icons/fa'
// import Button from '@/app/components/Button/Button'
// import Heading from '@/app/components/Heading/Heading'
// import Link from 'next/link'

// const RegistrationTheme1 = () => {
//     const [loading, setLoading] = useState(false);
//     return (
//         <div>
//             <InnerPage title={"Software Registration"} />
//             <div className="flex items-center justify-center p-4">
//                 <div className="w-full max-w-7xl flex items-center justify-center main-section" >
//                     <div className="bg-[var(--rv-bg-white)] rounded-xl p-4 md:p-8 flex flex-col justify-center w-full max-w-lg border border-[var(--rv-gray)]">
//                         <div className="w-full flex flex-col gap-6">
//                             <div>
//                                 <Heading align='start' title={'Welcome Back'} heading={'Software Registration'} description={'Enter your credentials to access your account'} />
//                             </div>

//                             <div className="space-y-5">
//                                 <div>
//                                     <label className="block font-semibold text-[var(--rv-primary)] mb-2.5">
//                                         Pan No.
//                                     </label>
//                                     <div className="relative group">
//                                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
//                                             <FaMailBulk size={20} />
//                                         </div>
//                                         <input
//                                             type="text"
//                                             name="pan"
//                                             placeholder="Enter your pan"
//                                             className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-[var(--rv-white)] outline-none border-[var(--rv-gray)]"
//                                         />
//                                     </div>
//                                 </div>

//                                 <Button
//                                     disabled={loading}
//                                     className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2
//                                     ${loading
//                                             ? "bg-[var(--rv-bg-gray)] cursor-not-allowed opacity-70"
//                                             : "bg-[var(--rv-primary)] hover:bg-[var(--rv-secondary)] hover:shadow-xl text-[var(--rv-white)]"
//                                         }`}
//                                     text={loading ? (
//                                         <>
//                                             <FaSpinner className="animate-spin h-5 w-5" />
//                                             Logging in...
//                                         </>
//                                     ) : (
//                                         "Login"
//                                     )}>
//                                 </Button>
//                                 <p className="text-center">
//                                     Already registered?{" "}
//                                     <Link href="/login" className="text-[var(--rv-primary)] font-semibold">
//                                         Login here
//                                     </Link>
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default RegistrationTheme1


"use client";
import { useState, useEffect } from "react";
import SoftwareRegistration from "@/app/components/robo/software_registration/registration"
import Heading from "@/app/components/Heading/Heading";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from '../../../components/Button/Button'
import { FaIdCard, FaSpinner } from 'react-icons/fa'
import Link from 'next/link'
import * as z from "zod";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import axios from "axios";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

// ✅ PAN validation schema
const kycSchema = z.object({
    pan_number: z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN number")
        .length(10, "PAN must be 10 characters"),
});

export default function RegistrationComponent({ roboUser, sitedata, login }) {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const pan = sessionStorage.getItem("client_pan");
        if (pan) {
            setIsVerified(true);
        }
    }, []);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(kycSchema),
        defaultValues: {
            pan_number: "",
        },
    });
    const onSubmit = async (values) => {
        setLoading(true);
        setError(null);

        const formData = {
            arn_id: roboUser?.arnId,
            pan_number: values.pan_number.toUpperCase(), // ensure PAN is uppercase
        };

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/registration/get-client-name-by-pan`, formData);

            const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
            if (response.data.status === 1) {
                const { name, dob } = response.data.data;
                const encryptedName = CryptoJS.AES.encrypt(name, secretKey).toString();
                const encryptedDob = CryptoJS.AES.encrypt(dob, secretKey).toString();
                const encryptedPan = CryptoJS.AES.encrypt(formData.pan_number, secretKey).toString();

                localStorage.setItem("client_name", encryptedName);
                localStorage.setItem("client_dob", encryptedDob);
                localStorage.setItem("client_pan", encryptedPan);
                console.log(response.data.status === 1)
                if (response.data.status === 1) {
                    setIsVerified(true)
                }
            } else {
                const encryptedPanNew = CryptoJS.AES.encrypt(formData.pan_number, secretKey).toString();
                localStorage.setItem("client_pan", encryptedPanNew);
                onSuccess();
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <InnerPage title={"Software Registration"} />
            <div className="bg-[var(--rv-bg-black1)]">
                <div className="main-section">
                    {isVerified ? (
                        <SoftwareRegistration roboUser={roboUser} sitedata={sitedata} login={login} />
                    ) : (
                        <div className="flex items-center justify-center p-4">
                            <div className="w-full max-w-7xl flex items-center justify-center" >
                                <div className="bg-[var(--rv-bg-white)] rounded-xl p-4 md:p-8 flex flex-col justify-center w-full max-w-lg border border-gray-300">
                                    <div className="w-full flex flex-col gap-6">
                                        <div>
                                            <Heading align='start' title={'Welcome Back'} heading={'Software Registration'} description={'Enter your credentials to access your account'} />
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="block font-semibold text-[var(--rv-primary)] mb-2.5">
                                                            Pan No.
                                                        </label>
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                                                                <FaIdCard size={20} />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                name="pan"
                                                                {...register("pan_number")}
                                                                maxLength={10}
                                                                placeholder="Enter your PAN"
                                                                onChange={(e) => {
                                                                    e.target.value = e.target.value.toUpperCase();
                                                                }}
                                                                className="uppercase w-full pl-12 pr-4 py-3.5 rounded-xl border bg-[var(--rv-white)] outline-none border-gray-300"

                                                            />
                                                            {errors.pan_number && (
                                                                <p className="text-sm text-red-500">{errors.pan_number.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type='submit'
                                                        disabled={loading}
                                                        className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2
                                                            ${loading
                                                                ? "bg-gray-400 cursor-not-allowed opacity-70"
                                                                : "bg-[var(--rv-primary)] hover:bg-[var(--rv-secondary)] hover:shadow-xl text-[var(--rv-white)]"
                                                            }`}
                                                        text={loading ? (
                                                            <>
                                                                <FaSpinner className="animate-spin h-5 w-5" />
                                                                Loading...
                                                            </>
                                                        ) : (
                                                            "Submit"
                                                        )}>
                                                    </Button>
                                                </form>
                                            </div>
                                            <p className="text-center">
                                                Already registered?{" "}
                                                <Link href="/login" className="text-[var(--rv-primary)] font-semibold">
                                                    Login here
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

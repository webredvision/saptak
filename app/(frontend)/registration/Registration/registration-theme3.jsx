import React, { useState, useEffect } from 'react'
import InnerPage from "@/app/components/InnerBanner/InnerPage"
import { FaIdCard, FaMailBulk, FaSpinner } from 'react-icons/fa'
import Button from '@/app/components/Button/Button'
import Link from 'next/link'
import * as z from "zod";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import { zodResolver } from "@hookform/resolvers/zod";
import SoftwareRegistration from "@/app/components/robo/software_registration/registration"
import axios from "axios";

// ✅ PAN validation schema
const kycSchema = z.object({
    pan_number: z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Enter a valid PAN number")
        .length(10, "PAN must be 10 characters"),
});

const RegistrationTheme3 = ({ roboUser, sitedata, login }) => {
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
        <div>
            <InnerPage title={"Software Registration"} />
            <div className="flex items-center justify-center p-4">
                <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 main-section overflow-hidden">
                    <div className="rounded-xl lg:rounded-r-none lg:rounded-l-xl overflow-hidden ">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                    </div>

                    <div className="bg-[var(--rv-bg-white)] border rounded-xl lg:rounded-l-none lg:rounded-r-xl  p-5 lg:p-10 flex flex-col gap-5 justify-center">
                        {isVerified ? (
                            <SoftwareRegistration roboUser={roboUser} sitedata={sitedata} login={login}/>
                        ) : (
                            <div className="w-full flex flex-col gap-6">
                                <div>
                                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--rv-primary)] text-[var(--rv-white)] rounded-full font-semibold mb-5 shadow-lg">
                                        <span className="w-2.5 h-2.5 bg-[var(--rv-bg-white)] rounded-full animate-pulse"></span>
                                        Welcome Back
                                    </span>
                                    <h6 className="font-bold mb-2 text-[var(--rv-primary)]">Software Registration</h6>
                                    <p className="">Enter your credentials to access your account</p>
                                </div>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="space-y-5">
                                        <div>
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
                                            type={'submit'}
                                            disabled={loading}
                                            className={`py-3 w-full
                                            ${loading
                                                    ? "bg-[var(--rv-bg-gray)] cursor-not-allowed opacity-70"
                                                    : ""
                                                }`}
                                            text={loading ? (
                                                <>
                                                    <FaSpinner className="animate-spin h-5 w-5" />
                                                    Logging in...
                                                </>
                                            ) : (
                                                "Register Now"
                                            )}>
                                        </Button>
                                        <p className="text-center">
                                            Already registered?{" "}

                                            <Link href="/login" className="text-[var(--rv-primary)] font-semibold">
                                                Login here
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegistrationTheme3

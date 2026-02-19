"use client";
import { useState, useEffect, forwardRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CryptoJS from "crypto-js";
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/lib/fullSchema"; // path as per your project
import { Popover } from "@/app/components/ui/popover";
import Button from '../../../components/Button/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser } from "react-icons/fa6";
import Heading from '../../../components/Heading/Heading'
import Link from "next/link";
import { FaIdCard, FaMailBulk } from "react-icons/fa";
import { MdCall } from "react-icons/md";


const Registration = ({ roboUser, sitedata, login, dark }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [otpSend, setOtpSend] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showBSEPopup, setShowBSEPopup] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [provider, setProvider] = useState({ username: "", password: "" });
  const [timer, setTimer] = useState(120) // 2 minutes in seconds
  const [resendEnabled, setResendEnabled] = useState(false);
  const [desk, setDesk] = useState(login?.name || login?.loginitems[0].login_desk); // IFA ya ARN

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email_id: "",
      mobile_number: "",
      pan_number: "",
      dob: undefined,
      otp: "",
      arn_no: "",
      pcode: [],
      amount: [],
    },
  });


  useEffect(() => {
    try {
      const storedData = localStorage.getItem("investmentData");
      if (storedData) {
        const parsed = JSON.parse(storedData);

        // make sure funds exist before mapping
        if (Array.isArray(parsed.funds)) {
          const pcodeArray = parsed.funds.map((f) => f.pcode);
          const amountArray = parsed.funds.map((f) => f.allocationAmount);

          setProvider((prev) => ({
            ...prev,
            arn_no: parsed.arnnumber || roboUser?.arnNumber || "",
            pcode: pcodeArray,
            amount: amountArray,
          }));
        }
      }
    } catch (error) {
      console.error("Error parsing investmentData from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    try {
      const encryptedName = localStorage.getItem("client_name");
      const encryptedPan = localStorage.getItem("client_pan");
      const encryptedDob = localStorage.getItem("client_dob");
      if (encryptedName && encryptedPan && encryptedDob) {
        const name = CryptoJS.AES.decrypt(encryptedName, secretKey).toString(CryptoJS.enc.Utf8);
        const pan = CryptoJS.AES.decrypt(encryptedPan, secretKey).toString(CryptoJS.enc.Utf8);
        const dobStr = CryptoJS.AES.decrypt(encryptedDob, secretKey).toString(CryptoJS.enc.Utf8);

        // ✅ Parse DOB string to Date object
        const parsedDob = new Date(dobStr);
        const isValidDate = !isNaN(parsedDob);
        setValue("name", name);
        setValue("pan_number", pan);
        if (isValidDate) {
          setValue("dob", parsedDob);
        }
      }
      else if (encryptedPan) {
        const panNew = CryptoJS.AES.decrypt(encryptedPan, secretKey).toString(CryptoJS.enc.Utf8);
        setValue("pan_number", panNew)
      }
    } catch (error) {
      console.error("Decryption error:", error);
    }
  }, [setValue]);

  useEffect(() => {
    if (timer <= 0) {
      setResendEnabled(true)
      return
    }

    setResendEnabled(false)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setResendEnabled(true) // enable button when timer ends
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("client_name") // remove when page closes or reloads
      localStorage.removeItem("client_dob") // remove when page closes or reloads
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      localStorage.removeItem("client_name") // remove when component unmounts (navigation)
      localStorage.removeItem("client_dob") // remove when component unmounts (navigation)
    }
  }, [])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const onGenerateOtp = async (data, isResend = false) => {
    if (isResend) setLoadingResend(true);
    else setLoadingGenerate(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/registration/check-account`, {
        ...data, arn_id: roboUser.arnId, arn_no: roboUser.arnNumber,
      });
      console.log(res?.data?.msg)
      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
      const encryptedUser = CryptoJS.AES.encrypt(res.data.userName, secretKey).toString();
      const encryptedPass = CryptoJS.AES.encrypt(res.data.Password, secretKey).toString();

      localStorage.setItem("client_user", encryptedUser);
      localStorage.setItem("client_pass", encryptedPass);

      const msg = res.data?.msg || "";
      if (msg.includes("account is already created")) {
        setShowBSEPopup(true);
        setSuccessText("It seems that your account is already created. Credential shared on your registered email and mobile number.");
      } else if (msg.includes("OTP sent") && res.data.status) {
        setShowOtpModal(true)
        setOtpSend(true);
        toast.success(msg);
      } else if (msg.includes("This Email ID is already registered")) {
        setSuccessText("It seems that your account is already created. Credential shared on your registered email and mobile number.");
        toast.warn(msg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isResend) setLoadingResend(false);
      else setLoadingGenerate(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setLoadingVerify(true);
    setErrorMessage(""); // Clear any previous error
    // close modal after success
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo/registration/verify-o-t-p`, {
        arnId: roboUser.arnId,
        // arn_no: roboUser.arnNumber,
        // arnId: data.arn_id,
        name: data.name,
        emailId: data.email_id,
        mobileNumber: data.mobile_number,
        panNumber: data.pan_number,
        dob: data.dob?.toISOString().split("T")[0],
        otpNumber: data.otp,
        source: 'WebRobo',
      });
      console.log(data)
      const msg = res.data?.msg || "";
      const apiResponse = res.data;
      const softwareData = {
        username: apiResponse.username,
        password: apiResponse.password,
        loginFor: 'CLIENT',
        callbackUrl: sitedata?.callbackurl,
        siteUrl: "",
        pcode: provider.pcode || [],
        amount: provider.amount || [],
        arn_no: provider.arn_no || "",
      };
      if (apiResponse.status === false && msg.includes("This is Wrong OTP or OTP not Verified")) {
        setErrorMessage(msg);
        setLoadingVerify(false)
        setShowOtpModal(true)
      }
      if (msg.includes("Login Credentials sent")) {
        const endpoint =
          desk === "ARN"
            ? "/api/login/arn-login"
            : "/api/login/ifa-login";
        const res = await axios.post(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${endpoint}`, softwareData);
        if (res.data.status === true) {
          setProvider((prev) => ({ ...prev, username: "", password: "" }));
          router.push(`${res.data.url}`);
          setShowOtpModal(false)
        } else {
          alert(res.data.msg);
        }
      } else {
        setErrorMessage(msg);
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setErrorMessage("Something went wrong. Please try again later.");
      setShowOtpModal(false)
    }
    finally {
      setLoadingVerify(false)
    }
  };

  // Resend OTP button click
  const handleResendOtp = () => {
    const formData = getValues() // get existing form values
    onGenerateOtp(formData, true) // call the same function as resend
    setTimer(120)             // reset timer to 2 minutes
    setResendEnabled(false)   // disable resend button
  }

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <div
        onClick={onClick} // must call this to open calendar
        ref={ref}
        className={`w-[28rem] flex justify-between pl-3 pr-4 py-3.5 ${dark ? 'text-gray-800 bg-[var(--rv-secondary)]' : 'bg-[var(--rv-white)]'} rounded-xl border  outline-none border-gray-300`}
      >
        <CalendarIcon className="mr-4 h-5 w-5 text-[var(--rv-primary)]" />
        <input
          value={value}
          onChange={() => { }}
          className="flex-1 outline-none bg-transparent"
          placeholder="Select DOB"
          readOnly
        />
      </div>
    );
  });

  CustomDateInput.displayName = "CustomDateInput";
  return (
    <div className="">
      <ToastContainer />
      <div className="flex items-center justify-center">
        <div className="w-full max-w-7xl flex items-center justify-center" >
          <div className={`${!dark ? 'bg-[var(--rv-bg-white)]' : '[background:var(--rv-gradient)]'} rounded-xl p-4 md:p-8 flex flex-col justify-center w-full max-w-lg border border-gray-300`}>
            <div className="w-full flex flex-col gap-6">
              <div>
                <Heading align='start' title={'Welcome Back'} heading={'Software Registration'} description={'Enter your credentials to access your account'} variant={dark ? "light" : ""} />
              </div>

              <div className="space-y-5">
                <div>
                  <form onSubmit={handleSubmit(onGenerateOtp)} className="space-y-4">

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                        <FaUser size={20} />
                      </div>
                      <input
                        type="text"
                        name="pan"
                        {...register("name")}
                        placeholder="Enter your PAN"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${dark ? 'text-gray-800 bg-[var(--rv-bg-white)]' : 'bg-[var(--rv-white)]'} border  outline-none border-gray-300`}

                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                        <FaIdCard size={20} />
                      </div>
                      <input
                        type="text"
                        name="pan"
                        {...register("pan_number")}
                        maxLength={10}
                        // placeholder="Enter your PAN"
                        className={`uppercase w-full pl-12 pr-4 py-3.5 rounded-xl ${dark ? 'text-gray-800 bg-[var(--rv-bg-white)]' : 'bg-[var(--rv-white)]'} border  outline-none border-gray-300`}

                      />
                      {errors.pan_number && (
                        <p className="text-sm text-red-500">{errors.pan_number.message}</p>
                      )}
                    </div>

                    {/* DOB with calendar */}
                    <div className="relative group">
                      {/* <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                        <FaIdCard size={20} />
                      </div>
                      <input
                        type="date"
                        name="pan"
                        {...register("pan_number")}
                        maxLength={10}
                        // placeholder="Enter your PAN"
                        className={`placeholder-gray-800 uppercase w-full pl-12 pr-4 py-3.5 rounded-xl ${dark ? 'text-gray-800' : ''} border bg-[var(--rv-white)] outline-none border-gray-300`}
                        onChange={(date) => setValue("dob", date)}
                        selected={getValues("dob")}

                      /> */}
                      <Popover open={open} onOpenChange={setOpen}>
                        <DatePicker
                          selected={getValues("dob")}
                          onChange={(date) => setValue("dob", date)}
                          dateFormat="dd/MM/yyyy"
                          maxDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          placeholderText="Select DOB"
                          customInput={<CustomDateInput />}
                        />
                      </Popover>
                    </div>

                    {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                        <FaMailBulk size={20} />
                      </div>
                      <input
                        type="text"
                        name="pan"
                        {...register("email_id")}
                        placeholder="Enter your Email"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${dark ? 'text-gray-800 bg-[var(--rv-bg-white)]' : 'bg-[var(--rv-white)]'} border  outline-none border-gray-300`}

                      />
                      {errors.email_id && (
                        <p className="text-sm text-red-500">{errors.email_id.message}</p>
                      )}
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--rv-primary)]">
                        <MdCall size={20} />
                      </div>
                      <input
                        type="text"
                        {...register("mobile_number")}
                        maxLength={10}
                        placeholder="Enter your Mobile"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl ${dark ? 'text-gray-800 bg-[var(--rv-bg-white)]' : 'bg-[var(--rv-white)]'} border  outline-none border-gray-300`}

                      />
                      {errors.mobile_number && (
                        <p className="text-sm text-red-500">{errors.mobile_number.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className={`btn btn-primary mx-auto`}
                      disabled={loadingGenerate}
                      text={loadingGenerate ? "Sending OTP..." : "Generate OTP"}
                    >
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
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal} className={`${dark ? "bg-[var(--rv-secondary)]" : "bg-white"}`}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`${dark ? "bg-[var(--rv-secondary)]" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              Please enter the one-time password sent to your registered mobile number.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-4">
            <input {...register("otp")} placeholder="Enter OTP" className="w-full px-3 py-3.5 rounded-xl border bg-[var(--rv-white)] outline-none border-gray-300" />
            {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

            <p className="text-sm text-gray-500">
              {resendEnabled ? "You can resend OTP now." : `Resend OTP in ${formatTime(timer)}`}
            </p>

            <Button
              type="button"
              onClick={handleResendOtp}
              className={'w-full'}
              disabled={!resendEnabled || loadingResend}
              text={loadingResend ? "Resending..." : "Resend OTP"}
            >
            </Button>

            <DialogFooter>
              <Button
                type="submit" className={'w-full'} disabled={loadingVerify}
                text={loadingVerify ? "Verifying..." : "Verify OTP"}
              >
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Modal for BSE Redirect */}
      <Dialog open={showBSEPopup} onOpenChange={setShowBSEPopup} className={`${dark ? "bg-[var(--rv-secondary)]" : "bg-white"}`}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className={`${dark ? "bg-[var(--rv-secondary)]" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle>Notice</DialogTitle>
          </DialogHeader>
          Dear user, {successText} Please proceed to Login to your account.
          <DialogDescription>
            Important information regarding your login process.
          </DialogDescription>
          <DialogFooter>
            <Button className={'mx-auto'} onClick={() => router.push("/login")} text={'Proceed'}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Registration;

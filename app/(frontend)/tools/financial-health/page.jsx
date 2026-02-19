"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { ArrowLeft, Check, Cross, X } from "lucide-react";
import WelcomeSection from "@/app/components/FinancialHealth/WelcomeSection";
import InquirySection from "@/app/components/FinancialHealth/InquirySection";
import TopSuggestedFund from "@/app/components/topSuggestedFuns";

import { toast } from "react-toastify";
import Button from "@/app/components/Button/Button";
import Heading from "@/app/components/Heading/Heading";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Skeleton } from "@/app/components/ui/skeleton";
import { motion } from "framer-motion";
import InnerPage from "@/app/components/InnerBanner/InnerPage";

const FinancialHealthPage = () => {
  const [isStart, setIsStart] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [roboUser, setRoboUser] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [status, setStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [sitedata, setSitedata] = useState([]);
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [performanceData, setPerformanceData] = useState({});
  const [userdata, setUserData] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [schemeName, setSchemeName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const generateCaptchaText = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createCaptchaSVG = (text) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="40" width="120">
            <rect width="100%" height="100%" fill="#f8d7c3"/>
            <text x="10" y="28" font-size="24" fill="#a30a00" font-family="monospace">${text}</text>
          </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const refreshCaptcha = useCallback(() => {
    const newCaptcha = generateCaptchaText();
    setCaptcha(newCaptcha);
    setCaptchaImage(createCaptchaSVG(newCaptcha));
  }, []);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  const fetchSiteData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/site-settings`,
      );
      if (res.status === 200) setSitedata(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchRoboUser = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robo`,
      );
      if (res.data.success) setRoboUser(res.data.data);
    } catch (error) {
      console.error("Error fetching Robo User:", error);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();
    fetchRoboUser();
  }, [fetchSiteData, fetchRoboUser]);

  const fetchPerformanceData = useCallback(async (categories) => {
    setIsModalOpen(true);
    setLoading(true);
    try {
      const queryString = categories
        .map((cat) => encodeURIComponent(cat))
        .join(",");
      setSchemeName(queryString);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/fund-performance/fp-data?categorySchemes=${queryString}`,
      );
      if (response.status === 200)
        setPerformanceData(response.data.data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching performance data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealth`,
      );
      if (response.status === 200) setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  const handleAnswerSelect = async (mark) => {
    setSelectedAnswer(mark);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      question: questions[currentQuestionIndex].question,
      selectedAnswerMarks: mark,
    };
    const newScore = updatedAnswers.reduce(
      (acc, a) => acc + Number(a?.selectedAnswerMarks || 0),
      0,
    );
    setAnswers(updatedAnswers);
    setScore(newScore);

    setTimeout(async () => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex >= questions.length) {
        setIsQuizCompleted(true);
        setShowResultDialog(true);
        if (userdata?.username && !hasSubmitted) {
          setLoading(true);
          try {
            await sendAllAnswersToAPI(userdata, updatedAnswers);
            setIsModalOpen(false);
            setHasSubmitted(true);
          } catch (error) {
            console.error("Error submitting answers:", error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedAnswer(
          updatedAnswers[nextQuestionIndex]?.selectedAnswerMarks ?? null,
        );
      }
    }, 300);
  };

  const handlePreviousClick = () => {
    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);
    setSelectedAnswer(answers[prevIndex]?.selectedAnswerMarks ?? null);
  };

  const sendAllAnswersToAPI = async (data, answersOverride) => {
    const finalAnswers = Array.isArray(answersOverride)
      ? answersOverride
      : answers;
    let healthprofile;
    const totalScore = finalAnswers.reduce(
      (acc, curr) => acc + curr.selectedAnswerMarks,
      0,
    );
    if (totalScore <= 3) healthprofile = "Critical";
    else if (totalScore <= 5) healthprofile = "Weak";
    else if (totalScore <= 7) healthprofile = "Border Line";
    else if (totalScore <= 9) healthprofile = "Fit";
    else healthprofile = "Excellent";

    const payload = {
      user: data,
      score: totalScore,
      answers: finalAnswers,
      healthprofile,
    };
    const emailContent = finalAnswers
      .map(
        (a) =>
          `<p><strong>Question:</strong> ${a.question}<br/><strong>Answer:</strong> ${a.selectedAnswerMarks === 1 ? "Yes" : "No"}</p>`,
      )
      .join("");

    const emaildata = {
      user: data?.username,
      to: data?.email,
      subject: "Your Financial Health Report",
      html: `<p>Dear ${data?.username}, your score is ${totalScore}.</p>${emailContent}`,
    };

    const senderdata = {
      user: data?.username,
      to: sitedata?.email,
      subject: "New Financial Health Enquiry",
      html: `<p>New entry from ${data?.username} (${data?.email}). Score: ${totalScore}.</p>${emailContent}`,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/financialhealth`,
        payload,
      );
      await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email/`,
        emaildata,
      );
      await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/email/`,
        senderdata,
      );
      toast.success("Assessment submitted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Submission failed.");
    }
  };

  // ---- Welcome Component (Moved Inside) ----

  const getResultMessage = () => {
    if (score <= 3)
      return { message: "Critical", color: "text-[var(--rv-red)]" };
    if (score <= 5)
      return { message: "Weak", color: "text-[var(--rv-yellow-dark)]" };
    if (score <= 7)
      return { message: "Border Line", color: "text-[var(--rv-yellow)]" };
    if (score <= 9) return { message: "Fit", color: "text-[var(--rv-green)]" };
    return { message: "Excellent", color: "text-[var(--rv-green)]" };
  };

  const getSuggestedFunds = () => {
    const res = getResultMessage().message;
    if (res === "Critical")
      return [
        "Liquid Fund",
        "Ultra Short Duration Fund",
        "Balanced Hybrid Fund",
      ];
    if (res === "Weak")
      return [
        "Conservative Hybrid Fund",
        "Equity Savings Fund",
        "Multi Asset Allocation Fund",
      ];
    if (res === "Border Line")
      return [
        "Aggressive Hybrid Fund",
        "Large & Mid Cap Fund",
        "Index Funds/ETFs",
      ];
    if (res === "Fit")
      return ["Flexi Cap Fund", "Mid Cap Fund", "Focused Fund"];
    return ["ELSS Fund", "International Fund", "Thematic Fund"];
  };

  useEffect(() => {
    if (isStart) fetchQuestions();
  }, [isStart, fetchQuestions]);

  useEffect(() => {
    if (isQuizCompleted) {
      const suggestedFunds = getSuggestedFunds();
      if (suggestedFunds.length > 0) fetchPerformanceData(suggestedFunds);
    }
  }, [isQuizCompleted, fetchPerformanceData]);

  useEffect(() => {
    if (isQuizCompleted && userdata?.username && !hasSubmitted) {
      setLoading(true);
      sendAllAnswersToAPI(userdata)
        .then(() => {
          setIsModalOpen(false);
          setHasSubmitted(true);
        })
        .catch((error) => console.error("Error submitting answers:", error))
        .finally(() => setLoading(false));
    }
  }, [isQuizCompleted, userdata, hasSubmitted]);

  return (
    <div>
      <InnerPage title={"Financial Health"} />
      <div className="px-4">
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <DialogContent
            className="max-w-xl p-8 bg-[var(--rv-bg-surface)] border border-[var(--rv-border)] text-center animate-in fade-in zoom-in duration-500 text-[var(--rv-text)]"
            hideClose
          >
            <DialogTitle className="sr-only">Health Check Result</DialogTitle>
            <div className="space-y-8 flex justify-center flex-col items-center">
              <div className="">
                <p className="   font-bold text-[var(--rv-text-muted)] uppercase tracking-[0.2em] mb-4">
                  Assessment Result
                </p>
                <h2
                  className={`   font-bold ${getResultMessage().color} drop-shadow-2xl`}
                >
                  {getResultMessage().message}
                </h2>
              </div>
              <p className="text-[var(--rv-text)]    leading-relaxed max-w-md font-medium">
                {getResultMessage().message === "Critical" &&
                  "Your financial health is in danger. You're exposed to risks. Start investing, even a small start today can protect your future."}
                {getResultMessage().message === "Weak" &&
                  "Your financial base is fragile. Right now, your money isn't growing. Begin with disciplined investing to build strength and security."}
                {getResultMessage().message === "Border Line" &&
                  "You've made a start, but it's not enough. With focused investing, you can reduce stress and grow more confidently."}
                {getResultMessage().message === "Fit" &&
                  "You're doing well. Keep going with smarter strategies. Long-term investing can help you grow potential wealth and give you peace of mind."}
                {getResultMessage().message === "Excellent" &&
                  "You've built a strong foundation. Now's the time to grow faster, diversify more, and build long-term potential wealth."}
              </p>
              <Button
                text="View Recommendations"
                onClick={() => setShowResultDialog(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col bg-cover w-full bg-[var(--rv-bg-page)] bg-center relative justify-center px-4">
        <div className="max-w-7xl main-section w-full mx-auto">
          <div className="bg-[var(--rv-bg-surface)] backdrop-blur-xl p-5 md:p-8 rounded-3xl shadow-2xl border border-[var(--rv-border)]  relative">
            {!isStart ? (
              <WelcomeSection onStart={() => setIsStart(true)} />
            ) : loadingQuestions ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-1/4 mx-auto rounded-full bg-[var(--rv-bg-secondary-light)]" />
                <Skeleton className="h-16 w-3/4 mx-auto rounded-2xl bg-[var(--rv-bg-secondary-light)]" />
                <div className="flex justify-center gap-6 mt-12">
                  <Skeleton className="h-20 w-48 rounded-2xl bg-[var(--rv-bg-secondary-light)]" />
                  <Skeleton className="h-20 w-48 rounded-2xl bg-[var(--rv-bg-secondary-light)]" />
                </div>
              </div>
            ) : isQuizCompleted ? (
              <div className="text-left animate-in fade-in duration-700 flex flex-col gap-10">
                {loading ? (
                  <p className="text-center text-[var(--rv-text)] animate-pulse">
                    Loading fund suggestions...
                  </p>
                ) : (
                  performanceData.length > 0 && (
                    <TopSuggestedFund
                      performanceData={performanceData}
                      schemeName={schemeName}
                      roboUser={roboUser}
                    />
                  )
                )}
                <div className="flex justify-center ">
                  <Button
                    text="Explore All Funds"
                    link="/performance/fund-performance"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-10 items-start text-[var(--rv-text)]">
                <div className="w-full flex justify-between items-center border-b border-[var(--rv-border)]">
                  <div className="flex flex-col items-start">
                    <span className="text-[var(--rv-text-muted)] font-bold uppercase tracking-[0.4em] mb-2 text-left opacity-70">
                      Question
                    </span>
                    <div className="text-3xl font-bold bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-secondary)] bg-clip-text text-transparent flex items-baseline">
                      {currentQuestionIndex + 1}
                      <span className="text-[var(--rv-text-muted)] text-base font-medium ml-2 opacity-60">
                        / {questions.length}
                      </span>
                    </div>
                  </div>
                  {currentQuestionIndex > 0 && (
                    <button
                      className="w-10 h-10 rounded-xl bg-[var(--rv-bg-secondary-light)] hover:bg-[var(--rv-bg-secondary-light)] text-[var(--rv-text)] transition-all border border-[var(--rv-border)] flex items-center justify-center group shadow-sm"
                      onClick={handlePreviousClick}
                    >
                      <ArrowLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                      />
                    </button>
                  )}
                </div>

                <div className="text-left  flex items-center">
                  <h4 className="text-xl md:text-2xl font-bold text-[var(--rv-text)] leading-tight tracking-tight opacity-90">
                    {questions[currentQuestionIndex]?.question}
                  </h4>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                  <button
                    onClick={() => handleAnswerSelect(1)}
                    variant={selectedAnswer === 1 ? "default" : "outline"}
                    className="w-fit bg-[var(--rv-bg-secondary-light)] group  hover:border-[var(--rv-bg-primary)] border border-[var(--rv-secondary-dark)] py-2 px-5 md:px-7 rounded-xl transition-all"
                  >
                    <Check
                      className="mr-2 inline border rounded-full p-1 group-hover:border-[var(--rv-bg-primary)] border-[var(--rv-secondary-dark)]"
                      size={32}
                    />{" "}
                    Yes
                  </button>
                  <button
                    variant={selectedAnswer === 0 ? "default" : "outline"}
                    onClick={() => handleAnswerSelect(0)}
                    className="w-fit bg-[var(--rv-bg-secondary-light)] group  hover:border-[var(--rv-bg-primary)] border border-[var(--rv-secondary-dark)] py-2 px-5 md:px-7 rounded-xl transition-all"
                  >
                    <X
                      className="mr-2 inline border rounded-full p-1 group-hover:border-[var(--rv-bg-primary)] border-[var(--rv-secondary-dark)]"
                      size={32}
                    />{" "}
                    No
                  </button>
                </div>

                <div className="w-full relative">
                  <div className="flex justify-between items-center mb-5 px-1">
                    <span className="font-bold text-[var(--rv-text-muted)] capitalize tracking-widest opacity-70">
                      Assessment Progress
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[var(--rv-text-muted)] uppercase tracking-[0.2em]">
                        {Math.round(
                          ((currentQuestionIndex + 1) / questions.length) * 100,
                        )}
                        %
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--rv-primary)] animate-pulse" />
                    </div>
                  </div>
                  <div className="h-3 bg-[var(--rv-bg-secondary-light)] rounded-full overflow-hidden p-0.5 border border-[var(--rv-border)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      }}
                      className="h-full bg-gradient-to-r from-[var(--rv-primary)] to-[var(--rv-secondary)] rounded-full shadow-[0_0_15px_rgba(var(--rv-secondary-rgb),0.5)]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!userdata.username && isStart ? (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] flex items-center justify-center p-4">
          <div className="bg-[var(--rv-bg-surface)] p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-lg border border-[var(--rv-border)] overflow-y-auto max-h-[90vh] text-[var(--rv-text)]">
            <InquirySection
              captcha={captcha}
              captchaImage={captchaImage}
              refreshCaptcha={refreshCaptcha}
              onSuccess={setUserData}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FinancialHealthPage;

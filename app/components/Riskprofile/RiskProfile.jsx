"use client";
import React, { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Slider } from "@/app/components/ui/slider";
import { ResultDisplay } from "@/app/components/ui/result-display";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { Toaster } from "@/app/components/ui/toaster";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MdCancel } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import Button from "@/app/components/Button/Button";
import InquirySection from "./InquirySection";
import TopSuggestedFund from "@/app/components/topSuggestedFuns";
import { motion } from 'framer-motion'

const portfolios = [
  {
    id: 11377,
    type: "Low",
    val_1: "Conservative Portfolio (Low)",
    start_range: 0,
    end_range: 20,
  },
  {
    id: 11378,
    type: "Moderate",
    val_1: "Balanced Portfolio (Moderate)",
    start_range: 21,
    end_range: 40,
  },
  {
    id: 11379,
    type: "High",
    val_1: "Aggressive Portfolio (High)",
    start_range: 41,
    end_range: 60,
  },
  {
    id: 11380,
    type: "Moderate High",
    val_1: "Moderate Aggressive (Moderate High)",
    start_range: 61,
    end_range: 80,
  },
  {
    id: 11381,
    type: "Very High",
    val_1: "Very Aggressive Portfolio (Very High)",
    start_range: 81,
    end_range: 100,
  },
];
const RiskProfile = ({ roboUser, sitedata, isDark = false }) => {
  const [isStart, setIsStart] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswerText, setSelectedAnswerText] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [captcha, setCaptcha] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [riskProfiles, setRiskProfiles] = useState([]);

  const [showAllocationCalculator, setShowAllocationCalculator] =
    useState(false);
  const [result, setResult] = useState({ message: "", color: "" });
  const [modelPortfolioId, setModelPortfolioId] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schemeName, setSchemeName] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const router = useRouter();
  // ---- Captcha Setup ----
  useEffect(() => {
    refreshCaptcha();
  }, []);

  const generateCaptchaText = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

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

  const fetchPerformanceData = useCallback(async (categories) => {
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

  // ---- Fetch Questions ----
  const fetchQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/risk-questions`,
      );
      if (response.status === 200) setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoadingQuestions(false);
    }
  }, []);
  const getResult = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/risk-questions/get-result?arnId=${roboUser.arnId}&deskType=${roboUser.deskType}`,
      );
      if (response.status === 200 && response.data.status) {
        setRiskProfiles(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching risk questions", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);
  useEffect(() => {
    if (roboUser) getResult();
  }, [roboUser]);

  // ---- Form Schema ----
  const FormSchema = z.object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),
    mobile: z.string().nonempty({ message: "Mobile number is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    message: z.string().optional(),
    captcha: z.string().optional(),
  });

  const handlePreviousClick = () => {
    if (currentQuestionIndex === 0) return;
    const prevIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(prevIndex);
    const prevAnswer = answers[prevIndex];
    setSelectedAnswer(prevAnswer?.selectedAnswerMarks || null);
    setSelectedAnswerText(prevAnswer?.selectedAnswerText || null);
  };

  // ---- Handle Select ----
  const handleAnswerSelect = (item) => {
    // show the selected state immediately
    setSelectedAnswer(item.marks);
    setSelectedAnswerText(item.text);

    // save the answer for current question
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      questionId: questions[currentQuestionIndex]?._id,
      question: questions[currentQuestionIndex]?.question,
      selectedAnswerText: item.text,
      selectedAnswerMarks: item.marks,
    };

    setAnswers(updatedAnswers);

    // update aggregated score
    const newScore = updatedAnswers.reduce(
      (acc, a) => acc + Number(a.selectedAnswerMarks || 0),
      0,
    );
    setScore(newScore);

    // auto-advance after a short delay so the user can see their selection
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setTimeout(() => {
        setCurrentQuestionIndex(nextIndex);
        const nextAnswer = updatedAnswers[nextIndex];
        setSelectedAnswer(nextAnswer?.selectedAnswerMarks || null);
        setSelectedAnswerText(nextAnswer?.selectedAnswerText || null);
      }, 150);
    } else {
      // last question: finalize
      if (!roboUser) {
        sendAllAnswersToAPI(updatedAnswers);
      }
      setIsQuizCompleted(true);
      setShowResultPopup(true);
    }
  };

  // ---- Send Data ----
  const sendAllAnswersToAPI = async (answers) => {
    const totalScore = answers.reduce(
      (acc, curr) => acc + curr.selectedAnswerMarks,
      0,
    );
    let riskprofile = "Moderate";

    if (totalScore >= 10 && totalScore < 20) riskprofile = "Conservative";
    else if (totalScore >= 20 && totalScore <= 26)
      riskprofile = "Moderately Conservative";
    else if (totalScore >= 27 && totalScore <= 33) riskprofile = "Moderate";
    else if (totalScore >= 34 && totalScore <= 39)
      riskprofile = "Moderately Aggressive";
    else if (totalScore >= 40) riskprofile = "Aggressive";

    const payload = { user: userdata, score: totalScore, answers, riskprofile };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/riskcalculator/`,
        payload,
      );
      toast.success("Your responses have been submitted!");
    } catch (error) {
      console.error(error);
      toast.error("Submission failed.");
    }
  };

  // ---- Result Message ----
  const getResultMessage = useCallback((score) => {
    const result = portfolios.find(
      (p) => score >= p.start_range && score <= p.end_range,
    );

    if (result) {
      return {
        message: result.val_1,
        type: result.type,
        color: getColorByType(result.type),
      };
    }

    return {
      message: "Invalid Score",
      type: "Unknown",
      color: "text-[var(--rv-gray)]",
    };
  }, []);

  const getModelPortfolioMap = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/risk-questions/get-model-id?arnId=${roboUser.arnId}&deskType=${roboUser.arnId}`,
      );
      if (response.status === 200 && response.data.status) {
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching model portfolio map", error);
    }
    return [];
  };

  const getModelPortfolio = async (modelPortfolioId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/open-apis/risk-questions/get-model-portfolio?arnId=${roboUser.arnId}&modelPortfolioId=${modelPortfolioId}`,
      );
      if (response.status === 200 && response.data.status) {
        setPortfolio(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching model portfolio", error);
    }
  };

  // If this is a roboUser, derive result from riskProfiles and fetch model portfolio
  useEffect(() => {
    if (!roboUser) return;

    if (riskProfiles.length > 0) {
      const matched = riskProfiles.find((profile) => {
        const start = profile.start_range ?? 0;
        const end = profile.end_range ?? 999;
        return score >= start && score <= end;
      });

      if (matched) {
        setResult({
          message: matched.val_1 || matched.type,
          color: getColorByType(matched.type),
          id: matched.id,
          type: matched.type,
        });

        getModelPortfolioMap().then((mapData) => {
          const map = mapData.find((item) => item.riskProfileId == matched.id);
          if (map) {
            setModelPortfolioId(map.modelPortfolioId);
            getModelPortfolio(map.modelPortfolioId);
          } else {
            setModelPortfolioId(null);
            setPortfolio(null);
          }
        });
      }
    }
  }, [riskProfiles, score, roboUser]);

  // If not a roboUser, derive result from the local portfolios mapping
  useEffect(() => {
    if (roboUser) return;

    const res = getResultMessage(score);
    setResult({
      message: res.message,
      color: res.color,
      type: res.type,
      id: null,
    });
    setModelPortfolioId(null);
    setPortfolio(null);
  }, [score, roboUser]);

  const getColorByType = (type) => {
    switch (type.toLowerCase()) {
      case "low":
        return "text-[var(--rv-red-dark)]";
      case "moderate":
        return "text-[var(--rv-red)]";
      case "moderate high":
        return "text-[var(--rv-yellow-dark)]";
      case "high":
        return "text-[var(--rv-green)]";
      case "very high":
        return "text-[var(--rv-green-dark)]";
      default:
        return "text-[var(--rv-gray)]";
    }
  };

  const getBgClassByType = (type) => {
    if (!type) return "bg-[var(--rv-secondary)]";
    switch (type.toLowerCase()) {
      case "low":
        return "bg-[var(--rv-bg-green)]";
      case "moderate":
        return "bg-[var(--rv-bg-yellow)]";
      case "moderate high":
        return "bg-[var(--rv-bg-yellow-dark)]";
      case "high":
        return "bg-[var(--rv-bg-red)]";
      case "very high":
        return "bg-[var(--rv-bg-red-dark)]";
      default:
        return "bg-[var(--rv-secondary)]";
    }
  };

  const getSuggestedFunds = useCallback(() => {
    switch (getResultMessage(score).message) {
      case "Conservative Portfolio (Low)":
        return [
          "Liquid Fund",
          "Ultra Short Duration Fund",
          "Balanced Hybrid Fund",
        ];
      case "Balanced Portfolio (Moderate)":
        return [
          "Conservative Hybrid Fund",
          "Equity Savings Fund",
          "Multi Asset Allocation Fund",
        ];
      case "Aggressive Portfolio (High)":
        return [
          "Aggressive Hybrid Fund",
          "Large & Mid Cap Fund",
          "Index Funds/ETFs",
        ];
      case "Moderate Aggressive (Moderate High)":
        return ["Flexi Cap Fund", "Mid Cap Fund", "Focused Fund"];
      case "Very Aggressive Portfolio (Very High)":
        return ["ELSS Fund", "International Fund", "Thematic Fund"];
      default:
        return [];
    }
  }, [score, getResultMessage]);

  useEffect(() => {
    if (isQuizCompleted) {
      const suggestedFunds = getSuggestedFunds();
      if (suggestedFunds.length > 0) fetchPerformanceData(suggestedFunds);
    }
  }, [isQuizCompleted, fetchPerformanceData, getSuggestedFunds]);

  return (
    <div>
      <Dialog open={showResultPopup} onOpenChange={setShowResultPopup}>
        <DialogContent
          className="max-w-2xl py-16 px-12 bg-[var(--rv-bg-surface)] border border-[var(--rv-border)] rounded-3xl backdrop-blur-3xl z-[10001]"
          hideClose
        >
          <DialogTitle className="sr-only">Risk Profile Result</DialogTitle>
          <div className="text-center space-y-8 flex justify-center flex-col items-center">
            <div className="">
              <p className="font-bold text-[var(--rv-text-muted)] uppercase tracking-[0.2em] mb-4">
                Assessment Result
              </p>
              <h2 className="font-bold">
                Your Score is {score} out of 100
              </h2>
            </div>
            <p className={`font-bold ${result?.color || ""}`}>
              {result?.message}
            </p>
            <p className=" font-medium leading-relaxed">
              Based on your risk profile, we have identified an investment model
              that best matches your preferences and financial goals.
            </p>
            <Button
              text="Next"
              className={"text-center "}
              onClick={() => setShowResultPopup(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-[var(--rv-bg-page)] text-[var(--rv-text)] px-4">
        <div className="main-section max-w-7xl mx-auto">
          {!roboUser && !userdata.username && (
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
          )}
          <div className="bg-[var(--rv-bg-surface)] backdrop-blur-xl p-5 md:p-8 rounded-3xl shadow-2xl border border-[var(--rv-border)]  relative">

            {loadingQuestions ? (
              <QuestionSkeleton />
            ) : isQuizCompleted ? (
              <div id="showfunds" className="animate-in fade-in duration-700">
                {loading ? (
                  <SkeletonCard />
                ) : (
                  performanceData.length > 0 && (
                    <TopSuggestedFund
                      performanceData={performanceData}
                      schemeName={schemeName}
                      roboUser={roboUser}
                    />
                  )
                )}
                <div className="flex justify-center mt-12">
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
                      className="w-12 h-12 rounded-xl bg-[var(--rv-bg-secondary-light)] hover:bg-[var(--rv-bg-secondary-light)] text-[var(--rv-text-muted)] hover:text-[var(--rv-text)] transition-all border border-[var(--rv-border)] flex items-center justify-center"
                      onClick={handlePreviousClick}
                    >
                      <ArrowLeft size={24} />
                    </button>
                  )}
                </div>
                <div className="text-left ">
                  <h4 className="font-bold text-[var(--rv-text)] leading-tight">
                    {questions[currentQuestionIndex]?.question}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {questions[currentQuestionIndex]?.answers?.map(
                    (answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(answer)}
                        variant={
                          selectedAnswer === answer.marks ? "default" : "outline"
                        }
                        className="w-fit bg-[var(--rv-bg-secondary-light)] group  hover:border-[var(--rv-bg-primary)] border border-[var(--rv-secondary-dark)] py-2 px-5 md:px-7 rounded-xl transition-all"
                      >
                        <Check
                          className="mr-2 inline border rounded-full p-1 group-hover:border-[var(--rv-bg-primary)] border-[var(--rv-secondary-dark)]"
                          size={32}
                        />{" "}
                        {answer.text}
                      </button>
                    ),
                  )}
                </div>

                <div className="w-full relative">
                  <div className="flex justify-between items-center mb-6 px-1">
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
    </div>
  );
};

export default RiskProfile;

const QuestionSkeleton = () => (
  <div className="animate-pulse space-y-8 max-w-7xl mx-auto">
    <div className="flex justify-between items-center">
      <div className="h-16 w-32 bg-[var(--rv-bg-secondary-light)] rounded-2xl" />
      <div className="h-16 w-16 bg-[var(--rv-bg-secondary-light)] rounded-2xl" />
    </div>
    <div className="h-12 bg-[var(--rv-bg-secondary-light)] rounded-xl w-3/4" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-24 bg-[var(--rv-bg-secondary-light)] rounded-2xl" />
      <div className="h-24 bg-[var(--rv-bg-secondary-light)] rounded-2xl" />
      <div className="h-24 bg-[var(--rv-bg-secondary-light)] rounded-2xl" />
      <div className="h-24 bg-[var(--rv-bg-secondary-light)] rounded-2xl" />
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="space-y-4 max-w-7xl mx-auto">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse h-20 bg-[var(--rv-bg-secondary-light)] rounded-2xl border border-[var(--rv-border)]"
      />
    ))}
  </div>
);

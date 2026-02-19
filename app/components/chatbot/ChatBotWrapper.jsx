"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaTimes, FaWhatsapp } from "react-icons/fa";

function isValidEmail(email) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(String(email || "").trim());
}

function isValidName(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return false;
  return /^[A-Za-z][A-Za-z ]+$/.test(trimmed);
}

function normalizeMobile(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function isValidMobile(value) {
  return /^\d{10}$/.test(normalizeMobile(value));
}

function normalizeWhatsappNumber(raw) {
  const digits = String(raw || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function buildWhatsappText({ name, mobile, email, address, services }) {
  const lines = [
    `*Name*: ${name}`,
    `*Phone*: ${mobile}`,
    `*E-mail*: ${email}`,
    `*City*: ${address}`,
    `*Services*: ${(services || []).join(", ")}`,
  ];
  return encodeURIComponent(lines.join("\n"));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const COPY = {
  greet: [
    "Hi! Welcome to {site}.",
    "Hello! Thanks for visiting {site}.",
    "Hey! Welcome to {site}.",
    "Hi there! Great to see you at {site}.",
    "Hello! Welcome to {site}.",
    "Hi! You’re chatting with {site}.",
    "Hello! Welcome—how can I help you today at {site}?",
    "Hi! Thanks for stopping by {site}.",
    "Hey there! Welcome to {site}. How can I help?",
    "Hello! Nice to meet you. Welcome to {site}.",
  ],
  askName: [
    "I can help you connect on WhatsApp. What's your name?",
    "I'll connect you on WhatsApp. May I know your name?",
    "Before we continue, what's your name?",
    "To get started, please share your name.",
    "May I have your name, please?",
    "Sure—what’s your full name?",
    "Let’s get started. Your name, please?",
    "Can you tell me your name to continue?",
    "Please share your name so I can proceed.",
    "What name should I use?",
  ],
  invalidName: [
    "Please enter a valid name (letters only).",
    "That does not look like a name. Please use letters only.",
    "Kindly enter your name using alphabets only.",
    "Please enter your name (only letters and spaces).",
    "Name should contain only alphabets. Please try again.",
    "Please avoid numbers/symbols in the name.",
    "That looks invalid—please type your name again.",
    "Please enter a proper name to continue.",
    "Kindly enter a valid full name.",
    "Please provide your name in letters (A–Z) only.",
  ],
  askMobile: [
    "Great. What is your 10 digit mobile number?",
    "Thanks! Please share your 10 digit mobile number.",
    "Awesome. Your 10 digit phone number?",
    "Please enter your 10 digit mobile number (India).",
    "Can you share your 10 digit contact number?",
    "What’s the best 10 digit phone number to reach you on?",
    "Please type your mobile number (10 digits).",
    "Your phone number (10 digits), please.",
    "Please share your mobile number to continue.",
    "May I have your 10 digit mobile number?",
  ],
  invalidMobile: [
    "Please enter a valid 10 digit mobile number.",
    "That phone number seems incorrect. Enter 10 digits only.",
    "Please provide a 10 digit number (no country code).",
    "Mobile number should be exactly 10 digits.",
    "Please enter 10 digits only (no spaces or symbols).",
    "That doesn’t look right—please re-enter your 10 digit number.",
    "Please enter a valid Indian mobile number (10 digits).",
    "Mobile number is required—enter 10 digits.",
    "Please try again with a correct 10 digit phone number.",
    "Invalid number format. Please enter 10 digits.",
  ],
  askEmail: [
    "Thanks. What is your email address?",
    "Great. What's your email address?",
    "Perfect. Please share your email.",
    "Please type your email address.",
    "What’s your email (for confirmation)?",
    "Can you share your email ID?",
    "Please enter your email so we can reach you.",
    "Your email address, please.",
    "Please provide your email to continue.",
    "May I know your email address?",
  ],
  invalidEmail: [
    "Please enter a valid email address.",
    "That email does not look correct. Please try again.",
    "Kindly enter a valid email (example: name@email.com).",
    "Email seems invalid—please re-check and try again.",
    "Please enter a valid email like `name@example.com`.",
    "That email format is not correct. Please type it again.",
    "Please provide a proper email address.",
    "Invalid email. Please enter a correct one.",
    "Email is required—please enter a valid email.",
    "Please avoid spaces in the email and try again.",
  ],
  askCity: [
    "Which city are you from?",
    "What city do you live in?",
    "Please tell me your city.",
    "Which city should we note for you?",
    "Please enter your city name.",
    "What’s your current city?",
    "Which city are you located in?",
    "Please share your city to continue.",
    "Your city, please.",
    "May I know your city?",
  ],
  invalidCity: [
    "Please enter your city.",
    "City is required. Please type your city name.",
    "Please enter a valid city name.",
    "City cannot be empty—please type your city.",
    "Please provide your city to continue.",
    "Kindly enter the city name.",
    "Please type your city (example: Indore).",
    "City is missing—please enter it.",
    "Please add your city name.",
    "Enter your city to proceed.",
  ],
  askServices: [
    "Select the services you are interested in:",
    "Which services can we help you with?",
    "Please choose the services you need:",
    "What are you interested in today? Select services:",
    "Please pick the services you want help with:",
    "Choose one or more services from the list:",
    "Select your preferred services to continue:",
    "Which services would you like to explore?",
    "Please select at least one service below:",
    "Pick the services you’re looking for:",
  ],
  whatsappNotConfigured: [
    "WhatsApp number is not configured.",
    "WhatsApp is not configured right now. Please try again later.",
    "WhatsApp details are missing. Please contact support.",
    "WhatsApp number is unavailable at the moment.",
    "Unable to open WhatsApp right now. Please try later.",
  ],
  selectOneService: [
    "Please select at least one service.",
    "Choose at least one service to continue.",
    "Select one or more services to proceed.",
    "Please choose at least one option from the list.",
    "Pick at least one service, then continue.",
  ],
  submitFailed: [
    "Failed to submit. Please try again.",
    "Something went wrong. Please retry in a moment.",
    "We could not submit your request. Please try again.",
    "Unable to submit right now. Please try again shortly.",
    "Oops—submission didn’t work. Please retry.",
    "Something went wrong while submitting. Please try again.",
  ],
};

function formatCopy(template, vars) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, k) =>
    vars?.[k] != null ? String(vars[k]) : `{${k}}`,
  );
}

export default function ChatBotWrapper({
  sitedata,
  services = [],
  isDark = false,
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("idle"); // idle | name | mobile | email | city | services | done

  const startedRef = useRef(false);
  const timersRef = useRef([]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const copyMemoryRef = useRef({});
  const formRef = useRef({
    name: "",
    mobile: "",
    email: "",
    address: "",
    services: [],
  });

  const serviceOptions = useMemo(() => {
    return (services || [])
      .map((service) => ({
        id: service?._id || service?.name,
        name: service?.name || "",
      }))
      .filter((service) => Boolean(service.id) && Boolean(service.name));
  }, [services]);

  const whatsappNumber = useMemo(() => {
    return normalizeWhatsappNumber(sitedata?.whatsAppNo || sitedata?.mobile);
  }, [sitedata?.whatsAppNo, sitedata?.mobile]);

  const pickCopy = (key, vars, fallback = "") => {
    const items = COPY[key] || (fallback ? [fallback] : [""]);
    if (items.length === 0) return "";

    const lastIdx = copyMemoryRef.current[key];
    let idx = Math.floor(Math.random() * items.length);
    if (items.length > 1 && idx === lastIdx) idx = (idx + 1) % items.length;
    copyMemoryRef.current[key] = idx;
    return formatCopy(items[idx], vars);
  };

  const botSay = (text, delayMs = 700) => {
    return new Promise((resolve) => {
      setBotTyping(true);
      const t = setTimeout(() => {
        setBotTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: createId(), from: "bot", type: "text", text },
        ]);
        resolve();
      }, delayMs);
      timersRef.current.push(t);
    });
  };

  const userSay = (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: createId(), from: "user", type: "text", text: trimmed },
    ]);
  };

  const resetChat = () => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
    startedRef.current = false;
    setOpen(false);
    setMessages([]);
    setInput("");
    setError("");
    setBotTyping(false);
    setSubmitting(false);
    setStep("idle");
    formRef.current = {
      name: "",
      mobile: "",
      email: "",
      address: "",
      services: [],
    };
  };

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages, botTyping]);

  useEffect(() => {
    if (!open) return;
    if (botTyping || submitting) return;
    if (step === "services" || step === "done") return;

    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [open, step, botTyping, submitting]);

  useEffect(() => {
    return () => {
      for (const t of timersRef.current) clearTimeout(t);
      timersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (startedRef.current) return;
    startedRef.current = true;

    setMessages([]);
    setError("");
    setBotTyping(false);
    setInput("");
    setSubmitting(false);
    setStep("idle");
    formRef.current = {
      name: "",
      mobile: "",
      email: "",
      address: "",
      services: [],
    };

    const greet = async () => {
      const site = sitedata?.websiteName || "our website";
      await botSay(pickCopy("greet", { site }, `Hi! Welcome to ${site}.`));
      await botSay(
        pickCopy(
          "askName",
          null,
          "I can help you connect on WhatsApp. What's your name?",
        ),
      );
      setStep("name");
    };

    greet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSend = async () => {
    if (submitting || botTyping) return;
    const trimmed = String(input || "").trim();
    if (!trimmed) return;

    setError("");
    userSay(trimmed);
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 0);

    if (step === "name") {
      if (!isValidName(trimmed)) {
        await botSay(pickCopy("invalidName"));
        return;
      }
      formRef.current.name = trimmed;
      await botSay(pickCopy("askMobile"));
      setStep("mobile");
      return;
    }

    if (step === "mobile") {
      if (!isValidMobile(trimmed)) {
        await botSay(pickCopy("invalidMobile"));
        return;
      }
      formRef.current.mobile = normalizeMobile(trimmed);
      await botSay(pickCopy("askEmail"));
      setStep("email");
      return;
    }

    if (step === "email") {
      if (!isValidEmail(trimmed)) {
        await botSay(pickCopy("invalidEmail"));
        return;
      }
      formRef.current.email = trimmed;
      await botSay(pickCopy("askCity"));
      setStep("city");
      return;
    }

    if (step === "city") {
      if (!trimmed) {
        await botSay(pickCopy("invalidCity"));
        return;
      }
      formRef.current.address = trimmed;
      await botSay(pickCopy("askServices"));
      setStep("services");
      setMessages((prev) => [
        ...prev,
        { id: createId(), from: "bot", type: "services" },
      ]);
    }
  };

  const toggleService = (serviceName) => {
    const current = formRef.current.services || [];
    formRef.current.services = current.includes(serviceName)
      ? current.filter((s) => s !== serviceName)
      : [...current, serviceName];
    setMessages((prev) => [...prev]);
  };

  const servicesSelected = () => {
    return (formRef.current.services || []).length > 0;
  };

  const submitLeadAndOpenWhatsapp = async () => {
    if (submitting || botTyping) return;

    if (!servicesSelected()) {
      setError(pickCopy("selectOneService"));
      return;
    }

    setError("");
    setSubmitting(true);
    setStep("done");

    try {
      const payload = {
        name: String(formRef.current.name || "").trim(),
        mobile: normalizeMobile(formRef.current.mobile),
        email: String(formRef.current.email || "").trim(),
        address: String(formRef.current.address || "").trim(),
        services: formRef.current.services || [],
      };

      const res = await fetch("/api/bot/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to submit (${res.status})`);
      }

      if (whatsappNumber) {
        const text = buildWhatsappText(payload);
        window.open(
          `https://wa.me/${whatsappNumber}?text=${text}`,
          "_blank",
          "noopener,noreferrer",
        );
      } else {
        setError(pickCopy("whatsappNotConfigured"));
      }
      resetChat();
    } catch (e) {
      setError(e?.message || pickCopy("submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const isMobileStep = step === "mobile";

  return (
    <>
      <style jsx>{`
        @keyframes typingPulse {
          0% {
            transform: translateY(0);
            opacity: 0.45;
          }
          50% {
            transform: translateY(-2px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0);
            opacity: 0.45;
          }
        }
      `}</style>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 bg-[var(--rv-primary)] text-[var(--rv-white)] border-none rounded-full w-[52px] h-[52px] flex items-center justify-center z-[99999] shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out cursor-pointer hover:scale-110"
        aria-label={open ? "Close WhatsApp widget" : "Open WhatsApp widget"}
      >
        <FaWhatsapp size={24} />
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-[360px] z-[99998] max-md:right-3 max-md:left-3 max-md:w-auto max-md:bottom-[86px]">
          <div className="bg-[var(--rv-bg-surface)] rounded-[20px] overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.2)] flex flex-col h-[520px] border border-[var(--rv-border)] max-md:h-[70vh] max-md:max-h-[560px] max-md:rounded-2xl">
            <div className="bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] p-[10px_16px] flex items-center justify-between border-b border-[var(--rv-border)]">
              <div className="flex items-center gap-2.5">
                <FaWhatsapp size={18} />
                <div className="text-sm font-bold leading-[1.2]">
                  {sitedata?.websiteName || "Chat Support"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetChat}
                  className="bg-transparent border-none text-[var(--rv-white)] cursor-pointer"
                  aria-label="Close"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 bg-[var(--rv-bg-surface)] overflow-y-auto"
            >
              <div className="p-3 flex flex-col gap-2.5">
                {messages.map((m) => {
                  if (m.type === "services") {
                    const selected = formRef.current.services || [];
                    return (
                      <div key={m.id} className="flex justify-start">
                        <div className="max-w-[85%] bg-[var(--rv-bg-page)] text-[var(--rv-text)] rounded-[14px_14px_14px_6px] p-[10px_12px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-sm leading-[1.35] border border-[var(--rv-border)]">
                          {serviceOptions.length === 0 ? (
                            <div className="text-[13px] text-[var(--rv-text-muted)]">
                              No services available.
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 my-2.5">
                              {serviceOptions.map((service) => (
                                <label
                                  key={service.id}
                                  className="flex items-center gap-1.5 text-[15px] cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selected.includes(service.name)}
                                    onChange={() => toggleService(service.name)}
                                  />
                                  <span>{service.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className={
                        m.from === "user"
                          ? "flex justify-end"
                          : "flex justify-start"
                      }
                    >
                      <div
                        className={
                          m.from === "user"
                            ? "max-w-[85%] bg-[var(--rv-bg-secondary-light)] text-[var(--rv-text)] rounded-[14px_14px_6px_14px] p-[10px_12px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-sm leading-[1.35] border border-[var(--rv-border)]"
                            : "max-w-[85%] bg-[var(--rv-bg-page)] text-[var(--rv-text)] rounded-[14px_14px_14px_6px] p-[10px_12px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-sm leading-[1.35] border border-[var(--rv-border)]"
                        }
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}

                {botTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] bg-[var(--rv-bg-page)] text-[var(--rv-text)] rounded-[14px_14px_14px_6px] p-[10px_12px] shadow-[0_2px_10px_rgba(0,0,0,0.06)] text-sm leading-[1.35] border border-[var(--rv-border)]">
                      <div
                        className="inline-flex gap-1 items-center py-0.5"
                        aria-label="Typing"
                      >
                        <span
                          className="w-[7px] h-[7px] rounded-full bg-[var(--rv-text-muted)]"
                          style={{
                            animation: "typingPulse 1.1s infinite ease-in-out",
                          }}
                        />
                        <span
                          className="w-[7px] h-[7px] rounded-full bg-[var(--rv-text-muted)]"
                          style={{
                            animation: "typingPulse 1.1s infinite ease-in-out",
                            animationDelay: "0.15s",
                          }}
                        />
                        <span
                          className="w-[7px] h-[7px] rounded-full bg-[var(--rv-text-muted)]"
                          style={{
                            animation: "typingPulse 1.1s infinite ease-in-out",
                            animationDelay: "0.3s",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[var(--rv-border)] bg-[var(--rv-bg-surface)] p-2.5 flex flex-col gap-2">
              {error && <div className="text-[var(--rv-red)]   ">{error}</div>}
              {step === "services" ? (
                <button
                  type="button"
                  className="w-full border-none rounded-xl px-3 py-2.5 bg-[var(--rv-primary)] text-[var(--rv-black)] cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={!servicesSelected() || submitting || botTyping}
                  onClick={async () => {
                    if (!servicesSelected()) return;
                    const chosen = formRef.current.services || [];
                    userSay(chosen.join(", "));
                    await submitLeadAndOpenWhatsapp();
                  }}
                >
                  {submitting ? "Continuing..." : "Continue"}
                </button>
              ) : (
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      const next = e.target.value;
                      if (isMobileStep) {
                        setInput(next.replace(/[^\d]/g, "").slice(0, 10));
                      } else {
                        setInput(next);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSend();
                    }}
                    placeholder={
                      step === "done"
                        ? "Opening WhatsApp..."
                        : "Type your reply..."
                    }
                    disabled={botTyping || submitting || step === "done"}
                    inputMode={isMobileStep ? "numeric" : undefined}
                    maxLength={isMobileStep ? 10 : undefined}
                    className="flex-1 border border-[var(--rv-border)] bg-[var(--rv-bg-page)] text-[var(--rv-text)] rounded-full px-3 py-2.5 text-sm outline-none placeholder:text-[var(--rv-text-muted)]"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={
                      botTyping ||
                      submitting ||
                      !input.trim() ||
                      step === "done"
                    }
                    className="border-none rounded-full px-3.5 py-2.5 bg-[var(--rv-primary)] text-[var(--rv-black)] cursor-pointer font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

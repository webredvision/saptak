"use client";
import Button from "../../../components/Button/Button";

const HeroTheme3 = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--rv-bg-white)] to-[var(--rv-bg-secondary)] text-[var(--rv-black)] px-4">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,69,245,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,69,245,.08)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 main-section-top">
        <div className="max-w-7xl mx-auto main-section flex flex-col items-center gap-14">
          <div className="flex flex-col items-center text-center gap-5 max-w-5xl mx-auto pt-10 md:pt-2">
            <div className="inline-flex items-center gap-2 border border-[var(--rv-bg-primary)] text-xs text-[var(--rv-primary)] px-2 pr-4 py-1 rounded-full font-light bg-[var(--rv-bg-white)] backdrop-blur">
              <span className="bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] px-4 py-2 rounded-full">
                Trusted
              </span>
              Helping You Invest with Confidence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[var(--rv-primary)] font-light leading-tight">
              Invest Smarter with <b>Trusted Mutual Fund Guidance</b>
            </h1>

            <p className="opacity-90 max-w-xl">
              Personalized investment solutions backed by trust, transparency, and SEBI compliance
            </p>

            <div className="flex items-center flex-wrap gap-5 z-20">
              <Button text="Book a Free Consultation" link="/login" />
            </div>
          </div>

          <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end justify-end">
            <div className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-xl flex flex-col gap-3 p-5">
              <p>
                Focused on trust, transparency, and disciplined long-term
                investing.
              </p>
              <p>
                <b>SEBI-Compliant</b> Mutual Fund Support
              </p>
              <div className="w-full h-72 rounded-xl overflow-hidden">
                <img
                  src="/images/hero-author-image.jpg"
                  className="w-full h-full object-cover"
                  alt="Mutual Fund Consultation Madurai"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-[var(--rv-bg-secondary)] to-[var(--rv-bg-secondary)] relative z-10 p-5 text-[var(--rv-white)] rounded-xl flex flex-col gap-3">
              <div className="flex flex-col gap-5">
                <h1>10,000+</h1>
                <div className="flex flex-col gap-2">
                  <h6>Investors Served</h6>
                  <p>
                    Providing simple, transparent access to mutual fund
                    investments nationwide.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 -z-10">
                <img src="/images/hero-info-item-bg.png" alt="Mutual Fund Consultation Madurai" />
              </div>
            </div>

            <div className="bg-gradient-to-b from-transparent via-transparent to-[var(--rv-bg-white)] rounded-xl flex flex-col gap-8 p-5">
              <div className="flex flex-col gap-2">
                <h6>Years of Distribution Experience</h6>
                <p>
                  Facilitating SEBI-registered mutual fund investments with
                  disciplined guidance.
                </p>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-[var(--rv-bg-secondary-dark)] to-[var(--rv-bg-secondary)]"></div>
              <div className="flex flex-col gap-2">
                <h1>1,000s</h1>
                <p>
                  Reliable support across SIPs, purchases, redemptions, and
                  service requests.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[var(--rv-bg-primary)] to-[var(--rv-bg-secondary)] text-[var(--rv-white)] rounded-xl flex flex-col gap-3 p-7">
              <b>
                Helping investors make informed decisions through compliant and
                transparent mutual fund access.
              </b>
              <div className="w-full h-72 rounded-xl overflow-hidden">
                <img
                  src="/images/hero-item-image.png"
                  className="w-full h-full object-contain"
                  alt="Mutual Fund Consultation Madurai"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTheme3;

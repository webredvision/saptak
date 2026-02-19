import Button from "@/app/components/Button/Button";

const WelcomePage = ({ onStatus }) => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center">
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--rv-secondary)]/10 border border-[var(--rv-secondary)]/20 mb-8">
        <div className="w-2 h-2 rounded-full bg-[var(--rv-secondary)] animate-pulse" />
        <span className="text-[var(--rv-secondary)]    font-bold uppercase tracking-[0.2em]">
          Intelligence Assessment
        </span>
      </div>

      <h2 className="  font-bold text-[var(--rv-black)] leading-tight mb-8">
        Check Your Financial Health
      </h2>

      <p className="text-[var(--rv-secondary)] leading-relaxed    font-medium mb-12">
        Your financial health is a reflection of how prepared you are for life's
        opportunities and challenges. A strong foundation allows you to manage
        daily expenses, save for the future, and handle emergencies with
        confidence.
        <br />
        <br />
        By assessing your health today, you gain the clarity needed to optimize
        investments, reduce stress, and build lasting security for a brighter
        tomorrow.
      </p>

      <Button
        text="Start Your Assessment Now"
        onClick={() => onStatus(true)}
        className="bg-[var(--rv-secondary)] text-[var(--rv-white)] font-bold uppercase tracking-wider rounded-2xl p-6 transition-all duration-300"
      />
    </div>
  );
};

export default WelcomePage;

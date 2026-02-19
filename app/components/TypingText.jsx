import { useEffect, useState } from "react";

const TypingText = ({ words, typingSpeed = 120, pauseTime = 1500 }) => {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[index];
        let timeout;

        if (!isDeleting && text.length < currentWord.length) {
            timeout = setTimeout(() => {
                setText(currentWord.slice(0, text.length + 1));
            }, typingSpeed);
        }
        else if (!isDeleting && text.length === currentWord.length) {
            timeout = setTimeout(() => setIsDeleting(true), pauseTime);
        }
        else if (isDeleting && text.length > 0) {
            timeout = setTimeout(() => {
                setText(currentWord.slice(0, text.length - 1));
            }, typingSpeed / 2);
        }
        else if (isDeleting && text.length === 0) {
            setIsDeleting(false);
            setIndex((prev) => (prev + 1) % words.length);
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, index, words, typingSpeed, pauseTime]);

    return (
        <span style={{
            backgroundImage:
                "var(--rv-bg-gradient)",
        }} className="relative text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight bg-clip-text text-transparent">
            {text}
            <span style={{
                backgroundImage:
                    "var(--rv-bg-gradient)",
            }} className="animate-pulse text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight bg-clip-text text-transparent"> {""}|</span>
        </span>
    );
};

export default TypingText;

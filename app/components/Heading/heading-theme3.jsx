import React from "react";

const Heading3 = ({ title, heading, description, align = "center", variant = "dark" }) => {
    const headingColor = variant === "light" ? "text-[var(--rv-black)]" : "text-[var(--rv-primary)]";
    return (
        <div className={`text-${align} flex flex-col items-${align} gap-1`}>
            {title &&
                <div className="w-fit p-2 rounded-full border flex items-center gap-2 px-4 capitalize">
                    <div className="w-2 h-2 bg-[var(--rv-bg-secondary)] rounded-full"></div>
                    <p className="font-light text-sm tracking-wider text-[var(--rv-primary)]">
                        {title}
                    </p>
                </div>
            }
            {heading &&
                <h4 className={`font-bold leading-tight ${headingColor}`}>
                    {heading}
                </h4>
            }
            {description && <p className={`text-[var(--rv-black)] opacity-80`} dangerouslySetInnerHTML={{ __html: description }} />}

        </div>
    );
};

export default Heading3;

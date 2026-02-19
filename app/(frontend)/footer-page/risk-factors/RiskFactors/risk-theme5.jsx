import React from 'react'
import InnerPage from "@/app/components/InnerBanner/InnerPage"
const RiskTheme5 = () => {
    return (
        <div className="relative bg-[var(--rv-bg-white)] text-[var(--rv-black)] z-10">
            <InnerPage title={"Risk Factor"} />
            <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
                    <div className='flex flex-col gap-3'>
                        <h5>Risk Factors Associated with Investing Through MFDs</h5>
                        <p>Risk Factors Associated with Mutual Fund Investments</p>
                        <p>Investing through mutual funds involves certain risks, and investors are advised to read all scheme-related documents carefully. Some key risks include:</p>
                        <ul>
                            <li><b>Market Risk:</b> The value of mutual fund investments may rise or fall due to changes in overall market conditions.</li>
                            <li><b>Liquidity Risk:</b> Some securities held by mutual funds may not be easily traded in the market, which can affect timely redemptions.</li>
                            <li><b>Credit Risk:</b> In debt-oriented funds, there is a risk that the issuer of a bond or instrument may default in payment of interest or principal.</li>
                            <li><b>Interest Rate Risk:</b> Debt fund values are sensitive to interest rate changes. Rising interest rates may negatively impact returns.</li>
                            <li><b>Inflation Risk: </b> Over time, inflation may reduce the real value of your investment returns.</li>
                            <li><b>Managerial Risk:</b> Fund performance depends on the decisions of the fund manager. Incorrect calls or strategy may lead to underperformance.</li>
                            <li><b>Scheme-Specific Risks:</b> Each mutual fund scheme carries unique risks. Investors are advised to read the Scheme Information Document (SID) before investing.</li>
                        </ul>
                        <p><i>“Note: Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully. Past performance is not indicative of future results. As a Mutual Fund Distributor (MFD), we offer execution-only services and do not provide investment advice. Investors are advised to assess their risk tolerance and consult with a financial advisor if needed.”
                        </i></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RiskTheme5

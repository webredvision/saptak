import React from 'react'
import InnerPage from "@/app/components/InnerBanner/InnerPage"
const TermTheme3 = () => {
    return (
        <div className="relative bg-[var(--rv-bg-white)] text-[var(--rv-black)] z-10">
            <InnerPage title={"Terms & Conditions"} />
            <div className="px-4">
        <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
                    <div className='flex flex-col gap-3'>
                        <h5>Terms &amp; Conditions</h5>
                        <p>When investing through Mutual Fund Distributors (MFDs), investors need to understand the following terms and conditions:</p>
                        <ul>
                            <li><b>Net Asset Value (NAV):</b> The value of mutual fund units is based on the applicable NAV, which fluctuates based on market conditions.</li>
                            <li><b>Commissions and Fees:</b> Distributors may receive commissions (upfront, trail, or otherwise) from Asset Management Companies (AMCs). These should be transparently disclosed to the investor.</li>
                            <li><b>Entry and Exit Loads:</b> Some mutual fund schemes may charge entry (at the time of purchase) or exit loads (at the time of redemption). Investors should be informed about these charges beforehand.</li>
                            <li><b>Execution-Only Platform:</b> MFDs may offer an execution-only platform, meaning they execute transactions without providing investment advice.</li>
                            <li><b>KYC Compliance:</b> Investors must complete the Know Your Customer (KYC) process before investing.</li>
                            <li><b>Right to Information:</b> Investors have the right to receive all relevant information about the mutual fund schemes, including scheme information documents, key information memorandums, and periodic statements.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermTheme3

import React from 'react'
import InnerPage from "@/app/components/InnerBanner/InnerPage"

const ImportantTheme3 = () => {
    return (
        <div className="relative bg-[var(--rv-bg-white)] text-[var(--rv-black)] z-10">
            <InnerPage title={"Important Links"} />
            <div className='px-4'>
                <div className="max-w-7xl mx-auto main-section flex flex-col gap-5 md:gap-8">
                    <div className='flex flex-col gap-3'>
                        <h5>Here are some essential links for investors:</h5>
                        <ul>
                            <li>Association of Mutual Funds in India (AMFI): Provides information on mutual funds, including NAVs, fund performance, and investor education. <a href="https://www.amfiindia.com/" target="_blank"><b><u>AMFI Website</u></b></a></li>
                            <li>Securities and Exchange Board of India (SEBI): The regulatory body for securities markets in India, offering guidelines, circulars, and investor protection information. <a href="https://www.sebi.gov.in/" target="_blank"><b><u>SEBI Website</u></b></a></li>
                            <li>Registrar and Transfer Agent (RTA): <a href="https://www.camsonline.com" target="_blank"><b><u>https://www.camsonline.com</u></b></a> / <a href="https://mfs.kfintech.com" target="_blank"><u><b>https://mfs.kfintech.com</b></u></a></li>

                            <li>CDSL/NSDL (Depositories): <a href="https://www.cdslindia.com" target="_blank"><u><b>https://www.cdslindia.com</b></u></a> / <a href="https://nsdl.co.in/related/wrld.php" target="_blank"><u><b>https://nsdl.co.in/related/wrld.php</b></u> </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImportantTheme3

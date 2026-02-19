import Link from 'next/link'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import { MdArrowForwardIos } from 'react-icons/md'

const InnerTheme3 = ({ title }) => {
    return (
        <section className="bg-gradient-to-b from-[var(--rv-bg-white)] to-[var(--rv-bg-secondary)] text-[var(--rv-black)]] md:p-16 px-6 py-16 w-full z-10 relative" >
            <div className='w-full main-section text-center flex items-center justify-center'>
                <div className='flex flex-col gap-2'>
                    <h3>{title}</h3>
                    <div className='flex items-center justify-center gap-2'>
                        <Link href={'/'}>
                            <div className='flex items-center gap-2'>
                                <FaHome />
                                <p className=''>Home</p>
                            </div>
                        </Link>
                        <div className='flex items-center gap-2'>
                            <MdArrowForwardIos />
                            <p className=' '>{title}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default InnerTheme3

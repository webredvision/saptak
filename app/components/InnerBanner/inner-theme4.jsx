import Link from 'next/link'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import { MdArrowForwardIos } from 'react-icons/md'

const InnerTheme4 = ({ title }) => {
    return (
        <div className="lg:px-3 lg:rounded-xl overflow-hidden">
            <section className="w-full flex items-center px-4 lg:rounded-xl overflow-hidden text-[var(--rv-white)] relative z-10  bg-gradient-to-tl from-[var(--rv-bg-secondary)] via-[var(--rv-bg-secondary)] to-[var(--rv-bg-primary)]">
                <div className='w-full md:p-28 px-6 py-20 text-center text-[var(--rv-white)] flex items-center justify-center'>
                    <div className='flex flex-col gap-2'>
                        <h1>{title}</h1>
                        <div className='flex items-center justify-center gap-2'>
                            <Link href={'/'}>
                                <div className='flex items-center gap-2'>
                                    <FaHome />
                                    <p className=' '>Home</p>
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
        </div>
    )
}

export default InnerTheme4

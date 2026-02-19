import Link from 'next/link'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import { MdArrowForwardIos } from 'react-icons/md'

const InnerTheme1 = ({ title }) => {
    return (
        <section className="bg-[var(--rv-bg-secondary)] md:p-16 px-6 py-16 w-full z-10 relative
        before:content-['']
        before:absolute before:inset-0
        before:bg-[url('/images/footer-vector.png')]
        before:bg-cover before:bg-center
        before:brightness-0 before:invert before:opacity-[0.05]
        before:-z-10" >
            <div className='w-full main-section text-center text-[var(--rv-white)] flex items-center justify-center'>
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

export default InnerTheme1

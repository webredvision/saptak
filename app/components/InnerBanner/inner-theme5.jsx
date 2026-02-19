import Link from 'next/link'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import { MdArrowForwardIos } from 'react-icons/md'

const InnerTheme5 = ({ title }) => {
  return (
    <section className='main-section-top bg-[var(--rv-bg-white)] relative overflow-hidden'>
      <div className="absolute inset-0 pointer-events-none">
        <span className="circle circle-1 bg-[var(--rv-blue)]" />
        <span className="circle circle-2 bg-[var(--rv-blue)]" />
        <span className="circle circle-3 bg-[var(--rv-pink)]" />
        <span className="circle circle-4 bg-[var(--rv-yellow)]" />
        <span className="circle circle-5 bg-[var(--rv-green)]" />
        <span className="circle circle-6 bg-[var(--rv-purple)]" />
      </div>
      <div className='w-full md:p-20 px-6 py-20 text-center text-[var(--rv-black)] flex items-center justify-center'>
        <div className='flex flex-col gap-2'>
          <h1>{title}</h1>
          <div className='flex flex-wrap items-center justify-center gap-2'>
            <Link href={'/'}>
              <div className='flex items-center gap-2'>
                <FaHome />
                <p className=' '>Home</p>
              </div>
            </Link>
            <MdArrowForwardIos />
            <div className='flex items-center gap-2'>
              <p className=' '>{title}</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .circle {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.8;
        }

        .circle-1 {
          top: 10%;
          left: 5%;
          animation: move1 28s infinite alternate;
        }

        .circle-2 {
          top: 15%;
          right: 5%;
          animation: move2 30s infinite alternate;
        }

        .circle-3 {
          bottom: 15%;
          left: 30%;
          animation: move3 26s infinite alternate;
        }

        .circle-4 {
          bottom: 10%;
          right: 25%;
          animation: move4 32s infinite alternate;
        }

        .circle-5 {
          top: 20%;
          left: 10%;
          animation: move5 28s infinite alternate;
        }

        .circle-6 {
          top: 20%;
          right: 10%;
          animation: move6 28s infinite alternate;
        }

        @keyframes move1 {
          to { transform: translate(20vw, 20vh); }
        }
        @keyframes move2 {
          to { transform: translate(-20vw, 20vh); }
        }
        @keyframes move3 {
          to { transform: translate(20vw, -20vh); }
        }
        @keyframes move4 {
          to { transform: translate(-20vw, -20vh); }
        }
        @keyframes move3 {
          to { transform: translate(20vw, 20vh); }
        }
        @keyframes move4 {
          to { transform: translate(-20vw, 20vh); }
        }
      `}</style>
    </section>
  )
}

export default InnerTheme5

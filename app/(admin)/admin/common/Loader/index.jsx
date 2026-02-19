import React from 'react'
import './loader.css'
const Loader = () => {
  return (
    <div className="fixed inset-0  bg-[var(--rv-bg-white)] flex items-center justify-center z-50 p-2">
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;

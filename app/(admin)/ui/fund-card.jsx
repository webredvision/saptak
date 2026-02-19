import React from "react";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

const FundCard = ({ logo,
  funddes,
  schemeCategory,
  schemeName,
  si,
  three_year,
  five_year,
  pcode,}) => {
      const handleSelectFunds = () => {
    if (!SECRET_KEY) {
      console.error("Missing SECRET_KEY! Please define NEXT_PUBLIC_SECRET_KEY in .env file.");
      return;
    }
    const dataToStore = {
      pcode,
      ftype: schemeName,
      timestamp: Date.now(),
    };

    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(dataToStore),
        SECRET_KEY
      ).toString();

      localStorage.setItem("encryptedFundPerormanceData", encrypted);

      window.location.href = "/performance/fund-performance/fund-details";
    } catch (error) {
      console.error("Encryption or navigation failed:", error);
    }
  };

  return (
     <>
    <tr onClick={handleSelectFunds} className="rounded-lg shadow-sm shadow-[var(--rv-primary)] hover:bg-[var(--rv-secondary)] cursor-pointer">
      <td className="w-1/3 px-2 py-3">
        <div className="flex items-center gap-6">
          <div>
            <h6 className="font-semibold ">{funddes}</h6>
            <p className=" text-[var(--rv-gray)]">{schemeCategory}</p>
          </div>
        </div>
      </td>
      <td className="w-1/5 text-center font-semibold px-2 py-3">{si}</td>
      <td className="w-1/5 text-center font-semibold px-2 py-3">{three_year || "0.00"}%</td>
      <td className="w-1/5 text-center font-semibold px-2 py-3">{five_year || "0.00"}%</td>
    </tr>
    <tr>
      <td colSpan="4" className="h-3"></td>
    </tr>
  </>
  );
  };

export default FundCard;

import FundCategoryTabs from "@/app/components/FundCategoryTabs/page";
import CalculatorHeader from "@/app/components/calculators/CalculatorHeader";
import { performance } from "@/data/calculators";

import InnerPage from "@/app/components/InnerBanner/InnerPage";

export default function MarketUpdate() {
  return (
    <>
      <InnerPage title="Fund Performance" />
      <div className="bg-[var(--rv-bg-white)]">
        <div className=" pt-10 pb-20 px-4">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-5">
              <CalculatorHeader
                title="Fund Performance"
                subtitle=""
                activeCalculator="Fund Performance"
                items={performance}
              />
            </div>
            <FundCategoryTabs />
          </div>
        </div>
      </div>
    </>
  );
}

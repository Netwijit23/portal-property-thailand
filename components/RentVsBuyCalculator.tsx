"use client";
import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import Reveal from "./Reveal";

function formatTHB(n: number): string {
  return `฿${Math.round(n).toLocaleString()}`;
}

function monthlyMortgagePayment(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (principal <= 0 || n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function RentVsBuyCalculator() {
  // Renting inputs
  const [monthlyRent, setMonthlyRent] = useState(35000);
  const [depositMonths, setDepositMonths] = useState(3);

  // Buying inputs
  const [price, setPrice] = useState(8000000);
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [loanYears, setLoanYears] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);

  const rentUpfront = monthlyRent * depositMonths;

  const buy = useMemo(() => {
    const downPayment = price * (downPaymentPct / 100);
    const loanAmount = price - downPayment;
    const monthlyPayment = monthlyMortgagePayment(loanAmount, interestRate, loanYears);
    const transferFeeEstimate = price * 0.02; // typical 2% transfer fee, often split buyer/seller
    const upfront = downPayment + transferFeeEstimate / 2;
    return { downPayment, loanAmount, monthlyPayment, upfront };
  }, [price, downPaymentPct, loanYears, interestRate]);

  return (
    <section id="calculator" className="relative bg-white border-y border-[#E8E4DC] py-20 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#B8935A]" />
              <span className="font-sans text-[10px] uppercase tracking-[2.5px] text-[#B8935A]">Plan Your Budget</span>
              <div className="h-px w-8 bg-[#B8935A]" />
            </div>
            <h2 className="font-cormorant text-[36px] md:text-[42px] font-light text-[#0A0A0A] leading-tight">
              Rent or buy? <em className="italic text-[#B8935A]">Run the numbers</em>
            </h2>
            <p className="font-sans text-[14px] text-[#86868B] mt-3 max-w-lg mx-auto">
              A rough monthly-cost comparison — adjust the figures to match a property you&apos;re considering.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Renting */}
          <Reveal>
            <div className="bg-[#FAFAF8] border border-[#E8E4DC] rounded-2xl p-7 h-full flex flex-col">
              <h3 className="font-cormorant text-[22px] font-medium text-[#0A0A0A] mb-5">Renting</h3>

              <label className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1.5 block">
                Monthly rent (THB)
              </label>
              <input
                type="number"
                min={0}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                className="w-full font-sans text-[15px] px-4 py-2.5 rounded-lg border border-[#E8E4DC] bg-white mb-4 focus:outline-none focus:border-[#B8935A]"
              />

              <label className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1.5 block">
                Deposit (months&apos; rent)
              </label>
              <input
                type="number"
                min={0}
                value={depositMonths}
                onChange={(e) => setDepositMonths(Number(e.target.value) || 0)}
                className="w-full font-sans text-[15px] px-4 py-2.5 rounded-lg border border-[#E8E4DC] bg-white mb-6 focus:outline-none focus:border-[#B8935A]"
              />

              <div className="mt-auto pt-5 border-t border-[#E8E4DC]">
                <p className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1">Estimated monthly cost</p>
                <p className="font-cormorant text-[32px] font-medium text-[#B8935A]">{formatTHB(monthlyRent)}</p>
                <p className="font-sans text-[12px] text-[#8A8680] mt-2">
                  Upfront cash needed: {formatTHB(rentUpfront)} (refundable deposit + advance rent)
                </p>
              </div>
            </div>
          </Reveal>

          {/* Buying */}
          <Reveal>
            <div className="bg-[#FAFAF8] border border-[#E8E4DC] rounded-2xl p-7 h-full flex flex-col">
              <h3 className="font-cormorant text-[22px] font-medium text-[#0A0A0A] mb-5">Buying</h3>

              <label className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1.5 block">
                Purchase price (THB)
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                className="w-full font-sans text-[15px] px-4 py-2.5 rounded-lg border border-[#E8E4DC] bg-white mb-4 focus:outline-none focus:border-[#B8935A]"
              />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1.5 block">
                    Down payment (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value) || 0)}
                    className="w-full font-sans text-[15px] px-4 py-2.5 rounded-lg border border-[#E8E4DC] bg-white focus:outline-none focus:border-[#B8935A]"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1.5 block">
                    Loan term (years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={loanYears}
                    onChange={(e) => setLoanYears(Number(e.target.value) || 0)}
                    className="w-full font-sans text-[15px] px-4 py-2.5 rounded-lg border border-[#E8E4DC] bg-white focus:outline-none focus:border-[#B8935A]"
                  />
                </div>
              </div>

              <label className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1.5 block">
                Interest rate (% per year)
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full font-sans text-[15px] px-4 py-2.5 rounded-lg border border-[#E8E4DC] bg-white mb-6 focus:outline-none focus:border-[#B8935A]"
              />

              <div className="mt-auto pt-5 border-t border-[#E8E4DC]">
                <p className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A8680] mb-1">Estimated monthly cost</p>
                <p className="font-cormorant text-[32px] font-medium text-[#B8935A]">{formatTHB(buy.monthlyPayment)}</p>
                <p className="font-sans text-[12px] text-[#8A8680] mt-2">
                  Upfront cash needed: {formatTHB(buy.upfront)} (down payment + est. transfer fees)
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="flex items-start gap-3 mt-8 px-1">
            <Calculator size={15} className="text-[#B8935A] shrink-0 mt-0.5" strokeWidth={1.8} />
            <p className="font-sans text-[12px] text-[#8A8680] leading-relaxed">
              Estimates only — for guidance, not a loan offer. Mortgage terms and eligibility (especially for foreign
              buyers) vary by lender; talk to us and we&apos;ll help you get real numbers for a specific property.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

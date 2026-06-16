import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Calculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8);
  const [tenure, setTenure] = useState(60);
  const [showSchedule, setShowSchedule] = useState(false);

  const { emi, totalInterest, totalAmount, schedule } = useMemo(() => {
    const p = amount;
    const r = rate / 12 / 100;
    const n = tenure;

    let emiVal;
    if (r === 0) {
      emiVal = p / n;
    } else {
      emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalAmt = emiVal * n;
    const totalInt = totalAmt - p;

    // Amortization schedule
    let balance = p;
    const sched = [];
    for (let i = 1; i <= n; i++) {
      const interestPart = balance * r;
      const principalPart = emiVal - interestPart;
      const closingBalance = balance - principalPart;
      sched.push({
        month: i,
        opening: balance,
        emi: emiVal,
        principal: principalPart,
        interest: interestPart,
        closing: Math.max(0, closingBalance)
      });
      balance = closingBalance;
    }

    return { emi: emiVal, totalInterest: totalInt, totalAmount: totalAmt, schedule: sched };
  }, [amount, rate, tenure]);

  const chartData = {
    labels: ['Principal', 'Interest'],
    datasets: [{
      data: [amount, totalInterest],
      backgroundColor: ['#1B3A6B', '#C9A84C'],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };

  const fmt = (n) => '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <span className="inline-block text-secondary font-semibold text-sm tracking-wider uppercase mb-3">EMI Calculator</span>
            <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6">Loan EMI Calculator</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">Calculate your monthly payment and view the complete amortization schedule.</p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Controls */}
            <motion.div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-border/50 p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-dark">Loan Amount</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(1000, Math.min(500000, Number(e.target.value))))}
                        className="w-32 text-right text-sm font-semibold text-primary bg-light rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <input type="range" min="1000" max="500000" step="1000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-primary h-2" />
                  <div className="flex justify-between text-xs text-muted mt-1"><span>$1,000</span><span>$500,000</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-dark">Annual Interest Rate</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={rate}
                        step="0.1"
                        onChange={(e) => setRate(Math.max(1, Math.min(30, Number(e.target.value))))}
                        className="w-20 text-right text-sm font-semibold text-primary bg-light rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-sm text-muted">%</span>
                    </div>
                  </div>
                  <input type="range" min="1" max="30" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary h-2" />
                  <div className="flex justify-between text-xs text-muted mt-1"><span>1%</span><span>30%</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-dark">Loan Tenure</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(Math.max(6, Math.min(360, Number(e.target.value))))}
                        className="w-20 text-right text-sm font-semibold text-primary bg-light rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-sm text-muted">months</span>
                    </div>
                  </div>
                  <input type="range" min="6" max="360" step="6" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-primary h-2" />
                  <div className="flex justify-between text-xs text-muted mt-1"><span>6 months</span><span>360 months</span></div>
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div className="lg:col-span-2 space-y-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-center">
                <p className="text-gray-300 text-sm mb-2">Monthly EMI</p>
                <p className="text-4xl font-heading font-bold text-secondary mb-6">{fmt(emi)}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400">Total Interest</p>
                    <p className="text-lg font-bold text-white">{fmt(totalInterest)}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-lg font-bold text-white">{fmt(totalAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-6">
                <h3 className="text-sm font-semibold text-dark mb-4 text-center">Principal vs Interest</h3>
                <div className="w-48 h-48 mx-auto">
                  <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom', labels: { padding: 16, font: { family: "'DM Sans'" } } } }, maintainAspectRatio: true }} />
                </div>
              </div>

              <Link
                to="/apply"
                className="block text-center px-8 py-4 bg-gradient-to-r from-secondary to-secondary-light text-dark font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                Apply for This Loan
              </Link>
            </motion.div>
          </div>

          {/* Amortization Schedule */}
          <div className="mt-12">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full bg-white rounded-xl p-4 text-center font-semibold text-primary hover:bg-primary/5 transition-colors border border-border/50"
            >
              {showSchedule ? 'Hide' : 'Show'} Amortization Schedule ({tenure} months)
            </button>

            {showSchedule && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden"
              >
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-primary text-white sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Month</th>
                        <th className="px-4 py-3 text-right font-medium">Opening Balance</th>
                        <th className="px-4 py-3 text-right font-medium">EMI</th>
                        <th className="px-4 py-3 text-right font-medium">Principal</th>
                        <th className="px-4 py-3 text-right font-medium">Interest</th>
                        <th className="px-4 py-3 text-right font-medium">Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((row) => (
                        <tr key={row.month} className="border-b border-border/30 hover:bg-light/50">
                          <td className="px-4 py-3 font-medium">{row.month}</td>
                          <td className="px-4 py-3 text-right">{fmt(row.opening)}</td>
                          <td className="px-4 py-3 text-right font-medium">{fmt(row.emi)}</td>
                          <td className="px-4 py-3 text-right text-primary">{fmt(row.principal)}</td>
                          <td className="px-4 py-3 text-right text-secondary-dark">{fmt(row.interest)}</td>
                          <td className="px-4 py-3 text-right">{fmt(row.closing)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

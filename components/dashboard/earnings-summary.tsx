"use client";

interface EarningsSummaryProps {
  monthlyEarnings: number;
  totalEarnings: number;
  completedJobs: number;
  rating: number;
  responseTime: string;
}

export function EarningsSummary({
  monthlyEarnings,
  totalEarnings,
  completedJobs,
  rating,
  responseTime,
}: EarningsSummaryProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6">
      <h3 className="text-lg font-bold mb-4">Performance & Earnings</h3>
      
      <div className="space-y-4">
        {/* Monthly Earnings */}
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4 border border-blue-200">
          <p className="text-sm text-blue-700 font-semibold">This Month</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">৳ {monthlyEarnings.toLocaleString()}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-stone-50 p-4 border border-stone-200">
            <p className="text-xs text-stone-600">Total Earnings</p>
            <p className="text-xl font-bold text-stone-900 mt-1">৳ {totalEarnings.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-xs text-green-700">Completed Jobs</p>
            <p className="text-xl font-bold text-green-900 mt-1">{completedJobs}</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 border border-purple-200">
            <p className="text-xs text-purple-700">Rating</p>
            <p className="text-xl font-bold text-purple-900 mt-1">⭐ {rating}</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-4 border border-orange-200">
            <p className="text-xs text-orange-700">Avg Response</p>
            <p className="text-xl font-bold text-orange-900 mt-1">{responseTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

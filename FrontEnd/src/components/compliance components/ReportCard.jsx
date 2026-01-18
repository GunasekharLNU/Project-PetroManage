import React from "react";

const ReportCard = ({ label, value }) => {
  // --- IMPROVED REGEX: Keeps "ID" together while splitting words like "SafetyScore" ---
  const formatLabel = (str) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Space between lowercase and uppercase
      .replace(/^./, (s) => s.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // Logic for UI feedback
  const isScore = label.toLowerCase().includes("score");
  // Supports numeric strings (90-100) or status strings
  const isPositive = String(value).toLowerCase().match(/pass|compliant|9[0-9]|100/);

  return (
    <div className="group relative bg-white p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-200 
                    shadow-sm transition-all duration-300 ease-out
                    md:hover:shadow-xl md:hover:shadow-emerald-100/50 
                    md:hover:-translate-y-1 md:hover:border-emerald-300 
                    cursor-pointer active:scale-[0.98] md:active:scale-95 w-full h-full 
                    min-h-27.5 sm:min-h-32.5 flex flex-col overflow-hidden">

      {/* Interactive Background Glow */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-50/5 to-emerald-50/30 
                      opacity-0 md:group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      {/* Decorative Accent: Left indicator for status */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isPositive ? "bg-emerald-500 opacity-100" : "bg-slate-200 opacity-40 md:group-hover:opacity-100"
        }`} />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="w-full">

          {/* Label Section - INCREASED SIZE */}
          <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
            <span className="text-xs sm:text-sm md:text-base font-black text-slate-500 uppercase tracking-[0.15em] leading-tight">
              {formatLabel(label)}
            </span>
            <div className={`shrink-0 mt-1 h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-500 ${isPositive
              ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] scale-110"
              : "bg-slate-300"
              }`} />
          </div>

          {/* Value Section - DECREASED SIZE FOR BETTER HIERARCHY */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight text-slate-800 wrap-break-word w-full sm:w-auto leading-tight">
              {value ?? "—"}
            </span>

            {isScore && value && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight shrink-0 mt-0.5">
                %
              </span>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 flex items-center justify-between min-h-3">
          <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-0 md:group-hover:opacity-100 transition-opacity hidden xs:block">
            Report Entry
          </p>
          {isPositive && (
            <span className="text-[7px] sm:text-[8px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">
              Valid
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
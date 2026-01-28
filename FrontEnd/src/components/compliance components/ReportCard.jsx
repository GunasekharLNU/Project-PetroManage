import React from "react";

const ReportCard = ({ label, value }) => {
  // Formats camelCase to Title Case
  const formattedLabel = label.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 h-full flex flex-col items-center justify-center text-center min-h-27.5">

      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {formattedLabel}
      </span>

      <div className="flex items-baseline justify-center gap-1 w-full">
        <span className="text-lg sm:text-xl font-black text-slate-800 wrap-break-word leading-tight tracking-tight">
          {value ?? "—"}
        </span>

        {label.toLowerCase().includes("score") && value && (
          <span className="text-[10px] font-black text-slate-300 uppercase">%</span>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
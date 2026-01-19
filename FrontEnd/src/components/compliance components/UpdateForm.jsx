import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaUserTie,
  FaCalendarAlt,
  FaLock,
  FaEdit,
  FaTimes
} from "react-icons/fa";

const UpdateForm = ({ onClose, reports, setReports, reportToUpdate, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    safetyScore: "",
    complianceStatus: "",
  });

  // 1. Initialize and Normalize data for the form state
  useEffect(() => {
    if (reportToUpdate) {
      const rawStatus = reportToUpdate.complianceStatus || reportToUpdate.ComplianceStatus || "";
      setFormData({
        safetyScore: reportToUpdate.safetyScore ?? reportToUpdate.SafetyScore ?? "",
        // Form needs underscores for the <select> values to match Java Enums
        complianceStatus: rawStatus.toString().toUpperCase().replace(/\s+/g, '_'),
      });
    }
  }, [reportToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = reportToUpdate?.reportId || reportToUpdate?.ReportID;
    if (!id) {
      alert("Error: Missing Report ID");
      return;
    }

    // Helper to ensure Enums are UPPERCASE_WITH_UNDERSCORES
    const formatForEnum = (str) =>
      str ? str.toString().toUpperCase().replace(/\s+/g, '_').trim() : null;

    // 2. Prepare Payload including existing data to prevent MySQL NULL overwrites
    const cleanPayload = {
      reportId: id,
      // Updated fields
      safetyScore: Number(formData.safetyScore),
      complianceStatus: formatForEnum(formData.complianceStatus),

      // Preservation fields (Inspector, Dates, Asset info)
      inspector: reportToUpdate.inspector || reportToUpdate.Inspector,
      nextAuditDate: reportToUpdate.nextAuditDate || reportToUpdate.NextAuditDate,
      generatedDate: reportToUpdate.generatedDate || reportToUpdate.GeneratedDate,
      assetName: reportToUpdate.assetName || reportToUpdate.AssetName,

      // Sanitize ReportType Enum (Prevents the "Safety Compliance" parse error)
      reportType: formatForEnum(reportToUpdate.reportType || reportToUpdate.ReportType),

      // Include nested asset if available
      asset: reportToUpdate.asset || null
    };

    try {
      const url = `http://localhost:8080/api/compliance-reports/${id}`;
      const response = await axios.put(url, cleanPayload);

      if (response.status === 200 || response.status === 204) {
        // 3. Update Local UI state (removed localStorage as requested)
        if (reports && Array.isArray(reports)) {
          const updatedReports = reports.map((report) => {
            const currentId = report.reportId || report.ReportID;
            if (currentId === id) {
              return {
                ...report,
                SafetyScore: Number(formData.safetyScore),
                ComplianceStatus: cleanPayload.complianceStatus,
                LastUpdated: new Date().toLocaleString("en-GB"),
              };
            }
            return report;
          });
          setReports(updatedReports);
        }

        if (onUpdateSuccess) onUpdateSuccess(cleanPayload);
        onClose();
      }
    } catch (error) {
      console.error("Payload causing error:", cleanPayload);
      const errorMsg = error.response?.data?.message || "Check Java console for Enum mapping errors.";
      alert(`Update Failed: ${errorMsg}`);
    }
  };

  if (!reportToUpdate) return null;

  // Shared Responsive Tailwind Classes
  const labelClasses = "flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-2 transition-all";
  const disabledClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-[13px] text-slate-400 font-semibold cursor-not-allowed transition-all shadow-inner";
  const editableClasses = "w-full bg-white border border-emerald-200 rounded-xl p-3 sm:p-4 text-[13px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-slate-900 shadow-sm cursor-pointer hover:border-emerald-300";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-4xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[95vh] animate-in fade-in zoom-in duration-300">

      {/* HEADER SECTION */}
      <div className="bg-slate-900 px-6 py-5 sm:p-8 text-white flex items-center justify-between border-b-4 border-amber-500 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden sm:flex p-3 bg-slate-800 rounded-2xl shrink-0">
            <FaEdit className="text-amber-500 text-xl" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-tighter truncate">Update Metrics</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">
              ID: <span className="text-amber-400">{reportToUpdate?.reportId || reportToUpdate?.ReportID}</span>
            </p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer shrink-0">
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* FORM CONTENT (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50/30 scrollbar-hide">
        <form id="update-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">

            {/* Asset Name - Read Only */}
            <div className="space-y-1">
              <label className={`${labelClasses} text-slate-400`}>
                <FaLock className="opacity-50" /> Asset Name
              </label>
              <input type="text" disabled value={reportToUpdate?.assetName || reportToUpdate?.AssetName || ""} className={disabledClasses} />
            </div>

            {/* Report Type - Read Only */}
            <div className="space-y-1">
              <label className={`${labelClasses} text-slate-400`}>
                <FaLock className="opacity-50" /> Report Type
              </label>
              <input type="text" disabled value={reportToUpdate?.reportType || reportToUpdate?.ReportType || ""} className={disabledClasses} />
            </div>

            {/* Safety Score - EDITABLE */}
            <div className="space-y-1 group">
              <label className={`${labelClasses} text-emerald-600 group-focus-within:text-emerald-400`}>
                <FaCheckCircle /> Safety Score (0-100)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="safetyScore"
                  value={formData.safetyScore}
                  onChange={handleChange}
                  min="0" max="100"
                  className={editableClasses}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-300 pointer-events-none">%</span>
              </div>
            </div>

            {/* Compliance Status - EDITABLE */}
            <div className="space-y-1 group">
              <label className={`${labelClasses} text-emerald-600 group-focus-within:text-emerald-400`}>
                <FaCheckCircle /> Compliance Status
              </label>
              <div className="relative">
                <select
                  name="complianceStatus"
                  value={formData.complianceStatus}
                  onChange={handleChange}
                  className={`${editableClasses} appearance-none pr-10`}
                  required
                >
                  <option value="COMPLIANT">Compliant</option>
                  <option value="NON_COMPLIANT">Non-Compliant</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Original Inspector - Read Only */}
            <div className="space-y-1">
              <label className={`${labelClasses} text-slate-400`}>
                <FaUserTie className="opacity-50" /> Original Inspector
              </label>
              <input type="text" disabled value={reportToUpdate?.inspector || reportToUpdate?.Inspector || "N/A"} className={disabledClasses} />
            </div>

            {/* Next Audit - Read Only */}
            <div className="space-y-1">
              <label className={`${labelClasses} text-slate-400`}>
                <FaCalendarAlt className="opacity-50" /> Next Audit Date
              </label>
              <input type="text" disabled value={reportToUpdate?.nextAuditDate || reportToUpdate?.NextAuditDate || "N/A"} className={disabledClasses} />
            </div>

          </div>
        </form>
      </div>

      {/* FOOTER SECTION (Sticky) */}
      <div className="p-6 sm:p-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto order-2 sm:order-1 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all p-2 cursor-pointer active:scale-95"
        >
          Discard Changes
        </button>

        <button
          form="update-form"
          type="submit"
          className="w-full sm:w-auto order-1 sm:order-2 px-10 py-4 sm:py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 hover:-translate-y-1 transition-all shadow-xl shadow-slate-200 active:scale-95 cursor-pointer flex items-center justify-center gap-3"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateForm;
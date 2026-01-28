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

const UpdateForm = ({ onClose, report, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    safetyScore: "",
    complianceStatus: "",
  });

  // 1. Initialize data - Only safetyScore and complianceStatus are editable
  useEffect(() => {
    if (report) {
      setFormData({
        safetyScore: report.safetyScore || 0,
        // Ensure we handle potential nulls and match backend ENUM format
        complianceStatus: report.complianceStatus ? report.complianceStatus.toUpperCase() : "PENDING_REVIEW",
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Build the full payload
    // We combine the editable formData with the static report data 
    // to satisfy the backend's PUT requirement for a full object.
    const payload = {
      reportId: report.reportId,
      asset: {
        assetId: report.asset?.assetId || report.assetId
      },
      assetName: report.assetName,
      reportType: report.reportType, // Use report. (static) not formData. (missing)
      safetyScore: Number(formData.safetyScore),
      complianceStatus: formData.complianceStatus,
      inspector: report.inspector,     // Use report. (static)
      nextAuditDate: report.nextAuditDate, // Use report. (static)
      generatedDate: report.generatedDate
    };

    try {
      const URL = `http://localhost:8080/api/compliance-reports/${report.reportId}`;
      const response = await axios.put(URL, payload);

      if (response.status === 200 || response.status === 204) {
        if (onUpdateSuccess) await onUpdateSuccess()
        onClose();
      }
    } catch (error) {
      console.error("Update failed. Payload:", payload);
      console.error("Error Details:", error.response?.data || error.message);
      alert("Failed to update report. Check console for details.");
    }
  };

  if (!report) return null;

  const labelClasses = "flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-2 transition-all";
  const disabledClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 text-[13px] text-slate-400 font-semibold cursor-not-allowed transition-all shadow-inner";
  const editableClasses = "w-full bg-white border border-emerald-200 rounded-xl p-3 sm:p-4 text-[13px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-slate-900 shadow-sm cursor-pointer hover:border-emerald-300";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">

      {/* HEADER SECTION */}
      <div className="bg-slate-900 px-6 py-5 sm:p-8 text-white flex items-center justify-between border-b-4 border-amber-500 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden sm:flex p-3 bg-slate-800 rounded-2xl shrink-0">
            <FaEdit className="text-amber-500 text-xl" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-tighter uppercase">Update Metrics</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">
              ID: <span className="text-amber-400">{report.reportId}</span>
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer">
          <FaTimes className="text-xl" />
        </button>
      </div>

      {/* FORM CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50/30 scrollbar-hide">
        <form id="update-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaLock className="opacity-50" /> Asset Name</label>
            <input type="text" disabled value={report.assetName || ""} className={disabledClasses} />
          </div>

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaLock className="opacity-50" /> Report Type</label>
            <input type="text" disabled value={report.reportType || ""} className={disabledClasses} />
          </div>

          <div className="space-y-1 group">
            <label className={`${labelClasses} text-emerald-600 group-focus-within:text-emerald-400`}><FaCheckCircle /> Safety Score (0-100)</label>
            <input
              type="number"
              name="safetyScore"
              value={formData.safetyScore}
              onChange={handleChange}
              min="0" max="100"
              className={editableClasses}
              required
            />
          </div>

          <div className="space-y-1 group">
            <label className={`${labelClasses} text-emerald-600 group-focus-within:text-emerald-400`}><FaCheckCircle /> Compliance Status</label>
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
          </div>

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaUserTie className="opacity-50" /> Inspector</label>
            <input type="text" disabled value={report.inspector || ""} className={disabledClasses} />
          </div>

          <div className="space-y-1">
            <label className={`${labelClasses} text-slate-400`}><FaCalendarAlt className="opacity-50" /> Next Audit Date</label>
            <input type="text" disabled value={report.nextAuditDate || ""} className={disabledClasses} />
          </div>

        </form>
      </div>

      {/* FOOTER SECTION */}
      <div className="p-6 sm:p-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all p-2 cursor-pointer active:scale-95"
        >
          Discard Changes
        </button>

        <button
          form="update-form"
          type="submit"
          className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 hover:-translate-y-1 transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-3"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default UpdateForm;
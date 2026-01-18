import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaClipboardList, FaShieldAlt, FaCheckCircle, FaUserTie,
  FaCalendarAlt, FaIndustry, FaTimes
} from "react-icons/fa";

const assets = [
  { value: 1, label: "North Sea Rig Alpha (RIG-001)" },
  { value: 2, label: "West Texas Rig Beta (RIG-002)" },
  { value: 3, label: "Pipeline Delta-7 (PL-045)" },
  { value: 4, label: "Storage Facility B (STG-012)" },
  { value: 5, label: "Gulf Platform Echo (RIG-008)" },
];

const ReportForm = ({ onClose, reports, setReports, onLogAction }) => {
  const [formData, setFormData] = useState({
    reportType: "",
    asset: null,
    safetyScore: "",
    complianceStatus: "",
    inspector: "",
    nextAuditDate: new Date(),
    generatedDate: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetChange = (option) => {
    setFormData((prev) => ({ ...prev, asset: option }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, nextAuditDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.asset) {
      alert("Please select an asset");
      return;
    }

    const statusMapping = {
      "Compliant": "COMPLIANT",
      "Non-Compliant": "NON_COMPLIANT",
      "Pending Review": "PENDING_REVIEW"
    };

    const typeMapping = {
      "Safety Compliance": "SAFETY_COMPLIANCE",
      "Environmental Compliance": "ENVIRONMENTAL_COMPLIANCE",
      "Regulatory": "REGULATORY"
    };

    const payload = {
      asset: { assetId: Number(formData.asset.value) },
      assetName: formData.asset.label,
      reportType: typeMapping[formData.reportType],
      safetyScore: Number(formData.safetyScore),
      complianceStatus: statusMapping[formData.complianceStatus],
      inspector: formData.inspector,
      nextAuditDate: formData.nextAuditDate.toISOString().split('T')[0],
      generatedDate: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post("http://localhost:8080/api/compliance-reports", payload);

      // --- NORMALIZE FOR INSTANT UI UPDATE ---
      const normalizedNewReport = {
        ReportID: response.data.reportId,
        AssetName: payload.assetName,
        SafetyScore: payload.safetyScore,
        ComplianceStatus: formData.complianceStatus,
        NextAuditDate: payload.nextAuditDate,
        Inspector: payload.inspector,
        ReportType: formData.reportType
      };

      if (setReports) {
        setReports((prev) => [...prev, normalizedNewReport]);
      }

      if (onLogAction) {
        onLogAction(response.data.reportId, "New Report Created", "NONE", `Inspector: ${payload.inspector}`);
      }

      alert("Success! Report saved to database.");
      if (onClose) onClose();
    } catch (error) {
      console.error("Submission Error:", error.response?.data);
      alert("Failed to save: " + (error.response?.data?.message || "Check Server Connection"));
    }
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0.75rem',
      fontSize: '14px',
      minHeight: '48px',
      backgroundColor: 'white',
      borderColor: state.isFocused ? '#10b981' : '#e2e8f0',
      boxShadow: state.isFocused ? '0 0 0 1px #10b981' : 'none',
      '&:hover': { borderColor: '#10b981' }
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      fontSize: '14px',
      padding: '12px',
      backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
    })
  };

  const inputClasses = "w-full bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-semibold shadow-sm";
  const labelClasses = "flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-4xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col h-full max-h-[92vh] sm:max-h-[95vh] animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-900 px-6 py-5 sm:p-8 text-white flex items-center justify-between border-b-4 border-emerald-500 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div className="p-3 bg-slate-800 rounded-2xl hidden sm:flex items-center justify-center shrink-0">
            <FaIndustry className="text-emerald-500 text-xl sm:text-2xl" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-black tracking-tighter truncate">Generate Report</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest truncate">Asset Operations Management</p>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer shrink-0">
          <FaTimes className="text-xl sm:text-2xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50/30">
        <form id="report-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-1">
              <label className={labelClasses}><FaClipboardList className="text-emerald-600" /> Report Type</label>
              <select name="reportType" value={formData.reportType} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer pr-10`} required>
                <option value="">Select Type</option>
                <option value="Safety Compliance">Safety Compliance</option>
                <option value="Environmental Compliance">Environmental Compliance</option>
                <option value="Regulatory">Regulatory</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaShieldAlt className="text-emerald-600" /> Asset Selection</label>
              <Select options={assets} value={formData.asset} onChange={handleAssetChange} styles={selectStyles} placeholder="Find asset..." required menuPortalTarget={document.body} />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaCheckCircle className="text-emerald-600" /> Safety Score (0-100)</label>
              <div className="relative">
                <input type="number" name="safetyScore" value={formData.safetyScore} onChange={handleChange} min="0" max="100" placeholder="Enter score" className={inputClasses} required />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">%</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaCheckCircle className="text-emerald-600" /> Compliance Status</label>
              <select name="complianceStatus" value={formData.complianceStatus} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer pr-10`} required>
                <option value="">Set Status</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaUserTie className="text-emerald-600" /> Inspector / Lead</label>
              <input type="text" name="inspector" value={formData.inspector} onChange={handleChange} placeholder="Name or Agency" className={inputClasses} required />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}><FaCalendarAlt className="text-emerald-600" /> Next Audit Date</label>
              <DatePicker selected={formData.nextAuditDate} onChange={handleDateChange} dateFormat="dd MMM yyyy" minDate={new Date()} className={`${inputClasses} cursor-pointer`} wrapperClassName="w-full" />
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 sm:p-8 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <button type="button" onClick={onClose} className="w-full sm:w-auto order-2 sm:order-1 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-all p-2 cursor-pointer active:scale-95">
          Discard Changes
        </button>
        <button form="report-form" type="submit" className="w-full sm:w-auto order-1 sm:order-2 px-10 py-4 sm:py-4 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-xl shadow-emerald-100 active:scale-95 cursor-pointer flex items-center justify-center gap-2">
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;
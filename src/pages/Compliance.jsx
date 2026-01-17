import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FileCheck, Plus } from "lucide-react";
import { FaHistory, FaPlus } from "react-icons/fa"; // Fixed FaPlus import
import { AnimatePresence, motion } from "framer-motion";

// Internal Components & Utils
import Card from "../components/compliance components/Card.jsx";
import ReportsTable from "../components/compliance components/ReportsTable.jsx";
import ReportForm from "../components/compliance components/ReportForm.jsx";
import AuditView from "../components/compliance components/AuditView.jsx";
import { handleExport } from "../components/compliance components/exportutil.js";

// Animation Variants (Fixed missing variables)
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Compliance = () => {
  const [view, setView] = useState("dashboard");
  const [showPopup, setShowPopup] = useState(false);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const logsPerPage = 8;
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setLogSearchTerm(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Load Data & Global Listeners
  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("complianceReports") || "[]");
    const savedLogs = JSON.parse(localStorage.getItem("auditLogs") || "[]");
    setReports(savedReports);
    setAuditLogs(savedLogs);

    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowExportDropdown(false);
      }
    };
    window.addEventListener("mousedown", closeDropdown);
    return () => window.removeEventListener("mousedown", closeDropdown);
  }, []);

  const parseLogDate = useCallback((str) => {
    if (!str) return null;
    const [datePart] = str.split(",");
    const [d, m, y] = datePart.split("/");
    return new Date(y, m - 1, d);
  }, []);

  // Filter Logic
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch = !logSearchTerm ||
        Object.values(log).some(v => String(v).toLowerCase().includes(logSearchTerm.toLowerCase()));

      let matchesDate = true;
      if (fromDate || endDate) {
        const logDate = parseLogDate(log.Timestamp);
        if (logDate) {
          const lTime = logDate.getTime();
          if (fromDate && lTime < new Date(fromDate).setHours(0, 0, 0, 0)) matchesDate = false;
          if (endDate && lTime > new Date(endDate).setHours(23, 59, 59, 999)) matchesDate = false;
        } else matchesDate = false;
      }
      return matchesSearch && matchesDate;
    });
  }, [auditLogs, logSearchTerm, fromDate, endDate, parseLogDate]);

  // Add Log Entry
  const addAuditLog = (reportId, action, oldValue = "-", newValue = "-") => {
    const newLog = {
      ReportID: reportId || "N/A",
      Action: action,
      OldValue: oldValue,
      NewValue: newValue,
      User: "System Administrator",
      Timestamp: new Date().toLocaleString("en-GB")
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem("auditLogs", JSON.stringify(updated));
  };

  // Stats Logic
  const dynamicStats = useMemo(() => {
    if (!reports.length) return { "Overall Compliance": "0%", "Safety Score": "0", "Pending": "0", "Audits": "0" };
    const compliant = reports.filter(r => r.ComplianceStatus === "Compliant").length;
    const score = reports.reduce((a, b) => a + Number(b.SafetyScore || 0), 0);
    return {
      "✅ Overall Compliance": `${Math.round((compliant / reports.length) * 100)}%`,
      "🛡️ Safety Score": `${Math.round(score / reports.length)}`,
      "📋 Pending Reviews": reports.filter(r => r.ComplianceStatus === "Pending Review").length,
      "📅 Upcoming Audits": reports.filter(r => r.NextAuditDate && new Date(r.NextAuditDate) >= new Date().setHours(0, 0, 0, 0)).length
    };
  }, [reports]);

  // Export Wrapper
  const onExportTrigger = (type) => {
    handleExport(filteredLogs, type);
    setShowExportDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "dashboard" ? (
          <motion.div key="dash" variants={containerVar} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}>
            <div className="w-full pt-4">
              <div className="relative overflow-hidden text-white rounded-xl px-4 py-6 sm:px-12 bg-slate-900 shadow-2xl">
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight flex items-center gap-3">
                    <FileCheck size={50} className="text-emerald-400 shrink-0" />
                    <span>Compliance <span className="text-emerald-400">&amp;</span> Safety</span>
                  </h2>

                  {/* Added pl-[62px] to align exactly under the text, skipping the 50px icon + 12px gap */}
                  <p className="text-slate-400 font-medium text-xs sm:text-base pl-[62px]">
                    Centralized regulatory tracking and real-time safety audit management.
                  </p>
                </div>
              </div>
            </div>

            <motion.div variants={itemVar} className="max-w-7xl mx-auto mt-10 px-4">
              <Card data={dynamicStats} />
            </motion.div>

            <motion.div variants={itemVar} className="flex justify-center mt-12 px-4">
              <button onClick={() => setShowPopup(true)} className="w-full sm:w-auto flex items-center justify-center gap-4 bg-emerald-600 text-white font-black px-10 py-5 rounded-2xl shadow-xl hover:bg-emerald-500 cursor-pointer text-xs uppercase tracking-widest transition-all">
                <FaPlus size={18} /> Generate New Report
              </button>
            </motion.div>

            <motion.div variants={itemVar} className="max-w-7xl mx-auto mt-16 px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-4">
                  <div className="h-10 w-2 bg-emerald-500 rounded-full" /> Active Reports
                </h2>
                <button onClick={() => setView("audit")} className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black rounded-xl hover:bg-slate-900 hover:text-white transition-all text-[10px] uppercase tracking-widest cursor-pointer">
                  <FaHistory /> Audit Logs
                </button>
              </div>
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-2">
                <ReportsTable reports={reports} setReports={setReports} onLogAction={addAuditLog} />
              </div>
            </motion.div>

            <AnimatePresence>
              {showPopup && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-xl p-4">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-2xl">
                    <ReportForm onClose={() => setShowPopup(false)} reports={reports} setReports={setReports} onLogAction={addAuditLog} />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <AuditView
            key="audit"
            setView={setView}
            filteredLogs={filteredLogs}
            indexOfFirstLog={(currentPage - 1) * logsPerPage}
            indexOfLastLog={currentPage * logsPerPage}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            fromDate={fromDate}
            setFromDate={setFromDate}
            endDate={endDate}
            setEndDate={setEndDate}
            showExportDropdown={showExportDropdown}
            setShowExportDropdown={setShowExportDropdown}
            exportData={onExportTrigger}
            dropdownRef={dropdownRef}
            currentLogs={filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={Math.ceil(filteredLogs.length / logsPerPage)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Compliance;
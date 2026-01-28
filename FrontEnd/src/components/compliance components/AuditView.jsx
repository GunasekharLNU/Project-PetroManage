import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHistory, FaArrowLeft, FaSearch, FaChevronDown, FaCode,
  FaFileCsv, FaFileExcel, FaFilePdf, FaTimes
} from "react-icons/fa";
import axios from "axios";
import { handleExport } from "./exportutil";

const AuditView = ({ setView }) => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const getAudit = async () => {
      try {
        const URL = "http://localhost:8080/api/audits";
        const response = await axios.get(URL);
        setData(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch audit logs:", error);
      }
    };
    getAudit();
  }, []);

  const clearDates = () => {
    setFromDate("");
    setEndDate("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Navigation */}
      <button
        onClick={() => setView("dashboard")}
        className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all mb-8 shadow-lg cursor-pointer"
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <FaHistory className="text-emerald-500" /> Audit History
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mt-1 whitespace-nowrap">
            Showing {data.length} Activities
          </p>
        </div>

        {/* Search Input */}
        <div className="relative h-12 w-64">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-full w-full pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter Group */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 h-12 shadow-sm">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-[10px] font-bold uppercase outline-none text-slate-600 cursor-pointer"
              />
              <span className="text-slate-300 text-xs font-bold">TO</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-[10px] font-bold uppercase outline-none text-slate-600 cursor-pointer"
              />
            </div>
            {(fromDate || endDate) && (
              <button
                onClick={clearDates}
                className="ml-2 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                title="Clear Dates"
              >
                <FaTimes size={10} />
              </button>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative h-12" ref={dropdownRef}>
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="h-full px-6 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-3 uppercase cursor-pointer"
            >
              Export <FaChevronDown className={`transition-transform ${showExportDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showExportDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  {[
                    { id: 'json', icon: <FaCode className="text-blue-500" />, label: 'JSON Data' },
                    { id: 'excel', icon: <FaFileExcel className="text-green-600" />, label: 'Excel Sheet' },
                    { id: 'pdf', icon: <FaFilePdf className="text-red-500" />, label: 'PDF Document' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        // Pass format first, then data
                        handleExport(opt.id, data);
                        setShowExportDropdown(false);
                      }}
                      className="w-full px-5 py-4 text-left text-[11px] font-black text-slate-600 hover:bg-slate-50 flex items-center gap-3 border-b border-slate-50 last:border-0 cursor-pointer transition-colors"
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-250 table-fixed">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black">
                <th className="px-6 py-6 text-center w-[15%]">Report ID</th>
                <th className="px-6 py-6 text-center w-[25%]">Action</th>
                <th className="px-6 py-6 text-center w-[20%]">Previous</th>
                <th className="px-6 py-6 text-center w-[20%]">Modified</th>
                <th className="px-6 py-6 text-center w-[20%]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((log, i) => (
                <tr key={log.id || i} className="hover:bg-slate-50/50 transition-colors h-20">
                  <td className="px-6 py-4 text-center whitespace-nowrap font-bold text-xs tabular-nums text-slate-900">
                    {log.reportIdDisplay || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center justify-center w-44 py-2 rounded-lg text-[10px] font-black uppercase border whitespace-nowrap ${log.action?.includes("DELETE") ? "bg-red-50 text-red-600 border-red-100" :
                        log.action?.includes("CREATE") ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                        {log.action || "UPDATE"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-400 italic text-[11px] wrap-break-word text-center">
                      {log.oldValue || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-700 font-bold text-[11px] wrap-break-word text-center">
                      {log.newValue || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-slate-400 text-[11px] tabular-nums">
                    {log.timestamp || "—"}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditView;
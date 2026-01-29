import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportCard from "./ReportCard";
import UpdateForm from "./UpdateForm";
import {
  FaFileExport,
  FaChevronDown,
  FaSearch,
  FaTimes,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import { handleExport } from "./exportutil.js";

const API_BASE_URL = "http://localhost:8080/api/compliance-reports";

const ReportsTable = ({ reports, setReports, fetchReports }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [showExportAllDropdown, setShowExportAllDropdown] = useState(false);
  const [showSingleExportDropdown, setShowSingleExportDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- MANUAL PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  const triggerExport = (data, format) => {
    handleExport(format, data);
    setShowExportAllDropdown(false);
    setShowSingleExportDropdown(false);
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm(`Delete this report: ${reportId}?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/${reportId}`);
      await fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleUpdateComplete = () => {
    fetchReports();
    setEditingReport(null);
  };

  // --- 1. FRONTEND FILTERING LOGIC ---
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.inspector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.complianceStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportId?.toString().includes(searchTerm);

    let matchesDate = true;
    if (startDate || endDate) {
      const auditDate = new Date(report.nextAuditDate).setHours(0, 0, 0, 0);
      if (startDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        matchesDate = matchesDate && auditDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate).setHours(0, 0, 0, 0);
        matchesDate = matchesDate && auditDate <= end;
      }
    }
    return matchesSearch && matchesDate;
  });

  // --- 2. PAGINATION LOGIC (Slicing the filtered array) ---
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 whenever search or date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-400 mx-auto font-sans text-slate-900 bg-slate-50 min-h-screen">

      {/* --- TOOLBAR --- */}
      <div className="flex flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Report..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 h-12 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 h-12">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-[10px] font-black uppercase outline-none bg-transparent text-slate-600 cursor-pointer"
              />
              <span className="text-slate-300 text-xs font-bold">TO</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-[10px] font-black uppercase outline-none bg-transparent text-slate-600 cursor-pointer"
              />
            </div>
            {(searchTerm || startDate || endDate) && (
              <button onClick={clearFilters} className="cursor-pointer ml-2 p-1.5 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors border border-transparent hover:border-slate-100">
                <FaTimes size={12} />
              </button>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setShowExportAllDropdown(true)} onMouseLeave={() => setShowExportAllDropdown(false)}>
            <button className="cursor-pointer px-6 h-12 bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 whitespace-nowrap">
              <FaFileExport className="text-emerald-400" /> Export
            </button>
            {showExportAllDropdown && (
              <div className="absolute right-0 pt-2 w-44 z-100 animate-in fade-in slide-in-from-top-2">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 overflow-hidden">
                  {['json', 'excel', 'pdf'].map((fmt) => (
                    <button key={fmt} onClick={() => triggerExport(filteredReports, fmt)} className="w-full text-left px-5 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition uppercase cursor-pointer">
                      Save as {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                <th className="px-8 py-5 text-center">Report ID</th>
                <th className="px-8 py-5 text-center">Asset Details</th>
                <th className="px-8 py-5 text-center">Safety Score</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.length > 0 ? (
                currentItems.map((report) => (
                  <tr key={report.reportId} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-6 font-bold text-slate-600 text-xs text-center">{report.reportId}</td>
                    <td className="px-8 py-6 text-center text-sm font-bold text-slate-800">{report.assetName}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center justify-center w-16 font-black text-slate-700 text-xs bg-slate-100 py-1 rounded-lg">{report.safetyScore}%</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex items-center justify-center w-32 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${report.complianceStatus?.toLowerCase().includes('non') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{report.complianceStatus}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setSelectedReport(report)} className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase bg-slate-50 border border-slate-200 hover:bg-white cursor-pointer transition-colors">View</button>
                        <button onClick={() => setEditingReport(report)} className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 cursor-pointer">Update</button>
                        <button onClick={() => handleDelete(report.reportId)} className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">No reports found matching your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} Reports
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaChevronLeft size={12} />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs transition-all cursor-pointer shadow-sm ${currentPage === i + 1
                    ? "bg-slate-900 text-white shadow-lg scale-110"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {selectedReport && (
        <div className="fixed inset-0 h-screen w-screen flex items-center justify-center z-200 p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-white/95 rounded-4xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden border border-white/20 max-h-[85vh]">
            <div className="relative px-8 py-6 border-b border-slate-100 flex items-center justify-center bg-white/50 top-0 z-10">
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Inspection Profile</h2>
                <div className="h-1 w-12 bg-linear-to-r from-emerald-400 to-cyan-500 rounded-full mt-1" />
              </div>
              <button onClick={() => setSelectedReport(null)} className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer border border-slate-100">
                <span className="text-xl">&times;</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50/30 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(selectedReport).map(([key, value]) => {
                  let displayValue = value;
                  if (value && typeof value === 'object') displayValue = value.assetName || value.assetId || value.id || "Linked Data";
                  if (key.toLowerCase().includes("date") && typeof displayValue === "string") displayValue = displayValue.split("T")[0];
                  if (typeof displayValue === "string" && displayValue.includes("_")) displayValue = displayValue.toLowerCase().split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
                  return <ReportCard key={key} label={key} value={displayValue} />;
                })}
              </div>
            </div>
            <div className="px-8 py-5 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-[15px] font-black text-slate-300 uppercase tracking-[0.2em]">ID: {selectedReport.reportId}</span>
              <div className="relative" onMouseEnter={() => setShowSingleExportDropdown(true)} onMouseLeave={() => setShowSingleExportDropdown(false)}>
                <button className="px-6 h-10 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all text-[9px] uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                  <FaFileExport className="text-emerald-400" /> Export <FaChevronDown className={`text-[7px] transition-transform ${showSingleExportDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSingleExportDropdown && (
                  <div className="absolute bottom-full right-0 mb-0 pb-2 w-40 z-30 animate-in fade-in slide-in-from-bottom-1">
                    <div className="bg-slate-900 rounded-xl shadow-xl py-1 overflow-hidden border-b-2 border-emerald-500">
                      {['json', 'excel', 'pdf'].map((fmt) => (
                        <button key={fmt} onClick={() => triggerExport([selectedReport], fmt)} className="w-full text-left px-5 py-2.5 text-[9px] font-black text-slate-300 hover:bg-emerald-500 hover:text-white transition-colors uppercase cursor-pointer">
                          Save as {fmt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingReport && (
        <div className="fixed inset-0 flex items-center justify-center z-300 p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-4xl">
            <UpdateForm report={editingReport} onUpdateSuccess={handleUpdateComplete} onClose={() => setEditingReport(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
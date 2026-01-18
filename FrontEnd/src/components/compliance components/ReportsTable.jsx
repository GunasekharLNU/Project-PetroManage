import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ReportCard from "./ReportCard";
import UpdateForm from "./UpdateForm";
import { FaFileExport, FaChevronDown } from "react-icons/fa";

const ReportsTable = ({ reports, setReports, onLogAction }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showExportAllDropdown, setShowExportAllDropdown] = useState(false);
  const [showSingleExportDropdown, setShowSingleExportDropdown] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingReport, setEditingReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 8;
  const API_BASE_URL = "http://localhost:8080/api/compliance-reports";

  // --- 1. FETCH FROM DATABASE ---
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);

      // Normalize Backend camelCase to your UI's PascalCase
      const normalizedData = response.data.map((r) => ({
        ReportID: r.reportId,
        AssetName: r.assetName || "N/A",
        SafetyScore: r.safetyScore,
        ComplianceStatus: r.complianceStatus ? r.complianceStatus.replace(/_/g, " ") : "PENDING",
        NextAuditDate: r.nextAuditDate,
        Inspector: r.inspector || "Unknown",
        ReportType: r.reportType || "General",
        GeneratedDate: r.generatedDate
      }));

      setReports(normalizedData);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [setReports]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // --- DATE PARSER ---
  const parseCustomDate = (dateStr) => {
    if (!dateStr) return null;
    const normalizedStr = String(dateStr).replace(/\sat\s/i, " ");
    const d = new Date(normalizedStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // --- FILTER LOGIC ---
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = Object.values(report).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      let matchesDate = true;
      if (fromDate || endDate) {
        const reportDateObj = parseCustomDate(report.NextAuditDate);
        if (!reportDateObj) {
          matchesDate = false;
        } else {
          const rTime = new Date(reportDateObj.getFullYear(), reportDateObj.getMonth(), reportDateObj.getDate()).getTime();
          if (fromDate) {
            const sTime = new Date(fromDate).setHours(0, 0, 0, 0);
            if (rTime < sTime) matchesDate = false;
          }
          if (endDate) {
            const eTime = new Date(endDate).setHours(0, 0, 0, 0);
            if (rTime > eTime) matchesDate = false;
          }
        }
      }
      return matchesSearch && matchesDate;
    });
  }, [reports, searchTerm, fromDate, endDate]);


  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  const currentReports = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredReports.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredReports, currentPage]);

  // --- EXPORT LOGIC ---
  const handleExport = (data, format, filename) => {
    const exportData = Array.isArray(data) ? data : [data];
    if (exportData.length === 0) return;
    const headers = ["ReportID", "AssetName", "ComplianceStatus", "SafetyScore", "NextAuditDate", "Inspector"];

    if (format === "excel") {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } else if (format === "pdf") {
      const doc = new jsPDF('l', 'mm', 'a4');
      autoTable(doc, {
        head: [headers],
        body: exportData.map((row) => headers.map((h) => row[h]?.toString() ?? "-")),
        headStyles: { fillColor: [15, 23, 42] }
      });
      doc.save(`${filename}.pdf`);
    } else if (format === "json") {
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(jsonBlob);
      link.download = `${filename}.json`;
      link.click();
    }
    setShowExportAllDropdown(false);
    setShowSingleExportDropdown(false);
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (reportID) => {
    if (!window.confirm(`Permanently delete Report ${reportID}?`)) return;

    try {
      // 1. Ensure there are no trailing slashes or spaces
      const cleanURL = API_BASE_URL.replace(/\/$/, "");

      // 2. Perform the request
      const response = await axios({
        method: 'delete',
        url: `${cleanURL}/${reportID}`,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200 || response.status === 204) {
        setReports(prev => prev.filter(r => r.ReportID !== reportID));
        if (onLogAction) onLogAction(reportID, "Deleted", "Success", "DELETED");
      }
    } catch (error) {
      console.error("Detailed Error:", error);

      // Check if it's a CORS error vs a 404
      if (!error.response) {
        alert("Network Error: The server refused the connection. This is likely a CORS issue or the server is blocked.");
      } else {
        alert(`Error ${error.response.status}: ${error.response.data || "Check console"}`);
      }
    }
  };

  const handleUpdateComplete = () => {
    fetchReports(); // Refresh data from DB
    setEditingReport(null);
  };
  const handleClearFilters = () => {
    setSearchTerm("");
    setFromDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-slate-400 animate-pulse uppercase tracking-widest">Syncing with Database...</div>;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-400 mx-auto font-sans text-slate-900 bg-slate-50 min-h-screen">

      {/* --- TOOLBAR --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="relative group w-full lg:max-w-md">
          <input
            type="text"
            placeholder="Search reports by ID or Asset..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-12 pl-6 pr-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-400 outline-none transition-all font-medium text-sm shadow-sm"
          />
          {/* Optional: Clear search icon inside input */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 font-bold"
            >
              &times;
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-3 shadow-sm h-12">
            <div className="flex flex-col px-2">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Audit Start</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
                className="text-[10px] font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
              />
            </div>
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <div className="flex flex-col px-2">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Audit End</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="text-[10px] font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
              />
            </div>

            {/* CLEAR BUTTON: Appears only if filters are active */}
            {(searchTerm || fromDate || endDate) && (
              <>
                <div className="h-6 w-px bg-slate-200 mx-2"></div>
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1 text-[8px] font-black text-red-500 hover:bg-red-50 rounded-lg uppercase transition-colors cursor-pointer"
                >
                  Clear
                </button>
              </>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setShowExportAllDropdown(true)} onMouseLeave={() => setShowExportAllDropdown(false)}>
            <button className="cursor-pointer w-full sm:w-auto px-8 h-12 bg-slate-900 text-white font-bold rounded-2xl transition-all shadow-lg text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 justify-center">
              <FaFileExport /> Export
            </button>
            {showExportAllDropdown && (
              <div className="absolute right-0 pt-2 w-full sm:w-44 z-100 animate-in fade-in slide-in-from-top-2">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 overflow-hidden">
                  {['json', 'excel', 'pdf'].map((fmt) => (
                    <button key={fmt} onClick={() => handleExport(filteredReports, fmt, "Compliance_Reports")} className="w-full text-left px-5 py-2.5 text-[10px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition uppercase cursor-pointer">Save as {fmt}</button>
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
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <tr key={report.ReportID} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-6 font-bold text-slate-600 text-xs text-center">{report.ReportID}</td>
                    <td className="px-8 py-6 text-center text-sm font-bold text-slate-800">{report.AssetName}</td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center justify-center w-16 font-black text-slate-700 text-xs bg-slate-100 py-1 rounded-lg">{report.SafetyScore}%</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex items-center justify-center w-32 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm ${report.ComplianceStatus?.toLowerCase().includes('non') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{report.ComplianceStatus}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => setSelectedReport(report)} className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase bg-slate-50 border border-slate-200 hover:bg-white cursor-pointer transition-colors">View</button>
                        <button onClick={() => setEditingReport(report)} className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 cursor-pointer">Update</button>
                        <button onClick={() => handleDelete(report.ReportID)} className="px-4 py-2 rounded-xl text-[9px] font-bold uppercase text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 cursor-pointer">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">No results found in database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 mb-8 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase ml-4">Showing {currentReports.length} of {filteredReports.length}</span>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-bold uppercase disabled:opacity-30 cursor-pointer">Prev</button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-bold uppercase disabled:opacity-30 cursor-pointer">Next</button>
          </div>
        </div>
      )}

      {/* --- MODAL: INSPECTION PROFILE (RESTORED VIEW) --- */}
      {selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center z-200 p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]">
            <div className="px-10 py-8 border-b flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-2xl font-black text-slate-900 uppercase">Inspection Profile</h2>
              <button onClick={() => setSelectedReport(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 cursor-pointer">&times;</button>
            </div>

            <div className="p-10 overflow-y-auto bg-slate-50/30 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(selectedReport).map(([key, value]) => (
                  <ReportCard key={key} label={key} value={value} />
                ))}
              </div>
            </div>

            {/* --- RESTORED FOOTER ACTIONS --- */}
            <div className="px-10 py-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-6 justify-between">
              <button onClick={() => { setEditingReport(selectedReport); setSelectedReport(null); }} className="w-full sm:w-auto px-8 h-12 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 text-[10px] uppercase tracking-widest shadow-lg cursor-pointer">Update Status</button>

              <div className="relative group w-full sm:w-auto" onMouseEnter={() => setShowSingleExportDropdown(true)} onMouseLeave={() => setShowSingleExportDropdown(false)}>
                <button className="cursor-pointer w-full sm:w-auto px-8 h-12 bg-slate-900 text-white font-bold rounded-2xl shadow-lg text-[10px] uppercase tracking-widest hover:bg-slate-800 flex items-center justify-center gap-2">
                  <FaFileExport /> Export Report <FaChevronDown className="text-[8px]" />
                </button>
                {showSingleExportDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-full sm:min-w-45 z-210">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 overflow-hidden">
                      {['json', 'excel', 'pdf'].map((fmt) => (
                        <button key={fmt} onClick={() => handleExport(selectedReport, fmt, `Report_${selectedReport.ReportID}`)} className="w-full text-left px-5 py-3 text-[10px] font-black text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition uppercase cursor-pointer">Save as {fmt}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedReport(null)} className="w-full sm:w-auto px-10 h-12 bg-white text-slate-400 border border-slate-200 font-bold rounded-2xl text-[9px] uppercase tracking-widest hover:text-red-500 cursor-pointer">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: UPDATE FORM --- */}
      {editingReport && (
        <div className="fixed inset-0 flex items-center justify-center z-300 p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-4xl">
            <UpdateForm reportToUpdate={editingReport} onUpdateSuccess={handleUpdateComplete} onClose={() => setEditingReport(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
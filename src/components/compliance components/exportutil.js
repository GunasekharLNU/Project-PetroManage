import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Handles cross-format data exporting
 * @param {Array} data - The array of log objects
 * @param {string} format - 'json' | 'csv' | 'excel' | 'pdf'
 */
export const handleExport = (data, format) => {
    if (!data || data.length === 0) {
        alert("No data available to export");
        return;
    }

    const fileName = `Audit_Report_${new Date().toISOString().split('T')[0]}`;
    const headers = ["Report ID", "Action", "User", "Old Value", "New Value", "Timestamp"];

    // Format for table-based exports
    const rows = data.map(l => [
        l.ReportID || "N/A",
        l.Action || "N/A",
        l.User || "System",
        l.OldValue || "—",
        l.NewValue || "—",
        l.Timestamp || ""
    ]);

    switch (format) {
        case "json":
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${fileName}.json`;
            link.click();
            break;

        case "csv":
            const wsCsv = XLSX.utils.json_to_sheet(data);
            const csv = XLSX.utils.sheet_to_csv(wsCsv);
            const csvBlob = new Blob([csv], { type: "text/csv" });
            const csvUrl = URL.createObjectURL(csvBlob);
            const csvLink = document.createElement("a");
            csvLink.href = csvUrl;
            csvLink.download = `${fileName}.csv`;
            csvLink.click();
            break;

        case "excel":
            const wsXlsx = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, wsXlsx, "Audit Trail");
            XLSX.writeFile(wb, `${fileName}.xlsx`);
            break;

        case "pdf":
            const doc = new jsPDF("l", "mm", "a4");
            doc.text("System Audit History", 14, 15);
            autoTable(doc, {
                head: [headers],
                body: rows,
                startY: 20,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [15, 23, 42] }
            });
            doc.save(`${fileName}.pdf`);
            break;

        default:
            console.warn("Unsupported export format");
    }
};
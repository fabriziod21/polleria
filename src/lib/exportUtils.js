import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exportar datos como CSV y descargar
 */
export function exportCSV(data, columns, fileName = "export") {
  const header = columns.map((c) => c.label).join(",");
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = c.getValue(row);
      // Escapar comas y comillas
      const str = String(val ?? "");
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, `${fileName}.csv`);
}

/**
 * Exportar datos como Excel (.xlsx)
 */
export function exportExcel(data, columns, fileName = "export") {
  const wsData = [
    columns.map((c) => c.label),
    ...data.map((row) => columns.map((c) => c.getValue(row))),
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  // Ancho de columnas
  ws["!cols"] = columns.map((c) => ({ wch: c.width || 20 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

/**
 * Exportar datos como PDF
 */
export function exportPDF(data, columns, fileName = "export", title = "") {
  const doc = new jsPDF();

  if (title) {
    doc.setFontSize(16);
    doc.text(title, 14, 20);
  }

  autoTable(doc, {
    startY: title ? 30 : 15,
    head: [columns.map((c) => c.label)],
    body: data.map((row) => columns.map((c) => String(c.getValue(row) ?? ""))),
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [220, 38, 38], // red-600
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`${fileName}.pdf`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

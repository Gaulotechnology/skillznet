import { useState, useMemo, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  exportValue?: (row: T) => string | number;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  actions?: (row: T) => React.ReactNode;
  bulkActions?: React.ReactNode;
  headerActions?: React.ReactNode;
  emptyIcon?: string;
  emptyMessage?: string;
  exportFileName?: string;
  idField?: string;
  onRowClick?: (row: T) => void;
}

// ─── Utility: Audit log ───────────────────────────────────────────────────────

function logTableAction(action: string, details?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const user = (() => {
    try {
      const u = localStorage.getItem("skillzlink_user");
      return u ? JSON.parse(u)?.name || "Unknown" : "Unknown";
    } catch {
      return "Unknown";
    }
  })();
  console.info(
    `[DataTable] ${timestamp} | User: ${user} | Action: ${action}`,
    details || ""
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  title,
  subtitle,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  selectable = false,
  onSelectionChange,
  actions,
  bulkActions,
  headerActions,
  emptyIcon = "lnr lnr-layers",
  emptyMessage = "No records found",
  exportFileName = "export",
  idField = "id",
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [selectedIds, setSelectedIds] = useState<Set<any>>(new Set());

  // ─── Search ───────────────────────────────────────────────────────────

  const searchableKeys = useMemo(
    () => columns.filter((c) => c.searchable !== false).map((c) => c.key),
    [columns]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      searchableKeys.some((key) => {
        const val = row[key];
        return val != null && String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search, searchableKeys]);

  // ─── Sort ─────────────────────────────────────────────────────────────

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  // ─── Pagination ───────────────────────────────────────────────────────

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page, pageSize]
  );

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
    logTableAction("page_size_changed", { size });
  };

  // ─── Sort handler ─────────────────────────────────────────────────────

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    logTableAction("sort", { key, dir: sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : "asc" });
  };

  // ─── Selection ────────────────────────────────────────────────────────

  const toggleRow = useCallback(
    (id: any) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        if (onSelectionChange) {
          const selected = data.filter((r) => next.has(r[idField]));
          onSelectionChange(selected);
        }
        return next;
      });
    },
    [data, idField, onSelectionChange]
  );

  const toggleAll = useCallback(() => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    } else {
      const ids = new Set(paginated.map((r) => r[idField]));
      setSelectedIds(ids);
      onSelectionChange?.(paginated);
    }
  }, [paginated, selectedIds, idField, onSelectionChange]);

  // ─── Export ───────────────────────────────────────────────────────────

  const getExportData = () => {
    const exportCols = columns.filter((c) => c.exportable !== false);
    return sorted.map((row) => {
      const obj: Record<string, any> = {};
      exportCols.forEach((col) => {
        obj[col.label] = col.exportValue ? col.exportValue(row) : row[col.key] ?? "";
      });
      return obj;
    });
  };

  const exportToExcel = () => {
    const exportData = getExportData();
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `${exportFileName}.xlsx`);
    logTableAction("export_excel", { rows: exportData.length, fileName: exportFileName });
  };

  const exportToPDF = () => {
    const exportData = getExportData();
    const doc = new jsPDF({ orientation: "landscape" });
    const exportCols = columns.filter((c) => c.exportable !== false);

    doc.setFontSize(16);
    doc.text(title || exportFileName, 14, 20);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`Exported on ${new Date().toLocaleString()} — ${exportData.length} records`, 14, 28);

    autoTable(doc, {
      startY: 34,
      head: [exportCols.map((c) => c.label)],
      body: exportData.map((row) => exportCols.map((c) => String(row[c.label] ?? ""))),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [31, 41, 55], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save(`${exportFileName}.pdf`);
    logTableAction("export_pdf", { rows: exportData.length, fileName: exportFileName });
  };

  const exportToCSV = () => {
    const exportData = getExportData();
    const exportCols = columns.filter((c) => c.exportable !== false);
    const headers = exportCols.map((c) => c.label).join(",");
    const rows = exportData.map((row) =>
      exportCols.map((c) => `"${String(row[c.label] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers, ...rows].join("\n");
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8" }), `${exportFileName}.csv`);
    logTableAction("export_csv", { rows: exportData.length, fileName: exportFileName });
  };

  // ─── Search handler with logging ──────────────────────────────────────

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    if (value.length > 2) {
      logTableAction("search", { query: value, results: filtered.length });
    }
  };

  // ─── Pagination range ─────────────────────────────────────────────────

  const getPageRange = () => {
    const range: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          {title && <h2 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <i className="lnr lnr-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-56 pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="lnr lnr-cross text-xs"></i>
              </button>
            )}
          </div>

          {/* Export dropdown */}
          <ExportDropdown onExcel={exportToExcel} onPDF={exportToPDF} onCSV={exportToCSV} />

          {/* Custom header actions (Add button, etc.) */}
          {headerActions}
        </div>
      </div>

      {/* Bulk actions */}
      {selectable && selectedIds.size > 0 && (
        <div className="mb-3 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3 text-sm font-medium text-gray-700">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-5 h-5 rounded bg-gray-900 text-white text-xs flex items-center justify-center font-bold">
              {selectedIds.size}
            </span>
            selected
          </span>
          <div className="ml-auto flex items-center gap-2">{bulkActions}</div>
        </div>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    {selectable && (
                      <th className="w-10 px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === paginated.length && paginated.length > 0}
                          onChange={toggleAll}
                          className="w-3.5 h-3.5 rounded border-gray-300 accent-gray-900 cursor-pointer"
                        />
                      </th>
                    )}
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"} ${col.sortable !== false ? "cursor-pointer select-none hover:text-gray-900" : ""}`}
                        style={col.width ? { width: col.width } : undefined}
                        onClick={() => col.sortable !== false && handleSort(col.key)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {col.label}
                          {col.sortable !== false && sortKey === col.key && (
                            <i className={`lnr ${sortDir === "asc" ? "lnr-chevron-up" : "lnr-chevron-down"} text-[9px] text-gray-900`}></i>
                          )}
                        </span>
                      </th>
                    ))}
                    {actions && (
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="py-16 text-center">
                        <i className={`${emptyIcon} text-3xl text-gray-300 block mb-2`}></i>
                        <p className="text-sm text-gray-400">{emptyMessage}</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((row, idx) => (
                      <tr
                        key={row[idField] ?? idx}
                        className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70 transition-colors ${selectedIds.has(row[idField]) ? "bg-blue-50/40" : ""} ${onRowClick ? "cursor-pointer" : ""}`}
                        onClick={() => onRowClick?.(row)}
                      >
                        {selectable && (
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(row[idField])}
                              onChange={() => toggleRow(row[idField])}
                              className="w-3.5 h-3.5 rounded border-gray-300 accent-gray-900 cursor-pointer"
                            />
                          </td>
                        )}
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={`px-4 py-3 text-[13px] ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                          >
                            {col.render ? col.render(row, (page - 1) * pageSize + idx) : (
                              <span className="text-gray-900">{row[col.key] ?? "—"}</span>
                            )}
                          </td>
                        ))}
                        {actions && (
                          <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            {actions(row)}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer: pagination + page size */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>
                  Showing <strong className="text-gray-700">{Math.min((page - 1) * pageSize + 1, sorted.length)}</strong>–<strong className="text-gray-700">{Math.min(page * pageSize, sorted.length)}</strong> of <strong className="text-gray-700">{sorted.length}</strong>
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-gray-400 bg-white"
                >
                  {pageSizeOptions.map((s) => (
                    <option key={s} value={s}>{s} / page</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-2.5 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="lnr lnr-chevron-left text-xs"></i>
                </button>
                {getPageRange().map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${p === page ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || totalPages === 0}
                  className="px-2.5 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <i className="lnr lnr-chevron-right text-xs"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Export Dropdown ─────────────────────────────────────────────────────────

function ExportDropdown({
  onExcel,
  onPDF,
  onCSV,
}: {
  onExcel: () => void;
  onPDF: () => void;
  onCSV: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors flex items-center gap-1.5"
      >
        <i className="lnr lnr-download text-sm"></i>
        Export
        <i className="lnr lnr-chevron-down text-[9px] ml-0.5"></i>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
            <button
              onClick={() => { onExcel(); setOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">XL</span>
              Excel (.xlsx)
            </button>
            <button
              onClick={() => { onPDF(); setOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold">PDF</span>
              PDF (.pdf)
            </button>
            <button
              onClick={() => { onCSV(); setOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">CSV</span>
              CSV (.csv)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default DataTable;

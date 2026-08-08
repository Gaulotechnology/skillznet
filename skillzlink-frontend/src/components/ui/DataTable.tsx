import type {
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {{
                          asc: <i className="lnr lnr-chevron-up text-xs text-brand-600"></i>,
                          desc: <i className="lnr lnr-chevron-down text-xs text-brand-600"></i>,
                        }[header.column.getIsSorted() as string] ?? (
                          <i className="lnr lnr-chevron-down text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 bg-slate-50/50">
        <div className="text-sm text-slate-500 font-medium">
          Showing <span className="font-semibold text-slate-700">{table.getRowModel().rows.length > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1 : 0}</span> to{" "}
          <span className="font-semibold text-slate-700">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getPrePaginationRowModel().rows.length
            )}
          </span>{" "}
          of <span className="font-semibold text-slate-700">{table.getPrePaginationRowModel().rows.length}</span> results
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <i className="lnr lnr-chevron-left text-sm font-bold"></i>
          </button>
          <div className="flex items-center gap-1 mx-2">
            <span className="text-sm font-medium text-slate-700">Page {table.getState().pagination.pageIndex + 1}</span>
            <span className="text-sm text-slate-500">of {table.getPageCount() || 1}</span>
          </div>
          <button
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <i className="lnr lnr-chevron-right text-sm font-bold"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

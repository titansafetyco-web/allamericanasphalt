"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export type Column<T> = {
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

export function FilterTable<T extends { id: string }>({
  rows,
  columns,
  placeholder,
  searchText,
  empty = "No matching records.",
}: {
  rows: T[];
  columns: Column<T>[];
  placeholder: string;
  searchText: (row: T) => string;
  empty?: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => searchText(row).toLowerCase().includes(needle));
  }, [query, rows, searchText]);

  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-foreground/10">
      <div className="border-b px-4 py-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="h-10 max-w-sm bg-white"
          aria-label={placeholder}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/60 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={`px-4 py-3 font-semibold ${column.className ?? ""}`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                  {empty}
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="border-t border-border/80 hover:bg-muted/40">
                  {columns.map((column) => (
                    <td key={column.header} className={`px-4 py-3 ${column.className ?? ""}`}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import Button from "@/app/components/Button/Button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { CaretSortIcon } from "@radix-ui/react-icons";

const SchemePerformanceTable = ({ data, title }) => {

  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invested Type
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div>{row?.getValue("title")}</div>,
    },
    {
      accessorKey: "investedAmount",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invested Amount
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row?.getValue("investedAmount")}</div>,
    },
    {
      accessorKey: "buyRate",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Buy Rate
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("buyRate")}</div>,
    },
    {
      accessorKey: "buyUnit",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Buy Units
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("buyUnit")}</div>,
    },
    {
      accessorKey: "maturityDate",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Maturity Date
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("maturityDate")}</div>,
    },
    {
      accessorKey: "RateAtMaturity",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Maturity Rate
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("RateAtMaturity")}</div>,
    },
    {
      accessorKey: "maturityValue",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Maturity Value
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("maturityValue")}</div>,
    },
    {
      accessorKey: "absoluteReturns",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Absolute Return
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("absoluteReturns")}%</div>,
    },
    {
      accessorKey: "xirrRate",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer whitespace-nowrap text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          XIRR (%)
          <CaretSortIcon className="ml-1 h-4 w-4 text-white" />
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{row.getValue("xirrRate")}%</div>,
    },
  ];

  const table = useReactTable({
    data: data || [], // Make sure data is an empty array if undefined
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by title..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm border border-[var(--rv-primary)] rounded-xl focus:ring-[var(--rv-primary)]"
          />
        </div>
        <div className="rounded-xl border border-[var(--rv-primary)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--rv-primary)] text-white">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-[var(--rv-primary)]/90 border-b-0">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-white h-12 font-bold whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {data?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b border-[var(--rv-border)] hover:bg-[var(--rv-bg-primary-dark)]">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            text="Previous"
            className="px-4 py-2 text-sm rounded-full bg-[var(--rv-bg-surface)] text-[var(--rv-primary)] border border-[var(--rv-primary)] hover:bg-[var(--rv-primary)] hover:text-white transition-all disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          <Button
            text="Next"
            className="px-4 py-2 text-sm rounded-full bg-[var(--rv-bg-surface)] text-[var(--rv-primary)] border border-[var(--rv-primary)] hover:bg-[var(--rv-primary)] hover:text-white transition-all disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
        </div>
      </div>
    </div>
  );
};

export default SchemePerformanceTable;

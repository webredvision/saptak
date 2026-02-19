"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Input } from "@/app/(admin)/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/ui/table";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import Button from "@/app/components/Button/Button";

export default function ServicesTable({ AllServices }) {
  const router = useRouter();
  const [services, setServices] = React.useState(AllServices || []);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleEditService = (srv) => {
    router.push(`/admin/services/${srv.versionSlug}/${srv._id}`);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setLoading(true);

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/services/${selectedId}`
      );

      if (res.status === 200) {
        toast.success("Deleted successfully");
        setServices((prev) => prev.filter((srv) => srv._id !== selectedId));
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      toast.error("Error deleting service");
      console.error(error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button


          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
          variant="ghost"
          className="bg-transparent hover:bg-[var(--rv-bg-gray-light)] text-[var(--rv-black)]"
        >
          <span className="flex items-center gap-2">
            Service Name
          </span></button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="line-clamp-2 max-w-sm text-[var(--rv-gray-dark)]"
          dangerouslySetInnerHTML={{
            __html: row.getValue("description") || "",
          }}
        />
      ),
    },
    {
      accessorKey: "metaTitle",
      header: "Meta Title",
      cell: ({ row }) => <div>{row.getValue("metaTitle") || "-"}</div>,
    },
    {
      accessorKey: "metaDescription",
      header: "Meta Description",
      cell: ({ row }) => <div>{row.getValue("metaDescription") || "-"}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const srv = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleEditService(srv)}
              className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
            ><FiEdit2 size={16} /></button>
            <button
              onClick={() => confirmDelete(srv._id)}

              className="text-[var(--rv-red-dark)] border border-[var(--rv-red-dark)] rounded-md p-2"
            > <FiTrash2 size={16} /></button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: services,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="w-full p-3 bg-[var(--rv-bg-white)] rounded-md">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search service..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-xl border border-[var(--rv-gray-light)]"
        />
      </div>

      {/* Table */}
      <div className="rounded-md overflow-hidden border border-[var(--rv-gray-light)]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {services?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          text="Previous"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        />
        <Button
          text="Next"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        />
      </div>
      <ToastContainer />
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this Service?</p>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                text="Cancel"
                onClick={cancelDelete}
                disabled={loading}
                className="bg-[var(--rv-bg-gray)] text-[var(--rv-black)] rounded-md"
              />
              <Button
                text={loading ? "Deleting..." : "Delete"}
                onClick={handleDelete}
                disabled={loading}
                icon={loading && <FaSpinner className="animate-spin ml-2" />}
                className="bg-[var(--rv-bg-red-dark)] hover:bg-[var(--rv-bg-red-dark)] text-[var(--rv-white)] rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

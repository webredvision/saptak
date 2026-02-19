"use client";
import React, { useEffect, useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import Button from "@/app/components/Button/Button";
import { Input } from "@/app/(admin)/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(admin)/ui/table";
import Loader from "@/app/(admin)/admin/common/Loader";

const ManageGallery = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 🧠 Fetch gallery data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/gallery");
        if (res.status === 200) setData(res.data);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
        toast.error("Failed to load gallery data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🧩 Confirm delete dialog
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  // 🗑️ Handle delete
  const handleDelete = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/api/gallery/${selectedId}`);
      if (res.status === 200) {
        setData((prev) => prev.filter((item) => item._id !== selectedId));
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting image.");
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  // 🧾 Table columns
  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const img = row.getValue("image");
        const src = img?.url || "/placeholder.png";
        return (
          <Image
            src={src}
            width={80}
            height={80}
            alt="Gallery Image"
            className="rounded-md object-cover border"
          />
        );
      },
    },
    {
      id: "category",
      header: "Category",
      accessorFn: (row) => row.category?.title || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Added On",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const gallery = row.original;
        return (
          <button
            onClick={() => confirmDelete(gallery._id)}
            className="text-[var(--rv-red-dark)] border border-[var(--rv-red-dark)] rounded-md p-2 hover:bg-[var(--rv-bg-red-light)]"
          >
            <FiTrash2 size={16} />
          </button>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
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
    < div>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />

      <div className="flex justify-between mb-4 items-center">
        <h6 className="font-semibold text-lg">Manage Gallery</h6>
        <Link href="/admin/manage-gallery/add-image">
          <Button
            text="Add New Image"
          />
        </Link>
      </div>

      {loading && data.length === 0 ? (
        <Loader />
      ) : (
        <div className="w-full bg-[var(--rv-bg-white)] p-4 rounded-md shadow-sm flex flex-col gap-4">
          <div className="flex items-center">
            <Input
              placeholder="Filter by category..."
              value={table.getColumn("category")?.getFilterValue() ?? ""}
              onChange={(e) => table.getColumn("category")?.setFilterValue(e.target.value)}
              className="max-w-sm border border-[var(--rv-gray)]"
            />
          </div>

          <div className="rounded-md overflow-hidden border border-[var(--rv-gray-light)]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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

          <div className="flex items-center justify-between py-3">
            <span className="text-[var(--rv-gray)]">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} selected
            </span>

            <div className="flex gap-2">
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
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--rv-bg-white)] p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
            <p className="text-[var(--rv-gray-dark)] font-medium">Are you sure you want to delete this image?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-[var(--rv-bg-gray-light)] rounded hover:bg-[var(--rv-bg-gray)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-[var(--rv-bg-red-dark)] text-[var(--rv-white)] rounded hover:bg-[var(--rv-bg-red-dark)] disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ div>
  );
};

export default ManageGallery;

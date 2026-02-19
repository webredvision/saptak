"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import formatDate from "@/lib/formatDate";
import Button from "@/app/components/Button/Button";
import { Input } from "@/app/(admin)/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/ui/table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/app/(admin)/admin/common/Loader";

const DataTableDemo = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  // ✅ Fetch Testimonials
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/testimonials/`
      );
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("❌ Failed to fetch testimonials");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // ✅ Confirm Delete
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
    const toastId = toast.loading("Deleting testimonial...");

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/testimonials/${selectedId}`
      );

      if (res.status === 200) {
        toast.update(toastId, {
          render: "Testimonial deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setShowConfirm(false);
        setSelectedId(null);
        await fetchData();
      } else {
        toast.update(toastId, {
          render: "⚠️ Failed to delete testimonial!",
          type: "error",
          isLoading: false,
          autoClose: 2500,
        });
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "❌ Something went wrong while deleting!",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.getValue("image")?.url}
          width={80}
          height={80}
          className="rounded-full"
          alt="image"
        />
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => <div>{row.getValue("author")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Post date",
      cell: ({ row }) => (
        <div className="capitalize">{formatDate(row.getValue("createdAt"))}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const testimonial = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                router.push(`/admin/manage-testimonials/edit-post/${testimonial._id}`)
              }
              className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => confirmDelete(testimonial._id)}
              className="text-[var(--rv-red-dark)] border border-[var(--rv-red-dark)] rounded-md p-2"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between items-center gap-5 mb-4">
        <h6 className="font-semibold">All Testimonials</h6>
        <Link href="/admin/manage-testimonials/add-testimonial">
          <Button
            text="Add New"
          />
        </Link>
      </div>

      {loading && data.length === 0 ? (
        <Loader />
      ) : (
        <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md flex flex-col gap-3">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by author..."
              value={table.getColumn("author")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("author")?.setFilterValue(event.target.value)
              }
              className="max-w-xl border border-[var(--rv-gray)]"
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
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
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
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
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
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this video?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={cancelDelete} className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-[var(--rv-bg-red)] text-[var(--rv-white)] rounded"
              >
                {loading ? "Deleting..." : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableDemo;

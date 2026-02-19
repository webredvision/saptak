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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/ui/table";
import { Input } from "@/app/(admin)/ui/input";
import Loader from "@/app/(admin)/admin/common/Loader";

// ✅ Import Toastify
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AwardsTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  // ✅ Fetch awards data
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards/`
        );
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch awards", error);
        toast.error("❌ Failed to fetch awards");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Confirm deletion modal
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  // ✅ Handle delete (with toastify)
  const handleDelete = async () => {
    if (!selectedId) return;
    setLoading(true);
    const toastId = toast.loading("Deleting award...");
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/awards/${selectedId}`
      );

      if (res.status === 200) {
        // Update UI immediately
        setData((prev) => prev.filter((item) => item._id !== selectedId));

        toast.update(toastId, {
          render: "Award deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.update(toastId, {
          render: "⚠️ Failed to delete award!",
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
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  // ✅ Define table columns
  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const img = row.getValue("image");
        return img?.url ? (
          <Image
            src={img.url}
            width={80}
            height={80}
            alt="award image"
            className="rounded-md"
          />
        ) : (
          <span>No Image</span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "presentedBy",
      header: "Presented By",
      cell: ({ row }) => <div>{row.getValue("presentedBy")}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="capitalize">{formatDate(row.getValue("date"))}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const award = row.original;

        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                router.push(`/admin/manage-awards/edit/${award._id}`)
              }
              className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>

            <button
              onClick={() => confirmDelete(award._id)}
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
    < div>
      <ToastContainer />

      <div className="flex justify-between items-center gap-5 mb-4">
        <h6 className="font-semibold">Manage Awards</h6>
        <Link href="/admin/manage-awards/add-awards">
          <Button
            text="Add New Award"
          />
        </Link>
      </div>

      {loading && data.length === 0 ? (
        <Loader />
      ) : (
        <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md flex flex-col gap-3">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(e) =>
                table.getColumn("name")?.setFilterValue(e.target.value)
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
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
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

      {/* ✅ Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
            <p className="font-medium mb-2">
              Are you sure you want to delete this award?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded hover:bg-[var(--rv-bg-gray)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-[var(--rv-bg-red-dark)] text-[var(--rv-white)] rounded hover:bg-[var(--rv-bg-red-dark)]"
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

export default AwardsTable;

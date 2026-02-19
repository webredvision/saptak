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
import { TbLockCancel, TbLockCheck } from "react-icons/tb";

const PopupsTable = () => {
  const router = useRouter();

  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  // ✅ Fetch Popups
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/`
      );
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("❌ Failed to fetch popups");
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

  // ✅ Handle Delete with Toastify feedback
  const handleDelete = async () => {
    if (!selectedId) return;
    setLoading(true);
    const toastId = toast.loading("Deleting popup...");

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/${selectedId}`
      );

      if (res.status === 200) {
        toast.update(toastId, {
          render: "Popup deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setShowConfirm(false);
        setSelectedId(null);
        await fetchData();
      } else {
        toast.update(toastId, {
          render: "⚠️ Failed to delete popup!",
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

  // ✅ Toggle Popup Status
  const toggleStatus = async (id, currentStatus) => {
    const toastId = toast.loading("Updating popup status...");
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/webpopups/changestatus/`,
        { id, status: !currentStatus }
      );

      if (res.status === 201) {
        toast.update(toastId, {
          render: "Status updated successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        await fetchData();
      } else {
        toast.update(toastId, {
          render: "⚠️ Failed to update status!",
          type: "error",
          isLoading: false,
          autoClose: 2500,
        });
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "❌ Error while updating status!",
        type: "error",
        isLoading: false,
        autoClose: 2500,
      });
    }
  };

  // ✅ Table Columns
  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const image = row.getValue("image");
        return image?.url ? (
          <Image
            src={image.url}
            width={120}
            height={80}
            alt="popup"
            className="rounded-md"
          />
        ) : (
          <span className="text-[var(--rv-gray)] italic">No Image</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={`px-3 py-1 font-medium rounded-full ${status ? "bg-[var(--rv-bg-green-light)] text-[var(--rv-green-dark)]" : "bg-[var(--rv-bg-red-light)] text-[var(--rv-red-dark)]"
              }`}
          >
            {status ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => formatDate(row.getValue("updatedAt")),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const popup = row.original;
        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleStatus(popup._id, popup.status)}
              className={`border rounded-md p-2 ${!popup.status
                ? "border-[var(--rv-red)] text-[var(--rv-red-dark)]"
                : "border-[var(--rv-green-dark)] text-[var(--rv-green-dark)]"
                }`}
            >
              {!popup.status ? <TbLockCancel /> : <TbLockCheck />}
            </button>
            <button
              onClick={() =>
                router.push(`/admin/manage-popups/edit/${popup._id}`)
              }
              className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => confirmDelete(popup._id)}
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
    <>
      <ToastContainer />
      <div className="flex justify-between items-center gap-5 mb-4">
        <h6 className="font-semibold">All Popups</h6>
        {data.length === 0 && (
          <Link href="/admin/manage-popups/add">
            <Button
              text="Add New Popup"
            />
          </Link>
        )}
      </div>

      {loading && data.length === 0 ? (
        <Loader />
      ) : (
        <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md flex flex-col gap-3">
          {/* 🔍 Search Filter */}
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter by title..."
              value={table.getColumn("title")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-xl border border-[var(--rv-gray)]"
            />
          </div>

          {/* 🧾 Data Table */}
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
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 🔄 Pagination Controls */}
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

      {/* 🗑️ Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this popup?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded"
              >
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
    </>
  );
};

export default PopupsTable;

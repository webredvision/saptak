"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import formatDate from "@/lib/formatDate";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(admin)/ui/dialog";
import Button from "@/app/components/Button/Button";
import { Label } from "@/app/(admin)/ui/label";
import { Input } from "@/app/(admin)/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/ui/table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/app/(admin)/admin/common/Loader";

const GalleryCategoryTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false); // separate for CRUD actions
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [categorytitle, setCategorytitle] = React.useState("");
  const [editCategoryId, setEditCategoryId] = React.useState("");
  const [deleteId, setDeleteId] = React.useState(null);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory`
      );
      if (res.status === 200) setData(res.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory/${deleteId}`
      );
      if (res.status === 201) {
        setData((prev) => prev.filter((c) => c._id !== deleteId));
        toast.success("Category deleted successfully");
      }
    } catch {
      toast.error("Error deleting category");
    } finally {
      setShowConfirm(false);
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async () => {
    if (!categorytitle.trim()) {
      toast.warn("Title is required");
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory`,
        { categorytitle }
      );
      if (res.status === 201) {
        fetchData();
        setDialogOpen(false);
        toast.success("Gallery category added successfully");
      }
    } catch {
      toast.error("Error adding category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!categorytitle.trim()) {
      toast.warn("Title is required");
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/gallerycategory/${editCategoryId}`,
        { categorytitle }
      );
      if (res.status === 201) {
        fetchData();
        setDialogOpen(false);
        toast.success("Gallery category updated successfully");
      }
    } catch {
      toast.error("Error updating category");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => <div>{formatDate(row.getValue("updatedAt"))}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const cate = row.original;
        return (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditCategoryId(cate._id);
                setCategorytitle(cate.title);
                setDialogOpen(true);
              }}
              className="text-[var(--rv-primary)] border border-[var(--rv-primary)] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>
            <button
              onClick={() => {
                setDeleteId(cate._id);
                setShowConfirm(true);
              }}
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
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    < div>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex justify-between mb-4 items-center">
        <h6 className="font-semibold">Gallery Categories</h6>
        {data.length < 10 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setDialogOpen(true);
                  setCategorytitle("");
                  setEditCategoryId("");
                }}
                text="Add New"
              />
            </DialogTrigger>
            <DialogContent className="bg-[var(--rv-bg-white)]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">
                  {editCategoryId
                    ? "Edit Gallery Category"
                    : "Add Gallery Category"}
                </DialogTitle>
                <DialogDescription>
                  {editCategoryId
                    ? "Update this gallery category."
                    : "Add a new gallery category."}
                </DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter category title"
                  value={categorytitle}
                  className="border border-[var(--rv-gray-dark)]"
                  onChange={(e) => setCategorytitle(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  disabled={actionLoading}
                  onClick={editCategoryId ? handleUpdate : handleSubmit}
                  text={
                    actionLoading ? (
                      <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" /> Processing...
                      </span>
                    ) : editCategoryId ? (
                      "Update"
                    ) : (
                      "Save"
                    )
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {data.length >= 10 && (
        <p className="text-[var(--rv-red-dark)] mb-4">
          You’ve reached the maximum limit of 10 categories.
        </p>
      )}

      {loading && data.length === 0 ? (
        <Loader />
      ) : (
        <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md flex flex-col gap-3">
          <Input
            placeholder="Filter by title..."
            value={table.getColumn("title")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table.getColumn("title")?.setFilterValue(e.target.value)
            }
            className="max-w-md border"
          />
          <div className="rounded-md overflow-hidden border border-[var(--rv-gray-light)]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
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
                      className="text-center h-24"
                    >
                      No gallery categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
            <p className="font-medium text-center">
              Are you sure you want to delete this category?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-[var(--rv-bg-red)] text-[var(--rv-white)] rounded flex items-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Deleting...
                  </>
                ) : (
                  "OK"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </ div>
  );
};

export default GalleryCategoryTable;

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
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/app/(admin)/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/(admin)/ui/table";
import { FaSpinner } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper function for date formatting
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const DataTableDemo = () => {
    const router = useRouter();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [categorytitle, setCategorytitle] = React.useState("");
    const [editCategoryId, setEditCategoryId] = React.useState("");
    const [deleteId, setDeleteId] = React.useState(null);
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category/`
            );
            if (res.status === 200) {
                setData(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error("Failed to load data.");
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const confirmDelete = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category/${deleteId}`
            );
            if (res.status === 201) {
                setData((prevData) => prevData.filter((cate) => cate._id !== deleteId));
                toast.success("Category deleted successfully.");
            } else {
                toast.error("Failed to delete category.");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Error deleting category.");
        }
        setLoading(false);
        setConfirmOpen(false);
        setDeleteId(null);
    };


    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category/`,
                { categorytitle }
            );
            if (res.status === 201) {
                setData((prevData) => [
                    ...prevData,
                    {
                        _id: res.data._id,
                        title: categorytitle,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                ]);
                setDialogOpen(false);
                toast.success("Category added successfully!");
            } else {
                toast.error("Failed to add category.");
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Error adding category.");
        }
        setLoading(false);
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/category/${editCategoryId}`,
                { categorytitle }
            );
            if (res.status === 201) {
                fetchData();
                setDialogOpen(false);
                toast.success("Category updated successfully!");
            } else {
                toast.error("Failed to update category.");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Error updating category.");
        }
        setLoading(false);
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Post date",
            cell: ({ row }) => (
                <div className="capitalize">{formatDate(row.getValue("createdAt"))}</div>
            ),
        },
        {
            accessorKey: "updatedAt",
            header: "Last Update",
            cell: ({ row }) => (
                <div className="capitalize">{formatDate(row.getValue("updatedAt"))}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const cate = row.original;

                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setEditCategoryId(cate._id);
                                setCategorytitle(cate.title);
                                setDialogOpen(true);
                            }}
                            className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
                        >
                            <FiEdit2 size={16} />
                        </button>

                        <button
                            onClick={() => confirmDelete(cate._id)}
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

            <div className="flex justify-between mb-5">
                <h6 className="font-semibold">All Categories</h6>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setDialogOpen(true);
                                setCategorytitle("");
                                setEditCategoryId("");
                            }}
                            text='Add New'
                        />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-[var(--rv-bg-white)]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">
                                {editCategoryId ? "Edit Category" : "Add New Category"}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the details for the{" "}
                                {editCategoryId ? "edit" : "new"} category.
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label htmlFor="posttitle" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="posttitle"
                                placeholder="Enter title"
                                value={categorytitle}
                                onChange={(e) => setCategorytitle(e.target.value)}
                                className="border border-[var(--rv-gray-dark)]"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                onClick={editCategoryId ? handleUpdate : handleSubmit}
                                text={!loading ? (
                                    <>{editCategoryId ? "Update Category" : "Save Category"}</>
                                ) : (
                                    <>
                                         <FaSpinner className="animate-spin h-4 w-4 mr-2 inline-block" />
                                        Submitting...
                                    </>
                                )}
                            />
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md flex flex-col gap-3">
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
                                        No data.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
                        <p>Are you sure you want to delete this category?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button  onClick={() => setConfirmOpen(false)} className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded">
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
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

export default DataTableDemo;

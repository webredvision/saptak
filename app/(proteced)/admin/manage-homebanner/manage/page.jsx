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
import formatDate from "@/lib/formatDate";

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

    // ✅ Fetch banners
    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/`
                );
                if (res.status === 200) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch banners", error);
                toast.error("Failed to fetch banners!");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // ✅ Confirm delete modal
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
                `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/homebanner/${selectedId}`
            );
            if (res.status === 200) {
                setData((prevData) => prevData.filter((b) => b._id !== selectedId));
                toast.success("Banner deleted successfully!");
            } else {
                toast.error("Failed to delete banner!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting banner!");
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
                const image = row.getValue("image");
                return (
                    <div className="flex justify-center">
                        {image?.url ? (
                            <Image
                                src={image.url}
                                width={80}
                                height={80}
                                className="rounded-md object-cover"
                                alt="banner"
                            />
                        ) : (
                            <div className="text-[var(--rv-gray)]  ">No image</div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
        },
        {
            accessorKey: "designation",
            header: "Designation",
            cell: ({ row }) => <div>{row.getValue("designation")}</div>,
        },
        {
            accessorKey: "auther_url",
            header: "Author URL",
            cell: ({ row }) => (
                <Link
                    href={row.getValue("auther_url") || "#"}
                    target="_blank"
                    className="text-[var(--rv-blue-dark)] hover:underline"
                >
                    {row.getValue("auther_url") || "-"}
                </Link>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Post Date",
            cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <div className="flex items-center gap-3 justify-center">
                        <button
                            onClick={() =>
                                router.push(`/admin/manage-homebanner/edit-post/${blog._id}`)
                            }
                            className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2 hover:bg-[var(--rv-bg-primary)] hover:text-[var(--rv-white)]"
                        >
                            <FiEdit2 size={16} />
                        </button>

                        <button
                            onClick={() => confirmDelete(blog._id)}
                            className="text-[var(--rv-red-dark)] border border-[var(--rv-red-dark)] rounded-md p-2 hover:bg-[var(--rv-bg-red-dark)] hover:text-[var(--rv-white)]"
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
            <div className="flex justify-between items-center mb-5">
                <h6 className="font-bold">Manage Home Banners</h6>
                {data.length < 5 ? (
                    <Link href="/admin/manage-homebanner/add-homebanner">
                        <Button
                            text="Add New"
                        />
                    </Link>
                ) : (
                    <p className="text-[var(--rv-red)] font-medium">
                        You already have 5 banners. Cannot add more.
                    </p>
                )}
            </div>

            <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter by title..."
                        value={table.getColumn("title")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table.getColumn("title")?.setFilterValue(e.target.value)
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
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-end gap-2 py-4">
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

            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-[var(--rv-bg-white)] p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
                        <h3 className="  font-semibold mb-3 text-[var(--rv-gray-dark)]">
                            Confirm Deletion
                        </h3>
                        <p className="text-[var(--rv-gray-dark)] mb-4">
                            Are you sure you want to delete this banner?
                        </p>
                        <div className="flex justify-end gap-3">
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
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" />
        </ div>
    );
};

export default DataTableDemo;

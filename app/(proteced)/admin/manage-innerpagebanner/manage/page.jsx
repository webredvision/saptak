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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(admin)/ui/table";
import Loader from "@/app/(admin)/admin/common/Loader";
import formatDate from "@/lib/formatDate";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/innerpagebanner/`);
                if (res.status === 200) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch inner page banner", error);
                toast.error("Failed to load banners");
            }
            setLoading(false);
        };

        fetchData();
    }, []);
    const confirmDelete = (id) => {
        setSelectedId(id);
        setShowConfirm(true);
    };
    const CancelDelete = () => {
        setShowConfirm(false);
        setSelectedId(null);
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        setLoading(true);

        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/innerpagebanner/${selectedId}`);

            if (res.status === 200) {
                setData((prevData) => prevData.filter((blog) => blog._id !== selectedId));
                toast.success("Deleted successfully!");
            } else {
                toast.error("Failed to delete banner");
            }
        } catch (error) {
            toast.error("Error deleting banner");
            console.error(error);
        } finally {
            setLoading(false);
            setShowConfirm(false);
            setSelectedId(null);
        }
    };


    const columns = [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => <div><Image src={row.getValue("image")?.url} width={100} height={100} className="rounded-full" priority={false} alt="image" /></div>,
        },
        {
            accessorKey: "title",
            header: "title",
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
        },
        {
            accessorKey: "createdAt",
            header: "Post date",
            cell: ({ row }) => <div className="capitalize">{formatDate(row.getValue("createdAt"))}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const blog = row.original;

                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/admin/manage-innerpagebanner/edit-post/${blog._id}`)}
                            className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
                        >
                            <FiEdit2 size={16} />
                        </button>

                        <button
                            onClick={() => confirmDelete(blog._id)}
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
            <div className="flex justify-between items-center gap-5 mb-4">
                <h6 className='font-semibold'>Manage Inner Banner</h6>
                <Link href="/admin/manage-innerpagebanner/add-innerbanner">
                    <Button text='Add New'></Button>
                </Link>
            </div>
            {loading && data.length === 0 ? (
                <Loader />
            ) : (
                <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md flex flex-col gap-2">
                    <div className="flex items-center">
                        <Input
                            placeholder="Filter by title..."
                            value={(table.getColumn("title")?.getFilterValue()) ?? ""}
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
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table?.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end gap-2">
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
                        <p>Are you sure you want to delete this InnerBanner?</p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={CancelDelete} className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded">
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
            <ToastContainer />
        </ div>
    );
};

export default DataTableDemo;

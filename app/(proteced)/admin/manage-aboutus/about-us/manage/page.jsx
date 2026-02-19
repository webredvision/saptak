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
import { FiEdit2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
  
import Button from "@/app/components/Button/Button";
import Loader from "@/app/(admin)/admin/common/Loader";
import { Input } from "@/app/(admin)/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(admin)/ui/table";
import formatDate from "@/lib/formatDate";

const DataTableAboutUs = () => {
    const router = useRouter();
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/aboutus`);
                if (res.status === 200) setData(res.data);
            } catch (error) {
                toast.error("Failed to fetch About Us data ❌");
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns = [
        {
            accessorKey: "image",
            header: "Image",
            cell: ({ row }) => {
                const imageUrl = row.getValue("image")?.url || "/placeholder.jpg";
                return <Image src={imageUrl} width={80} height={80} className="rounded-md object-cover" alt="About Image" />;
            },
        },
        { accessorKey: "title", header: "Title", cell: ({ row }) => <div>{row.getValue("title")}</div> },
        { accessorKey: "createdAt", header: "Created", cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div> },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const blog = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/admin/manage-aboutus/about-us/edit/${blog._id}`)}
                            className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
                        >
                            <FiEdit2 size={16} />
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
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex justify-between mb-4 items-center">
                <h6 className='font-semibold'>
                    About Us
                </h6>
                {(!data || data?.length === 0) && (
                    <Link href="/admin/manage-aboutus/about-us/add">
                        <Button text={'Add About Us'} />
                    </Link>
                )}
            </div>

            {loading && data.length === 0 ? (
                <Loader />
            ) : (
                <div className="bg-[var(--rv-bg-white)] p-3 rounded-md">
                    <div className="flex items-center py-2">
                        <Input
                            placeholder="Filter by title..."
                            value={(table.getColumn("title")?.getFilterValue()) ?? ""}
                            onChange={(e) => table.getColumn("title")?.setFilterValue(e.target.value)}
                            className="max-w-xl border border-[var(--rv-gray)]"
                        />
                    </div>
                    <div className="rounded-md overflow-hidden border border-[var(--rv-gray-light)]">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between space-x-2 ">
                        <div className="  text-muted-foreground flex-1">
                            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
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
                </div>
            )}
        </ div>
    );
};

export default DataTableAboutUs;

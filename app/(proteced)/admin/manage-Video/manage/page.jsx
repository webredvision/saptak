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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatDate from "@/lib/formatDate";
import Button from "@/app/components/Button/Button";
import { Input } from "@/app/(admin)/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(admin)/ui/table";
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

    // Fetch video data
    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin/`);
                if (res.status === 200) setData(res.data);
            } catch (error) {
                console.error("Failed to fetch video", error);
                toast.error("Failed to fetch videos");
            }
            setLoading(false);
        };

        fetchData();
    }, []);

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
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/video-admin/${selectedId}`);
            if (res.status === 200) {
                setData((prevData) => prevData.filter((item) => item._id !== selectedId));
                toast.success("Video deleted successfully!");
            } else {
                toast.error("Failed to delete video");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting video");
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
            cell: ({ row }) => {
                const video = row.original;
                const image = row.getValue("image");
                const imageUrl =
                    image?.url && image.url.trim() !== ""
                        ? image.url
                        : "https://placehold.co/100x100?text=No+Image";
                const videoLink = video?.embedUrl || video?.videoUrl || "";

                const thumb = (
                    <div className="w-20">
                        <img
                            src={imageUrl}
                            className="rounded-full object-cover"
                            alt="video image"
                        />
                    </div>
                );

                return videoLink ? (
                    <a href={videoLink} target="_blank" rel="noopener noreferrer">
                        {thumb}
                    </a>
                ) : (
                    thumb
                );
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const video = row.original;
                const type = video?.embedUrl ? "Iframe" : "Manual";
                return <div>{type}</div>;
            },
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
        },
        {
            accessorKey: "videoUrl",
            header: "Video Url",
            cell: ({ row }) => {
                const url = row.getValue("videoUrl");
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--rv-primary)] hover:underline"
                    >
                        {url}
                    </a>
                ) : (
                    <span>-</span>
                );
            },
        },
        {
            accessorKey: "embedUrl",
            header: "Embed Url",
            cell: ({ row }) => {
                const url = row.getValue("embedUrl");
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--rv-primary)] hover:underline"
                    >
                        {url}
                    </a>
                ) : (
                    <span>-</span>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Post date",
            cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const video = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push(`/admin/manage-Video/edit-video/${video._id}`)}
                            className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
                        >
                            <FiEdit2 size={16} />
                        </button>

                        <button
                            onClick={() => confirmDelete(video._id)}
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
        <div>
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="flex justify-between items-center gap-5 mb-4">
                <h6 className="font-semibold">Manage Video</h6>
                <Link href="/admin/manage-Video/add-Video">
                    <Button
                        text={"Add New Video"}
                    />
                </Link>
            </div>

            {loading && data.length === 0 ? (
                <Loader />
            ) : (
                <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md flex flex-col gap-3">
                    <div className="flex items-center">
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

                    <div className="flex items-center justify-end space-x-2">
                        <div className="flex-1 text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="flex items-center gap-2">
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

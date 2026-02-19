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
import { Input } from "@/app/(admin)/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(admin)/ui/table";
import formatDate from "@/lib/formatDate";
import Loader from "@/app/(admin)/admin/common/Loader";
import Button from "@/app/components/Button/Button";

const DataTableDemo = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState("contactus");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [actionLoadingId, setActionLoadingId] = React.useState(null);
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [selectedLead, setSelectedLead] = React.useState(null);
    const [showLeadModal, setShowLeadModal] = React.useState(false);

    const openLeadModal = (lead) => {
        const normalized = {
            ...lead,
            _id: normalizeId(lead?._id || lead?.id),
        };
        setSelectedLead(normalized);
        setShowLeadModal(true);
    };

    const closeLeadModal = () => {
        setShowLeadModal(false);
        setSelectedLead(null);
    };

    const truncateText = (text, limit = 80) => {
        if (!text) return "-";
        const value = String(text);
        return value.length > limit ? `${value.slice(0, limit)}...` : value;
    };

    const normalizeId = (id) => {
        if (!id) return "";
        if (typeof id === "string") return id;
        if (id.$oid) return id.$oid;
        if (id._id) return id._id;
        return String(id);
    };

    const apiBase =
        typeof window !== "undefined" && window?.location?.origin
            ? window.location.origin
            : (process.env.NEXT_PUBLIC_NEXTAUTH_URL || "");
    const normalizedBase = apiBase.replace(/\/$/, "");
    const getApiUrl = (path) => (normalizedBase ? `${normalizedBase}${path}` : path);

    const fetchData = async (type, status = "all") => {
        setLoading(true);
        try {
            let url = "";
            switch (type) {
                case "contactus":
                    url = getApiUrl("/api/leads");
                    break;
                case "botleads":
                    url = getApiUrl("/api/bot/leads");
                    break;
                case "riskprofile":
                    url = getApiUrl("/api/riskprofileuser");
                    break;
                case "healthprofile":
                    url = getApiUrl("/api/financialhealthuser");
                    break;
                default:
                    url = getApiUrl("/api/leads");
            }

            const finalUrl =
                status === "all" ? url : `${url}?status=${status}`;
            const res = await axios.get(finalUrl);
            if (res.status === 200) {
                const leads = res?.data?.leads || res?.data || [];
                const normalizedLeads = Array.isArray(leads)
                    ? leads.map((lead) => ({
                        ...lead,
                        _id: normalizeId(lead?._id || lead?.id),
                    }))
                    : [];
                setData(normalizedLeads);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData(activeTab, statusFilter);
    }, [activeTab, statusFilter]);

    const markComplete = async (leadId) => {
        const normalizedId = normalizeId(leadId);
        if (!normalizedId) return;
        setActionLoadingId(normalizedId);
        try {
            let res;
            if (activeTab === "botleads") {
                res = await axios.put(getApiUrl(`/api/bot/leads?id=${normalizedId}`));
            } else if (activeTab === "contactus") {
                res = await axios.put(getApiUrl(`/api/leads?id=${normalizedId}`));
            } else if (activeTab === "riskprofile") {
                res = await axios.put(getApiUrl(`/api/riskprofileuser?id=${normalizedId}`));
            } else if (activeTab === "healthprofile") {
                res = await axios.put(getApiUrl(`/api/financialhealthuser?id=${normalizedId}`));
            }
            const updated = res?.data?.lead;
            if (updated?._id) {
                setData((prev) =>
                    prev.map((item) => (item?._id === leadId ? { ...item, ...updated } : item))
                );
                if (selectedLead && selectedLead?._id === leadId) {
                    setSelectedLead((prev) => (prev ? { ...prev, ...updated } : prev));
                }
                if (statusFilter === "pending") {
                    setData((prev) => prev.filter((item) => item?._id !== leadId));
                    closeLeadModal();
                }
            } else {
                console.error("Lead update failed:", res?.data);
            }
            await fetchData(activeTab, statusFilter);
        } catch (error) {
            console.error("Error updating lead:", error);
        } finally {
            setActionLoadingId(null);
        }
    };

    const deleteLead = async (leadId) => {
        const normalizedId = normalizeId(leadId);
        if (!normalizedId) return;
        setActionLoadingId(normalizedId);
        try {
            let res;
            if (activeTab === "botleads") {
                res = await axios.delete(getApiUrl(`/api/bot/leads?id=${normalizedId}`));
            } else if (activeTab === "contactus") {
                res = await axios.delete(getApiUrl(`/api/leads?id=${normalizedId}`));
            } else if (activeTab === "riskprofile") {
                res = await axios.delete(getApiUrl(`/api/riskprofileuser?id=${normalizedId}`));
            } else if (activeTab === "healthprofile") {
                res = await axios.delete(getApiUrl(`/api/financialhealthuser?id=${normalizedId}`));
            }
            const updated = res?.data?.lead;
            if (updated?._id) {
                setData((prev) =>
                    prev.map((item) => (item?._id === leadId ? { ...item, ...updated } : item))
                );
                if (selectedLead && selectedLead?._id === leadId) {
                    setSelectedLead((prev) => (prev ? { ...prev, ...updated } : prev));
                }
            } else {
                console.error("Lead delete failed:", res?.data);
            }
            await fetchData(activeTab, statusFilter);
            if (selectedLead && selectedLead?._id === leadId) {
                setSelectedLead((prev) => (prev ? { ...prev, isDeleted: true } : prev));
            }
        } catch (error) {
            console.error("Error deleting lead:", error);
        } finally {
            setActionLoadingId(null);
        }
    };

    const getColumns = () => {
        const baseColumns = [
            {
                id: "srno",
                header: "S. No.",
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => <div>{row.getValue("email")}</div>,
            },
            {
                accessorKey: "mobile",
                header: "Mobile",
                cell: ({ row }) => <div>{row.getValue("mobile")}</div>,
            },
        ];

        const dateColumn = {
            accessorKey: "createdAt",
            header: "Post Date",
            cell: ({ row }) => (
                <div className="capitalize">
                    {formatDate(row.getValue("createdAt"))}
                </div>
            ),
        };

        const statusColumn = {
            accessorKey: "isComplete",
            header: "Status",
            cell: ({ row }) => {
                const lead = row.original;
                const value = row.getValue("isComplete");
                const done = value === true || value === "true" || value === 1;
                const isDeleted = Boolean(lead?.isDeleted);
                return (
                    <div
                        className={
                            isDeleted
                                ? "text-[var(--rv-bg-red)] font-semibold"
                                : done
                                    ? "text-[var(--rv-green)] font-semibold"
                                    : "text-[var(--rv-bg-primary)] font-semibold"
                        }
                    >
                        {isDeleted ? "Deleted" : done ? "Converted" : "Pending"}
                    </div>
                );
            },
        };

        const detailsColumn = {
            id: "details",
            header: "Details",
            cell: ({ row }) => {
                const lead = row.original;
                return (
                    <Button
                        text="View"
                        className="bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-primary)] text-[var(--rv-white)]"
                        onClick={() => openLeadModal(lead)}
                    />
                );
            },
        };

        switch (activeTab) {
            case "contactus":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "message",
                        header: "Message",
                        cell: ({ row }) => (
                            <div title={row.getValue("message")}>
                                {truncateText(row.getValue("message"))}
                            </div>
                        ),
                    },
                    statusColumn,
                    detailsColumn,
                    dateColumn,
                ];
            case "botleads":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "services",
                        header: "Services",
                        cell: ({ row }) => <div>{row.getValue("services")}</div>,
                    },
                    {
                        accessorKey: "address",
                        header: "Address",
                        cell: ({ row }) => <div>{row.getValue("address")}</div>,
                    },
                    statusColumn,
                    detailsColumn,
                    dateColumn,
                ];
            case "riskprofile":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "message",
                        header: "Message",
                        cell: ({ row }) => (
                            <div title={row.getValue("message")}>
                                {truncateText(row.getValue("message"))}
                            </div>
                        ),
                    },
                    {
                        accessorKey: "score",
                        header: "Score",
                        cell: ({ row }) => <div>{row.getValue("score")}</div>,
                    },
                    {
                        accessorKey: "riskprofile",
                        header: "Risk Profile",
                        cell: ({ row }) => <div>{row.getValue("riskprofile")}</div>,
                    },
                    statusColumn,
                    detailsColumn,
                    dateColumn,
                ];
            case "healthprofile":
                return [
                    ...baseColumns,
                    {
                        accessorKey: "message",
                        header: "Message",
                        cell: ({ row }) => (
                            <div title={row.getValue("message")}>
                                {truncateText(row.getValue("message"))}
                            </div>
                        ),
                    },
                    {
                        accessorKey: "score",
                        header: "Score",
                        cell: ({ row }) => <div>{row.getValue("score")}</div>,
                    },
                    {
                        accessorKey: "healthprofile",
                        header: "Health Profile",
                        cell: ({ row }) => <div>{row.getValue("healthprofile")}</div>,
                    },
                    statusColumn,
                    detailsColumn,
                    dateColumn,
                ];
            default:
                return [...baseColumns, dateColumn];
        }
    };

    const columns = getColumns();

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
        <div className="text-base">
            <div className="flex flex-col gap-5">
                <div>
                    <h6 className="font-semibold">Leads</h6>
                </div>

                <div className="rounded-md bg-[var(--rv-bg-white)] p-3">
                    <div className="text-muted-foreground">
                        Total Leads: {data.length}
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        {[
                            { key: "contactus", label: "Contact Us Leads" },
                            { key: "botleads", label: "Bot Leads" },
                            { key: "riskprofile", label: "Risk Profile Leads" },
                            { key: "healthprofile", label: "Health Profile Leads" },
                        ].map((tab) => (
                            <Button
                                onClick={() => setActiveTab(tab.key)}
                                text={tab.label}
                            />
                        ))}
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-sm text-[var(--rv-gray-dark)]">
                            Filter status
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <select
                                className="rounded-md border border-[var(--rv-gray)] bg-[var(--rv-bg-white)] px-3 py-2 text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Converted</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-md bg-[var(--rv-bg-white)] p-3">
                    <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <Input
                            placeholder="Filter by email..."
                            value={table.getColumn("email")?.getFilterValue() ?? ""}
                            onChange={(event) =>
                                table.getColumn("email")?.setFilterValue(event.target.value)
                            }
                            className="max-w-xl border border-[var(--rv-gray)]"
                        />
                        <div className="text-sm text-[var(--rv-gray-dark)]">
                            Click <span className="font-semibold">View</span> to open full lead details.
                        </div>
                    </div>

                    <div className="w-full">
                        {loading ? (
                            <Loader />
                        ) : (
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
                                        table.getRowModel().rows.map((row) => {
                                            const isDeleted = Boolean(row.original?.isDeleted);
                                            return (
                                            <TableRow
                                                key={row.id}
                                                className={
                                                    isDeleted
                                                        ? "bg-red-50 line-through text-[var(--rv-bg-red)]"
                                                        : ""
                                                }
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
                                        )})
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="text-center h-24">
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>


                    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                text={'Previous'}
                                className={'bg-[var(--rv-bg-primary)] hover:bg-[var(--rv-bg-primary)] text-[var(--rv-white)] rounded-md'}
                            />
                            <Button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                text={'Next'}
                                className={'bg-[var(--rv-bg-secondary)] hover:bg-[var(--rv-bg-secondary)] text-[var(--rv-white)] rounded-md'}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showLeadModal && selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-[var(--rv-bg-white)] shadow-lg">
                        <div className="flex items-center justify-between border-b border-[var(--rv-gray)] px-5 py-4">
                            <div>
                                <h6 className="text-lg font-semibold">Lead Details</h6>
                                <p className="text-xs text-[var(--rv-gray-dark)]">
                                    {selectedLead?.email || selectedLead?.username || "Lead"}
                                </p>
                            </div>
                            <button
                                className="rounded-md border border-[var(--rv-gray)] px-3 py-1 text-sm"
                                onClick={closeLeadModal}
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-2">
                            <div>
                                <div className="text-xs text-[var(--rv-gray-dark)]">Name</div>
                                <div className="font-medium">{selectedLead?.username || "-"}</div>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--rv-gray-dark)]">Email</div>
                                <div className="font-medium">{selectedLead?.email || "-"}</div>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--rv-gray-dark)]">Mobile</div>
                                <div className="font-medium">{selectedLead?.mobile || "-"}</div>
                            </div>
                            <div>
                                <div className="text-xs text-[var(--rv-gray-dark)]">Status</div>
                                <div className="font-medium">
                                    {selectedLead?.isDeleted
                                        ? "Deleted"
                                        : selectedLead?.isComplete
                                            ? "Converted"
                                            : "Pending"}
                                </div>
                            </div>
                            {selectedLead?.services && (
                                <div className="md:col-span-2">
                                    <div className="text-xs text-[var(--rv-gray-dark)]">Services</div>
                                    <div className="font-medium">{selectedLead?.services}</div>
                                </div>
                            )}
                            {selectedLead?.address && (
                                <div className="md:col-span-2">
                                    <div className="text-xs text-[var(--rv-gray-dark)]">Address</div>
                                    <div className="font-medium">{selectedLead?.address}</div>
                                </div>
                            )}
                            {selectedLead?.message && (
                                <div className="md:col-span-2">
                                    <div className="text-xs text-[var(--rv-gray-dark)]">Message</div>
                                    <div className="font-medium whitespace-pre-wrap">
                                        {selectedLead?.message}
                                    </div>
                                </div>
                            )}
                            {selectedLead?.score !== undefined && (
                                <div>
                                    <div className="text-xs text-[var(--rv-gray-dark)]">Score</div>
                                    <div className="font-medium">{selectedLead?.score}</div>
                                </div>
                            )}
                            {selectedLead?.riskprofile && (
                                <div>
                                    <div className="text-xs text-[var(--rv-gray-dark)]">Risk Profile</div>
                                    <div className="font-medium">{selectedLead?.riskprofile}</div>
                                </div>
                            )}
                            {selectedLead?.healthprofile && (
                                <div>
                                    <div className="text-xs text-[var(--rv-gray-dark)]">Health Profile</div>
                                    <div className="font-medium">{selectedLead?.healthprofile}</div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--rv-gray)] px-5 py-4">
                            {!selectedLead?.isComplete && !selectedLead?.isDeleted && (
                                <Button
                                    text="Mark Done"
                                    className="min-w-[120px] bg-[var(--rv-bg-secondary)] hover:bg-[var(--rv-bg-secondary)] text-[var(--rv-white)]"
                                    disabled={actionLoadingId === selectedLead?._id}
                                    onClick={() => markComplete(selectedLead?._id)}
                                />
                            )}
                            {!selectedLead?.isDeleted && (
                                <Button
                                    text="Delete"
                                    className="min-w-[120px] bg-[var(--rv-bg-red)] hover:bg-[var(--rv-bg-red)] text-[var(--rv-white)]"
                                    disabled={actionLoadingId === selectedLead?._id}
                                    onClick={() => deleteLead(selectedLead?._id)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTableDemo;

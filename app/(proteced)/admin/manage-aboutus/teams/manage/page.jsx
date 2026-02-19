"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
  
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/(admin)/ui/table";
import Button from "@/app/components/Button/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/app/(admin)/admin/common/Loader";

const TeamTable = () => {
  const router = useRouter();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams`);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (err) {
        toast.error("Error fetching team data");
        console.error("Error fetching team data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
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
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/teams/${selectedId}`);
      if (res.status === 200) {
        setData((prevData) => prevData.filter((blog) => blog._id !== selectedId));
        toast.success("Member deleted successfully!");
      } else {
        toast.error("Failed to delete member.");
      }
    } catch (error) {
      toast.error("⚠️ Error deleting member.");
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
      cell: ({ row }) => (
        <Image
          src={row.original.image?.url || ""}
          alt="member"
          width={60}
          height={60}
          className="rounded-full object-cover"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => <div>{row.original.designation}</div>,
    },
    {
      accessorKey: "experience",
      header: "Experience (Years)",
      cell: ({ row }) => <div>{row.original.experience || "-"}</div>,
    },
    {
      accessorKey: "socialMedia",
      header: "Social Links",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {row.original.socialMedia?.map((sm, idx) => (
            <a key={idx} href={sm.link} target="_blank" rel="noopener noreferrer" className="text-[var(--rv-blue-dark)] underline">
              {sm.name}
            </a>
          )) || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const member = row.original;

        return (
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/admin/manage-aboutus/teams/edit/${member._id}`)}
              className="text-[var(--rv-bg-primary)] border border-[var(--rv-bg-primary)] rounded-md p-2"
            >
              <FiEdit2 size={16} />
            </button>

            <button
              onClick={() => confirmDelete(member._id)}
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
  });

  return (
    < div className="flex flex-col items-center gap-5">
      <div className="flex justify-between items-center gap-5 w-full">
        <h6 className="font-semibold">Manage Team Members</h6>
        <Link href="/admin/manage-aboutus/teams/add">
          <Button text="Add New Member" />
        </Link>
      </div>
      {loading && data.length === 0 ? (
        <Loader />
      ) : (
        <div className="w-full bg-[var(--rv-bg-white)] p-3 rounded-md">
          <div className="rounded-md overflow-hidden border border-[var(--rv-gray-light)]">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
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
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg">
            <p>Are you sure you want to delete this Member?</p>
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
      )
      }

      <ToastContainer />
    </ div >
  );
};

export default TeamTable;

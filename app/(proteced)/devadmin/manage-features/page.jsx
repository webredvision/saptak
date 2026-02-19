"use client";
import { useState, useEffect } from "react";
import Loader from "@/app/(admin)/admin/common/Loader";
import { logoGroups, menuGroups } from "@/data/menu";

export default function SelectSectionsPage() {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/permissions`
        );
        const data = await res.json();

        const enabledPermissions = data
          .filter((p) => p.enabled)
          .map((p) => p.permission);

        setSelectedPermissions(enabledPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const togglePermission = async (permission) => {
    const isActive = selectedPermissions.includes(permission);

    const newSelected = isActive
      ? selectedPermissions.filter((p) => p !== permission)
      : [...selectedPermissions, permission];

    setSelectedPermissions(newSelected);

    await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/permissions`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permission,
          enabled: !isActive,
        }),
      }
    );
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl text-center font-bold mb-6">
          Select Features
        </h1>

        {/* MENU GROUPS */}
        {menuGroups?.map((group, groupIndex) => (
          <div key={`menu-group-${group?.name || groupIndex}`} className="mb-8">
            <div className="overflow-x-auto rounded-lg shadow border border-[var(--rv-gray)] bg-[var(--rv-bg-white)]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] text-base uppercase">
                  <tr>
                    <th className="px-6 py-3">Menu Name</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group?.menuItems?.map((item, itemIndex) => {
                    const isActive = selectedPermissions.includes(item?.permission);

                    return (
                      <tr
                        key={`menu-item-${group?.name || groupIndex}-${item?.permission || itemIndex}`}
                        className="border-t border-[var(--rv-gray)] hover:bg-[var(--rv-bg-gray-light)] transition"
                      >
                        <td className="px-6 py-4 font-medium text-[var(--rv-gray-dark)]">
                          {item?.label}
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => togglePermission(item?.permission)}
                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
                              isActive
                                ? "bg-[var(--rv-primary)]"
                                : "bg-[var(--rv-bg-gray)]"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-[var(--rv-bg-white)] shadow transition ${
                                isActive ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* LOGO GROUPS */}
        {logoGroups?.map((group, groupIndex) => (
          <div key={`logo-group-${group?.name || groupIndex}`} className="mb-8">
            <div className="overflow-x-auto rounded-lg shadow border border-[var(--rv-gray)] bg-[var(--rv-bg-white)]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] text-base uppercase">
                  <tr>
                    <th className="px-6 py-3">Website Logo</th>
                    <th className="px-6 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group?.logotems?.map((item, itemIndex) => {
                    const isActive = selectedPermissions.includes(item?.permission);

                    return (
                      <tr
                        key={`logo-item-${group?.name || groupIndex}-${item?.permission || itemIndex}`}
                        className="border-t border-[var(--rv-gray)] hover:bg-[var(--rv-bg-gray-light)] transition"
                      >
                        <td className="px-6 py-4 font-medium text-[var(--rv-gray-dark)]">
                          {item?.label}
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button
                            onClick={() => togglePermission(item?.permission)}
                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${
                              isActive
                                ? "bg-[var(--rv-primary)]"
                                : "bg-[var(--rv-bg-gray)]"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-[var(--rv-bg-white)] shadow transition ${
                                isActive ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

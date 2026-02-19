"use client";
import { useState, useEffect } from "react";
 
import Loader from "@/app/(admin)/admin/common/Loader";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SelectSectionsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deskOptions, setDeskOptions] = useState([]);
  const [confirmPopup, setConfirmPopup] = useState({
    open: false,
    type: null,
    userId: null,
    currentValue: null,
  });
  const [localUserData, setLocalUserData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robomodel`);
        const json = await res.json();

        if (json.success) {
          setUsers(json.data);

          const localData = {};
          json.data.forEach((u) => {
            localData[u._id] = {
              arnId: u.arnId || "",
              arnNumber: u.arnNumber || "",
              deskType: u.deskType || "",
            };
          });
          setLocalUserData(localData);
        }
      } catch (err) {
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDeskOptions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/login/login-desk`);
        const json = await res.json();

        if (json.data?.length > 0) {
          const options = json.data[0].loginitems.map((item) => {
            let desk = item.login_desk.toLowerCase();
            if (desk === "ifa") desk = "advisor";
            return desk;
          });
          setDeskOptions(options);
        }
      } catch (err) {
        toast.error("Failed to fetch desk options.");
      }
    };
    fetchDeskOptions();
  }, []);

  useEffect(() => {
    if (deskOptions.length > 0 && users.length > 0) {
      const firstDesk = deskOptions[0];
      const updatedLocal = { ...localUserData };

      users
        .filter((u) => u.roboUser)
        .forEach((u) => {
          updatedLocal[u._id] = {
            ...updatedLocal[u._id],
            deskType: firstDesk,
          };
        });

      setLocalUserData(updatedLocal);
    }
  }, [deskOptions, users]);

  const handleToggle = (userId, type, currentValue) => {
    if (type === "roboUser" && !users.find((u) => u._id === userId).softwareUser) {
      toast.warning("Enable Software User first to activate Robo User");
      return;
    }

    setConfirmPopup({
      open: true,
      type,
      userId,
      currentValue,
    });
  };

  const confirmToggle = async () => {
    const { userId, type, currentValue } = confirmPopup;
    const newValue = !currentValue;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robomodel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          [type]: newValue,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? json.data : u)));
        toast.success("Updated successfully!");
      } else {
        toast.error("Update failed.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setConfirmPopup({ open: false, type: null, userId: null, currentValue: null });
    }
  };

  const handleLocalChange = (userId, field, value) => {
    setLocalUserData((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (userId) => {
    const { arnId, arnNumber, deskType } = localUserData[userId];

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/robomodel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          arnId,
          arnNumber,
          deskType,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setUsers((prev) => prev.map((u) => (u._id === userId ? json.data : u)));
        toast.success("Saved successfully!");
      } else {
        toast.error("Failed to save changes.");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  if (loading)
    return (
      < div>
        <Loader />
        <ToastContainer position="top-right" />
      </ div>
    );

  return (
    < div>
      <ToastContainer position="top-right" />
      <div className="">
        <h5 className="font-bold text-center mb-6">Robo Setup</h5>
        <div className="overflow-x-auto rounded-lg border border-[var(--rv-gray)] bg-[var(--rv-bg-white)] mb-6">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] text-base uppercase">
              <tr>
                <th className="px-6 py-3 text-center">Software User</th>
                <th className="px-6 py-3 text-center">Robo User</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-[var(--rv-gray)] hover:bg-[var(--rv-bg-gray-light)] transition">
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggle(user._id, "softwareUser", user.softwareUser)}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${user.softwareUser ? "bg-[var(--rv-bg-primary)]" : "bg-[var(--rv-bg-gray)]"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-[var(--rv-bg-white)] transition ${user.softwareUser ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => user.softwareUser && handleToggle(user._id, "roboUser", user.roboUser)}
                      disabled={!user.softwareUser}
                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition ${user.roboUser ? "bg-[var(--rv-bg-primary)]" : "bg-[var(--rv-bg-gray)]"} ${!user.softwareUser ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-[var(--rv-bg-white)] transition ${user.roboUser ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.filter(u => u.roboUser).map((user) => (
          <div key={`details-${user._id}`} className="bg-[var(--rv-bg-white)] rounded-lg border border-[var(--rv-gray)] p-6 mb-6">
            <h5 className="font-bold text-center mb-6">Robo User Details</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">ARN ID</label>
                <input
                  type="text"
                  value={localUserData[user._id]?.arnId || ""}
                  onChange={(e) => handleLocalChange(user._id, "arnId", e.target.value)}
                  className="border px-2 py-2 rounded w-full border-[var(--rv-gray)] outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">ARN Number</label>
                <input
                  type="text"
                  value={localUserData[user._id]?.arnNumber || ""}
                  onChange={(e) => handleLocalChange(user._id, "arnNumber", e.target.value)}
                  className="border px-2 py-2 rounded w-full border-[var(--rv-gray)] outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Desk Type</label>
                <input
                  type="text"
                  value={localUserData[user._id]?.deskType || ""}
                  readOnly
                  className="border px-2 py-2 rounded w-full border-[var(--rv-gray)] outline-none bg-[var(--rv-bg-gray-light)] cursor-not-allowed"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => handleSave(user._id)}
                className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] px-4 py-2 rounded-md hover:bg-[var(--rv-bg-primary)] transition"
              >
                Save
              </button>
            </div>
          </div>
        ))}
        {confirmPopup.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-[var(--rv-bg-black)] z-50">
            <div className="bg-[var(--rv-bg-white)] rounded-lg-lg p-6 max-w-sm w-full">
              <h6 className="font-semibold mb-4 text-center">
                {confirmPopup.type === "softwareUser"
                  ? "Are you sure you want to toggle Software User?"
                  : "Are you sure you want to toggle Robo User?"}
              </h6>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmToggle}
                  className="bg-[var(--rv-bg-primary)] text-[var(--rv-white)] px-4 py-2 rounded-md hover:bg-[var(--rv-bg-primary)] transition"
                >
                  Yes
                </button>
                <button
                  onClick={() =>
                    setConfirmPopup({ open: false, type: null, userId: null, currentValue: null })
                  }
                  className="bg-[var(--rv-bg-gray)] text-[var(--rv-gray-dark)] px-4 py-2 rounded-md hover:bg-[var(--rv-bg-gray)] transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ div>
  );
}

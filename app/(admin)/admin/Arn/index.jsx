'use client';

import { useState, useEffect } from 'react';

import axios from 'axios';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner } from 'react-icons/fa';
import Loader from '@/app/(admin)/admin/common/Loader';
import AddArnModal from './arnModel';
import EditArnModal from './editArnModel';
import Button from '@/app/components/Button/Button';

const ArnList = () => {
  const [arnData, setArnData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // 🔹 For delete confirmation popup
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 Fetch all ARNs
  const fetchArnData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`);
      setArnData(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch ARN data');
      console.error('Failed to fetch ARN data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArnData();
  }, []);

  // 🔹 Add Modal handlers
  const handleAddClick = () => setShowAddModal(true);
  const handleAddClose = () => {
    setShowAddModal(false);
    fetchArnData();
  };

  // 🔹 Edit Modal handlers
  const handleEditClick = (arn) => setEditData(arn);
  const handleEditClose = () => {
    setEditData(null);
    fetchArnData();
  };

  // 🔹 Delete confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // 🔹 Perform delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/arn`, {
        data: { id: deleteId },
      });
      toast.success('ARN deleted successfully');
      fetchArnData();
    } catch (err) {
      toast.error('Failed to delete ARN');
      console.error('Failed to delete ARN:', err);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="overflow-x-auto flex flex-col items-start w-full gap-5 rounded-md p-3 bg-[var(--rv-bg-white)]">
      <div className="flex justify-between items-center gap-5 w-full">
        <h6 className="font-bold">All ARN List</h6>
        <Button text={' Add ARN & EUIN'} onClick={handleAddClick}/>
      </div>

      <div className="overflow-x-auto w-full">
        {loading ? (
          <Loader />
        ) : arnData.length === 0 ? (
          <p className="p-4">No ARN data found.</p>
        ) : (
          <div className="w-full">
            <table className="w-full border border-[var(--rv-gray)] text-left table-auto whitespace-nowrap">
              <thead>
                <tr className="bg-[var(--rv-bg-gray-light)]">
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">SR No.</th>
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">ARN NO.</th>
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">ARN Reg. Date</th>
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">ARN Expiry</th>
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">EUIN NO.</th>
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">EUIN Reg. Date</th>
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">EUIN Expiry</th>
                  <th className="border border-[var(--rv-gray)] px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {arnData.map((item, arnIndex) =>
                  item.euins.length > 0 ? (
                    item.euins.map((euinEntry, euinIndex) => (
                      <tr key={`${item._id}-${euinEntry.euin}`}>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">
                          {euinIndex === 0 ? arnIndex + 1 : ''}
                        </td>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">
                          {euinIndex === 0 ? item.arn : ''}
                        </td>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">
                          {euinIndex === 0
                            ? new Date(item.registrationDate).toLocaleDateString()
                            : ''}
                        </td>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">
                          {euinIndex === 0
                            ? new Date(item.expiryDate).toLocaleDateString()
                            : ''}
                        </td>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">{euinEntry.euin}</td>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">
                          {new Date(euinEntry.registrationDate).toLocaleDateString()}
                        </td>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">
                          {new Date(euinEntry.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="border border-[var(--rv-gray)] px-4 py-2">
                          {euinIndex === 0 && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="text-[var(--rv-primary)] border border-[var(--rv-primary)] rounded-md p-2 hover:bg-[var(--rv-bg-blue-light)]"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => confirmDelete(item._id)}
                                className="text-[var(--rv-red-dark)] border border-[var(--rv-red-dark)] rounded-md p-2 hover:bg-[var(--rv-bg-red-light)]"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={item._id}>
                      <td className="border border-[var(--rv-gray)] px-4 py-2">{arnIndex + 1}</td>
                      <td className="border border-[var(--rv-gray)] px-4 py-2">{item.arn}</td>
                      <td className="border border-[var(--rv-gray)] px-4 py-2">
                        {new Date(item.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="border border-[var(--rv-gray)] px-4 py-2">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </td>
                      <td colSpan="3" className="border border-[var(--rv-gray)] px-4 py-2 text-center">
                        No EUINs
                      </td>
                      <td className="border border-[var(--rv-gray)] px-4 py-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="text-[var(--rv-primary)] border border-[var(--rv-primary)] rounded-md p-2 hover:bg-[var(--rv-bg-blue-light)]"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => confirmDelete(item._id)}
                            className="text-[var(--rv-red-dark)] border border-[var(--rv-red-dark)] rounded-md p-2 hover:bg-[var(--rv-bg-red-light)]"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && <AddArnModal onClose={handleAddClose} />}

      {editData && <EditArnModal arnData={editData} onClose={handleEditClose} />}

      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
          <div className="bg-[var(--rv-bg-white)] p-4 rounded shadow-lg w-96">
            <p className="font-medium">Are you sure you want to delete this ARN?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-[var(--rv-bg-gray)] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-[var(--rv-bg-red-dark)] text-[var(--rv-white)] rounded hover:bg-[var(--rv-bg-red-dark)] flex items-center gap-2"
              >
                {deleting &&  <FaSpinner className="animate-spin h-4 w-4 mr-2" />}
                {deleting ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ArnList;

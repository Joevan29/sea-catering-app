// client/src/components/admin/pages/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../common/ConfirmationModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(''); // 'role' atau 'delete'

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Gagal memuat data user", error);
      toast.error("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;
    
    try {
      if (actionType === 'role') {
        const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
        await api.put(`/admin/users/${selectedUser.id}/role`, { role: newRole });
        toast.success(`Role untuk ${selectedUser.full_name} berhasil diubah menjadi ${newRole}.`);
      } else if (actionType === 'delete') {
        await api.delete(`/admin/users/${selectedUser.id}`);
        toast.success(`User ${selectedUser.full_name} berhasil dihapus.`);
      }
      
      fetchUsers(); // Ambil ulang data terbaru setelah aksi berhasil
    } catch (error) {
      console.error(`Aksi ${actionType} gagal`, error);
      // Toast error sudah otomatis dari interceptor
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="card">
        <h2 className="heading heading--tertiary">Manajemen Pengguna</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleOpenModal(user, 'role')} className="btn btn--secondary btn--sm">
                      <FaEdit /> Ganti Role
                    </button>
                    <button onClick={() => handleOpenModal(user, 'delete')} className="btn btn--danger btn--sm">
                      <FaTrash /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={`Konfirmasi Aksi: ${actionType === 'role' ? 'Ubah Role' : 'Hapus User'}`}
      >
        <p>
          Apakah Anda yakin ingin **{actionType === 'role' ? `mengubah role ${selectedUser?.full_name} menjadi ${selectedUser?.role === 'admin' ? "'user'" : "'admin'"}?` : `menghapus user ${selectedUser?.full_name}?`}**
          <br />
          {actionType === 'delete' && "Aksi ini tidak dapat diurungkan."}
        </p>
      </ConfirmationModal>
    </>
  );
};

export default UserManagement;
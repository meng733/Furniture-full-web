import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiMail, FiUser } from 'react-icons/fi';
import api from '../../api/api';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">Registered Customers</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">View list of users, administrators, and contact channels.</p>
      </div>

      {/* Filter toolbar */}
      <div className="flex bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-soft">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white transition-all"
          />
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-wood-500"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-soft">
          <p className="text-zinc-400 dark:text-zinc-500">No customers found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Customer Details</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Role</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                        <FiUser size={18} />
                      </div>
                      <p className="font-semibold text-zinc-850 dark:text-white leading-tight">{u.name}</p>
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-300 font-medium">
                      <span className="flex items-center gap-2">
                        <FiMail className="text-zinc-400" size={14} />
                        <span>{u.email}</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        u.role === 'admin' 
                          ? 'bg-wood-100 text-wood-850 dark:bg-wood-950/30 dark:text-wood-400' 
                          : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-zinc-400">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;

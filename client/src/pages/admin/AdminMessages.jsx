import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiTrash2, FiSearch, FiX, FiCheckCircle } from 'react-icons/fi';
import api from '../../api/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Read, Unread
  
  // Modal for detail view
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const response = await api.put(`/messages/${id}/read`);
      if (response.data.success) {
        setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage({ ...selectedMessage, read: true });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const response = await api.delete(`/messages/${id}`);
      if (response.data.success) {
        setMessages(messages.filter(m => m._id !== id));
        setSelectedMessage(null);
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const senderName = msg.name || '';
    const senderEmail = msg.email || '';
    const subject = msg.subject || '';
    const textContent = msg.message || '';
    
    const matchesSearch = senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          textContent.toLowerCase().includes(searchTerm.toLowerCase());
                          
    let matchesStatus = true;
    if (statusFilter === 'Read') matchesStatus = msg.read;
    if (statusFilter === 'Unread') matchesStatus = !msg.read;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">Customer Messages</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage contact inquiries, support tickets, and design requests.</p>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-soft">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by sender, email, subject, or message content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-11 pr-4 text-sm text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white dark:border-zinc-800 dark:bg-zinc-800 dark:text-white dark:focus:border-white transition-all"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-700 outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 transition-all cursor-pointer"
          >
            <option value="All">All Inquiries</option>
            <option value="Unread">Unread Only</option>
            <option value="Read">Read Only</option>
          </select>
        </div>
      </div>

      {/* Messages List / Grid */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-wood-500"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-soft">
          <p className="text-zinc-400 dark:text-zinc-500">No contact messages received.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((msg) => (
            <motion.div
              key={msg._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-3xl border p-6 flex flex-col justify-between shadow-soft hover:shadow-luxury transition-all relative ${
                msg.read 
                  ? 'bg-white border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800' 
                  : 'bg-zinc-900/5 dark:bg-zinc-800/10 border-wood-200 dark:border-wood-900/30'
              }`}
            >
              {/* Unread marker dot */}
              {!msg.read && (
                <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-wood-500 animate-pulse"></span>
              )}

              <div>
                <div className="flex justify-between items-start pr-6">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white leading-tight">{msg.name}</h3>
                    <p className="text-[10px] text-zinc-400 mt-1">{msg.email}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-wood-600 dark:text-wood-400">Subject</span>
                  <p className="font-semibold text-sm text-zinc-850 dark:text-white mt-0.5">{msg.subject}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-zinc-800 flex justify-between items-center text-xs">
                <span className="text-zinc-400">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedMessage(msg); if (!msg.read) handleMarkAsRead(msg._id); }}
                    className="rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 px-3 py-1.5 font-semibold transition-all"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(msg._id)}
                    className="p-1.5 rounded-lg border border-zinc-200 text-rose-600 hover:bg-rose-50 dark:border-zinc-800 dark:text-rose-450 dark:hover:bg-rose-950/20 transition-all"
                    title="Delete Message"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Reader Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-luxury z-10"
            >
              <div className="flex justify-between items-start border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                    Contact Message
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Received on {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Sender Details */}
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-zinc-400">Sender Name</p>
                      <p className="font-bold text-zinc-900 dark:text-white mt-1">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Phone</p>
                      <p className="font-bold text-zinc-900 dark:text-white mt-1">{selectedMessage.phone || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-400">Email Address</p>
                      <a href={`mailto:${selectedMessage.email}`} className="font-bold text-wood-600 dark:text-wood-400 hover:underline block mt-1">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-wood-600 dark:text-wood-400">Subject</span>
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white mt-0.5">{selectedMessage.subject}</p>
                  
                  <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-850/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 max-h-48 overflow-y-auto">
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 justify-end">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-250 hover:bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:hover:bg-rose-950/20 px-4 py-2.5 text-xs font-semibold transition-colors"
                  >
                    <FiTrash2 size={14} />
                    <span>Delete</span>
                  </button>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 px-5 py-2.5 text-xs font-semibold text-white transition-colors"
                  >
                    Close
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;

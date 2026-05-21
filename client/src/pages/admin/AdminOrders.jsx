import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import api from '../../api/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (response.data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const response = await api.delete(`/orders/${id}`);
      if (response.data.success) {
        setOrders(orders.filter(o => o._id !== id));
        setSelectedOrder(null);
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const customerName = order.customerDetails?.name || '';
    const customerPhone = order.customerDetails?.phone || '';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customerPhone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">Customer Orders</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Manage delivery statuses, customer logs, and total invoices.</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 shadow-soft">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
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
            <option value="All">All Statuses</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Catalog Table */}
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-wood-500"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-soft">
          <p className="text-zinc-400 dark:text-zinc-500">No orders found matching the filter.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/10">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Order ID</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Customer</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Items Count</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Total Price</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Date</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="text-sm hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                    <td className="p-4 font-mono text-xs text-zinc-400">
                      #{order._id.substring(order._id.length - 8)}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-zinc-850 dark:text-white leading-tight">{order.customerDetails?.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">{order.customerDetails?.phone}</p>
                    </td>
                    <td className="p-4 text-zinc-600 dark:text-zinc-300 font-medium">
                      {order.orderItems?.reduce((acc, item) => acc + item.quantity, 0) || 0} items
                    </td>
                    <td className="p-4 font-bold text-zinc-950 dark:text-white">
                      {order.totalPrice?.toLocaleString()} ETB
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 outline-none border cursor-pointer ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30' :
                          'bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                        }`}
                      >
                        {orderStatuses.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-xs text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all"
                          title="View Details"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="p-2 rounded-lg border border-zinc-200 text-rose-600 hover:bg-rose-50 dark:border-zinc-800 dark:text-rose-450 dark:hover:bg-rose-950/20 transition-all"
                          title="Delete Order"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-luxury z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                    Order Details
                  </h3>
                  <p className="font-mono text-xs text-zinc-400 mt-1">ID: #{selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Delivery Details */}
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4">
                  <h4 className="font-display font-semibold text-sm text-zinc-850 dark:text-white border-b border-zinc-100 pb-2 dark:border-zinc-800">
                    Delivery & Customer
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs mt-3">
                    <div>
                      <p className="text-zinc-400">Name</p>
                      <p className="font-bold text-zinc-900 dark:text-white mt-1">{selectedOrder.customerDetails?.name}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Phone</p>
                      <p className="font-bold text-zinc-900 dark:text-white mt-1">{selectedOrder.customerDetails?.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-zinc-400">Address</p>
                      <p className="font-bold text-zinc-900 dark:text-white mt-1 leading-relaxed">{selectedOrder.customerDetails?.address}</p>
                    </div>
                  </div>
                </div>

                {/* Items list */}
                <div className="space-y-3">
                  <h4 className="font-display font-semibold text-sm text-zinc-850 dark:text-white">
                    Ordered Items
                  </h4>
                  <div className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                    {selectedOrder.orderItems?.map((item) => {
                      const itemImg = item.image?.startsWith('http') 
                        ? item.image 
                        : `http://localhost:5000${item.image}`;
                      return (
                        <div key={item._id} className="flex gap-4 py-3 items-center">
                          <img
                            src={itemImg}
                            alt={item.name}
                            className="h-12 w-12 rounded-xl object-cover bg-zinc-50"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-zinc-850 dark:text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">Quantity: {item.quantity} x {item.price?.toLocaleString()} ETB</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-zinc-950 dark:text-white">
                              {(item.price * item.quantity).toLocaleString()} ETB
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Invoice Footer Summary */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-zinc-400">Current Status</span>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white mt-1">{selectedOrder.status}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400">Order Total</span>
                    <p className="font-display font-extrabold text-lg text-zinc-900 dark:text-white mt-0.5">
                      {selectedOrder.totalPrice?.toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                {/* Quick actions inside Modal */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 justify-end">
                  {selectedOrder.status !== 'Delivered' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder._id, 'Delivered')}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors"
                    >
                      <FiCheck size={14} />
                      <span>Mark Delivered</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder._id)}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 dark:border-rose-900/30 dark:hover:bg-rose-950/20 px-4 py-2.5 text-xs font-semibold transition-colors"
                  >
                    <FiTrash2 size={14} />
                    <span>Delete Order</span>
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

export default AdminOrders;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiMail, FiCheck, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../api/api';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/orders/stats/dashboard');
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-wood-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
        {error}
      </div>
    );
  }

  const {
    totalOrders,
    totalProducts,
    totalMessages,
    totalCustomers,
    totalRevenue,
    totalSales,
    statusCounts,
    latestOrders,
    latestMessages
  } = stats || {};

  const statCards = [
    {
      label: 'Delivered Revenue',
      value: `${totalRevenue?.toLocaleString() || 0} ETB`,
      icon: FiDollarSign,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
    },
    {
      label: 'All-Time Sales',
      value: `${totalSales?.toLocaleString() || 0} ETB`,
      icon: FiDollarSign,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
    },
    {
      label: 'Total Orders',
      value: totalOrders || 0,
      icon: FiShoppingBag,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
    },
    {
      label: 'Registered Customers',
      value: totalCustomers || 0,
      icon: FiUsers,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
    },
    {
      label: 'Total Products',
      value: totalProducts || 0,
      icon: FiBox,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400'
    },
    {
      label: 'Inquiries/Messages',
      value: totalMessages || 0,
      icon: FiMail,
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-950 dark:text-white">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Real-time metrics, order lists, and customer inquiries.</p>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 flex items-center justify-between shadow-soft hover:shadow-luxury transition-all"
          >
            <div>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white mt-2">{card.value}</h3>
            </div>
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${card.color}`}>
              <card.icon size={22} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Orders & Messages Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">
            <h3 className="font-display font-bold text-zinc-950 dark:text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-wood-600 dark:text-wood-400 hover:underline flex items-center gap-1">
              <span>View All</span>
              <FiArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Customer</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Total Price</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/40">
                {latestOrders?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-sm text-zinc-400">No orders placed yet.</td>
                  </tr>
                ) : (
                  latestOrders?.map((order) => (
                    <tr key={order._id} className="text-sm">
                      <td className="py-4">
                        <p className="font-semibold text-zinc-800 dark:text-white">{order.customerDetails?.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{order.customerDetails?.phone}</p>
                      </td>
                      <td className="py-4 font-semibold text-zinc-950 dark:text-white">
                        {order.totalPrice?.toLocaleString()} ETB
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' :
                          order.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400' :
                          'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-zinc-400">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Messages Alert Box */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800">
            <h3 className="font-display font-bold text-zinc-950 dark:text-white">Recent Messages</h3>
            <Link to="/admin/messages" className="text-xs font-semibold text-wood-600 dark:text-wood-400 hover:underline flex items-center gap-1">
              <span>View All</span>
              <FiArrowRight size={12} />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {latestMessages?.length === 0 ? (
              <p className="text-center py-6 text-sm text-zinc-400">No contact messages received.</p>
            ) : (
              latestMessages?.map((msg) => (
                <div key={msg._id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between hover:shadow-soft transition-all">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-sm text-zinc-850 dark:text-white">{msg.name}</span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-wood-600 dark:text-wood-400 mt-1">{msg.subject}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;

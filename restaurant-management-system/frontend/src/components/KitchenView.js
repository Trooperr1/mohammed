import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ordersAPI } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import './KitchenView.css';

function KitchenView() {
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, preparing

  const currentLang = i18n.language;

  useEffect(() => {
    loadOrders();
    // Refresh every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useWebSocket((data) => {
    if (data.type === 'new_order' || data.type === 'order_update' || data.type === 'order_delete') {
      loadOrders();
    }
  });

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll({ status: 'pending,preparing' });
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await ordersAPI.update(orderId, { status });
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getItemName = (item) => {
    const langMap = { en: 'name_en', ar: 'name_ar', ku: 'name_ku' };
    return item[langMap[currentLang]] || item.name_en;
  };

  const getOrderAge = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - created) / 1000 / 60);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 min ago';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  // Sort orders: pending first, then by creation time
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <div className="kitchen-view">
      <div className="kitchen-header">
        <h1>🍳 {t('kitchen')}</h1>
        <div className="order-count">
          {orders.length} {t('orders')}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          {t('all_categories')} ({orders.length})
        </button>
        <button
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          {t('pending')} ({orders.filter((o) => o.status === 'pending').length})
        </button>
        <button
          className={`filter-tab ${filter === 'preparing' ? 'active' : ''}`}
          onClick={() => setFilter('preparing')}
        >
          {t('preparing')} ({orders.filter((o) => o.status === 'preparing').length})
        </button>
      </div>

      {/* Orders Grid */}
      {sortedOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">No orders at the moment</div>
        </div>
      ) : (
        <div className="kitchen-orders-grid">
          {sortedOrders.map((order) => {
            const items = JSON.parse(order.items);
            const orderAge = getOrderAge(order.created_at);
            const isUrgent = new Date() - new Date(order.created_at) > 15 * 60 * 1000; // > 15 minutes

            return (
              <div
                key={order.id}
                className={`kitchen-order-card ${order.status} ${isUrgent ? 'urgent' : ''}`}
              >
                <div className="order-card-header">
                  <div className="order-info">
                    <div className="order-table">
                      {t('table')} {order.table_number || 'N/A'}
                    </div>
                    <div className="order-time">{orderAge}</div>
                  </div>
                  <div className={`order-status-badge badge-${order.status}`}>
                    {t(order.status)}
                  </div>
                </div>

                <div className="order-items-section">
                  {items.map((item, idx) => (
                    <div key={idx} className="kitchen-order-item">
                      <span className="item-quantity">{item.quantity}x</span>
                      <span className="item-name">{getItemName(item)}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="order-notes">
                    <strong>📝 {t('notes')}:</strong> {order.notes}
                  </div>
                )}

                <div className="order-actions">
                  {order.status === 'pending' && (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      🔥 {t('mark_preparing')}
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      className="btn btn-success btn-block"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      ✅ {t('mark_ready')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default KitchenView;

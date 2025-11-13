import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tablesAPI, menuAPI, ordersAPI } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import Receipt from './Receipt';
import './CashierView.css';

function CashierView() {
  const { t, i18n } = useTranslation();
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [showReceipt, setShowReceipt] = useState(null);
  const [orderNotes, setOrderNotes] = useState('');

  const currentLang = i18n.language;

  useEffect(() => {
    loadTables();
    loadMenu();
    loadCategories();
    loadActiveOrders();
  }, []);

  useWebSocket((data) => {
    if (data.type === 'table_update') {
      loadTables();
    } else if (data.type === 'order_update' || data.type === 'new_order') {
      loadActiveOrders();
    }
  });

  const loadTables = async () => {
    try {
      const response = await tablesAPI.getAll();
      setTables(response.data);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadMenu = async (category = '') => {
    try {
      const response = await menuAPI.getAll(category);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await menuAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadActiveOrders = async () => {
    try {
      const response = await ordersAPI.getAll({ status: 'pending,preparing,ready' });
      setActiveOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    loadMenu(category);
  };

  const handleTableSelect = (table) => {
    if (table.status === 'occupied') {
      alert('Table is already occupied!');
      return;
    }
    setSelectedTable(table);
    setShowOrderModal(true);
  };

  const addItemToOrder = (item) => {
    const existingItem = orderItems.find((oi) => oi.id === item.id);
    if (existingItem) {
      setOrderItems(
        orderItems.map((oi) =>
          oi.id === item.id ? { ...oi, quantity: oi.quantity + 1 } : oi
        )
      );
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }]);
    }
  };

  const updateItemQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter((item) => item.id !== itemId));
    } else {
      setOrderItems(
        orderItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCompleteOrder = async (paymentMethod) => {
    if (orderItems.length === 0) {
      alert('Please add items to the order');
      return;
    }

    try {
      const orderData = {
        table_number: selectedTable?.table_number || null,
        items: orderItems,
        total_price: calculateTotal(),
        notes: orderNotes,
      };

      const response = await ordersAPI.create(orderData);

      // Show receipt
      setShowReceipt({ ...response.data, payment_method: paymentMethod });

      // Reset form
      setOrderItems([]);
      setSelectedTable(null);
      setShowOrderModal(false);
      setOrderNotes('');

      // Reload data
      loadTables();
      loadActiveOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    }
  };

  const handleCompletePayment = async (order, paymentMethod) => {
    try {
      await ordersAPI.update(order.id, {
        status: 'completed',
        payment_method: paymentMethod,
      });
      loadTables();
      loadActiveOrders();
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const getItemName = (item) => {
    const langMap = { en: 'name_en', ar: 'name_ar', ku: 'name_ku' };
    return item[langMap[currentLang]] || item.name_en;
  };

  const getCategoryName = (category) => {
    const langMap = { en: 'name_en', ar: 'name_ar', ku: 'name_ku' };
    return category[langMap[currentLang]] || category.name_en;
  };

  return (
    <div className="cashier-view">
      <div className="cashier-header">
        <h1>{t('cashier')}</h1>
      </div>

      {/* Tables Grid */}
      <div className="section">
        <h2>{t('tables')}</h2>
        <div className="tables-grid">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`table-card ${table.status}`}
              onClick={() => handleTableSelect(table)}
            >
              <div className="table-number">{table.table_number}</div>
              <div className={`table-status badge badge-${table.status}`}>
                {t(table.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div className="section">
          <h2>{t('active_orders')}</h2>
          <div className="orders-list">
            {activeOrders.map((order) => {
              const items = JSON.parse(order.items);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span>
                      {t('table')} {order.table_number || 'N/A'}
                    </span>
                    <span className={`badge badge-${order.status}`}>
                      {t(order.status)}
                    </span>
                  </div>
                  <div className="order-items">
                    {items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{getItemName(item)} x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <strong>${order.total_price.toFixed(2)}</strong>
                    {order.status === 'ready' && (
                      <div className="payment-actions">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleCompletePayment(order, 'cash')}
                        >
                          💵 {t('cash')}
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompletePayment(order, 'card')}
                        >
                          💳 {t('card')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showOrderModal && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <span>
                {t('new_order')} - {t('table')} {selectedTable?.table_number}
              </span>
              <button
                className="close-btn"
                onClick={() => {
                  setShowOrderModal(false);
                  setOrderItems([]);
                  setOrderNotes('');
                }}
              >
                ✕
              </button>
            </div>

            <div className="order-modal-content">
              {/* Menu Section */}
              <div className="menu-section">
                <div className="category-tabs">
                  <button
                    className={`category-tab ${selectedCategory === '' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('')}
                  >
                    {t('all_categories')}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat.id)}
                    >
                      {getCategoryName(cat)}
                    </button>
                  ))}
                </div>

                <div className="menu-items-grid">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="menu-item-card"
                      onClick={() => addItemToOrder(item)}
                    >
                      <div className="menu-item-name">{getItemName(item)}</div>
                      <div className="menu-item-price">${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="order-summary-section">
                <h3>{t('order_summary')}</h3>

                {orderItems.length === 0 ? (
                  <div className="empty-order">{t('add_items')}</div>
                ) : (
                  <>
                    <div className="order-items-list">
                      {orderItems.map((item) => (
                        <div key={item.id} className="order-summary-item">
                          <div className="item-info">
                            <div>{getItemName(item)}</div>
                            <div className="item-price">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </div>
                          </div>
                          <div className="item-controls">
                            <button
                              className="qty-btn"
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                            >
                              -
                            </button>
                            <span className="qty">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                          <div className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('notes')}</label>
                      <textarea
                        className="form-textarea"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder={t('notes')}
                      />
                    </div>

                    <div className="order-total">
                      <span>{t('total')}:</span>
                      <span className="total-amount">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>

                    <div className="modal-footer">
                      <button
                        className="btn btn-success"
                        onClick={() => handleCompleteOrder('cash')}
                      >
                        💵 {t('cash')}
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleCompleteOrder('card')}
                      >
                        💳 {t('card')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <Receipt order={showReceipt} onClose={() => setShowReceipt(null)} />
      )}
    </div>
  );
}

export default CashierView;

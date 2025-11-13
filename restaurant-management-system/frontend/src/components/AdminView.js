import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { menuAPI, reportsAPI } from '../services/api';
import './AdminView.css';

function AdminView() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('menu'); // menu, reports
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  const currentLang = i18n.language;

  // Form state
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    name_ku: '',
    description_en: '',
    description_ar: '',
    description_ku: '',
    price: '',
    category: 'pizza',
    available: true,
  });

  useEffect(() => {
    loadMenu();
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeTab === 'reports') {
      loadReport();
    }
  }, [activeTab, reportDate]);

  const loadMenu = async () => {
    try {
      const response = await menuAPI.getAll();
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

  const loadReport = async () => {
    try {
      const response = await reportsAPI.getDailyReport(reportDate);
      setReportData(response.data);
    } catch (error) {
      console.error('Error loading report:', error);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name_en: '',
      name_ar: '',
      name_ku: '',
      description_en: '',
      description_ar: '',
      description_ku: '',
      price: '',
      category: 'pizza',
      available: true,
    });
    setShowMenuModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name_en: item.name_en,
      name_ar: item.name_ar || '',
      name_ku: item.name_ku || '',
      description_en: item.description_en || '',
      description_ar: item.description_ar || '',
      description_ku: item.description_ku || '',
      price: item.price,
      category: item.category,
      available: item.available === 1,
    });
    setShowMenuModal(true);
  };

  const handleSubmitMenu = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        available: formData.available ? 1 : 0,
      };

      if (editingItem) {
        await menuAPI.update(editingItem.id, data);
      } else {
        await menuAPI.create(data);
      }

      setShowMenuModal(false);
      loadMenu();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Error saving menu item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await menuAPI.delete(id);
      loadMenu();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      await menuAPI.update(item.id, { ...item, available: item.available ? 0 : 1 });
      loadMenu();
    } catch (error) {
      console.error('Error updating item:', error);
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

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? getCategoryName(category) : categoryId;
  };

  return (
    <div className="admin-view">
      <div className="admin-header">
        <h1>⚙️ {t('admin')}</h1>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          {t('menu_management')}
        </button>
        <button
          className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          {t('reports')}
        </button>
      </div>

      {/* Menu Management Tab */}
      {activeTab === 'menu' && (
        <div className="menu-management">
          <div className="section-header">
            <h2>{t('menu')}</h2>
            <button className="btn btn-primary" onClick={handleOpenAddModal}>
              ➕ {t('add_menu_item')}
            </button>
          </div>

          <div className="menu-table">
            <table>
              <thead>
                <tr>
                  <th>{t('item_name')}</th>
                  <th>{t('category')}</th>
                  <th>{t('price')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td>{getItemName(item)}</td>
                    <td>{getCategoryNameById(item.category)}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.available ? 'badge-available' : 'badge-occupied'
                        }`}
                      >
                        {item.available ? t('available') : 'Unavailable'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleOpenEditModal(item)}
                          title={t('edit')}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleToggleAvailability(item)}
                          title={item.available ? t('make_unavailable') : t('make_available')}
                        >
                          {item.available ? '🔴' : '🟢'}
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteItem(item.id)}
                          title={t('delete')}
                        >
                          🗑️
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

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="reports-section">
          <div className="section-header">
            <h2>{t('daily_sales')}</h2>
            <input
              type="date"
              className="form-input date-input"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
            />
          </div>

          {reportData && (
            <>
              {/* Summary Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-label">{t('total_orders')}</div>
                    <div className="stat-value">{reportData.summary.total_orders || 0}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-label">{t('total_revenue')}</div>
                    <div className="stat-value">
                      ${(reportData.summary.total_revenue || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🧾</div>
                  <div className="stat-content">
                    <div className="stat-label">{t('average_order')}</div>
                    <div className="stat-value">
                      ${(reportData.summary.average_order || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Items */}
              {reportData.popularItems && reportData.popularItems.length > 0 && (
                <div className="report-card">
                  <h3>{t('popular_items')}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>{t('item_name')}</th>
                        <th>{t('category')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('total')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.popularItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name_en}</td>
                          <td>{getCategoryNameById(item.category)}</td>
                          <td>{item.total_quantity}</td>
                          <td>${item.total_sales.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Category Breakdown */}
              {reportData.categoryBreakdown && reportData.categoryBreakdown.length > 0 && (
                <div className="report-card">
                  <h3>{t('sales_by_category')}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>{t('category')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('total')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.categoryBreakdown.map((cat, idx) => (
                        <tr key={idx}>
                          <td>{getCategoryNameById(cat.category)}</td>
                          <td>{cat.total_items}</td>
                          <td>${cat.total_sales.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Payment Methods */}
              {reportData.paymentMethods && reportData.paymentMethods.length > 0 && (
                <div className="report-card">
                  <h3>{t('payment_methods')}</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>{t('payment_method')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('total')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.paymentMethods.map((pm, idx) => (
                        <tr key={idx}>
                          <td>{t(pm.payment_method)}</td>
                          <td>{pm.count}</td>
                          <td>${pm.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Menu Item Modal */}
      {showMenuModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <span>{editingItem ? t('edit_menu_item') : t('add_menu_item')}</span>
              <button className="close-btn" onClick={() => setShowMenuModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitMenu}>
              <div className="form-group">
                <label className="form-label">{t('item_name')} (English)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('item_name')} (Arabic)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('item_name')} (Kurdish)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name_ku}
                  onChange={(e) => setFormData({ ...formData, name_ku: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('description')} (English)</label>
                <textarea
                  className="form-textarea"
                  value={formData.description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, description_en: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('description')} (Arabic)</label>
                <textarea
                  className="form-textarea"
                  value={formData.description_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, description_ar: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('description')} (Kurdish)</label>
                <textarea
                  className="form-textarea"
                  value={formData.description_ku}
                  onChange={(e) =>
                    setFormData({ ...formData, description_ku: e.target.value })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('price')}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('category')}</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getCategoryName(cat)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({ ...formData, available: e.target.checked })
                    }
                  />
                  <span>{t('available')}</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowMenuModal(false)}
                >
                  {t('cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminView;

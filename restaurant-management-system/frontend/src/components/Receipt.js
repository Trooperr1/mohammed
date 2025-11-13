import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import './Receipt.css';

function Receipt({ order, onClose }) {
  const { t, i18n } = useTranslation();
  const receiptRef = useRef();
  const currentLang = i18n.language;

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const getItemName = (item) => {
    const langMap = { en: 'name_en', ar: 'name_ar', ku: 'name_ku' };
    return item[langMap[currentLang]] || item.name_en;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(currentLang);
  };

  const items = JSON.parse(order.items);
  const subtotal = order.total_price;
  const tax = 0; // You can calculate tax if needed
  const grandTotal = subtotal + tax;

  return (
    <div className="modal-overlay">
      <div className="modal receipt-modal">
        <div className="receipt-container" ref={receiptRef}>
          <div className="receipt-header">
            <h1>🍕 Restaurant Name</h1>
            <p>123 Restaurant Street</p>
            <p>City, Country</p>
            <p>Tel: +123 456 7890</p>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-info">
            <div className="receipt-row">
              <span>{t('order')} ID:</span>
              <span>{order.id.substring(0, 8)}</span>
            </div>
            <div className="receipt-row">
              <span>{t('table')}:</span>
              <span>{order.table_number || 'N/A'}</span>
            </div>
            <div className="receipt-row">
              <span>{t('date')}:</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="receipt-row">
              <span>{t('payment_method')}:</span>
              <span>{t(order.payment_method)}</span>
            </div>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-items">
            <table>
              <thead>
                <tr>
                  <th>{t('item_name')}</th>
                  <th>{t('quantity')}</th>
                  <th>{t('price')}</th>
                  <th>{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{getItemName(item)}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-totals">
            <div className="receipt-row">
              <span>{t('subtotal')}:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {tax > 0 && (
              <div className="receipt-row">
                <span>{t('tax')}:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="receipt-row total-row">
              <span>{t('grand_total')}:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-footer">
            <p>{t('thank_you')}</p>
            <p>Please visit again!</p>
          </div>
        </div>

        <div className="receipt-actions no-print">
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ {t('print')}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;

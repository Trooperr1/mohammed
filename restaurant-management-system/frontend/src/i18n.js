import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "cashier": "Cashier",
      "kitchen": "Kitchen",
      "admin": "Admin",

      // Common
      "table": "Table",
      "tables": "Tables",
      "order": "Order",
      "orders": "Orders",
      "menu": "Menu",
      "total": "Total",
      "status": "Status",
      "actions": "Actions",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "add": "Add",
      "search": "Search",
      "close": "Close",
      "print": "Print",
      "date": "Date",
      "time": "Time",
      "quantity": "Quantity",
      "price": "Price",
      "notes": "Notes",

      // Table status
      "available": "Available",
      "occupied": "Occupied",

      // Order status
      "pending": "Pending",
      "preparing": "Preparing",
      "ready": "Ready",
      "completed": "Completed",
      "cancelled": "Cancelled",

      // Categories
      "pizza": "Pizza",
      "doner": "Doner",
      "kurdish": "Kurdish Food",
      "arabic": "Arabic Food",
      "all_categories": "All Categories",

      // Cashier
      "new_order": "New Order",
      "select_table": "Select Table",
      "add_items": "Add Items",
      "order_summary": "Order Summary",
      "payment_method": "Payment Method",
      "cash": "Cash",
      "card": "Card",
      "complete_order": "Complete Order",
      "view_orders": "View Orders",
      "active_orders": "Active Orders",

      // Kitchen
      "incoming_orders": "Incoming Orders",
      "mark_preparing": "Mark as Preparing",
      "mark_ready": "Mark as Ready",
      "order_details": "Order Details",

      // Admin
      "dashboard": "Dashboard",
      "menu_management": "Menu Management",
      "reports": "Reports",
      "daily_sales": "Daily Sales",
      "add_menu_item": "Add Menu Item",
      "edit_menu_item": "Edit Menu Item",
      "item_name": "Item Name",
      "description": "Description",
      "category": "Category",
      "make_available": "Make Available",
      "make_unavailable": "Make Unavailable",

      // Reports
      "total_orders": "Total Orders",
      "total_revenue": "Total Revenue",
      "average_order": "Average Order",
      "popular_items": "Popular Items",
      "sales_by_category": "Sales by Category",
      "hourly_breakdown": "Hourly Breakdown",
      "payment_methods": "Payment Methods",

      // Messages
      "order_created": "Order created successfully",
      "order_updated": "Order updated successfully",
      "order_completed": "Order completed successfully",
      "item_added": "Item added to order",
      "table_updated": "Table status updated",

      // Receipt
      "receipt": "Receipt",
      "thank_you": "Thank you for dining with us!",
      "subtotal": "Subtotal",
      "tax": "Tax",
      "grand_total": "Grand Total"
    }
  },
  ar: {
    translation: {
      // Navigation
      "cashier": "الكاشير",
      "kitchen": "المطبخ",
      "admin": "الإدارة",

      // Common
      "table": "طاولة",
      "tables": "الطاولات",
      "order": "طلب",
      "orders": "الطلبات",
      "menu": "القائمة",
      "total": "الإجمالي",
      "status": "الحالة",
      "actions": "الإجراءات",
      "save": "حفظ",
      "cancel": "إلغاء",
      "delete": "حذف",
      "edit": "تعديل",
      "add": "إضافة",
      "search": "بحث",
      "close": "إغلاق",
      "print": "طباعة",
      "date": "التاريخ",
      "time": "الوقت",
      "quantity": "الكمية",
      "price": "السعر",
      "notes": "ملاحظات",

      // Table status
      "available": "متاح",
      "occupied": "مشغول",

      // Order status
      "pending": "قيد الانتظار",
      "preparing": "قيد التحضير",
      "ready": "جاهز",
      "completed": "مكتمل",
      "cancelled": "ملغى",

      // Categories
      "pizza": "بيتزا",
      "doner": "دونر",
      "kurdish": "طعام كردي",
      "arabic": "طعام عربي",
      "all_categories": "جميع الفئات",

      // Cashier
      "new_order": "طلب جديد",
      "select_table": "اختر الطاولة",
      "add_items": "إضافة عناصر",
      "order_summary": "ملخص الطلب",
      "payment_method": "طريقة الدفع",
      "cash": "نقدي",
      "card": "بطاقة",
      "complete_order": "إتمام الطلب",
      "view_orders": "عرض الطلبات",
      "active_orders": "الطلبات النشطة",

      // Kitchen
      "incoming_orders": "الطلبات الواردة",
      "mark_preparing": "وضع علامة قيد التحضير",
      "mark_ready": "وضع علامة جاهز",
      "order_details": "تفاصيل الطلب",

      // Admin
      "dashboard": "لوحة التحكم",
      "menu_management": "إدارة القائمة",
      "reports": "التقارير",
      "daily_sales": "المبيعات اليومية",
      "add_menu_item": "إضافة عنصر للقائمة",
      "edit_menu_item": "تعديل عنصر القائمة",
      "item_name": "اسم العنصر",
      "description": "الوصف",
      "category": "الفئة",
      "make_available": "جعله متاحاً",
      "make_unavailable": "جعله غير متاح",

      // Reports
      "total_orders": "إجمالي الطلبات",
      "total_revenue": "إجمالي الإيرادات",
      "average_order": "متوسط الطلب",
      "popular_items": "العناصر الشائعة",
      "sales_by_category": "المبيعات حسب الفئة",
      "hourly_breakdown": "التفصيل بالساعة",
      "payment_methods": "طرق الدفع",

      // Messages
      "order_created": "تم إنشاء الطلب بنجاح",
      "order_updated": "تم تحديث الطلب بنجاح",
      "order_completed": "تم إتمام الطلب بنجاح",
      "item_added": "تمت إضافة العنصر إلى الطلب",
      "table_updated": "تم تحديث حالة الطاولة",

      // Receipt
      "receipt": "الفاتورة",
      "thank_you": "شكراً لتناول الطعام معنا!",
      "subtotal": "المجموع الفرعي",
      "tax": "الضريبة",
      "grand_total": "الإجمالي النهائي"
    }
  },
  ku: {
    translation: {
      // Navigation
      "cashier": "کاشێر",
      "kitchen": "چێشتخانە",
      "admin": "بەڕێوەبردن",

      // Common
      "table": "مێز",
      "tables": "مێزەکان",
      "order": "داواکاری",
      "orders": "داواکاریەکان",
      "menu": "لیست",
      "total": "کۆی گشتی",
      "status": "دۆخ",
      "actions": "کردارەکان",
      "save": "پاشەکەوتکردن",
      "cancel": "هەڵوەشاندنەوە",
      "delete": "سڕینەوە",
      "edit": "دەستکاریکردن",
      "add": "زیادکردن",
      "search": "گەڕان",
      "close": "داخستن",
      "print": "چاپکردن",
      "date": "بەروار",
      "time": "کات",
      "quantity": "ژمارە",
      "price": "نرخ",
      "notes": "تێبینیەکان",

      // Table status
      "available": "بەردەست",
      "occupied": "قەرەباڵغ",

      // Order status
      "pending": "چاوەڕوان",
      "preparing": "ئامادەکردن",
      "ready": "ئامادەیە",
      "completed": "تەواوبوو",
      "cancelled": "هەڵوەشێندراوە",

      // Categories
      "pizza": "پیتزا",
      "doner": "دۆنەر",
      "kurdish": "خواردنی کوردی",
      "arabic": "خواردنی عەرەبی",
      "all_categories": "هەموو جۆرەکان",

      // Cashier
      "new_order": "داواکاریی نوێ",
      "select_table": "مێز هەڵبژێرە",
      "add_items": "زیادکردنی بڕگە",
      "order_summary": "کورتەی داواکاری",
      "payment_method": "شێوازی پارەدان",
      "cash": "کاش",
      "card": "کارت",
      "complete_order": "تەواوکردنی داواکاری",
      "view_orders": "بینینی داواکاریەکان",
      "active_orders": "داواکاریە چالاکەکان",

      // Kitchen
      "incoming_orders": "داواکاریە هاتووەکان",
      "mark_preparing": "نیشانکردن وەک ئامادەکردن",
      "mark_ready": "نیشانکردن وەک ئامادە",
      "order_details": "وردەکاریی داواکاری",

      // Admin
      "dashboard": "داشبۆرد",
      "menu_management": "بەڕێوەبردنی لیست",
      "reports": "ڕاپۆرتەکان",
      "daily_sales": "فرۆشتنی ڕۆژانە",
      "add_menu_item": "زیادکردنی بڕگە بۆ لیست",
      "edit_menu_item": "دەستکاریکردنی بڕگەی لیست",
      "item_name": "ناوی بڕگە",
      "description": "وەسف",
      "category": "جۆر",
      "make_available": "بەردەست بکە",
      "make_unavailable": "بەردەست مەکە",

      // Reports
      "total_orders": "کۆی داواکاریەکان",
      "total_revenue": "کۆی داهات",
      "average_order": "ناوەندی داواکاری",
      "popular_items": "بڕگە بەناوبانگەکان",
      "sales_by_category": "فرۆشتن بەپێی جۆر",
      "hourly_breakdown": "دابەشبوون بە کاتژمێر",
      "payment_methods": "شێوازەکانی پارەدان",

      // Messages
      "order_created": "داواکاری بە سەرکەوتوویی دروستکرا",
      "order_updated": "داواکاری بە سەرکەوتوویی نوێکرایەوە",
      "order_completed": "داواکاری بە سەرکەوتوویی تەواوبوو",
      "item_added": "بڕگە زیادکرا بۆ داواکاری",
      "table_updated": "دۆخی مێز نوێکرایەوە",

      // Receipt
      "receipt": "وەسڵ",
      "thank_you": "سوپاس بۆ خواردن لەگەڵ ئێمە!",
      "subtotal": "کۆی لاوەکی",
      "tax": "باج",
      "grand_total": "کۆی گشتی"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

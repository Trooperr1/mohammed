const db = require('../database');

async function initializeDatabase() {
  try {
    console.log('Initializing database with sample data...');

    // Wait for database to be ready
    await db.waitForReady();

    // Initialize 15 tables
    for (let i = 1; i <= 15; i++) {
      await db.run(
        'INSERT OR IGNORE INTO tables (table_number, status) VALUES (?, ?)',
        [i, 'available']
      );
    }
    console.log('✓ Initialized 15 tables');

    // Sample menu items
    const menuItems = [
      // Pizza
      { name_en: 'Margherita Pizza', name_ar: 'بيتزا مارغريتا', name_ku: 'پیتزای مارگەریتا', description_en: 'Fresh mozzarella, tomato sauce, basil', description_ar: 'موزاريلا طازجة وصلصة طماطم وريحان', description_ku: 'پەنیری تازە، سۆسی تەماتە، ڕێحان', price: 12.99, category: 'pizza' },
      { name_en: 'Pepperoni Pizza', name_ar: 'بيتزا بيبروني', name_ku: 'پیتزای پێپەرۆنی', description_en: 'Pepperoni, mozzarella, tomato sauce', description_ar: 'ببروني وموزاريلا وصلصة طماطم', description_ku: 'پێپەرۆنی، پەنیر، سۆسی تەماتە', price: 14.99, category: 'pizza' },
      { name_en: 'Vegetarian Pizza', name_ar: 'بيتزا نباتية', name_ku: 'پیتزای ڕووەکی', description_en: 'Mixed vegetables, mozzarella, tomato sauce', description_ar: 'خضروات مشكلة وموزاريلا وصلصة طماطم', description_ku: 'سەوزەی تێکەڵ، پەنیر، سۆسی تەماتە', price: 13.99, category: 'pizza' },
      { name_en: 'Four Cheese Pizza', name_ar: 'بيتزا أربعة أجبان', name_ku: 'پیتزای چوار پەنیر', description_en: 'Mozzarella, parmesan, gorgonzola, ricotta', description_ar: 'موزاريلا وبارميزان وجورجونزولا وريكوتا', description_ku: 'موتزارێلا، پارمێزان، گۆرگۆنزۆلا، ڕیکۆتا', price: 15.99, category: 'pizza' },

      // Doner
      { name_en: 'Chicken Doner Wrap', name_ar: 'لفافة دونر دجاج', name_ku: 'دونەری مریشک', description_en: 'Grilled chicken doner with vegetables', description_ar: 'دونر دجاج مشوي مع الخضروات', description_ku: 'دۆنەری مریشکی برژاو لەگەڵ سەوزە', price: 8.99, category: 'doner' },
      { name_en: 'Beef Doner Wrap', name_ar: 'لفافة دونر لحم بقري', name_ku: 'دونەری گۆشتی مانگا', description_en: 'Grilled beef doner with vegetables', description_ar: 'دونر لحم بقري مشوي مع الخضروات', description_ku: 'دۆنەری گۆشتی مانگای برژاو', price: 9.99, category: 'doner' },
      { name_en: 'Mixed Doner Plate', name_ar: 'طبق دونر مشكل', name_ku: 'قاپی دۆنەری تێکەڵ', description_en: 'Chicken and beef doner with rice and salad', description_ar: 'دونر دجاج ولحم مع أرز وسلطة', description_ku: 'دۆنەری مریشک و گۆشتی مانگا لەگەڵ برنج و زەڵاتە', price: 13.99, category: 'doner' },
      { name_en: 'Doner Box', name_ar: 'صندوق دونر', name_ku: 'سندوقی دۆنەر', description_en: 'Doner meat with fries and sauce', description_ar: 'لحم دونر مع بطاطس مقلية وصلصة', description_ku: 'گۆشتی دۆنەر لەگەڵ پەتاتە و سۆس', price: 10.99, category: 'doner' },

      // Kurdish Food
      { name_en: 'Dolma', name_ar: 'دولمة', name_ku: 'دۆڵمە', description_en: 'Stuffed grape leaves with rice and meat', description_ar: 'ورق عنب محشي بالأرز واللحم', description_ku: 'گەڵای مێو پڕکراو بە برنج و گۆشت', price: 11.99, category: 'kurdish' },
      { name_en: 'Biryani', name_ar: 'برياني', name_ku: 'بریانی', description_en: 'Kurdish-style rice with chicken and spices', description_ar: 'أرز على الطريقة الكردية مع الدجاج والتوابل', description_ku: 'برنجی کوردی لەگەڵ مریشک و بەهارات', price: 12.99, category: 'kurdish' },
      { name_en: 'Kubba', name_ar: 'كبة', name_ku: 'کوبە', description_en: 'Fried bulgur shells stuffed with minced meat', description_ar: 'أقراص البرغل المقلية محشوة باللحم المفروم', description_ku: 'بورگولی برژاو پڕکراو بە گۆشتی هاڕاو', price: 9.99, category: 'kurdish' },
      { name_en: 'Tepsi', name_ar: 'طبسي', name_ku: 'تەپسی', description_en: 'Baked lamb with vegetables and rice', description_ar: 'لحم ضأن مطبوخ مع الخضروات والأرز', description_ku: 'گۆشتی بەرخی کوڵاو لەگەڵ سەوزە و برنج', price: 14.99, category: 'kurdish' },

      // Arabic Food
      { name_en: 'Shawarma', name_ar: 'شاورما', name_ku: 'شاوەرما', description_en: 'Marinated meat wrap with garlic sauce', description_ar: 'لفافة لحم متبل مع صلصة الثوم', description_ku: 'گۆشتی ناو لەفە لەگەڵ سۆسی سیر', price: 7.99, category: 'arabic' },
      { name_en: 'Falafel Plate', name_ar: 'طبق فلافل', name_ku: 'قاپی فەلافێل', description_en: 'Fried chickpea balls with tahini sauce', description_ar: 'كرات الحمص المقلية مع صلصة الطحينة', description_ku: 'تۆپی نۆکی برژاو لەگەڵ سۆسی تەحینە', price: 8.99, category: 'arabic' },
      { name_en: 'Hummus with Meat', name_ar: 'حمص باللحم', name_ku: 'حومس بە گۆشت', description_en: 'Chickpea puree topped with minced meat', description_ar: 'هريس الحمص مع اللحم المفروم', description_ku: 'حوومسی نۆک لەگەڵ گۆشتی هاڕاو', price: 10.99, category: 'arabic' },
      { name_en: 'Mixed Grill', name_ar: 'مشاوي مشكلة', name_ku: 'برژاوی تێکەڵ', description_en: 'Assorted grilled meats with rice and salad', description_ar: 'لحوم مشوية متنوعة مع أرز وسلطة', description_ku: 'گۆشتی برژاوی جۆراوجۆر لەگەڵ برنج و زەڵاتە', price: 16.99, category: 'arabic' },
      { name_en: 'Mansaf', name_ar: 'منسف', name_ku: 'مەنسەف', description_en: 'Lamb cooked in yogurt sauce with rice', description_ar: 'لحم ضأن مطبوخ بصلصة اللبن مع الأرز', description_ku: 'گۆشتی بەرخ کوڵاو بە سۆسی ماست لەگەڵ برنج', price: 15.99, category: 'arabic' }
    ];

    for (const item of menuItems) {
      await db.run(
        `INSERT OR IGNORE INTO menu_items
        (name_en, name_ar, name_ku, description_en, description_ar, description_ku, price, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.name_en, item.name_ar, item.name_ku, item.description_en,
         item.description_ar, item.description_ku, item.price, item.category]
      );
    }
    console.log('✓ Initialized menu items');

    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();

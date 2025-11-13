const db = require('../database');

async function verifyDatabase() {
  try {
    await db.waitForReady();

    console.log('\n📊 Database Verification\n');
    console.log('=' .repeat(50));

    // Check tables
    const tables = await db.all('SELECT * FROM tables ORDER BY table_number');
    console.log(`\n✅ Tables: ${tables.length} found`);
    console.log(`   Available: ${tables.filter(t => t.status === 'available').length}`);
    console.log(`   Occupied: ${tables.filter(t => t.status === 'occupied').length}`);

    // Check menu items
    const menuItems = await db.all('SELECT * FROM menu_items');
    console.log(`\n✅ Menu Items: ${menuItems.length} found`);

    const categories = await db.all(
      'SELECT category, COUNT(*) as count FROM menu_items GROUP BY category'
    );
    categories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat.count} items`);
    });

    // Check orders
    const orders = await db.all('SELECT * FROM orders');
    console.log(`\n✅ Orders: ${orders.length} found`);

    console.log('\n' + '='.repeat(50));
    console.log('✨ Database verification complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error verifying database:', error);
    process.exit(1);
  }
}

verifyDatabase();

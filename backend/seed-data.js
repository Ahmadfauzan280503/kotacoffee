/**
 * Database Seeding Script
 * Creates initial categories and products with local images
 * 
 * Run with: node seed-data.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Categories to create
const categories = [
  { name: 'Coffee', imageUrl: '/images/coffee/Coffee 1.jpg' },
  { name: 'Non-Coffee', imageUrl: '/images/non-coffee/Non Coffee 1.jpg' },
  { name: 'Food', imageUrl: '/images/food/Roti bakar Tiramisu.jpg' }
];

// Products to create (will be mapped with category IDs after creation)
const productsData = [
  // Coffee products
  { 
    name: 'Espresso',
    description: 'Kopi espresso klasik dengan rasa yang kuat dan aroma yang khas',
    price: 15000,
    stock: 100,
    imageUrl: '/images/coffee/Coffee 1.jpg',
    categoryName: 'Coffee',
    unitSymbol: 'cup'
  },
  { 
    name: 'Coffee Gula Aren',
    description: 'Kopi susu dengan gula aren yang manis dan creamy',
    price: 20000,
    stock: 100,
    imageUrl: '/images/coffee/coffee 2.jpg',
    categoryName: 'Coffee',
    unitSymbol: 'cup'
  },
  // Non-Coffee products
  { 
    name: 'Matcha Latte',
    description: 'Minuman matcha dengan susu yang lembut dan menyegarkan',
    price: 22000,
    stock: 80,
    imageUrl: '/images/non-coffee/Non Coffee 1.jpg',
    categoryName: 'Non-Coffee',
    unitSymbol: 'cup'
  },
  { 
    name: 'Chocolate Milkshake',
    description: 'Milkshake coklat yang creamy dan nikmat',
    price: 25000,
    stock: 80,
    imageUrl: '/images/non-coffee/Non Coffee 2.jpg',
    categoryName: 'Non-Coffee',
    unitSymbol: 'cup'
  },
  { 
    name: 'Red Velvet',
    description: 'Minuman red velvet dengan cream cheese yang lezat',
    price: 24000,
    stock: 80,
    imageUrl: '/images/non-coffee/Non Coffee 3.jpg',
    categoryName: 'Non-Coffee',
    unitSymbol: 'cup'
  },
  { 
    name: 'Taro Latte',
    description: 'Minuman taro dengan susu yang manis dan wangi',
    price: 22000,
    stock: 80,
    imageUrl: '/images/non-coffee/Non Coffee 4.jpg',
    categoryName: 'Non-Coffee',
    unitSymbol: 'cup'
  },
  // Food products
  { 
    name: 'Roti Bakar Tiramisu',
    description: 'Roti bakar dengan topping tiramisu yang lezat',
    price: 18000,
    stock: 50,
    imageUrl: '/images/food/Roti bakar Tiramisu.jpg',
    categoryName: 'Food',
    unitSymbol: 'pcs'
  }
];

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Step 1: Get admin seller ID (required for products)
    console.log('📦 Getting admin seller...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'ahmadfauzan280503@gmail.com')
      .single();

    if (adminError || !adminUser) {
      console.error('❌ Admin user not found. Please login first.');
      return;
    }

    // Get or create seller for admin
    let { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', adminUser.id)
      .single();

    if (!seller) {
      console.log('📦 Creating seller for admin...');
      const { data: newSeller, error: createSellerError } = await supabase
        .from('sellers')
        .insert({
          user_id: adminUser.id,
          store_name: 'Kota Coffee',
          description: 'Kopi trotoar - Coffee shop terbaik'
        })
        .select()
        .single();

      if (createSellerError) {
        console.error('❌ Failed to create seller:', createSellerError);
        return;
      }
      seller = newSeller;
    }

    console.log('✅ Seller ID:', seller.id);

    // Step 2: Get units
    console.log('\n📏 Getting units...');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id, symbol');

    if (unitsError) {
      console.error('❌ Failed to get units:', unitsError);
      return;
    }

    const unitMap = {};
    units.forEach(u => unitMap[u.symbol] = u.id);
    console.log('✅ Units loaded:', Object.keys(unitMap).join(', '));

    // Step 3: Create categories
    console.log('\n📂 Creating categories...');
    const categoryMap = {};

    for (const cat of categories) {
      // Check if category exists
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('name', cat.name)
        .single();

      if (existing) {
        categoryMap[cat.name] = existing.id;
        console.log(`  ⏭️  Category "${cat.name}" already exists`);
      } else {
        const { data: newCat, error: catError } = await supabase
          .from('categories')
          .insert({
            name: cat.name,
            image_url: cat.imageUrl
          })
          .select()
          .single();

        if (catError) {
          console.error(`❌ Failed to create category ${cat.name}:`, catError);
          continue;
        }

        categoryMap[cat.name] = newCat.id;
        console.log(`  ✅ Created category "${cat.name}"`);
      }
    }

    // Step 4: Create products
    console.log('\n🛍️  Creating products...');

    for (const product of productsData) {
      // Check if product exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('name', product.name)
        .single();

      if (existing) {
        console.log(`  ⏭️  Product "${product.name}" already exists`);
        continue;
      }

      const categoryId = categoryMap[product.categoryName];
      const unitId = unitMap[product.unitSymbol];

      if (!categoryId || !unitId) {
        console.error(`❌ Missing category or unit for product ${product.name}`);
        continue;
      }

      const { data: newProduct, error: prodError } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.imageUrl,
          category_id: categoryId,
          unit_id: unitId,
          seller_id: seller.id
        })
        .select()
        .single();

      if (prodError) {
        console.error(`❌ Failed to create product ${product.name}:`, prodError);
        continue;
      }

      console.log(`  ✅ Created product "${product.name}" - Rp${product.price.toLocaleString()}`);
    }

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Summary:');
    console.log(`   Categories: ${Object.keys(categoryMap).length}`);
    console.log(`   Products: ${productsData.length}`);
    console.log('\n🔄 Please refresh your browser to see the products!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

seed();

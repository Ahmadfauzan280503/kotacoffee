require('dotenv').config();
const supabase = require('./src/config/supabase');

async function ensureAdminIsSeller() {
  const adminEmail = 'ahmadfauzan280503@gmail.com';
  
  // 1. Get admin user ID
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name')
    .eq('email', adminEmail)
    .single();

  if (userError || !user) {
    console.error('Admin user not found:', userError);
    return;
  }

  console.log(`Found admin user: ${user.name} (${user.id})`);

  // 2. Check if already a seller
  const { data: seller, error: sellerError } = await supabase
    .from('sellers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (seller) {
    console.log('Admin is already registered as a seller.');
    return;
  }

  // 3. Create seller profile
  const { data: newSeller, error: createError } = await supabase
    .from('sellers')
    .insert({
      user_id: user.id,
      shop_name: 'Kota Coffee (Admin)',
      description: 'Admin Managed Shop',
      address: 'Kota Makassar',
      phone: '082177561275',
      is_verified: true
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating seller profile:', createError);
  } else {
    console.log('Successfully created seller profile for Admin!');
  }
}

ensureAdminIsSeller();

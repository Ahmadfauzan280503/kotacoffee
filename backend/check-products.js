require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, is_featured');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  console.log('Current Products:', JSON.stringify(data, null, 2));
}

checkProducts();

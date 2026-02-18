require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findSeller() {
  const { data, error } = await supabase
    .from('sellers')
    .select('id, shop_name')
    .limit(1);
  
  if (error) {
    console.error('Error fetching sellers:', error);
    return;
  }
  
  console.log('Existing Seller:', JSON.stringify(data, null, 2));
}

findSeller();

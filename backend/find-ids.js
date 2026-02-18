require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findData() {
  const { data: units } = await supabase.from('units').select('id, name').limit(5);
  const { data: categories } = await supabase.from('categories').select('id, name').limit(10);
  
  console.log('Units:', JSON.stringify(units, null, 2));
  console.log('Categories:', JSON.stringify(categories, null, 2));
}

findData();

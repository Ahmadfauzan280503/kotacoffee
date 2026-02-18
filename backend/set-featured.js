require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setFeatured() {
  const targetIds = [
    'ea8aa766-9c60-4890-b8c6-43db515e86ca', // Espresso
    '26184efd-cef2-43e0-8f9c-1871da85d579', // Coffee Gula Aren
    'cb4a4dd0-0cf1-4370-89f0-c7408697281b'  // Matcha Latte
  ];

  // Reset all featured products first
  await supabase
    .from('products')
    .update({ is_featured: false })
    .neq('id', '00000000-0000-0000-0000-000000000000');

  // Set target products as featured
  const { data, error } = await supabase
    .from('products')
    .update({ is_featured: true })
    .in('id', targetIds);
  
  if (error) {
    console.error('Error updating products:', error);
    return;
  }
  
  console.log('Successfully updated featured products.');
}

setFeatured();

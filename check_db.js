const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/tiodev/Desktop/atuan/.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: webhooks, error } = await supabase
    .from('webhook_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) console.error('Error fetching webhooks:', error);
  else console.log('Recent Webhooks:', JSON.stringify(webhooks, null, 2));

  const { data: donations } = await supabase
    .from('donations')
    .select('id, donor_name, amount, status, donation_code')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('\nRecent Donations:', JSON.stringify(donations, null, 2));
}

main();

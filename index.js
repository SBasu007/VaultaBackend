
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/insert', async (req, res) => {
  const { user_id, title, link, category } = req.body;

  if (!title || !link || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('links') // Replace with your actual table name
    .insert([
      { user_id, title, link, category }
    ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ data });
});
app.post('/update-link', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing id field' });
  }

  // Fetch the current count
  const { data: currentData, error: fetchError } = await supabase
    .from('links')
    .select('clicks')
    .eq('id', id)
    .single();

  if (fetchError) {
    return res.status(500).json({ error: fetchError.message });
  }

  const newCount = (currentData?.clicks || 0) + 1;

  // Update the count
  const { data, error } = await supabase
    .from('links')
    .update({ clicks: newCount })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
});
app.get('/top-links', async (req, res) => {
  const{user_id}=req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id field' });
  }
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user_id)
    .order('clicks', { ascending: false })
    .limit(3);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
});
app.get('/all-links', async (req, res) => {
  const{user_id}=req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id field' });
  }
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user_id)

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

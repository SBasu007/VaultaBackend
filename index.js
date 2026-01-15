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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

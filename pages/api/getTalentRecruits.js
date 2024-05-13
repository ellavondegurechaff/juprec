import { supabase } from '../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: recruits, error } = await supabase
        .from('talent_recruits')
        .select('*');

      if (error) {
        throw error;
      }

      res.status(200).json(recruits);
    } catch (error) {
      console.error('Error fetching talent recruits:', error);
      res.status(500).json({ error: 'An error occurred while fetching talent recruits' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
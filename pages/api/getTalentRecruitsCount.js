import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { count, error } = await supabase
        .from('talent_recruits')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      res.status(200).json({ total_recruits: count });
    } catch (error) {
      console.error('Error fetching talent recruits count:', error);
      res.status(500).json({ error: 'An error occurred while fetching talent recruits count' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
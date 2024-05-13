import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'Missing talent recruit ID' });
      return;
    }

    try {
      const { error } = await supabase
        .from('talent_recruits')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      res.status(200).json({ message: 'Talent recruit deleted successfully' });
    } catch (error) {
      console.error('Error deleting talent recruit:', error);
      res.status(500).json({ error: 'An error occurred while deleting the talent recruit' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
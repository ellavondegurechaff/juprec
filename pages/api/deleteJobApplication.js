import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'Missing job application ID' });
      return;
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      res.status(200).json({ message: 'Job application deleted successfully' });
    } catch (error) {
      console.error('Error deleting job application:', error);
      res.status(500).json({ error: 'An error occurred while deleting the job application' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
import { supabase } from '../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact' });

      const { data: applications, error } = await supabase
        .from('job_applications')
        .select('*');

      if (error) {
        throw error;
      }

      res.status(200).json({
        total_applications: count,
        applications: applications,
      });
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ error: 'An error occurred while fetching job applications' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
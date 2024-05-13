import { supabase } from '../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Validate input
  const { data, session } = req.body;
  if (!data || !data.name || !data.contact || !data.message || !data.workgroup || !data.position) {
    return res.status(400).json({ status: 'error', message: 'Missing required data fields' });
  }

  try {
    // Insert data into the 'job_applications' table using Supabase
    const { error } = await supabase.from('job_applications').insert({
      name: data.name,
      contact: data.contact,
      message: data.message,
      workgroup: data.workgroup,
      position: data.position,
      username: session?.user?.name || '',
      twitter: session?.user?.image?.includes('twimg.com') ? 'true' : 'false',
      discord: session?.user?.image?.includes('discord') ? 'true' : 'false',
      created_at: new Date().toISOString(), // Add the current timestamp
    });

    if (error) {
      throw error;
    }

    res.status(200).json({
      status: 'success',
      message: 'Job application submitted successfully!',
    });
  } catch (error) {
    console.error('Error submitting job application:', error);
    res.status(500).json({
      status: 'error',
      error: error.toString(),
    });
  }
}
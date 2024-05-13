import { createRouter } from 'next-connect';
import multer from 'multer';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Import your NextAuth options correctly
import { supabase } from '../../utils/supabaseClient'; // Import the Supabase client from the utils folder

export const config = {
  api: {
    bodyParser: false,
  },
};

const router = createRouter();

// Configure multer for file storage in memory and file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post(upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  // Extract the session using getServerSession
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ error: 'Unauthorized access' });
    return;
  }

  const { user } = session;
  const username = user.name; // Adjust according to your session user object structure
  const positionName = req.body.positionName; // Assume it's sent along with the file upload form

  // Create a unique file name for the uploaded file
  const fileType = req.file.mimetype.split('/')[1];
  const uniqueFileName = `${positionName}_${username}.${fileType}`;

  // Upload file to bucket 'juprecruit' inside the folder 'workgroupresume'
  const { data, error } = await supabase.storage
    .from('juprecruit')
    .upload(`workgroupresume/${uniqueFileName}`, req.file.buffer, {
      contentType: req.file.mimetype,
    });

  if (error) {
    console.error('Error uploading file to Supabase Storage:', error);
    res.status(500).json({ error: 'Failed to upload file to Supabase Storage.' });
  } else {
    console.log('File uploaded to Supabase Storage:', data);
    res.status(200).json({ message: 'File uploaded to Supabase Storage successfully', fileKey: data.path });
  }
});

export default router.handler();
import { createRouter } from 'next-connect';
import multer from 'multer';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { supabase } from '../../utils/supabaseClient';

export const config = {
  api: {
    bodyParser: false,
  },
};

const router = createRouter();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post(upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(403).json({ error: 'Unauthorized access' });
    return;
  }

  const { user } = session;
  const username = user.name;
  const positionName = req.body.positionName;

  // Get the current timestamp
  const currentTimestamp = Date.now();

  // Create a unique file name with the timestamp
  const fileType = req.file.mimetype.split('/')[1];
  const uniqueFileName = `${positionName}_${username}_${currentTimestamp}.${fileType}`;

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
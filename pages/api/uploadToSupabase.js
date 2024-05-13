// Import the existing supabase client instead of creating a new one
import { supabase } from '.././utils/supabaseClient'; // Adjust the path as necessary
import multer from 'multer';
import { createRouter } from 'next-connect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const router = createRouter();

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB file size limit

router.post(upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.name) {
    res.status(403).json({ error: 'Unauthorized access or missing username' });
    return;
  }

  const username = session.user.name;
  const fileExtension = req.file.originalname.split('.').pop();
  const timestamp = Date.now(); // Generates a timestamp
  const uniqueFileName = `${username}.${timestamp}.${fileExtension}`; // Creates a unique file name

  try {
    const { data, error } = await supabase.storage
      .from('juprecruit')
      .upload(`talentresume/${uniqueFileName}`, req.file.buffer, {
        contentType: req.file.mimetype
      });

    if (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    } else {
      console.log('File uploaded:', data);
      res.status(200).json({ message: 'File uploaded successfully', fileUrl: data.Key });
    }
  } catch (error) { 
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router.handler();
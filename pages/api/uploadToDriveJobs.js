import { google } from 'googleapis';
import multer from 'multer';
import { createRouter } from 'next-connect';
import stream from 'stream';
import { getServerSession } from 'next-auth/next';

import { authOptions } from './auth/[...nextauth]'; // Import your NextAuth options correctly

const router = createRouter();
export const config = {
  api: {
    bodyParser: false,
  },
};

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

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({
    version: 'v3',
    auth,
  });

  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  try {
    const response = await drive.files.create({
      requestBody: {
        name: `${positionName}_${username}`, // Custom file name
        mimeType: req.file.mimetype,
        parents: ['10JhHUAc7GwCz8I_kBnEDg3gVKY7Crrfd'], // Your Google Drive folder ID
      },
      media: {
        mimeType: req.file.mimetype,
        body: bufferStream,
      },
    }, {
      fields: 'id, name, mimeType'
    });

    console.log('File uploaded:', response.data);
    res.status(200).json({
      message: 'File uploaded successfully',
      fileId: response.data.id
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router.handler();

import { google } from 'googleapis';
import multer from 'multer';
import { createRouter } from 'next-connect';
import stream from 'stream';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Ensure your NextAuth options are imported correctly

const router = createRouter();

export const config = {
  api: {
    bodyParser: false,
  }
};

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB file size limit

router.post(upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  // Get the user session from NextAuth
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || !session.user.name) {
    res.status(403).json({ error: 'Unauthorized access or missing username' });
    return;
  }

  const username = session.user.name;
  const fileExtension = req.file.originalname.split('.').pop();
  const customFileName = `${username}.${fileExtension}`;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  try {
    const response = await drive.files.create({
      requestBody: {
        name: customFileName,
        mimeType: req.file.mimetype,
        parents: ['1JvCSgnTHmEg57M8clo0yjBAzLehBEp0d'], // Ensure this is the correct folder ID
      },
      media: {
        mimeType: req.file.mimetype,
        body: bufferStream,
      },
    }, {
      fields: 'id, name, mimeType'
    });

    console.log('File uploaded:', response.data);
    res.status(200).json({ message: 'File uploaded successfully', fileId: response.data.id });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router.handler();

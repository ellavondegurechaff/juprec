import { google } from 'googleapis';
import multer from 'multer';
import { createRouter } from 'next-connect';
import stream from 'stream';

const router = createRouter();

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post(upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

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
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        parents: ['1JvCSgnTHmEg57M8clo0yjBAzLehBEp0d'],
      },
      media: {
        mimeType: req.file.mimetype,
        body: bufferStream,
      },
    }, {
      // Use fields to limit the API's response size
      fields: 'id, name, mimeType'
    });

    console.log('File uploaded:', response.data);
    res.status(200).json({ message: 'File uploaded successfully', fileId: response.data.id });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
    return;
  }
});

export default router.handler();

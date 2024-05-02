import { google } from 'googleapis';
const Busboy = require('busboy');
import Stream from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const busboy = Busboy({ headers: req.headers });
    let fileToUpload;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      fileToUpload = {
        fileName: filename,
        mimeType: mimetype,
      };

      const uploadStream = new Stream.PassThrough();
      file.pipe(uploadStream);
      fileToUpload.stream = uploadStream;
    });

    busboy.on('finish', async () => {
      if (!fileToUpload) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      try {
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const drive = google.drive({ version: 'v3', auth });

        const response = await drive.files.create({
          requestBody: {
            name: fileToUpload.fileName,
            mimeType: fileToUpload.mimeType,
            parents: ['1JvCSgnTHmEg57M8clo0yjBAzLehBEp0d'],
          },
          media: {
            mimeType: fileToUpload.mimeType,
            body: fileToUpload.stream,
          },
        });

        console.log('File uploaded:', response.data);
        res.status(200).json({ message: 'File uploaded successfully' });
      } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
      }
    });

    req.pipe(busboy);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
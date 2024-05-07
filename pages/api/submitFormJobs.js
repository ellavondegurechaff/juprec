import { google } from 'googleapis';

// Cached auth client
let cachedAuth = null;

async function getGoogleAuth() {
  if (!cachedAuth) {
    cachedAuth = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    await cachedAuth.authorize(); // Ensure the token is valid
  }
  return cachedAuth;
}

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
    const auth = await getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1k4r-E75vN3ozMF3tMNOfDBCmeD5bl7lATmPKd0q-1HI';
    const sheetTitle = 'JobSheet';

    // Check if the sheet exists, and create it if it doesn't
    const { data: sheetData } = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties',
    });

    const sheetExists = sheetData.sheets.some(
      (sheet) => sheet.properties.title === sheetTitle
    );

    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetTitle,
                },
              },
            },
          ],
        },
      });
    }

    // Retrieve existing headers
    const { data: headerData } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!A1:H1`,
    });

    // If headers are missing or incorrect, set them
    const headers = ['Name', 'Contact', 'Message', 'Workgroup', 'Position', 'Username', 'Twitter', 'Discord'];
    if (!headerData.values || headerData.values[0].length < headers.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTitle}!A1:H1`,
        valueInputOption: 'RAW',
        resource: { values: [headers] },
      });
    }

    // Construct the values array
    const values = [
      data.name,
      data.contact,
      data.message,
      data.workgroup,
      data.position,
      session?.user?.name || '',
      session?.user?.image?.includes('twimg.com') ? 'true' : 'false',
      session?.user?.image?.includes('discord') ? 'true' : 'false',
    ];

    // Append the new data
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    res.status(200).json({
      status: 'success',
      message: 'Data appended successfully!',
      updatedRange: result.data.updates.updatedRange,
    });
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    if (error.response?.status === 429) {
      res.status(429).json({ status: 'error', message: 'Rate limit exceeded, please try again later' });
    } else {
      res.status(500).json({ status: 'error', error: error.toString() });
    }
  }
}
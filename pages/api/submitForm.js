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
    await cachedAuth.authorize(); // Ensures the token is valid
  }
  return cachedAuth;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Validate input
  const { data } = req.body;
  if (!data || !data.name) { // Simplified validation for example
    return res.status(400).json({ status: 'error', message: 'Missing required data fields' });
  }

  try {
    const auth = await getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetTitle = 'Sheet1';

    const values = [
      data.name,
      data.expertise?.join(', '),
      data.experience,
      data.interests?.join(', '),
      data.talents,
      data.languages?.join(', '),
      data.timezone,
      data.description,
      data.discord,
      data.twitter,
      data.linkedin
    ];

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    res.status(200).json({ status: 'success', message: "Data appended successfully!", updatedRange: result.data.updates.updatedRange });
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    if (error.response?.status === 429) {
      // Specific handling for rate limit errors
      res.status(429).json({ status: 'error', message: 'Rate limit exceeded, please try again later' });
    } else {
      res.status(500).json({ status: 'error', error: error.toString() });
    }
  }
}

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
  const { data } = req.body;
  if (!data || !data.name) {
    return res.status(400).json({ status: 'error', message: 'Missing required data fields' });
  }

  // Define the headers
  const headers = [
    'Name', 'Expertise', 'Experience', 'Interests', 'Talents', 'Languages',
    'Timezone', 'Description', 'Email', 'Twitter', 'LinkedIn',
    'Discord Username', 'Previous Work Links'
  ];

  try {
    const auth = await getGoogleAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetTitle = 'Sheet1';

    // Retrieve existing headers
    const { data: headerData } = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!A1:L1`
    });

    // If headers are missing or incorrect, set them
    if (!headerData.values || headerData.values[0].length < headers.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTitle}!A1:M1`,
        valueInputOption: 'RAW',
        resource: { values: [headers] }
      });
    }

    // Construct the values array, including "Other" fields if applicable
    const expertiseList = data.expertise.includes('Other') ? [...data.expertise.filter((e) => e !== 'Other'), data.otherExpertise] : data.expertise;
    const interestList = data.interests.includes('Other') ? [...data.interests.filter((i) => i !== 'Other'), data.otherInterests] : data.interests;

    // Construct the values array
    const values = [
      data.name,
      data.expertise.join(', '),
      data.experience,
      data.interests.join(', '),
      data.talents,
      data.languages.join(', '),
      data.timezone,
      data.description,
      data.email,
      session?.user?.image?.includes('twimg.com') ? session?.user?.name : data.twitter,
      data.linkedin,
      data.discordUsername || '',
      data.previousWorkLinks.join(', ')
    ];


    // Append the new data
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] }
    });

    res.status(200).json({
      status: 'success',
      message: "Data appended successfully!",
      updatedRange: result.data.updates.updatedRange
    });
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    if (error.response?.status === 429) {
      res.status(429).json({
        status: 'error',
        message: 'Rate limit exceeded, please try again later'
      });
    } else {
      res.status(500).json({ status: 'error', error: error.toString() });
    }
  }
}

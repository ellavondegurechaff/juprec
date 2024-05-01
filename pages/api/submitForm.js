import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { data } = req.body;  // This should be the form data.
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetTitle = 'Sheet1';  // Ensure this matches your actual sheet title

    // Fetch the first row to check if it is empty (indicative of missing headers)
    const checkHeader = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!A1:K1`  // Assuming you have up to K columns for headers
    });

    if (!checkHeader.data.values || checkHeader.data.values.length === 0) {
      // Append headers if not present
      const headers = [
        'Name', 'Areas of Expertise', 'Experience', 'Areas of Interest', 'Talents/Hobbies',
        'Languages', 'Timezone', 'Description', 'Discord', 'Twitter', 'LinkedIn'
      ];
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetTitle}!A1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [headers] },
      });
    }

    // Prepare data to append
    const values = [
      data.name,
      data.expertise.join(', '),
      data.experience,
      data.interests.join(', '),
      data.talents,
      data.languages.join(', '),
      data.timezone,
      data.description,
      data.discord,
      data.twitter,
      data.linkedin
    ];

    // Append actual data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [values] },
    });

    res.status(200).json({ status: 'success', message: "Data appended successfully!" });
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).json({ status: 'error', error: error.toString() });
  }
};

import { QuizLead } from '../types';

/**
 * Creates a fresh, formatted Google Spreadsheet in the user's Drive and seeds it with headers.
 * Returns the spreadsheet ID of the newly created sheet.
 */
export const createSmeLeadsSpreadsheet = async (accessToken: string, title: string = 'RetailFlow OS - SME Diagnostic Leads'): Promise<string> => {
  try {
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title
        },
        sheets: [
          {
            properties: {
              title: 'Growth_Leads'
            }
          }
        ]
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Failed to create spreadsheet: ${errorText}`);
    }

    const sheetData = await createResponse.json();
    const spreadsheetId = sheetData.spreadsheetId;

    // Seed the headers in the created spreadsheet
    const headers = [
      'Timestamp',
      'Contact Name',
      'Business Name',
      'WhatsApp Number',
      'Email Address',
      'Industry Sector',
      'Core Operational Bottleneck',
      'Calculated Annual Leakage (₦)',
      'Current Channels',
      'Scheduled Appointment',
      'Diagnostic Notes'
    ];

    const seedResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Growth_Leads!A1:K1?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [headers]
      })
    });

    if (!seedResponse.ok) {
      console.warn('Could not write headers to the new spreadsheet, but the sheet was created.');
    }

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating Google Spreadsheet:', error);
    throw error;
  }
};

/**
 * Appends a lead row to the user's specified spreadsheet.
 * Attempts to write to 'Growth_Leads' tab, and fallbacks to the first sheet if that fails.
 */
export const appendLeadToGoogleSheet = async (
  accessToken: string,
  spreadsheetId: string,
  lead: QuizLead
): Promise<void> => {
  const rowData = [
    lead.timestamp,
    lead.name,
    lead.businessName,
    lead.whatsapp,
    lead.email,
    lead.industry,
    lead.corePain,
    lead.revenueLeakage, // Number for easy summing
    lead.channels.join(', '),
    lead.booking ? `${lead.booking.date} @ ${lead.booking.time}` : 'Not Scheduled Yet',
    lead.booking?.notes || ''
  ];

  // Try appending to the specific tab first
  let success = await tryAppend(accessToken, spreadsheetId, 'Growth_Leads!A:K', rowData);

  if (!success) {
    // Fallback to default first sheet
    console.warn("Could not write to 'Growth_Leads' tab. Retrying with default range A:K.");
    success = await tryAppend(accessToken, spreadsheetId, 'A:K', rowData);
  }

  if (!success) {
    throw new Error('Google Sheets row append failed. Please check if your spreadsheet ID is valid and accessible.');
  }
};

const tryAppend = async (
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[]
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [values]
        })
      }
    );

    return response.ok;
  } catch (error) {
    console.error(`Error during spreadsheet append for range ${range}:`, error);
    return false;
  }
};

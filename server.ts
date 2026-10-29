import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'registrations.json');

app.use(express.json());

// Ensure data folder and file exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface RegistrationRecord {
  id: string;
  registrationNumber: string;
  createdAt: string;
  fullName: string;
  mobileNumber: string;
  attendanceType: 'single' | 'couple';
  spouseName?: string;
  spouseMobileNumber?: string;
  mealChoiceSelf: 'Veg' | 'Non Veg';
  mealChoiceSpouse?: 'Veg' | 'Non Veg';
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  departureTime: string;
  travelMode: 'Flight' | 'Train' | 'Car' | 'Other';
  travelDetails?: string;
  preferGolf: 'Yes' | 'No';
  roomPreference?: string;
  allocatedRoom?: string; // Organizer field
  contributionAmount: number;
  paymentStatus?: 'Pending' | 'Paid';
  paymentReference?: string;
  specialNotes?: string;
}

// Initial seed data if file doesn't exist
const initialSeed: RegistrationRecord[] = [
  {
    id: 'reg_101',
    registrationNumber: 'KOL69-001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    fullName: 'Anirban Mukherjee',
    mobileNumber: '+91 98301 24589',
    attendanceType: 'couple',
    spouseName: 'Sreemoyee Mukherjee',
    spouseMobileNumber: '+91 98302 99412',
    mealChoiceSelf: 'Non Veg',
    mealChoiceSpouse: 'Non Veg',
    arrivalDate: '2026-01-29',
    arrivalTime: '11:30',
    departureDate: '2026-02-02',
    departureTime: '17:00',
    travelMode: 'Flight',
    travelDetails: '6E 204 from Delhi (T3)',
    preferGolf: 'Yes',
    roomPreference: 'King bed, high floor with city view',
    allocatedRoom: 'Suite 402 (Grand Oberoi)',
    contributionAmount: 30000,
    paymentStatus: 'Paid',
    paymentReference: 'UPI/602938192834',
    specialNotes: 'Looking forward to meeting batchmates after 10 years!'
  },
  {
    id: 'reg_102',
    registrationNumber: 'KOL69-002',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    fullName: 'Sourav Gangopadhyay',
    mobileNumber: '+91 98310 55678',
    attendanceType: 'single',
    mealChoiceSelf: 'Veg',
    arrivalDate: '2026-01-29',
    arrivalTime: '14:15',
    departureDate: '2026-02-02',
    departureTime: '12:00',
    travelMode: 'Train',
    travelDetails: 'Vande Bharat Express (Howrah)',
    preferGolf: 'No',
    roomPreference: 'Quiet room near elevator',
    allocatedRoom: 'Deluxe 208',
    contributionAmount: 15000,
    paymentStatus: 'Paid',
    paymentReference: 'IMPS/HDFC998231',
    specialNotes: 'Pure vegetarian meal please.'
  }
];

function readRegistrations(): RegistrationRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
      return initialSeed;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as RegistrationRecord[];
  } catch (err) {
    console.error('Error reading registrations file:', err);
    return [];
  }
}

function writeRegistrations(data: RegistrationRecord[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// REST Endpoints
app.get('/api/registrations', (_req, res) => {
  const records = readRegistrations();
  
  // Compute analytics
  let totalGuests = 0;
  let singleCount = 0;
  let coupleCount = 0;
  let vegCount = 0;
  let nonVegCount = 0;
  let golfCount = 0;
  let totalRevenue = 0;

  for (const r of records) {
    if (r.attendanceType === 'couple') {
      coupleCount += 1;
      totalGuests += 2;
      totalRevenue += 30000;
      if (r.mealChoiceSelf === 'Veg') vegCount++; else nonVegCount++;
      if (r.mealChoiceSpouse === 'Veg') vegCount++; else nonVegCount++;
    } else {
      singleCount += 1;
      totalGuests += 1;
      totalRevenue += 15000;
      if (r.mealChoiceSelf === 'Veg') vegCount++; else nonVegCount++;
    }
    if (r.preferGolf === 'Yes') golfCount++;
  }

  res.json({
    success: true,
    count: records.length,
    stats: {
      totalRegistrations: records.length,
      totalGuests,
      singleCount,
      coupleCount,
      vegCount,
      nonVegCount,
      golfCount,
      totalRevenue
    },
    data: records
  });
});

app.post('/api/registrations', (req, res) => {
  try {
    const body = req.body;
    if (!body.fullName || !body.mobileNumber || !body.arrivalDate || !body.departureDate) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    const records = readRegistrations();
    const nextSeq = (records.length + 1).toString().padStart(3, '0');
    const newRecord: RegistrationRecord = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      registrationNumber: `KOL69-${nextSeq}`,
      createdAt: new Date().toISOString(),
      fullName: body.fullName.trim(),
      mobileNumber: body.mobileNumber.trim(),
      attendanceType: body.attendanceType === 'couple' ? 'couple' : 'single',
      spouseName: body.attendanceType === 'couple' ? (body.spouseName || '').trim() : undefined,
      spouseMobileNumber: body.attendanceType === 'couple' ? (body.spouseMobileNumber || '').trim() : undefined,
      mealChoiceSelf: body.mealChoiceSelf === 'Veg' ? 'Veg' : 'Non Veg',
      mealChoiceSpouse: body.attendanceType === 'couple' ? (body.mealChoiceSpouse === 'Veg' ? 'Veg' : 'Non Veg') : undefined,
      arrivalDate: body.arrivalDate,
      arrivalTime: body.arrivalTime || 'TBD',
      departureDate: body.departureDate,
      departureTime: body.departureTime || 'TBD',
      travelMode: body.travelMode || 'Flight',
      travelDetails: (body.travelDetails || '').trim(),
      preferGolf: body.preferGolf === 'Yes' ? 'Yes' : 'No',
      roomPreference: (body.roomPreference || '').trim(),
      allocatedRoom: (body.allocatedRoom || '').trim() || 'Pending Organiser Allotment',
      contributionAmount: body.attendanceType === 'couple' ? 30000 : 15000,
      paymentStatus: body.paymentStatus || 'Pending',
      paymentReference: (body.paymentReference || '').trim(),
      specialNotes: (body.specialNotes || '').trim()
    };

    records.unshift(newRecord); // newest first
    writeRegistrations(records);

    return res.status(201).json({
      success: true,
      message: 'Registration successfully received and saved to JSON!',
      data: newRecord
    });
  } catch (err: any) {
    console.error('Error saving registration:', err);
    return res.status(500).json({ success: false, message: 'Server error while saving registration.' });
  }
});

// Update Room Allocation (Organizer tool)
app.patch('/api/registrations/:id/room', (req, res) => {
  const { id } = req.params;
  const { allocatedRoom, paymentStatus } = req.body;
  const records = readRegistrations();
  const index = records.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Registration record not found.' });
  }

  if (allocatedRoom !== undefined) {
    records[index].allocatedRoom = allocatedRoom;
  }
  if (paymentStatus !== undefined) {
    records[index].paymentStatus = paymentStatus;
  }

  writeRegistrations(records);
  res.json({ success: true, message: 'Record updated successfully.', data: records[index] });
});

// Delete record
app.delete('/api/registrations/:id', (req, res) => {
  const { id } = req.params;
  const records = readRegistrations();
  const filtered = records.filter(r => r.id !== id);
  if (filtered.length === records.length) {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }
  writeRegistrations(filtered);
  res.json({ success: true, message: 'Registration deleted successfully.' });
});

// Export to Excel (.xlsx)
app.get('/api/export/excel', (_req, res) => {
  try {
    const records = readRegistrations();

    // Map records into clean human-friendly Excel rows
    const excelRows = records.map((r, index) => ({
      'Sl. No': index + 1,
      'Reg No': r.registrationNumber,
      'Registered Date': new Date(r.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      'Participant Name': r.fullName,
      'Mobile / WhatsApp': r.mobileNumber,
      'Attendance Type': r.attendanceType.toUpperCase(),
      'Spouse Name': r.spouseName || 'N/A',
      'Spouse Mobile': r.spouseMobileNumber || 'N/A',
      'Self Meal Choice': r.mealChoiceSelf,
      'Spouse Meal Choice': r.mealChoiceSpouse || 'N/A',
      'Arrival Date': r.arrivalDate,
      'Arrival Time': r.arrivalTime,
      'Departure Date': r.departureDate,
      'Departure Time': r.departureTime,
      'Travel Mode': r.travelMode,
      'Travel Details (Flight/Train No)': r.travelDetails || 'None',
      'Play Golf?': r.preferGolf,
      'Guest Room Allotted (Organiser)': r.allocatedRoom || 'Pending',
      'Participant Room Preference': r.roomPreference || 'None',
      'Contribution (INR)': r.contributionAmount,
      'Payment Status': r.paymentStatus || 'Pending',
      'Payment UTR/Ref': r.paymentReference || 'N/A',
      'Special Notes': r.specialNotes || ''
    }));

    // Create workbook & worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelRows);

    // Auto-fit column widths
    const columnWidths = [
      { wch: 8 },  // Sl No
      { wch: 12 }, // Reg No
      { wch: 20 }, // Date
      { wch: 24 }, // Name
      { wch: 18 }, // Mobile
      { wch: 14 }, // Attendance
      { wch: 22 }, // Spouse Name
      { wch: 18 }, // Spouse Mobile
      { wch: 16 }, // Self Meal
      { wch: 18 }, // Spouse Meal
      { wch: 14 }, // Arrival Date
      { wch: 12 }, // Arrival Time
      { wch: 14 }, // Departure Date
      { wch: 12 }, // Departure Time
      { wch: 14 }, // Travel Mode
      { wch: 30 }, // Travel Details
      { wch: 12 }, // Golf
      { wch: 26 }, // Allocated Room
      { wch: 28 }, // Room Preference
      { wch: 18 }, // Contribution
      { wch: 14 }, // Status
      { wch: 24 }, // Payment Ref
      { wch: 32 }  // Notes
    ];
    worksheet['!cols'] = columnWidths;

    // Create Summary Worksheet
    const summaryData = [
      { Metric: 'Event Name', Value: 'Kol Getto SSC 69 Registration' },
      { Metric: 'Event Dates', Value: '29th January – 2nd February' },
      { Metric: 'Total Registrations', Value: records.length },
      { Metric: 'Total Guests (Heads)', Value: records.reduce((acc, r) => acc + (r.attendanceType === 'couple' ? 2 : 1), 0) },
      { Metric: 'Couple Registrations (₹30,000)', Value: records.filter(r => r.attendanceType === 'couple').length },
      { Metric: 'Single Registrations (₹15,000)', Value: records.filter(r => r.attendanceType === 'single').length },
      { Metric: 'Total Expected Contribution', Value: `₹${records.reduce((acc, r) => acc + r.contributionAmount, 0).toLocaleString('en-IN')}` },
      { Metric: 'Total Golf Participants', Value: records.filter(r => r.preferGolf === 'Yes').length },
      { Metric: 'Total Veg Meals', Value: records.reduce((acc, r) => acc + (r.mealChoiceSelf === 'Veg' ? 1 : 0) + (r.mealChoiceSpouse === 'Veg' ? 1 : 0), 0) },
      { Metric: 'Total Non-Veg Meals', Value: records.reduce((acc, r) => acc + (r.mealChoiceSelf === 'Non Veg' ? 1 : 0) + (r.mealChoiceSpouse === 'Non Veg' ? 1 : 0), 0) },
      { Metric: 'Report Generated At', Value: new Date().toLocaleString('en-IN') }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 32 }, { wch: 32 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filename = `Kol_Getto_SSC_69_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err: any) {
    console.error('Error exporting excel:', err);
    res.status(500).json({ success: false, message: 'Failed to generate Excel report' });
  }
});

// Export to CSV
app.get('/api/export/csv', (_req, res) => {
  try {
    const records = readRegistrations();
    const headers = [
      'Sl. No', 'Reg No', 'Date', 'Full Name', 'Mobile', 'Attendance',
      'Spouse Name', 'Spouse Mobile', 'Self Meal', 'Spouse Meal',
      'Arrival Date', 'Arrival Time', 'Departure Date', 'Departure Time',
      'Travel Mode', 'Travel Details', 'Golf', 'Room Allotted',
      'Room Preference', 'Fee (INR)', 'Payment Status', 'Payment Ref', 'Notes'
    ];

    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const rows = records.map((r, i) => [
      i + 1,
      r.registrationNumber,
      r.createdAt,
      r.fullName,
      r.mobileNumber,
      r.attendanceType,
      r.spouseName || '',
      r.spouseMobileNumber || '',
      r.mealChoiceSelf,
      r.mealChoiceSpouse || '',
      r.arrivalDate,
      r.arrivalTime,
      r.departureDate,
      r.departureTime,
      r.travelMode,
      r.travelDetails || '',
      r.preferGolf,
      r.allocatedRoom || '',
      r.roomPreference || '',
      r.contributionAmount,
      r.paymentStatus || '',
      r.paymentReference || '',
      r.specialNotes || ''
    ].map(escape).join(','));

    const csvContent = [headers.map(escape).join(','), ...rows].join('\n');
    const filename = `Kol_Getto_SSC_69_Report_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.send(csvContent);
  } catch (err: any) {
    console.error('Error exporting csv:', err);
    res.status(500).json({ success: false, message: 'Failed to generate CSV' });
  }
});

// In dev, attach Vite middleware. In production, serve dist static files.
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();

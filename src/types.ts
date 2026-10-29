export interface RegistrationRecord {
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

export interface RegistrationStats {
  totalRegistrations: number;
  totalGuests: number;
  singleCount: number;
  coupleCount: number;
  vegCount: number;
  nonVegCount: number;
  golfCount: number;
  totalRevenue: number;
}

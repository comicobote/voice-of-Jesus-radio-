export interface BibleVerse {
  id: number;
  text: string;
  reference: string;
  category: 'praise' | 'faith' | 'healing' | 'salvation' | 'strength';
}

export interface PrayerRequest {
  id: string;
  name: string;
  location: string;
  request: string;
  amens: number;
  timestamp: string;
}

export interface RadioProgram {
  id: number;
  name: string;
  time: string;
  host: string;
  description: string;
}

export interface Contribution {
  id: string;
  name: string;
  amount: number;
  phone: string;
  provider: 'MTN' | 'Airtel';
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
}

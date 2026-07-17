export interface Order {
  id: string;
  customerName: string;
  location: string;
  product: string;
  value: number; // in Naira (₦)
  channel: 'WhatsApp' | 'Instagram' | 'Web';
  status: 'NEW' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';
  time: string;
}

export interface Message {
  id: string;
  channel: 'WhatsApp' | 'Instagram';
  sender: string;
  text: string;
  timestamp: string;
  isIncoming: boolean;
}

export interface Lead {
  id: string;
  name: string;
  score: 'HOT' | 'WARM' | 'COLD';
  summary: string;
  statusTag: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
  iconType: 'whatsapp' | 'instagram' | 'pos' | 'gcal' | 'sage' | 'quickbooks' | 'sheets';
  tag: string;
}

export interface CompetitorPrice {
  id: string;
  product: string;
  category: 'SMARTPHONES' | 'LAPTOPS' | 'AUDIO';
  imageAlt: string;
  imageSrc: string;
  techHubPrice: number;
  slotPrice: number;
  pointekPrice: number;
  jumiaPrice: number;
  trend: 'up' | 'down' | 'flat';
}

export interface AIResponse {
  keywords: string[];
  response: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'SMARTPHONES' | 'LAPTOPS' | 'AUDIO';
  price: number; // in Naira (₦)
  imageSrc: string;
  imageAlt: string;
  specs: string[];
  stock: number;
  rating: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalSpent: number;
  orderCount: number;
  joinDate: string;
  sentiment: 'Satisfied' | 'Neutral' | 'At Risk';
  lastActive: string;
}

export interface QuizLead {
  id: string;
  timestamp: string;
  name: string;
  businessName: string;
  whatsapp: string;
  email: string;
  industry: string;
  channels: string[];
  replyDelay: string;
  corePain: string;
  timeValuation: string;
  stockTracking?: string;
  paymentVerification?: string;
  customerRetention?: string;
  revenueLeakage: number;
  booking?: {
    date: string;
    time: string;
    notes?: string;
    meetLink?: string;
  };
  syncedToSheets: boolean;
}


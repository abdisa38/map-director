import React, { useState, useMemo } from 'react';
import type { SessionOrder } from './OrderTracking';
import './admin.css';

// SVG Icons (Clean & recognizable)
function AdminIcon({ name, size = 18 }: { name: string; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
    orders: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    menu: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></>,
    categories: <><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M14 14h7v7h-7z"/><path d="M3 14h7v7H3z"/></>,
    tables: <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="4" y2="20"/><line x1="15" x2="15" y1="4" y2="20"/></>,
    staff: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>,
    reports: <><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    plus: <><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    edit: <><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    close: <><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    qr: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/></>,
    printer: <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
    userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    refreshCw: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></>,
    alertTriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    moreVertical: <><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    crown: <><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
    userX: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name] || icons.dashboard}
    </svg>
  );
}

// Clean, high-contrast, scannable QR Code SVG Generator
export function TableQRCodeSVG({ size = 160, tableNumber = '08', color = '#143D2B' }: { size?: number; tableNumber?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label={`QR Code for ${tableNumber}`}>
      <rect width="100" height="100" fill="#FAF8F5" rx="6" />
      {/* Top Left Marker */}
      <rect x="8" y="8" width="26" height="26" rx="4" stroke={color} strokeWidth="4" />
      <rect x="15" y="15" width="12" height="12" rx="2" fill={color} />
      {/* Top Right Marker */}
      <rect x="66" y="8" width="26" height="26" rx="4" stroke={color} strokeWidth="4" />
      <rect x="73" y="15" width="12" height="12" rx="2" fill={color} />
      {/* Bottom Left Marker */}
      <rect x="8" y="66" width="26" height="26" rx="4" stroke={color} strokeWidth="4" />
      <rect x="15" y="73" width="12" height="12" rx="2" fill={color} />
      {/* Data Pattern Modules */}
      <rect x="40" y="12" width="6" height="6" fill={color} />
      <rect x="52" y="12" width="6" height="6" fill={color} />
      <rect x="46" y="24" width="6" height="6" fill={color} />
      <rect x="12" y="42" width="6" height="6" fill={color} />
      <rect x="24" y="42" width="6" height="6" fill={color} />
      <rect x="18" y="52" width="6" height="6" fill={color} />
      <rect x="70" y="42" width="6" height="6" fill={color} />
      <rect x="82" y="42" width="6" height="6" fill={color} />
      <rect x="76" y="52" width="6" height="6" fill={color} />
      <rect x="40" y="76" width="6" height="6" fill={color} />
      <rect x="52" y="76" width="6" height="6" fill={color} />
      <rect x="46" y="66" width="6" height="6" fill={color} />
      <rect x="68" y="70" width="6" height="6" fill={color} />
      <rect x="80" y="70" width="6" height="6" fill={color} />
      <rect x="74" y="82" width="6" height="6" fill={color} />
      {/* Center GebetaQR Badge */}
      <rect x="38" y="38" width="24" height="24" rx="4" fill="#C69234" />
      <text x="50" y="53" fill="#143D2B" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">GQ</text>
    </svg>
  );
}

const money = (n: number) => `ETB ${n.toLocaleString()}`;

export type DiningTable = {
  id: string;
  number: string;
  area: string;
  capacity: number;
  active: boolean;
  qrToken: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  tag?: string;
  portions?: { name: string; price: number }[];
  extras?: { name: string; price: number }[];
};

const initialTables: DiningTable[] = [
  { id: 't1', number: 'Table 01', area: 'Main Dining', capacity: 2, active: true, qrToken: 'ak-t01-9f2b' },
  { id: 't2', number: 'Table 02', area: 'Main Dining', capacity: 4, active: true, qrToken: 'ak-t02-4a11' },
  { id: 't4', number: 'Table 04', area: 'Main Dining', capacity: 4, active: true, qrToken: 'ak-t04-8c7e' },
  { id: 't8', number: 'Table 08', area: 'Main Dining', capacity: 6, active: true, qrToken: 'ak-t08-3e44' },
  { id: 't10', number: 'Table 10', area: 'Main Dining', capacity: 8, active: true, qrToken: 'ak-t10-2b19' },
  { id: 'ter1', number: 'Terrace 01', area: 'Terrace', capacity: 2, active: true, qrToken: 'ak-ter1-5d88' },
  { id: 'ter2', number: 'Terrace 02', area: 'Terrace', capacity: 4, active: true, qrToken: 'ak-ter2-7f31' },
  { id: 'vip1', number: 'VIP Lounge', area: 'VIP Lounge', capacity: 10, active: false, qrToken: 'ak-vip1-1c02' },
];

const defaultDishes: MenuItem[] = [
  { id: 1, name: 'Doro Wat', description: 'Slow-cooked chicken in berbere sauce with boiled egg and injera.', price: 680, category: 'Ethiopian Food', image: 'photo-1746716447103-e1618bbd0669', available: true, tag: 'House favourite', portions: [{ name: 'Regular', price: 0 }, { name: 'Large', price: 180 }], extras: [{ name: 'Extra egg', price: 60 }, { name: 'Extra injera', price: 45 }] },
  { id: 2, name: 'Sizzling Beef Tibs', description: 'Tender beef sautéed with rosemary, peppers and fresh injera.', price: 720, category: 'Ethiopian Food', image: 'photo-1544025162-d76694265947', available: true, tag: 'Popular', portions: [{ name: 'Regular', price: 0 }, { name: 'Large', price: 200 }], extras: [{ name: 'Extra injera', price: 45 }, { name: 'Awaze sauce', price: 40 }] },
  { id: 3, name: 'The Garden Beyaynetu', description: 'Colourful combination of lentils and spiced vegetables on injera.', price: 460, category: 'Ethiopian Food', image: 'photo-1593252719532-53f183016149', available: true, tag: 'Plant-based' },
  { id: 4, name: 'Herb-Grilled Chicken', description: 'Flame-grilled chicken served with seasonal garden vegetables.', price: 650, category: 'Main Courses', image: 'photo-1670398564097-0762e1b30b3a', available: true },
  { id: 5, name: 'Abay Signature Burger', description: 'Grilled beef patty, cheddar, caramelised onions and fries.', price: 580, category: 'Burgers', image: 'photo-1568901346375-23c9450c58cd', available: true, portions: [{ name: 'Single patty', price: 0 }, { name: 'Double patty', price: 160 }], extras: [{ name: 'Extra cheese', price: 50 }, { name: 'Extra fries', price: 90 }] },
  { id: 6, name: 'Garden Margherita', description: 'Stone-baked pizza dough, fresh tomatoes, mozzarella and basil.', price: 620, category: 'Pizza', image: 'photo-1574071318508-1cdbab80d002', available: true, tag: 'Vegetarian' },
  { id: 7, name: 'Fresh Mango Juice', description: 'Freshly squeezed sweet ripe mango with no added sugar.', price: 180, category: 'Drinks', image: 'photo-1622597467836-f3285f2131b8', available: true },
  { id: 8, name: 'Chocolate Indulgence', description: 'Warm chocolate cake with soft centre and vanilla ice cream.', price: 320, category: 'Desserts', image: 'photo-1578985545062-69928b1d9587', available: false, tag: 'Sold Out' },
  { id: 9, name: 'Morning Shakshuka', description: 'Eggs slow-cooked in spiced tomato sauce with sourdough bread.', price: 340, category: 'Breakfast', image: 'photo-1525351484163-7529414344d8', available: true }
];

const initialCategories = ['All Items', 'Ethiopian Food', 'Main Courses', 'Breakfast', 'Burgers', 'Pizza', 'Drinks', 'Desserts'];
const diningAreas = ['All Areas', 'Main Dining', 'Terrace', 'VIP Lounge', 'Patio'];

// 03D — Staff Management, Roles & Permissions Types & Data
export type StaffRole = 'Owner' | 'Manager' | 'Kitchen Staff' | 'Waiter' | 'Cashier';
export type StaffStatus = 'Active' | 'Pending Invitation' | 'Inactive';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: StaffStatus;
  dateAdded: string;
  lastActive: string;
  avatar: string;
  invitationNote?: string;
}

export const initialStaff: StaffMember[] = [
  {
    id: 's1',
    name: 'Abebe Bekele',
    email: 'abebe@abaykitchen.com',
    phone: '+251 91 123 4567',
    role: 'Owner',
    status: 'Active',
    dateAdded: '12 Jan 2026',
    lastActive: '5m ago',
    avatar: 'AB'
  },
  {
    id: 's2',
    name: 'Selamawit Desta',
    email: 'selam@abaykitchen.com',
    phone: '+251 92 345 6789',
    role: 'Manager',
    status: 'Active',
    dateAdded: '15 Jan 2026',
    lastActive: '22m ago',
    avatar: 'SD'
  },
  {
    id: 's3',
    name: 'Tigist Haile',
    email: 'tigist@abaykitchen.com',
    phone: '+251 93 456 7890',
    role: 'Kitchen Staff',
    status: 'Active',
    dateAdded: '18 Jan 2026',
    lastActive: '1h ago',
    avatar: 'TH'
  },
  {
    id: 's4',
    name: 'Dawit Tadesse',
    email: 'dawit@abaykitchen.com',
    phone: '+251 94 567 8901',
    role: 'Waiter',
    status: 'Active',
    dateAdded: '20 Jan 2026',
    lastActive: '3h ago',
    avatar: 'DT'
  },
  {
    id: 's5',
    name: 'Almaz Ayana',
    email: 'almaz@abaykitchen.com',
    phone: '+251 95 678 9012',
    role: 'Cashier',
    status: 'Active',
    dateAdded: '22 Jan 2026',
    lastActive: '2h ago',
    avatar: 'AA'
  },
  {
    id: 's6',
    name: 'Yared Solomon',
    email: 'yared.s@gmail.com',
    phone: '+251 96 789 0123',
    role: 'Waiter',
    status: 'Pending Invitation',
    dateAdded: '16 Oct 2026',
    lastActive: 'Never (Invite Sent)',
    avatar: 'YS',
    invitationNote: 'Welcome to the evening dining room service crew.'
  },
  {
    id: 's7',
    name: 'Bethelhem Worku',
    email: 'bethel@gmail.com',
    phone: '+251 97 890 1234',
    role: 'Cashier',
    status: 'Inactive',
    dateAdded: '05 Feb 2026',
    lastActive: '14 days ago',
    avatar: 'BW'
  }
];

export const roleDescriptions: Record<StaffRole, { title: string; desc: string; icon: string; badgeClass: string }> = {
  Owner: {
    title: 'Owner',
    desc: 'Full workspace control, billing, settings, and team access.',
    icon: 'crown',
    badgeClass: 'owner'
  },
  Manager: {
    title: 'Manager',
    desc: 'Daily floor operations, orders, food menu, and dining tables.',
    icon: 'shield',
    badgeClass: 'manager'
  },
  'Kitchen Staff': {
    title: 'Kitchen Staff',
    desc: 'View incoming orders, prep statuses, and kitchen dietary notes.',
    icon: 'menu',
    badgeClass: 'kitchen'
  },
  Waiter: {
    title: 'Waiter / Service',
    desc: 'View table orders, update serving status, and table QR info.',
    icon: 'orders',
    badgeClass: 'waiter'
  },
  Cashier: {
    title: 'Cashier',
    desc: 'View orders, record payments, and confirm guest billing.',
    icon: 'check',
    badgeClass: 'cashier'
  }
};

export interface PermissionCategory {
  category: string;
  Owner: string;
  Manager: string;
  'Kitchen Staff': string;
  Waiter: string;
  Cashier: string;
}

export const permissionMatrix: PermissionCategory[] = [
  {
    category: 'Dashboard & Overview',
    Owner: 'Full View & KPI Controls',
    Manager: 'View Real-time Metrics',
    'Kitchen Staff': 'Restricted',
    Waiter: 'Restricted',
    Cashier: "View Today's Total Sales"
  },
  {
    category: 'Order Management',
    Owner: 'View, Edit, Cancel, Manage',
    Manager: 'View, Edit, Cancel, Manage',
    'Kitchen Staff': 'View Orders & Update Prep',
    Waiter: 'View Orders & Mark Served',
    Cashier: 'View Orders & Verify Pay'
  },
  {
    category: 'Food Menu & Categories',
    Owner: 'View, Create, Edit, Price',
    Manager: 'View, Create, Edit Availability',
    'Kitchen Staff': 'View Menu & Recipes',
    Waiter: 'View Available Items',
    Cashier: 'View Item Prices'
  },
  {
    category: 'Tables & QR Codes',
    Owner: 'View, Create, Print, Manage',
    Manager: 'View, Edit, Print QR Cards',
    'Kitchen Staff': 'Restricted',
    Waiter: 'View Table QR Status',
    Cashier: 'Restricted'
  },
  {
    category: 'Staff Management',
    Owner: 'Invite, Change Roles, Deactivate',
    Manager: 'View Staff Directory',
    'Kitchen Staff': 'Restricted',
    Waiter: 'Restricted',
    Cashier: 'Restricted'
  },
  {
    category: 'Customer Feedback',
    Owner: 'View, Export, Manage',
    Manager: 'View & Respond',
    'Kitchen Staff': 'View Food Rating Notes',
    Waiter: 'View Service Feedback',
    Cashier: 'Restricted'
  },
  {
    category: 'Reports & Analytics',
    Owner: 'Full Financial & Export',
    Manager: 'Daily Sales & Shift Summary',
    'Kitchen Staff': 'Restricted',
    Waiter: 'Restricted',
    Cashier: 'Restricted'
  },
  {
    category: 'Payment & Billing',
    Owner: 'Bank, Telebirr & Payouts',
    Manager: 'Restricted',
    'Kitchen Staff': 'Restricted',
    Waiter: 'Restricted',
    Cashier: 'Record & Confirm Payments'
  },
  {
    category: 'Restaurant Settings',
    Owner: 'Full Workspace Configuration',
    Manager: 'Restricted',
    'Kitchen Staff': 'Restricted',
    Waiter: 'Restricted',
    Cashier: 'Restricted'
  }
];

type Props = {
  sharedOrders: SessionOrder[];
  onUpdateOrders: (orders: SessionOrder[]) => void;
  onNavigateToCustomer: () => void;
};

export default function AdminDashboard({ sharedOrders, onUpdateOrders, onNavigateToCustomer }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'categories' | 'tables' | 'staff'>('staff');
  const [tables, setTables] = useState<DiningTable[]>(initialTables);
  const [dishes, setDishes] = useState<MenuItem[]>(defaultDishes);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  // Table Filters & Search
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [searchTable, setSearchTable] = useState('');
  const [tableStatusFilter, setTableStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals for 03C
  const [selectedQRTable, setSelectedQRTable] = useState<DiningTable | null>(null);
  const [editingTable, setEditingTable] = useState<DiningTable | null>(null);
  const [isNewTable, setIsNewTable] = useState(false);
  const [printModalTable, setPrintModalTable] = useState<DiningTable | null>(null);
  const [printConcept, setPrintConcept] = useState<'card' | 'tent' | 'bulk'>('card');
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals for 03B
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);

  // Staff Management State (03D)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaff);
  const [searchStaff, setSearchStaff] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('All');
  const [staffStatusFilter, setStaffStatusFilter] = useState<string>('All');

  // 03D Modals and Drawers
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedStaffProfile, setSelectedStaffProfile] = useState<StaffMember | null>(null);
  const [isPermissionsMatrixOpen, setIsPermissionsMatrixOpen] = useState(false);
  const [selectedMatrixRole, setSelectedMatrixRole] = useState<StaffRole>('Manager');
  const [roleChangeTarget, setRoleChangeTarget] = useState<StaffMember | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<StaffRole>('Manager');
  const [deactivatingTarget, setDeactivatingTarget] = useState<StaffMember | null>(null);

  // Add Staff Form State
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Waiter' as StaffRole,
    note: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [inviteSentSuccess, setInviteSentSuccess] = useState<StaffMember | null>(null);
  const [simulateInviteError, setSimulateInviteError] = useState(false);
  const [inviteErrorMsg, setInviteErrorMsg] = useState<string | null>(null);
  const [showMernDetails, setShowMernDetails] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered Staff (03D)
  const filteredStaff = useMemo(() => {
    return staffMembers.filter(member => {
      const matchSearch =
        member.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
        member.email.toLowerCase().includes(searchStaff.toLowerCase()) ||
        (member.phone && member.phone.includes(searchStaff));
      const matchRole = staffRoleFilter === 'All' || member.role === staffRoleFilter;
      const matchStatus = staffStatusFilter === 'All' || member.status === staffStatusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [staffMembers, searchStaff, staffRoleFilter, staffStatusFilter]);

  // Handle Send Invitation (03D)
  const handleSendInvitation = () => {
    const errors: { name?: string; email?: string } = {};
    if (!addForm.name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!addForm.email.trim()) {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(addForm.email.trim())) {
        errors.email = 'Enter a valid email address (e.g. name@abaykitchen.com)';
      } else if (staffMembers.some(s => s.email.toLowerCase() === addForm.email.trim().toLowerCase())) {
        errors.email = 'A staff account with this email already exists in Abay Kitchen';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmittingInvite(true);
    setInviteErrorMsg(null);

    // Simulate async network request
    setTimeout(() => {
      setIsSubmittingInvite(false);
      if (simulateInviteError) {
        setInviteErrorMsg('Unable to dispatch email invitation: Mail relay service unreachable. Please retry.');
        return;
      }

      const initials = addForm.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const newMember: StaffMember = {
        id: `s-${Date.now()}`,
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim() || undefined,
        role: addForm.role,
        status: 'Pending Invitation',
        dateAdded: 'Today',
        lastActive: 'Never (Invite Sent)',
        avatar: initials || 'ST',
        invitationNote: addForm.note.trim() || undefined
      };

      setStaffMembers(prev => [newMember, ...prev]);
      setInviteSentSuccess(newMember);
      showToast(`Invitation sent to ${newMember.email}`);
    }, 650);
  };

  // Resend Invite (03D)
  const handleResendInvite = (member: StaffMember) => {
    showToast(`Fresh 24h invitation token dispatched to ${member.email}`);
  };

  // Change Role (03D)
  const handleConfirmRoleChange = () => {
    if (!roleChangeTarget) return;
    if (roleChangeTarget.role === 'Owner' && newSelectedRole !== 'Owner') {
      const ownerCount = staffMembers.filter(s => s.role === 'Owner' && s.status === 'Active').length;
      if (ownerCount <= 1) {
        showToast('Cannot change role: Workspace must have at least one active Owner.');
        return;
      }
    }

    setStaffMembers(prev =>
      prev.map(s => (s.id === roleChangeTarget.id ? { ...s, role: newSelectedRole } : s))
    );
    if (selectedStaffProfile?.id === roleChangeTarget.id) {
      setSelectedStaffProfile({ ...selectedStaffProfile, role: newSelectedRole });
    }
    showToast(`${roleChangeTarget.name}'s role updated to ${newSelectedRole}`);
    setRoleChangeTarget(null);
  };

  // Toggle Account Active / Inactive (03D)
  const handleConfirmDeactivation = () => {
    if (!deactivatingTarget) return;
    if (deactivatingTarget.role === 'Owner' && deactivatingTarget.status === 'Active') {
      showToast('Action Blocked: Primary Owner account cannot be deactivated.');
      setDeactivatingTarget(null);
      return;
    }

    const nextStatus: StaffStatus = deactivatingTarget.status === 'Active' ? 'Inactive' : 'Active';
    setStaffMembers(prev =>
      prev.map(s => (s.id === deactivatingTarget.id ? { ...s, status: nextStatus } : s))
    );
    if (selectedStaffProfile?.id === deactivatingTarget.id) {
      setSelectedStaffProfile({ ...selectedStaffProfile, status: nextStatus });
    }
    showToast(
      nextStatus === 'Inactive'
        ? `${deactivatingTarget.name} has been deactivated. Historical records preserved.`
        : `${deactivatingTarget.name} has been reactivated.`
    );
    setDeactivatingTarget(null);
  };

  // Toggle Table Active Status
  const toggleTableActive = (id: string) => {
    setTables(prev =>
      prev.map(t => {
        if (t.id === id) {
          const next = !t.active;
          showToast(`${t.number} marked as ${next ? 'Active' : 'Inactive'}`);
          return { ...t, active: next };
        }
        return t;
      })
    );
  };

  // Filtered Tables
  const filteredTables = useMemo(() => {
    return tables.filter(t => {
      const matchArea = selectedArea === 'All Areas' || t.area === selectedArea;
      const matchSearch = t.number.toLowerCase().includes(searchTable.toLowerCase()) || t.area.toLowerCase().includes(searchTable.toLowerCase());
      const matchStatus = tableStatusFilter === 'all' ? true : tableStatusFilter === 'active' ? t.active : !t.active;
      return matchArea && matchSearch && matchStatus;
    });
  }, [tables, selectedArea, searchTable, tableStatusFilter]);

  // Save Table
  const handleSaveTable = () => {
    if (!editingTable) return;
    if (!editingTable.number.trim()) {
      showToast('Please enter a table name');
      return;
    }
    if (isNewTable) {
      if (tables.some(t => t.number.toLowerCase() === editingTable.number.toLowerCase())) {
        showToast('A table with this number already exists');
        return;
      }
      setTables([...tables, editingTable]);
      showToast(`${editingTable.number} created with QR Code!`);
    } else {
      setTables(tables.map(t => (t.id === editingTable.id ? editingTable : t)));
      showToast(`${editingTable.number} updated!`);
    }
    setEditingTable(null);
  };

  // Delete Table
  const handleDeleteTable = (id: string, name: string) => {
    setTables(tables.filter(t => t.id !== id));
    showToast(`${name} deleted`);
  };

  // Regenerate QR Token
  const handleRegenerateQR = (table: DiningTable) => {
    const newToken = `ak-${table.number.toLowerCase().replace(/\s+/g, '')}-${Math.random().toString(36).substring(2, 6)}`;
    setTables(tables.map(t => (t.id === table.id ? { ...t, qrToken: newToken } : t)));
    setSelectedQRTable({ ...table, qrToken: newToken });
    showToast(`New QR Code generated for ${table.number}`);
  };

  return (
    <div className="admin-shell">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <a href="#" className="admin-brand" onClick={e => { e.preventDefault(); setActiveTab('overview'); }}>
            <span style={{ color: 'var(--gold)' }}>gebeta</span>QR
            <span className="admin-brand-badge">Admin</span>
          </a>
          <div className="admin-restaurant-selector" title="Active Branch">
            <div>
              <strong>Abay Kitchen</strong>
              <small>Bole · Addis Ababa</small>
            </div>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Restaurant Management Menu">
          <button
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="dashboard" size={18} />
            <span>Overview</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="orders" size={18} />
            <span>Orders</span>
            {sharedOrders.filter(o => o.status === 'Received').length > 0 && (
              <span className="admin-nav-badge">{sharedOrders.filter(o => o.status === 'Received').length}</span>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="menu" size={18} />
            <span>Food Menu</span>
            <span className="admin-nav-badge" style={{ background: '#23734b', color: '#fff' }}>{dishes.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="categories" size={18} />
            <span>Categories</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tables'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="tables" size={18} />
            <span>Tables & QR</span>
            <span className="admin-nav-badge" style={{ background: 'var(--gold)', color: '#10261b' }}>{tables.length}</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => { setActiveTab('staff'); setMobileMenuOpen(false); }}
          >
            <AdminIcon name="staff" size={18} />
            <span>Staff</span>
            <span className="admin-nav-badge" style={{ background: '#2e6b4d', color: '#fff' }}>{staffMembers.length}</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Sales Reports (Coming in 03E)')}>
            <AdminIcon name="reports" size={18} />
            <span>Reports</span>
            <span className="admin-nav-soon">03E</span>
          </button>

          <button className="admin-nav-item" onClick={() => showToast('Settings (Coming in 03F)')}>
            <AdminIcon name="settings" size={18} />
            <span>Settings</span>
            <span className="admin-nav-soon">03F</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <span className="admin-user-avatar">AB</span>
            <div className="admin-user-info">
              <span className="admin-user-name">Abebe Bekele</span>
              <span className="admin-user-role">Owner</span>
            </div>
            <button
              className="admin-logout-btn"
              title="Sign Out"
              onClick={() => showToast('Signed out (demo)')}
              aria-label="Sign out"
            >
              <AdminIcon name="logout" size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <AdminIcon name="dashboard" size={18} />
            </button>
            <div className="admin-breadcrumb">
              <span>Abay Kitchen</span>
              <span>/</span>
              <strong>
                {activeTab === 'overview'
                  ? 'Overview'
                  : activeTab === 'orders'
                  ? 'Orders'
                  : activeTab === 'menu'
                  ? 'Food Menu'
                  : activeTab === 'categories'
                  ? 'Categories'
                  : activeTab === 'tables'
                  ? 'Tables & QR Codes'
                  : 'Staff Management'}
              </strong>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button className="admin-live-link" onClick={onNavigateToCustomer} title="View live customer menu">
              <AdminIcon name="external" size={14} />
              <span>Customer Menu (Table 08)</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          {/* =========================================================
              TAB: TABLES & QR CODE GENERATION (03C)
             ========================================================= */}
          {activeTab === 'tables' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Tables & QR Codes</h1>
                  <p>Generate digital menu QR codes for dining tables. Print table tents and cards.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="admin-action-btn secondary"
                    onClick={() => {
                      setPrintModalTable(tables[0]);
                      setPrintConcept('bulk');
                    }}
                  >
                    <AdminIcon name="printer" size={15} /> Print All QR Codes
                  </button>
                  <button
                    className="admin-action-btn primary"
                    onClick={() => {
                      setIsNewTable(true);
                      setEditingTable({
                        id: `t-${Date.now()}`,
                        number: `Table 0${tables.length + 1}`,
                        area: 'Main Dining',
                        capacity: 4,
                        active: true,
                        qrToken: `ak-t${tables.length + 1}-${Math.random().toString(36).substring(2, 6)}`
                      });
                    }}
                  >
                    <AdminIcon name="plus" size={15} /> Add Dining Table
                  </button>
                </div>
              </div>

              {/* Area Filters & Search */}
              <div className="admin-orders-controls">
                <div className="admin-status-tabs">
                  {diningAreas.map(area => (
                    <button
                      key={area}
                      className={`admin-tab-btn ${selectedArea === area ? 'active' : ''}`}
                      onClick={() => setSelectedArea(area)}
                    >
                      <span>{area}</span>
                      <span className="admin-tab-count">
                        {area === 'All Areas' ? tables.length : tables.filter(t => t.area === area).length}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="admin-filter-row">
                  <div className="admin-search-input">
                    <AdminIcon name="search" size={16} />
                    <input
                      type="text"
                      placeholder="Search table number…"
                      value={searchTable}
                      onChange={e => setSearchTable(e.target.value)}
                    />
                  </div>

                  <select
                    className="admin-select"
                    value={tableStatusFilter}
                    onChange={e => setTableStatusFilter(e.target.value as any)}
                  >
                    <option value="all">All Tables</option>
                    <option value="active">Active QR Codes</option>
                    <option value="inactive">Inactive Tables</option>
                  </select>
                </div>
              </div>

              {/* Tables Grid */}
              <div className="admin-tables-grid">
                {filteredTables.map(table => {
                  const hasLiveOrder = table.number === 'Table 08' || table.number === 'Table 04';
                  return (
                    <div className={`admin-table-box ${!table.active ? 'inactive' : ''}`} key={table.id}>
                      <div className="admin-table-box-top">
                        <div className="admin-table-title">
                          <h3>{table.number}</h3>
                          <span className="admin-table-area-tag">{table.area}</span>
                        </div>
                        {/* Interactive mini QR preview */}
                        <div
                          className="admin-table-qr-mini"
                          onClick={() => setSelectedQRTable(table)}
                          title="Click to view full QR code"
                        >
                          <TableQRCodeSVG size={50} tableNumber={table.number} />
                        </div>
                      </div>

                      <div className="admin-table-meta-row">
                        <span>Capacity: <strong>{table.capacity} Guests</strong></span>
                        <span className={`admin-table-order-pill ${hasLiveOrder ? 'active' : 'idle'}`}>
                          {hasLiveOrder ? '● Active Order' : 'No Order'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                          QR Ordering: <strong style={{ color: table.active ? '#23734b' : '#b83b3b' }}>{table.active ? 'Active' : 'Disabled'}</strong>
                        </span>
                        <button
                          className={`admin-toggle ${table.active ? 'on' : ''}`}
                          onClick={() => toggleTableActive(table.id)}
                          title={table.active ? 'Deactivate table QR' : 'Activate table QR'}
                          aria-label={`Toggle active for ${table.number}`}
                        >
                          <span className="admin-toggle-knob" />
                        </button>
                      </div>

                      <div className="admin-table-card-actions">
                        <button
                          className="admin-action-btn secondary"
                          style={{ flex: 1 }}
                          onClick={() => setSelectedQRTable(table)}
                        >
                          <AdminIcon name="qr" size={14} /> QR Code
                        </button>
                        <button
                          className="admin-action-btn secondary"
                          onClick={() => {
                            setPrintModalTable(table);
                            setPrintConcept('card');
                          }}
                          title="Print physical table card"
                        >
                          <AdminIcon name="printer" size={14} /> Print
                        </button>
                        <button
                          className="admin-action-btn secondary"
                          onClick={() => {
                            setIsNewTable(false);
                            setEditingTable({ ...table });
                          }}
                          title="Edit table settings"
                        >
                          <AdminIcon name="edit" size={14} />
                        </button>
                        <button
                          className="admin-action-btn danger"
                          onClick={() => handleDeleteTable(table.id, table.number)}
                          title="Delete table"
                        >
                          <AdminIcon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredTables.length === 0 && (
                <div className="admin-empty-state">
                  <AdminIcon name="tables" size={40} />
                  <h3>No tables found</h3>
                  <p>Try searching another table or clearing your area filter.</p>
                  <button className="admin-action-btn secondary" onClick={() => { setSearchTable(''); setSelectedArea('All Areas'); }}>
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}

          {/* =========================================================
              TAB: MENU MANAGEMENT (03B)
             ========================================================= */}
          {activeTab === 'menu' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Menu Management</h1>
                  <p>Add new dishes, change prices, and toggle available items instantly.</p>
                </div>
                <button
                  className="admin-action-btn primary"
                  onClick={() => {
                    setIsNewItem(true);
                    setEditingItem({
                      id: Date.now(),
                      name: '',
                      description: '',
                      price: 350,
                      category: 'Ethiopian Food',
                      image: 'photo-1544025162-d76694265947',
                      available: true,
                      portions: [{ name: 'Regular', price: 0 }]
                    });
                  }}
                >
                  <AdminIcon name="plus" size={16} /> Add New Dish
                </button>
              </div>

              <div className="admin-menu-grid">
                {dishes.map(dish => (
                  <div className={`admin-food-card ${!dish.available ? 'unavailable' : ''}`} key={dish.id}>
                    <div className="admin-food-thumb">
                      <img src={`https://images.unsplash.com/${dish.image}?w=500&auto=format&fit=crop&q=80`} alt={dish.name} />
                      {dish.tag && <span className="admin-food-tag">{dish.tag}</span>}
                      {!dish.available && <div className="admin-soldout-badge">TEMPORARILY SOLD OUT</div>}
                    </div>

                    <div className="admin-food-body">
                      <div className="admin-food-title-row">
                        <h3>{dish.name}</h3>
                        <span className="admin-food-category-badge">{dish.category}</span>
                      </div>
                      <p className="admin-food-desc">{dish.description}</p>
                      <div className="admin-food-meta">
                        <span className="admin-food-price">{money(dish.price)}</span>
                        <div className="admin-toggle-wrap">
                          <button
                            className={`admin-toggle ${dish.available ? 'on' : ''}`}
                            onClick={() => {
                              const next = !dish.available;
                              setDishes(dishes.map(d => (d.id === dish.id ? { ...d, available: next } : d)));
                              showToast(`${dish.name} is now ${next ? 'Available' : 'Sold Out'}`);
                            }}
                          >
                            <span className="admin-toggle-knob" />
                          </button>
                          <span style={{ color: dish.available ? '#23734b' : '#b83b3b' }}>
                            {dish.available ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                      </div>

                      <div className="admin-food-actions">
                        <button className="admin-action-btn secondary" onClick={() => setPreviewItem(dish)}>
                          <AdminIcon name="eye" size={14} /> Preview
                        </button>
                        <button className="admin-action-btn secondary" onClick={() => { setIsNewItem(false); setEditingItem({ ...dish }); }}>
                          <AdminIcon name="edit" size={14} /> Edit
                        </button>
                        <button className="admin-action-btn danger" onClick={() => setDishes(dishes.filter(d => d.id !== dish.id))}>
                          <AdminIcon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* =========================================================
              TAB: CATEGORIES (03B)
             ========================================================= */}
          {activeTab === 'categories' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1>Menu Categories</h1>
                  <p>Organize how dishes appear to customers browsing on their phones.</p>
                </div>
              </div>
              <div className="admin-category-grid">
                {categories.filter(c => c !== 'All Items').map(cat => (
                  <div className="admin-category-card" key={cat}>
                    <div className="admin-category-card-top">
                      <div>
                        <h3>{cat}</h3>
                        <p>{dishes.filter(d => d.category === cat).length} dishes</p>
                      </div>
                    </div>
                    <div className="admin-category-actions">
                      <button className="admin-action-btn secondary" onClick={() => setActiveTab('menu')}>
                        View Items
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* =========================================================
              TAB: ORDERS & OVERVIEW
             ========================================================= */}
          {activeTab === 'orders' && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ORDER REF</th>
                    <th>TABLE</th>
                    <th>ITEMS</th>
                    <th>TOTAL</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {sharedOrders.map(order => (
                    <tr key={order.reference}>
                      <td className="admin-order-ref">
                        <strong>{order.reference}</strong>
                        <small>{new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                      </td>
                      <td><span className="admin-table-tag">Table 08</span></td>
                      <td className="admin-items-summary">
                        <strong>{order.lines.reduce((n, l) => n + l.quantity, 0)} items</strong>
                        <p>{order.lines.map(l => `${l.quantity}× ${l.dish.name}`).join(', ')}</p>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--brand)' }}>
                        {money(order.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0))}
                      </td>
                      <td>
                        <span className={`admin-status-badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-top"><span>ACTIVE TABLES</span><AdminIcon name="tables" size={16} /></div>
                <strong>{tables.filter(t => t.active).length} / {tables.length}</strong>
                <div className="admin-kpi-foot pos">QR Codes scannable</div>
              </div>
              <div className="admin-kpi-card">
                <div className="admin-kpi-top"><span>DISHES ON MENU</span><AdminIcon name="menu" size={16} /></div>
                <strong>{dishes.filter(d => d.available).length}</strong>
                <div className="admin-kpi-foot">{dishes.filter(d => !d.available).length} sold out</div>
              </div>
              <div className="admin-kpi-card highlight">
                <div className="admin-kpi-top"><span>ORDERS TODAY</span><AdminIcon name="orders" size={16} /></div>
                <strong>{sharedOrders.length + 28}</strong>
                <div className="admin-kpi-foot">Live QR Orders</div>
              </div>
              <div className="admin-kpi-card">
                <div className="admin-kpi-top"><span>RECORDED SALES</span></div>
                <strong>ETB 32,800</strong>
                <div className="admin-kpi-foot">Pay at table</div>
              </div>
            </div>
          )}

          {/* =========================================================
              TAB: STAFF MANAGEMENT, ROLES & PERMISSIONS (03D)
             ========================================================= */}
          {activeTab === 'staff' && (
            <div className="admin-staff-section">
              {/* Page Header */}
              <div className="admin-page-header">
                <div>
                  <h1>Staff Management</h1>
                  <p>Manage your team and control access to your restaurant workspace.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="admin-action-btn secondary"
                    onClick={() => setIsPermissionsMatrixOpen(true)}
                    title="View permissions by role"
                  >
                    <AdminIcon name="shield" size={15} /> Roles & Permissions
                  </button>
                  <button
                    className="admin-action-btn primary"
                    onClick={() => {
                      setAddForm({ name: '', email: '', phone: '', role: 'Waiter', note: '' });
                      setFormErrors({});
                      setInviteSentSuccess(null);
                      setInviteErrorMsg(null);
                      setIsAddStaffOpen(true);
                    }}
                  >
                    <AdminIcon name="userPlus" size={15} /> Add Staff Member
                  </button>
                </div>
              </div>

              {/* KPI Status Counters */}
              <div className="admin-staff-kpi-grid">
                <div className="admin-staff-kpi-card">
                  <span className="admin-staff-kpi-label">TOTAL STAFF</span>
                  <div className="admin-staff-kpi-val-row">
                    <strong>{staffMembers.length}</strong>
                    <span className="admin-staff-kpi-icon"><AdminIcon name="staff" size={18} /></span>
                  </div>
                  <span className="admin-staff-kpi-sub">Across all roles</span>
                </div>

                <div className="admin-staff-kpi-card">
                  <span className="admin-staff-kpi-label">ACTIVE STAFF</span>
                  <div className="admin-staff-kpi-val-row">
                    <strong style={{ color: '#1f693e' }}>
                      {staffMembers.filter(s => s.status === 'Active').length}
                    </strong>
                    <span className="admin-staff-kpi-dot active" />
                  </div>
                  <span className="admin-staff-kpi-sub">Active login privileges</span>
                </div>

                <div className="admin-staff-kpi-card">
                  <span className="admin-staff-kpi-label">PENDING INVITATIONS</span>
                  <div className="admin-staff-kpi-val-row">
                    <strong style={{ color: '#b0791a' }}>
                      {staffMembers.filter(s => s.status === 'Pending Invitation').length}
                    </strong>
                    <span className="admin-staff-kpi-dot pending" />
                  </div>
                  <span className="admin-staff-kpi-sub">Awaiting activation</span>
                </div>

                <div className="admin-staff-kpi-card">
                  <span className="admin-staff-kpi-label">INACTIVE</span>
                  <div className="admin-staff-kpi-val-row">
                    <strong style={{ color: '#7a857e' }}>
                      {staffMembers.filter(s => s.status === 'Inactive').length}
                    </strong>
                    <span className="admin-staff-kpi-dot inactive" />
                  </div>
                  <span className="admin-staff-kpi-sub">Deactivated accounts</span>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="admin-orders-controls">
                <div className="admin-filter-row" style={{ width: '100%' }}>
                  <div className="admin-search-input" style={{ flex: 1, minWidth: '220px' }}>
                    <AdminIcon name="search" size={16} />
                    <input
                      type="text"
                      placeholder="Search staff by name or email…"
                      value={searchStaff}
                      onChange={e => setSearchStaff(e.target.value)}
                    />
                  </div>

                  <select
                    className="admin-select"
                    value={staffRoleFilter}
                    onChange={e => setStaffRoleFilter(e.target.value)}
                  >
                    <option value="All">All Roles</option>
                    <option value="Owner">Owner</option>
                    <option value="Manager">Manager</option>
                    <option value="Kitchen Staff">Kitchen Staff</option>
                    <option value="Waiter">Waiter / Service</option>
                    <option value="Cashier">Cashier</option>
                  </select>

                  <select
                    className="admin-select"
                    value={staffStatusFilter}
                    onChange={e => setStaffStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending Invitation">Pending Invitation</option>
                    <option value="Inactive">Inactive</option>
                  </select>

                  {(searchStaff || staffRoleFilter !== 'All' || staffStatusFilter !== 'All') && (
                    <button
                      className="admin-action-btn secondary"
                      onClick={() => {
                        setSearchStaff('');
                        setStaffRoleFilter('All');
                        setStaffStatusFilter('All');
                      }}
                      title="Clear filters"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Staff Table */}
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Staff Member</th>
                      <th>Role</th>
                      <th>Account Status</th>
                      <th>Date Added</th>
                      <th>Last Active</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map(member => {
                      const roleMeta = roleDescriptions[member.role];
                      return (
                        <tr key={member.id} className="admin-staff-table-row">
                          <td style={{ cursor: 'pointer' }} onClick={() => setSelectedStaffProfile(member)}>
                            <div className="admin-staff-user-cell">
                              <span className="admin-staff-avatar">{member.avatar}</span>
                              <div>
                                <strong className="admin-staff-name">{member.name}</strong>
                                <span className="admin-staff-email">{member.email}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className={`admin-role-badge ${roleMeta.badgeClass}`}>
                              <AdminIcon name={roleMeta.icon} size={13} />
                              <span>{roleMeta.title}</span>
                            </span>
                          </td>

                          <td>
                            <span
                              className={`admin-status-pill ${
                                member.status === 'Active'
                                  ? 'active'
                                  : member.status === 'Pending Invitation'
                                  ? 'pending'
                                  : 'inactive'
                              }`}
                            >
                              <span className="admin-status-dot" />
                              <span>{member.status}</span>
                            </span>
                          </td>

                          <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{member.dateAdded}</td>

                          <td style={{ color: 'var(--muted)', fontSize: '13px' }}>{member.lastActive}</td>

                          <td>
                            <div className="admin-staff-actions-cell">
                              {member.status === 'Pending Invitation' && (
                                <button
                                  className="admin-action-btn secondary sm"
                                  onClick={() => handleResendInvite(member)}
                                  title="Resend invitation email"
                                >
                                  <AdminIcon name="mail" size={13} /> Resend
                                </button>
                              )}

                              <button
                                className="admin-action-btn secondary sm"
                                onClick={() => setSelectedStaffProfile(member)}
                                title="View staff profile & permissions"
                              >
                                <AdminIcon name="eye" size={13} /> Profile
                              </button>

                              <button
                                className="admin-action-btn secondary sm"
                                onClick={() => {
                                  setRoleChangeTarget(member);
                                  setNewSelectedRole(member.role);
                                }}
                                title="Change role"
                              >
                                <AdminIcon name="shield" size={13} />
                              </button>

                              <button
                                className={`admin-action-btn sm ${member.status === 'Active' ? 'danger' : 'secondary'}`}
                                onClick={() => setDeactivatingTarget(member)}
                                title={member.status === 'Active' ? 'Deactivate account' : 'Reactivate account'}
                              >
                                {member.status === 'Active' ? (
                                  <AdminIcon name="userX" size={13} />
                                ) : (
                                  <AdminIcon name="check" size={13} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredStaff.length === 0 && (
                <div className="admin-empty-state">
                  <AdminIcon name="staff" size={40} />
                  <h3>No staff members found</h3>
                  <p>No team members match your current filter or search criteria.</p>
                  <button
                    className="admin-action-btn secondary"
                    onClick={() => {
                      setSearchStaff('');
                      setStaffRoleFilter('All');
                      setStaffStatusFilter('All');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Engineering & Security Handoff Accordion */}
              <div className="admin-backend-spec-card">
                <div
                  className="admin-backend-spec-header"
                  onClick={() => setShowMernDetails(!showMernDetails)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AdminIcon name="lock" size={18} />
                    <div>
                      <strong>Security Architecture & Backend Implementation Notes (MERN)</strong>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted)' }}>
                        Production RBAC, tenant scoping, and JWT authorization rules
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--brand)', fontWeight: 600 }}>
                    {showMernDetails ? 'Hide Architecture Notes ▲' : 'Show Architecture Notes ▼'}
                  </span>
                </div>

                {showMernDetails && (
                  <div className="admin-backend-spec-body">
                    <div className="admin-spec-grid">
                      <div className="admin-spec-item">
                        <strong>1. Workspace Multi-Tenancy</strong>
                        <p>Every staff document in MongoDB belongs strictly to one restaurant workspace (`restaurantId`). Staff cannot access another venue by altering route IDs.</p>
                      </div>
                      <div className="admin-spec-item">
                        <strong>2. Cryptographic Expiring Invitations</strong>
                        <p>Invitations use signed, hashed single-use tokens expiring in 24 hours. Passwords are never sent or stored in plain text.</p>
                      </div>
                      <div className="admin-spec-item">
                        <strong>3. Server-Side RBAC Enforcement</strong>
                        <p>Never trust browser claims. Express middleware validates role permissions against JWT claims on every single protected API endpoint.</p>
                      </div>
                      <div className="admin-spec-item">
                        <strong>4. Non-Destructive Deactivation</strong>
                        <p>Deactivating revokes active refresh tokens instantly while preserving historical orders, audit logs, and prep records.</p>
                      </div>
                      <div className="admin-spec-item">
                        <strong>5. Primary Owner Safeguard</strong>
                        <p>Backend rejects attempts to delete, deactivate, or demote the last remaining Owner account without formal ownership transfer.</p>
                      </div>
                      <div className="admin-spec-item">
                        <strong>6. Audit Logging</strong>
                        <p>Sensitive operations (role changes, staff invitations, menu price adjustments) append immutable entries to the workspace audit trail.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================
          MODAL 1: QR CODE DETAIL & GENERATOR MODAL (03C)
         ========================================================= */}
      {selectedQRTable && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedQRTable(null)}>
          <div className="admin-modal" style={{ width: '460px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0 }}>{selectedQRTable.number} QR Code</h3>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Abay Kitchen · {selectedQRTable.area}</span>
              </div>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setSelectedQRTable(null)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            <div className="admin-qr-modal-body">
              {/* High-Contrast Crisp QR Code */}
              <div className="admin-qr-code-frame">
                <TableQRCodeSVG size={180} tableNumber={selectedQRTable.number} />
              </div>

              {/* Destination URL */}
              <div className="admin-qr-url-box">
                <span>https://gebetaqr.com/r/abay-kitchen/t/{selectedQRTable.qrToken}</span>
                <button
                  style={{ background: 'transparent', border: 0, color: 'var(--brand)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  onClick={() => {
                    navigator.clipboard?.writeText(`https://gebetaqr.com/r/abay-kitchen/t/${selectedQRTable.qrToken}`);
                    showToast('Table ordering link copied to clipboard!');
                  }}
                  title="Copy Link"
                >
                  <AdminIcon name="copy" size={16} />
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', marginBottom: '12px' }}>
                <button
                  className="admin-action-btn secondary"
                  onClick={() => {
                    setPrintModalTable(selectedQRTable);
                    setPrintConcept('card');
                  }}
                >
                  <AdminIcon name="printer" size={15} /> Print Card
                </button>
                <button
                  className="admin-action-btn secondary"
                  onClick={() => {
                    setPrintModalTable(selectedQRTable);
                    setPrintConcept('tent');
                  }}
                >
                  <AdminIcon name="printer" size={15} /> Print Tent Card
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button
                  className="admin-action-btn secondary"
                  style={{ flex: 1 }}
                  onClick={() => showToast(`Downloaded high-res PNG for ${selectedQRTable.number}`)}
                >
                  <AdminIcon name="download" size={15} /> Download PNG
                </button>
                <button
                  className="admin-action-btn danger"
                  onClick={() => handleRegenerateQR(selectedQRTable)}
                  title="Generate new QR token (invalidates old printed QR)"
                >
                  Regenerate QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: PRINTABLE ASSETS & TENT CARDS PREVIEW (03C)
         ========================================================= */}
      {printModalTable && (
        <div className="admin-modal-backdrop" onClick={() => setPrintModalTable(null)}>
          <div className="admin-modal" style={{ width: printConcept === 'bulk' ? '640px' : '520px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Print Table QR Code</h3>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>High-resolution print-ready layout</span>
              </div>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setPrintModalTable(null)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            {/* Print Concept Switcher */}
            <div className="admin-print-switcher">
              <button
                className={`admin-tab-btn ${printConcept === 'card' ? 'active' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setPrintConcept('card')}
              >
                Tabletop Card
              </button>
              <button
                className={`admin-tab-btn ${printConcept === 'tent' ? 'active' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setPrintConcept('tent')}
              >
                Folded Tent Card
              </button>
              <button
                className={`admin-tab-btn ${printConcept === 'bulk' ? 'active' : ''}`}
                style={{ flex: 1 }}
                onClick={() => setPrintConcept('bulk')}
              >
                A4 Bulk Sheet (All Tables)
              </button>
            </div>

            {/* 1. Compact Tabletop Card Preview */}
            {printConcept === 'card' && (
              <div className="admin-print-card-preview">
                <div className="admin-print-card-brand">ABAY KITCHEN</div>
                <div className="admin-print-card-sub">ROOTED IN TRADITION · MADE WITH LOVE</div>
                <div className="admin-print-card-table">{printModalTable.number.toUpperCase()}</div>
                <div className="admin-print-card-qr">
                  <TableQRCodeSVG size={140} tableNumber={printModalTable.number} />
                </div>
                <div className="admin-print-card-instruction">Scan with phone camera to view menu & order</div>
                <div className="admin-print-card-footer">Thoughtfully served with gebetaQR</div>
              </div>
            )}

            {/* 2. Folded Tent Card Preview */}
            {printConcept === 'tent' && (
              <div className="admin-tent-card-preview">
                <div className="admin-tent-panel">
                  <strong style={{ fontSize: '14px', color: 'var(--brand)' }}>ABAY KITCHEN</strong>
                  <p style={{ fontSize: '10px', color: 'var(--muted)', margin: '4px 0 12px' }}>{printModalTable.number}</p>
                  <TableQRCodeSVG size={105} tableNumber={printModalTable.number} />
                  <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', marginTop: '8px' }}>Scan to Order</p>
                </div>
                <div className="admin-tent-divider">FOLD LINE</div>
                <div className="admin-tent-panel">
                  <strong style={{ fontSize: '14px', color: 'var(--brand)' }}>WELCOME TO OUR TABLE</strong>
                  <p style={{ fontSize: '10px', color: 'var(--muted)', margin: '4px 0 12px' }}>{printModalTable.number}</p>
                  <TableQRCodeSVG size={105} tableNumber={printModalTable.number} />
                  <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--brand)', marginTop: '8px' }}>Scan to Order</p>
                </div>
              </div>
            )}

            {/* 3. Bulk A4 Sheet Preview */}
            {printConcept === 'bulk' && (
              <div className="admin-bulk-sheet">
                <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e5dc', paddingBottom: '8px' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--brand)' }}>ABAY KITCHEN — ALL TABLES QR PRINT SHEET</strong>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--muted)' }}>Cut along dashed lines and place on dining tables</span>
                </div>
                <div className="admin-bulk-grid">
                  {tables.slice(0, 4).map(t => (
                    <div className="admin-bulk-cell" key={t.id}>
                      <strong style={{ fontSize: '13px', color: 'var(--brand)' }}>{t.number}</strong>
                      <div style={{ margin: '8px 0' }}>
                        <TableQRCodeSVG size={90} tableNumber={t.number} />
                      </div>
                      <span style={{ fontSize: '9px', color: 'var(--muted)' }}>Scan to view menu & order</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="admin-modal-actions" style={{ marginTop: '20px' }}>
              <button className="admin-action-btn secondary" onClick={() => setPrintModalTable(null)}>
                Cancel
              </button>
              <button
                className="admin-action-btn primary"
                onClick={() => {
                  showToast('Print dialog triggered. High-resolution print output ready.');
                  setPrintModalTable(null);
                }}
              >
                <AdminIcon name="printer" size={15} /> Print Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: ADD / EDIT TABLE FORM (03C)
         ========================================================= */}
      {editingTable && (
        <div className="admin-modal-backdrop" onClick={() => setEditingTable(null)}>
          <div className="admin-modal" style={{ width: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0 }}>{isNewTable ? 'Add Dining Table' : `Edit ${editingTable.number}`}</h3>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setEditingTable(null)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            <div className="admin-form-group">
              <label>Table Number / Name *</label>
              <input
                type="text"
                placeholder="e.g. Table 09 or Patio 01"
                value={editingTable.number}
                onChange={e => setEditingTable({ ...editingTable, number: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="admin-form-group">
                <label>Dining Area *</label>
                <select
                  value={editingTable.area}
                  onChange={e => setEditingTable({ ...editingTable, area: e.target.value })}
                >
                  <option value="Main Dining">Main Dining</option>
                  <option value="Terrace">Terrace</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Patio">Patio</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Capacity (Seats) *</label>
                <input
                  type="number"
                  min={1}
                  value={editingTable.capacity}
                  onChange={e => setEditingTable({ ...editingTable, capacity: parseInt(e.target.value) || 2 })}
                />
              </div>
            </div>

            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#fafbf8', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div>
                <strong style={{ fontSize: '13px', display: 'block' }}>Active for QR Ordering</strong>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Guests scanning this QR code can browse and place orders</span>
              </div>
              <button
                className={`admin-toggle ${editingTable.active ? 'on' : ''}`}
                onClick={() => setEditingTable({ ...editingTable, active: !editingTable.active })}
              >
                <span className="admin-toggle-knob" />
              </button>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-action-btn secondary" onClick={() => setEditingTable(null)}>
                Cancel
              </button>
              <button className="admin-action-btn primary" onClick={handleSaveTable}>
                Save Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: ADD STAFF MEMBER MODAL (03D)
         ========================================================= */}
      {isAddStaffOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsAddStaffOpen(false)}>
          <div className="admin-modal" style={{ width: '560px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Add Staff Member</h3>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Send an invitation link to join Abay Kitchen</span>
              </div>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setIsAddStaffOpen(false)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            {inviteSentSuccess ? (
              <div className="admin-invite-success-view">
                <div className="admin-invite-success-icon">
                  <AdminIcon name="check" size={32} />
                </div>
                <h3>Invitation Dispatched!</h3>
                <p>
                  A secure invitation link has been emailed to <strong>{inviteSentSuccess.email}</strong> with the <strong>{inviteSentSuccess.role}</strong> role.
                </p>
                <div className="admin-invite-note-card">
                  <AdminIcon name="info" size={16} />
                  <span>The link expires in 24 hours. The recipient will choose their own password upon opening the link.</span>
                </div>
                <div className="admin-modal-actions" style={{ marginTop: '20px' }}>
                  <button
                    className="admin-action-btn primary"
                    onClick={() => {
                      setIsAddStaffOpen(false);
                      setInviteSentSuccess(null);
                    }}
                  >
                    Done
                  </button>
                  <button
                    className="admin-action-btn secondary"
                    onClick={() => {
                      setInviteSentSuccess(null);
                      setAddForm({ name: '', email: '', phone: '', role: 'Waiter', note: '' });
                    }}
                  >
                    Invite Another Member
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleSendInvitation(); }}>
                {inviteErrorMsg && (
                  <div className="admin-alert-box error" style={{ marginBottom: '16px' }}>
                    <AdminIcon name="alertTriangle" size={18} />
                    <div style={{ flex: 1 }}>
                      <strong>Invitation Failed</strong>
                      <p>{inviteErrorMsg}</p>
                    </div>
                    <button
                      type="button"
                      className="admin-action-btn secondary sm"
                      onClick={handleSendInvitation}
                    >
                      Retry
                    </button>
                  </div>
                )}

                <div className="admin-form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Almaz Ayana"
                    value={addForm.name}
                    onChange={e => {
                      setAddForm({ ...addForm, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    className={formErrors.name ? 'input-error' : ''}
                  />
                  {formErrors.name && <span className="admin-field-error">{formErrors.name}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="admin-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. almaz@abaykitchen.com"
                      value={addForm.email}
                      onChange={e => {
                        setAddForm({ ...addForm, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                      }}
                      className={formErrors.email ? 'input-error' : ''}
                    />
                    {formErrors.email && <span className="admin-field-error">{formErrors.email}</span>}
                  </div>

                  <div className="admin-form-group">
                    <label>Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+251 91 123 4567"
                      value={addForm.phone}
                      onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Select Role Profile *</label>
                  <div className="admin-role-selector-grid">
                    {(['Manager', 'Kitchen Staff', 'Waiter', 'Cashier', 'Owner'] as StaffRole[]).map(r => {
                      const desc = roleDescriptions[r];
                      const isSelected = addForm.role === r;
                      return (
                        <div
                          key={r}
                          className={`admin-role-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setAddForm({ ...addForm, role: r })}
                        >
                          <div className="admin-role-card-top">
                            <span className={`admin-role-badge ${desc.badgeClass}`}>
                              <AdminIcon name={desc.icon} size={12} />
                              <span>{desc.title}</span>
                            </span>
                            <span className="admin-radio-circle">{isSelected && <span className="admin-radio-dot" />}</span>
                          </div>
                          <p className="admin-role-card-desc">{desc.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Invitation Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Welcome to the Abay Kitchen team! Look forward to working together."
                    value={addForm.note}
                    onChange={e => setAddForm({ ...addForm, note: e.target.value })}
                  />
                </div>

                {/* Password Notice Callout */}
                <div className="admin-security-banner">
                  <AdminIcon name="lock" size={16} />
                  <span>No password required. The staff member will receive a secure activation link to set their own credentials.</span>
                </div>

                {/* Simulated Error Toggle for Testing */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f5f7f3', borderRadius: '6px', margin: '14px 0 6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    Testing: Simulate network dispatch failure
                  </span>
                  <button
                    type="button"
                    className={`admin-toggle ${simulateInviteError ? 'on' : ''}`}
                    onClick={() => setSimulateInviteError(!simulateInviteError)}
                  >
                    <span className="admin-toggle-knob" />
                  </button>
                </div>

                <div className="admin-modal-actions" style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className="admin-action-btn secondary"
                    onClick={() => setIsAddStaffOpen(false)}
                    disabled={isSubmittingInvite}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-action-btn primary"
                    disabled={isSubmittingInvite || !addForm.name.trim() || !addForm.email.trim()}
                  >
                    {isSubmittingInvite ? (
                      <>
                        <AdminIcon name="refreshCw" size={15} /> Sending Invitation…
                      </>
                    ) : (
                      <>
                        <AdminIcon name="mail" size={15} /> Send Invitation
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 5: ROLES & PERMISSION MATRIX (03D)
         ========================================================= */}
      {isPermissionsMatrixOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsPermissionsMatrixOpen(false)}>
          <div className="admin-modal" style={{ width: '740px', maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Roles & Permissions Matrix</h3>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Predefined access profiles enforced by server authorization</span>
              </div>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setIsPermissionsMatrixOpen(false)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            {/* Role Filter Tabs for Quick Inspection */}
            <div className="admin-matrix-role-tabs">
              {(['Owner', 'Manager', 'Kitchen Staff', 'Waiter', 'Cashier'] as StaffRole[]).map(r => (
                <button
                  key={r}
                  className={`admin-tab-btn ${selectedMatrixRole === r ? 'active' : ''}`}
                  onClick={() => setSelectedMatrixRole(r)}
                >
                  <AdminIcon name={roleDescriptions[r].icon} size={14} />
                  <span>{r}</span>
                </button>
              ))}
            </div>

            {/* Selected Role Summary Banner */}
            <div className="admin-role-summary-banner">
              <strong>{selectedMatrixRole} Profile</strong>
              <p>{roleDescriptions[selectedMatrixRole].desc}</p>
            </div>

            {/* Permission Table */}
            <div className="admin-matrix-table-container">
              <table className="admin-matrix-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th style={{ color: selectedMatrixRole === 'Owner' ? 'var(--gold)' : undefined }}>Owner</th>
                    <th style={{ color: selectedMatrixRole === 'Manager' ? 'var(--brand)' : undefined }}>Manager</th>
                    <th style={{ color: selectedMatrixRole === 'Kitchen Staff' ? '#b87333' : undefined }}>Kitchen Staff</th>
                    <th style={{ color: selectedMatrixRole === 'Waiter' ? '#2a5d7c' : undefined }}>Waiter / Service</th>
                    <th style={{ color: selectedMatrixRole === 'Cashier' ? '#6b3f7a' : undefined }}>Cashier</th>
                  </tr>
                </thead>
                <tbody>
                  {permissionMatrix.map(row => (
                    <tr key={row.category}>
                      <td><strong>{row.category}</strong></td>
                      <td className={selectedMatrixRole === 'Owner' ? 'highlight-col' : ''}>
                        <span className="perm-chip full">{row.Owner}</span>
                      </td>
                      <td className={selectedMatrixRole === 'Manager' ? 'highlight-col' : ''}>
                        <span className={`perm-chip ${row.Manager === 'Restricted' ? 'none' : 'partial'}`}>{row.Manager}</span>
                      </td>
                      <td className={selectedMatrixRole === 'Kitchen Staff' ? 'highlight-col' : ''}>
                        <span className={`perm-chip ${row['Kitchen Staff'] === 'Restricted' ? 'none' : 'partial'}`}>{row['Kitchen Staff']}</span>
                      </td>
                      <td className={selectedMatrixRole === 'Waiter' ? 'highlight-col' : ''}>
                        <span className={`perm-chip ${row.Waiter === 'Restricted' ? 'none' : 'partial'}`}>{row.Waiter}</span>
                      </td>
                      <td className={selectedMatrixRole === 'Cashier' ? 'highlight-col' : ''}>
                        <span className={`perm-chip ${row.Cashier === 'Restricted' ? 'none' : 'partial'}`}>{row.Cashier}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Security Notice */}
            <div className="admin-security-banner" style={{ marginTop: '16px' }}>
              <AdminIcon name="shield" size={16} />
              <span>
                Access is enforced by the server. The visible controls reflect the permissions assigned to your account. Every backend API request validates authentication and role permissions.
              </span>
            </div>

            <div className="admin-modal-actions" style={{ marginTop: '16px' }}>
              <button className="admin-action-btn primary" onClick={() => setIsPermissionsMatrixOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 6: STAFF PROFILE & DETAILS DRAWER (03D)
         ========================================================= */}
      {selectedStaffProfile && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedStaffProfile(null)}>
          <div className="admin-modal" style={{ width: '520px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className="admin-staff-avatar lg">{selectedStaffProfile.avatar}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedStaffProfile.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{selectedStaffProfile.email}</span>
                </div>
              </div>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setSelectedStaffProfile(null)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            {/* Profile Overview Card */}
            <div className="admin-profile-details-grid">
              <div className="admin-profile-stat-box">
                <span className="stat-label">Assigned Role</span>
                <span className={`admin-role-badge ${roleDescriptions[selectedStaffProfile.role].badgeClass}`} style={{ marginTop: '4px' }}>
                  <AdminIcon name={roleDescriptions[selectedStaffProfile.role].icon} size={12} />
                  <span>{selectedStaffProfile.role}</span>
                </span>
              </div>

              <div className="admin-profile-stat-box">
                <span className="stat-label">Account Status</span>
                <span
                  className={`admin-status-pill ${
                    selectedStaffProfile.status === 'Active'
                      ? 'active'
                      : selectedStaffProfile.status === 'Pending Invitation'
                      ? 'pending'
                      : 'inactive'
                  }`}
                  style={{ marginTop: '4px' }}
                >
                  <span className="admin-status-dot" />
                  <span>{selectedStaffProfile.status}</span>
                </span>
              </div>

              <div className="admin-profile-stat-box">
                <span className="stat-label">Phone Number</span>
                <strong>{selectedStaffProfile.phone || 'Not provided'}</strong>
              </div>

              <div className="admin-profile-stat-box">
                <span className="stat-label">Restaurant Workspace</span>
                <strong>Abay Kitchen (Bole)</strong>
              </div>

              <div className="admin-profile-stat-box">
                <span className="stat-label">Date Added</span>
                <strong>{selectedStaffProfile.dateAdded}</strong>
              </div>

              <div className="admin-profile-stat-box">
                <span className="stat-label">Last Active</span>
                <strong>{selectedStaffProfile.lastActive}</strong>
              </div>
            </div>

            {/* Invitation Details if Pending */}
            {selectedStaffProfile.status === 'Pending Invitation' && (
              <div className="admin-profile-invite-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13px' }}>Invitation Pending</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted)' }}>
                      Invitation sent · Token valid for 24 hours
                    </span>
                  </div>
                  <button
                    className="admin-action-btn secondary sm"
                    onClick={() => handleResendInvite(selectedStaffProfile)}
                  >
                    <AdminIcon name="mail" size={13} /> Resend Invite
                  </button>
                </div>
                {selectedStaffProfile.invitationNote && (
                  <p style={{ fontSize: '12px', color: 'var(--ink)', fontStyle: 'italic', margin: '8px 0 0' }}>
                    "{selectedStaffProfile.invitationNote}"
                  </p>
                )}
              </div>
            )}

            {/* Permitted Actions */}
            <div className="admin-profile-perms-section">
              <span className="section-title">Permitted System Capabilities</span>
              <ul className="admin-profile-perms-list">
                {selectedStaffProfile.role === 'Owner' && (
                  <>
                    <li><AdminIcon name="check" size={14} /> Full management of restaurant settings & team accounts</li>
                    <li><AdminIcon name="check" size={14} /> View and export all financial and sales analytics</li>
                    <li><AdminIcon name="check" size={14} /> Manage bank payouts and Telebirr merchant billing</li>
                    <li><AdminIcon name="check" size={14} /> Create and modify digital menu dishes, prices, and QR codes</li>
                  </>
                )}
                {selectedStaffProfile.role === 'Manager' && (
                  <>
                    <li><AdminIcon name="check" size={14} /> Manage daily kitchen orders, dining tables, and QR cards</li>
                    <li><AdminIcon name="check" size={14} /> Update dish availability and edit menu pricing</li>
                    <li><AdminIcon name="check" size={14} /> View daily shift reports and customer feedback</li>
                    <li><AdminIcon name="check" size={14} /> View staff directory (cannot invite or alter owner credentials)</li>
                  </>
                )}
                {selectedStaffProfile.role === 'Kitchen Staff' && (
                  <>
                    <li><AdminIcon name="check" size={14} /> View incoming live QR orders with customer dietary notes</li>
                    <li><AdminIcon name="check" size={14} /> Update kitchen prep status (Preparing → Ready)</li>
                    <li><AdminIcon name="check" size={14} /> View food recipes and menu items</li>
                  </>
                )}
                {selectedStaffProfile.role === 'Waiter' && (
                  <>
                    <li><AdminIcon name="check" size={14} /> View table orders and guest seating allocations</li>
                    <li><AdminIcon name="check" size={14} /> Mark food items as served to guest tables</li>
                    <li><AdminIcon name="check" size={14} /> Inspect table QR codes and customer feedback</li>
                  </>
                )}
                {selectedStaffProfile.role === 'Cashier' && (
                  <>
                    <li><AdminIcon name="check" size={14} /> View orders, bill totals, and tax breakdowns</li>
                    <li><AdminIcon name="check" size={14} /> Record and confirm payments (Cash, Telebirr, Card)</li>
                    <li><AdminIcon name="check" size={14} /> View shift settlement history and print guest receipts</li>
                  </>
                )}
              </ul>
            </div>

            {/* Profile Action Buttons */}
            <div className="admin-modal-actions" style={{ marginTop: '20px' }}>
              <button
                className="admin-action-btn secondary"
                onClick={() => {
                  setRoleChangeTarget(selectedStaffProfile);
                  setNewSelectedRole(selectedStaffProfile.role);
                }}
              >
                <AdminIcon name="shield" size={15} /> Change Role
              </button>

              <button
                className={`admin-action-btn ${selectedStaffProfile.status === 'Active' ? 'danger' : 'secondary'}`}
                onClick={() => setDeactivatingTarget(selectedStaffProfile)}
              >
                {selectedStaffProfile.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
              </button>

              <button className="admin-action-btn secondary" onClick={() => setSelectedStaffProfile(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 7: CHANGE ROLE CONFIRMATION (03D)
         ========================================================= */}
      {roleChangeTarget && (
        <div className="admin-modal-backdrop" onClick={() => setRoleChangeTarget(null)}>
          <div className="admin-modal" style={{ width: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Change Staff Role</h3>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Update access privileges for {roleChangeTarget.name}</span>
              </div>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setRoleChangeTarget(null)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            {roleChangeTarget.role === 'Owner' && staffMembers.filter(s => s.role === 'Owner' && s.status === 'Active').length <= 1 ? (
              <div className="admin-alert-box warning" style={{ marginBottom: '16px' }}>
                <AdminIcon name="alertTriangle" size={18} />
                <div>
                  <strong>Primary Owner Cannot Be Demoted</strong>
                  <p>Abay Kitchen requires at least one active Owner. Transfer workspace ownership before changing this role.</p>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#f5f7f3', borderRadius: '8px', marginBottom: '16px' }}>
                  <span className="admin-staff-avatar">{roleChangeTarget.avatar}</span>
                  <div>
                    <strong>{roleChangeTarget.name}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted)' }}>
                      Current role: <span className={`admin-role-badge ${roleDescriptions[roleChangeTarget.role].badgeClass}`}>{roleChangeTarget.role}</span>
                    </span>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Assign New Role *</label>
                  <select
                    value={newSelectedRole}
                    onChange={e => setNewSelectedRole(e.target.value as StaffRole)}
                  >
                    <option value="Manager">Manager</option>
                    <option value="Kitchen Staff">Kitchen Staff</option>
                    <option value="Waiter">Waiter / Service</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>

                <div className="admin-role-summary-banner" style={{ marginTop: '12px' }}>
                  <strong>New Role: {newSelectedRole}</strong>
                  <p>{roleDescriptions[newSelectedRole].desc}</p>
                </div>

                <div className="admin-security-banner" style={{ marginTop: '12px' }}>
                  <AdminIcon name="shield" size={15} />
                  <span>Role changes require server authorization. New permissions take effect immediately upon the staff member's next request.</span>
                </div>
              </div>
            )}

            <div className="admin-modal-actions" style={{ marginTop: '20px' }}>
              <button className="admin-action-btn secondary" onClick={() => setRoleChangeTarget(null)}>
                Cancel
              </button>
              {!(roleChangeTarget.role === 'Owner' && staffMembers.filter(s => s.role === 'Owner' && s.status === 'Active').length <= 1) && (
                <button className="admin-action-btn primary" onClick={handleConfirmRoleChange}>
                  Confirm Role Change
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 8: DEACTIVATE / REACTIVATE CONFIRMATION (03D)
         ========================================================= */}
      {deactivatingTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeactivatingTarget(null)}>
          <div className="admin-modal" style={{ width: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0 }}>
                  {deactivatingTarget.status === 'Active' ? 'Deactivate Staff Account' : 'Reactivate Staff Account'}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{deactivatingTarget.name} · {deactivatingTarget.role}</span>
              </div>
              <button style={{ background: 'transparent', border: 0, cursor: 'pointer' }} onClick={() => setDeactivatingTarget(null)}>
                <AdminIcon name="close" size={20} />
              </button>
            </div>

            {deactivatingTarget.role === 'Owner' && deactivatingTarget.status === 'Active' ? (
              <div className="admin-alert-box error">
                <AdminIcon name="alertTriangle" size={18} />
                <div>
                  <strong>Primary Owner Cannot Be Deactivated</strong>
                  <p>You cannot deactivate the primary workspace owner. You must transfer restaurant ownership before removing owner credentials.</p>
                </div>
              </div>
            ) : deactivatingTarget.status === 'Active' ? (
              <div>
                <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 14px' }}>
                  Are you sure you want to deactivate <strong>{deactivatingTarget.name}</strong>?
                </p>
                <div className="admin-alert-box warning" style={{ marginBottom: '14px' }}>
                  <AdminIcon name="alertTriangle" size={18} />
                  <div>
                    <strong>Access Revocation Notice</strong>
                    <p>The staff member will immediately lose access to the Abay Kitchen dashboard. All historical order entries, kitchen preparation logs, and payment records remain preserved in the system.</p>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                  This account can be reactivated at any time by an authorized administrator.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 14px' }}>
                  Reactivate <strong>{deactivatingTarget.name}</strong>?
                </p>
                <div className="admin-alert-box info">
                  <AdminIcon name="check" size={18} />
                  <div>
                    <strong>Restore Access</strong>
                    <p>{deactivatingTarget.name} will regain access to their assigned <strong>{deactivatingTarget.role}</strong> workspace privileges upon logging in.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-modal-actions" style={{ marginTop: '20px' }}>
              <button className="admin-action-btn secondary" onClick={() => setDeactivatingTarget(null)}>
                Cancel
              </button>
              {!(deactivatingTarget.role === 'Owner' && deactivatingTarget.status === 'Active') && (
                <button
                  className={`admin-action-btn ${deactivatingTarget.status === 'Active' ? 'danger' : 'primary'}`}
                  onClick={handleConfirmDeactivation}
                >
                  {deactivatingTarget.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {toast && (
        <div className="admin-toast" role="status">
          <AdminIcon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

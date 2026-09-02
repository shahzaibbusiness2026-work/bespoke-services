import bcrypt from 'bcryptjs';
import { PRODUCTS, LOOKBOOKS, PROMO_CODES } from '../../src/data/products';
import { DatabaseSchema, UserRecord, OrderDetails } from '../types';

const defaultPasswordHash = bcrypt.hashSync('password123', 10);

export const SEED_USERS: UserRecord[] = [
  {
    id: 'usr-ll-4921',
    firstName: 'Victoria',
    lastName: 'Kensington',
    email: 'victoria.kensington@luxuryclient.com',
    phone: '+1 (555) 234-8921',
    role: 'client',
    vipTier: 'Diamond Concierge',
    pointsBalance: 12450,
    joinedDate: 'October 2023',
    passwordHash: defaultPasswordHash,
    addresses: [
      {
        id: 'addr-1',
        label: 'Primary Residence (Penthouse)',
        firstName: 'Victoria',
        lastName: 'Kensington',
        addressLine1: '740 Park Avenue, Apt 14B',
        addressLine2: 'Private Elevator Landing',
        city: 'New York',
        state: 'NY',
        zipCode: '10021',
        country: 'United States',
        phone: '+1 (555) 234-8921',
        isDefault: true,
      },
      {
        id: 'addr-2',
        label: 'Summer Villa',
        firstName: 'Victoria',
        lastName: 'Kensington',
        addressLine1: '42 Meadow Lane',
        city: 'Southampton',
        state: 'NY',
        zipCode: '11968',
        country: 'United States',
        phone: '+1 (555) 234-8921',
        isDefault: false,
      },
    ],
  },
  {
    id: 'usr-admin-001',
    firstName: 'Atelier',
    lastName: 'Director',
    email: 'boskilimited@boskilimited.info',
    phone: '+44 7738 761016',
    role: 'admin',
    vipTier: 'Diamond Concierge',
    pointsBalance: 999999,
    joinedDate: 'January 2022',
    passwordHash: bcrypt.hashSync('Barking12345@', 10),
    addresses: [],
  },
];

export const SEED_ORDERS: OrderDetails[] = [
  {
    orderId: 'LL-2025-8841',
    date: 'February 18, 2025',
    customer: {
      firstName: 'Victoria',
      lastName: 'Kensington',
      email: 'victoria.kensington@luxuryclient.com',
      phone: '+1 (555) 234-8921',
      address: '740 Park Avenue, Apt 14B',
      city: 'New York',
      state: 'NY',
      zipCode: '10021',
      country: 'United States',
    },
    shippingMethod: {
      id: 'concierge',
      name: 'White Glove Concierge Delivery',
      price: 75,
      estimatedDays: 'Delivered by Hand',
    },
    paymentMethod: 'Visa Platinum •••• 4892',
    items: [
      {
        id: 'prod-1-warm-ivory-king',
        product: PRODUCTS[0],
        selectedColor: PRODUCTS[0].colors[0],
        selectedSize: 'King',
        quantity: 2,
      },
      {
        id: 'prod-2-flax-natural-king',
        product: PRODUCTS[1],
        selectedColor: PRODUCTS[1].colors[0],
        selectedSize: 'King / Cal King',
        quantity: 1,
      },
    ],
    subtotal: 890,
    discount: 178,
    shipping: 75,
    tax: 62.3,
    total: 849.3,
    trackingNumber: 'ATELIER-WG-90218-EXP',
    status: 'Delivered',
  },
];

export const INITIAL_DATABASE: DatabaseSchema = {
  products: PRODUCTS,
  users: SEED_USERS,
  orders: SEED_ORDERS,
  bespokeInquiries: [
    {
      id: 'inq-b-1',
      fullName: 'Julian Vance',
      email: 'julian.vance@architecturaldigest.com',
      projectType: 'Penthouse Drapery & Custom Drops',
      details: 'Custom 14ft ceiling drop Belgian weighted linens in Natural Oatmeal.',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
  tradeInquiries: [
    {
      id: 'inq-t-1',
      companyName: 'The Beaumont Hotel & Suites',
      contactPerson: 'Claire St. John',
      businessEmail: 'claire.stjohn@thebeaumonthotel.co.uk',
      phone: '+44 20 7123 4567',
      professionalId: 'UK-VAT-99214482',
      orderVolume: '100-250 Suites',
      projectDetails: 'Complete guest suite textile overhaul with 600TC Egyptian sateen.',
      submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ],
  contactInquiries: [
    {
      id: 'inq-c-1',
      name: 'Oliver Sterling',
      email: 'oliver.sterling@mayfairpartners.co.uk',
      phone: '+44 20 7821 9900',
      subject: 'Private Atelier Consultation Request',
      message: 'Inquiring about private viewings for custom master suite linens for our Belgravia townhouse.',
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ],
  categories: ['bedding', 'sheets', 'duvets', 'curtains', 'throws', 'blankets', 'pillows'],
  promoCodes: PROMO_CODES,
  lookbooks: LOOKBOOKS,
};

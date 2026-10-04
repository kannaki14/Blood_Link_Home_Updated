export interface Donor {
  id: number | string;
  name: string;
  email?: string;
  bloodGroup: string;
  age: number;
  phone: string;
  location: string;
  lastDonation: string;
  availability: 'Available' | 'Unavailable';
  avatar: string;
}

export const donors: Donor[] = [
  {
    id: 1,
    name: 'Rahul Kumar',
    bloodGroup: 'O+',
    age: 28,
    phone: '+91 9876543210',
    location: 'Thirunelveli',
    lastDonation: '15 July 2025',
    availability: 'Available',
    avatar: 'RK',
  },
  {
    id: 2,
    name: 'Arun Selvam',
    bloodGroup: 'A+',
    age: 24,
    phone: '+91 9843210765',
    location: 'Thirunelveli',
    lastDonation: '6 July 2025',
    availability: 'Available',
    avatar: 'AS',
  },
  {
    id: 3,
    name: 'Priya Lakshmi',
    bloodGroup: 'B+',
    age: 31,
    phone: '+91 9751234567',
    location: 'Chennai',
    lastDonation: '20 June 2025',
    availability: 'Available',
    avatar: 'PL',
  },
  {
    id: 4,
    name: 'Deepak Raj',
    bloodGroup: 'AB+',
    age: 26,
    phone: '+91 9600123456',
    location: 'Madurai',
    lastDonation: '10 August 2025',
    availability: 'Unavailable',
    avatar: 'DR',
  },
  {
    id: 5,
    name: 'Kavitha Devi',
    bloodGroup: 'O-',
    age: 29,
    phone: '+91 9445678901',
    location: 'Coimbatore',
    lastDonation: '2 September 2025',
    availability: 'Available',
    avatar: 'KD',
  },
  {
    id: 6,
    name: 'Suresh Babu',
    bloodGroup: 'B-',
    age: 35,
    phone: '+91 9384567890',
    location: 'Salem',
    lastDonation: '25 July 2025',
    availability: 'Available',
    avatar: 'SB',
  },
  {
    id: 7,
    name: 'Meena Kumari',
    bloodGroup: 'A-',
    age: 22,
    phone: '+91 9267890123',
    location: 'Trichy',
    lastDonation: '1 August 2025',
    availability: 'Available',
    avatar: 'MK',
  },
  {
    id: 8,
    name: 'Vijay Anand',
    bloodGroup: 'AB-',
    age: 33,
    phone: '+91 9512345678',
    location: 'Thirunelveli',
    lastDonation: '18 September 2025',
    availability: 'Unavailable',
    avatar: 'VA',
  },
];

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

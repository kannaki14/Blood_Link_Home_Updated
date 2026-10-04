import type { Donor } from '../data/donors';

export interface DonorRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  blood_group: string;
  age: number | null;
  location: string | null;
  availability: string | boolean | null;
  last_donation: string | null;
  created_at: string;
}

export function donorFromRow(row: DonorRow): Donor {
  const initials = row.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    bloodGroup: row.blood_group,
    age: row.age ?? 0,
    phone: row.phone ?? 'Not provided',
    location: row.location ?? 'Not provided',
    lastDonation: row.last_donation
      ? new Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(new Date(`${row.last_donation}T00:00:00`))
      : 'Not provided',
    availability:
      row.availability === true || row.availability === 'Available'
        ? 'Available'
        : 'Unavailable',
    avatar: initials || 'D',
  };
}

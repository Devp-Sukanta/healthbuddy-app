import CareDirectory, { type Entry } from "@/components/CareDirectory";

const groups = [
  { label: 'Hospital type', options: ['Private', 'Government', 'Teaching', 'Specialty'] },
  { label: 'Specialties', options: ['General Medicine', 'Gynecology', 'General Surgery', 'Pediatrics', 'Cardiology', 'Orthopedics', 'Neurology', 'Oncology'] },
  { label: 'Facilities', match: 'all', options: ['24/7 Emergency', 'ICU', 'NICU', 'Diagnostics', 'Dialysis', 'Pharmacy', 'Blood Bank'] },
  { label: 'Payment', options: ['Cashless Insurance', 'Government Scheme', 'Self-pay'] },
  { label: 'Accessibility', match: 'all', options: ['Wheelchair Access', 'Accessible Parking', 'Accessible Restroom'] },
  { label: 'Distance', options: ['Within 5 km', 'Within 10 km', 'Within 20 km'] },
] as const;

const hospitals: Entry[] = [
  { id: 'city', name: 'City Health Hospital', location: 'Indiranagar', summary: 'Private · Multispecialty', distanceKm: 3.2, tags: ['Private', 'General Medicine', 'General Surgery', 'Cardiology', 'Orthopedics', '24/7 Emergency', 'ICU', 'Diagnostics', 'Pharmacy', 'Cashless Insurance', 'Self-pay', 'Wheelchair Access', 'Accessible Parking'] },
  { id: 'lotus', name: 'Lotus Women & Children’s Hospital', location: 'Koramangala', summary: 'Specialty · Women and children', distanceKm: 6.1, tags: ['Private', 'Specialty', 'Gynecology', 'Pediatrics', 'NICU', 'Diagnostics', 'Pharmacy', 'Cashless Insurance', 'Self-pay', 'Wheelchair Access', 'Accessible Restroom'] },
  { id: 'central', name: 'Central Teaching Hospital', location: 'Shivajinagar', summary: 'Government · Teaching hospital', distanceKm: 8.4, tags: ['Government', 'Teaching', 'General Medicine', 'General Surgery', 'Gynecology', 'Neurology', 'Orthopedics', '24/7 Emergency', 'ICU', 'Dialysis', 'Blood Bank', 'Government Scheme', 'Self-pay', 'Wheelchair Access', 'Accessible Restroom'] },
  { id: 'oak', name: 'Oak Cancer Centre', location: 'Whitefield', summary: 'Specialty · Oncology', distanceKm: 14.6, tags: ['Private', 'Specialty', 'Oncology', 'Diagnostics', 'Pharmacy', 'Cashless Insurance', 'Self-pay', 'Wheelchair Access', 'Accessible Parking', 'Accessible Restroom'] },
].map(entry => ({
  ...entry,
  tags: [...entry.tags, ...[5, 10, 20].filter(limit => entry.distanceKm <= limit).map(limit => `Within ${limit} km`)],
}));

export default function HospitalsScreen() {
  return <CareDirectory title="Hospitals" singular="hospital" icon="business-outline" entries={hospitals} groups={groups} />;
}

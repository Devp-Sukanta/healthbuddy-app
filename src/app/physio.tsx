import CareDirectory, { type Entry } from '@/components/CareDirectory';

const image = require('../../assets/icons/rehabilitation.png');

const groups = [
  {
    label: 'Specialty',
    options: ['Orthopedic', 'Sports Rehab', 'Neurological', 'Post-operative Rehab', 'Senior Mobility'],
  },
  {
    label: 'Session format',
    options: ['Home Visit', 'Clinic Visit', 'Video Session'],
  },
  {
    label: 'Availability',
    options: ['Weekdays', 'Weekends', 'Evenings'],
  },
  {
    label: 'Language',
    options: ['English', 'Hindi', 'Kannada'],
  },
] as const;

const entries: Entry[] = [
  {
    id: 'orthopedic',
    name: 'Orthopedic Physiotherapy',
    location: 'Indiranagar',
    summary: 'Joint and muscle rehabilitation',
    distanceKm: 2.7,
    image,
    tags: ['Orthopedic', 'Clinic Visit', 'Video Session', 'Weekdays', 'Evenings', 'English', 'Kannada'],
  },
  {
    id: 'sports',
    name: 'Sports Injury Rehabilitation',
    location: 'Koramangala',
    summary: 'Movement assessment and sports rehabilitation',
    distanceKm: 4.9,
    image,
    tags: ['Sports Rehab', 'Orthopedic', 'Clinic Visit', 'Weekdays', 'Weekends', 'English', 'Hindi'],
  },
  {
    id: 'neuro',
    name: 'Neurological Physiotherapy',
    location: 'Shivajinagar',
    summary: 'Mobility and balance rehabilitation',
    distanceKm: 6.3,
    image,
    tags: ['Neurological', 'Senior Mobility', 'Home Visit', 'Clinic Visit', 'Weekdays', 'Hindi', 'Kannada'],
  },
  {
    id: 'post-operative',
    name: 'Post-operative Physiotherapy',
    location: 'Whitefield',
    summary: 'Scheduled rehabilitation sessions at home',
    distanceKm: 8.6,
    image,
    tags: ['Post-operative Rehab', 'Home Visit', 'Weekdays', 'Weekends', 'English', 'Hindi'],
  },
];

export default function PhysioScreen() {
  return (
    <CareDirectory
      title="Physiotherapy services"
      singular="physiotherapy service"
      icon="fitness-outline"
      entries={entries}
      groups={groups}
    />
  );
}
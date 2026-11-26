import CareDirectory, { type Entry } from '@/components/CareDirectory';

const image = require('../../assets/icons/nurse.png');

const groups = [
  {
    label: 'Care type',
    options: ['Elder Care', 'Post-operative Care', 'Wound Care', 'Newborn Care'],
  },
  {
    label: 'Visit type',
    options: ['Home Visit', 'Clinic Visit'],
  },
  {
    label: 'Shift',
    options: ['Hourly', 'Day Shift', 'Night Shift', '24-hour Care'],
  },
  {
    label: 'Language',
    options: ['English', 'Hindi', 'Kannada'],
  },
] as const;

const entries: Entry[] = [
  {
    id: 'elder-home-care',
    name: 'Elder Home Care',
    location: 'Indiranagar',
    summary: 'Help with daily routines and ongoing nursing support',
    distanceKm: 2.4,
    image,
    tags: ['Elder Care', 'Home Visit', 'Day Shift', '24-hour Care', 'English', 'Kannada'],
  },
  {
    id: 'post-operative-care',
    name: 'Post-operative Nursing',
    location: 'Koramangala',
    summary: 'In-home nursing support after discharge',
    distanceKm: 4.8,
    image,
    tags: ['Post-operative Care', 'Wound Care', 'Home Visit', 'Hourly', 'Night Shift', 'English', 'Hindi'],
  },
  {
    id: 'wound-dressing',
    name: 'Wound Dressing Visit',
    location: 'Shivajinagar',
    summary: 'Dressing changes and follow-up nursing visits',
    distanceKm: 6.2,
    image,
    tags: ['Wound Care', 'Home Visit', 'Clinic Visit', 'Hourly', 'Hindi', 'Kannada'],
  },
  {
    id: 'newborn-support',
    name: 'Newborn Nursing Support',
    location: 'Whitefield',
    summary: 'Scheduled nursing support for newborns and families',
    distanceKm: 9.5,
    image,
    tags: ['Newborn Care', 'Home Visit', 'Day Shift', 'Night Shift', 'English', 'Hindi'],
  },
];

export default function NursingScreen() {
  return (
    <CareDirectory
      title="Nursing services"
      singular="nursing service"
      icon="heart-outline"
      entries={entries}
      groups={groups}
    />
  );
}
import CareDirectory, { type Entry } from '@/components/CareDirectory';

const labImage = require('../../assets/icons/sample-tube.png');

const groups = [
  {
    label: 'Test category',
    options: ['Hematology', 'Diabetes', 'Thyroid', 'Lipid Profile', 'Urinalysis'],
  },
  {
    label: 'Sample type',
    options: ['Blood', 'Urine'],
  },
  {
    label: 'Collection',
    options: ['Home Collection', 'Lab Visit'],
  },
  {
    label: 'Report turnaround',
    options: ['Same Day', 'Next Day'],
  },
  {
    label: 'Price range',
    options: ['Under ₹500', '₹500–₹999', '₹1,000 and above'],
  },
] as const;

function priceRange(price: number) {
  if (price < 500) return 'Under ₹500';
  if (price < 1000) return '₹500–₹999';
  return '₹1,000 and above';
}

// Sample prices, collection options, and turnaround times.
const catalog = [
  {
    id: 'cbc',
    name: 'Complete Blood Count (CBC)',
    location: 'HealthBuddy Diagnostics · Indiranagar',
    price: 349,
    distanceKm: 2.5,
    tags: ['Hematology', 'Blood', 'Home Collection', 'Lab Visit', 'Same Day'],
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    location: 'HealthBuddy Diagnostics · Indiranagar',
    price: 599,
    distanceKm: 2.5,
    tags: ['Diabetes', 'Blood', 'Home Collection', 'Lab Visit', 'Next Day'],
  },
  {
    id: 'thyroid',
    name: 'Thyroid Profile (T3, T4, TSH)',
    location: 'Lakeview Labs · Koramangala',
    price: 899,
    distanceKm: 4.8,
    tags: ['Thyroid', 'Blood', 'Home Collection', 'Lab Visit', 'Next Day'],
  },
  {
    id: 'lipid',
    name: 'Lipid Profile',
    location: 'Greenfield Diagnostics · Whitefield',
    price: 1099,
    distanceKm: 8.2,
    tags: ['Lipid Profile', 'Blood', 'Home Collection', 'Next Day'],
  },
  {
    id: 'urine',
    name: 'Routine Urine Examination',
    location: 'Lakeview Labs · Koramangala',
    price: 299,
    distanceKm: 4.8,
    tags: ['Urinalysis', 'Urine', 'Lab Visit', 'Same Day'],
  },
];

const tests: Entry[] = catalog.map(({ price, tags, ...item }) => ({
  ...item,
  summary: `₹${price.toLocaleString('en-IN')} · ${tags[1]} sample`,
  tags: [...tags, priceRange(price)],
  image: labImage,
}));

export default function LabTestsScreen() {
  return (
    <CareDirectory
      title="Lab tests"
      singular="lab test"
      icon="flask-outline"
      entries={tests}
      groups={groups}
    />
  );
}
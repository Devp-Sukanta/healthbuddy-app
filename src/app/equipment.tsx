import CareDirectory, { type Entry } from '@/components/CareDirectory';

const image = require('../../assets/icons/lab-equipment.png');

const groups = [
  {
    label: 'Equipment category',
    options: ['Microscopy', 'Sample Processing', 'Measurement', 'Lab Storage'],
  },
  {
    label: 'Purchase option',
    options: ['Buy', 'Rent'],
  },
  {
    label: 'Stock',
    options: ['In Stock', 'Back Order'],
  },
  {
    label: 'Fulfillment',
    options: ['Delivery', 'Store Pickup'],
  },
  {
    label: 'Support',
    match: 'all',
    options: ['Installation', 'Calibration', 'Warranty'],
  },
] as const;

const entries: Entry[] = [
  {
    id: 'microscope',
    name: 'Compound Microscope',
    location: 'Indiranagar',
    summary: 'Bench microscope · Buy or rent',
    distanceKm: 3.1,
    image,
    tags: ['Microscopy', 'Buy', 'Rent', 'In Stock', 'Delivery', 'Store Pickup', 'Warranty'],
  },
  {
    id: 'centrifuge',
    name: 'Benchtop Centrifuge',
    location: 'Koramangala',
    summary: 'Sample-processing equipment · Purchase',
    distanceKm: 5.4,
    image,
    tags: ['Sample Processing', 'Buy', 'In Stock', 'Delivery', 'Installation', 'Warranty'],
  },
  {
    id: 'balance',
    name: 'Digital Precision Balance',
    location: 'Shivajinagar',
    summary: 'Laboratory weighing equipment · Purchase',
    distanceKm: 6.7,
    image,
    tags: ['Measurement', 'Buy', 'In Stock', 'Delivery', 'Store Pickup', 'Calibration', 'Warranty'],
  },
  {
    id: 'refrigerator',
    name: 'Laboratory Refrigerator',
    location: 'Whitefield',
    summary: 'Temperature-controlled storage · Back order',
    distanceKm: 10.2,
    image,
    tags: ['Lab Storage', 'Buy', 'Back Order', 'Delivery', 'Installation', 'Warranty'],
  },
];

export default function EquipmentScreen() {
  return (
    <CareDirectory
      title="Lab equipment"
      singular="equipment listing"
      icon="flask-outline"
      entries={entries}
      groups={groups}
    />
  );
}
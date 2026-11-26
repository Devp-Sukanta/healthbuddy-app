import CareDirectory, { type Entry } from '@/components/CareDirectory';

const medicineImage = require('../../assets/icons/medicine.png');

const groups = [
  {
    label: 'Category',
    options: [
      'Pain & Fever',
      'Allergy',
      'Digestive Health',
      'Vitamins & Supplements',
      'Skin Care',
    ],
  },
  {
    label: 'Form',
    options: ['Tablet', 'Capsule', 'Liquid', 'Cream'],
  },
  {
    label: 'Prescription',
    options: ['Over the Counter', 'Prescription Required'],
  },
  {
    label: 'Stock',
    options: ['In Stock', 'Out of Stock'],
  },
  {
    label: 'Fulfillment',
    options: ['Home Delivery', 'Store Pickup'],
  },
] as const;

// Sample catalog. Use your pharmacy's product images, stock, and
// prescription classification when you connect your catalog.
const catalog = [
  {
    id: 'pain-relief',
    name: 'Pain Relief Tablets',
    location: 'Central Pharmacy',
    summary: 'Tablet · Sample pack of 10',
    distanceKm: 2.3,
    tags: ['Pain & Fever', 'Tablet', 'Over the Counter', 'In Stock', 'Home Delivery'],
  },
  {
    id: 'allergy-relief',
    name: 'Allergy Relief Syrup',
    location: 'Lakeview Pharmacy',
    summary: 'Liquid · Sample 60 mL bottle',
    distanceKm: 4.1,
    tags: ['Allergy', 'Liquid', 'Over the Counter', 'In Stock', 'Store Pickup'],
  },
  {
    id: 'digestive-care',
    name: 'Digestive Health Capsules',
    location: 'Central Pharmacy',
    summary: 'Capsule · Sample pack of 15',
    distanceKm: 2.3,
    tags: ['Digestive Health', 'Capsule', 'Over the Counter', 'Out of Stock'],
  },
  {
    id: 'multivitamin',
    name: 'Daily Multivitamin Tablets',
    location: 'Greenfield Pharmacy',
    summary: 'Tablet · Sample pack of 30',
    distanceKm: 5.8,
    tags: [
      'Vitamins & Supplements',
      'Tablet',
      'Over the Counter',
      'In Stock',
      'Home Delivery',
      'Store Pickup',
    ],
  },
  {
    id: 'skin-care',
    name: 'Prescription Skin Cream',
    location: 'Lakeview Pharmacy',
    summary: 'Cream · Sample tube',
    distanceKm: 4.1,
    tags: ['Skin Care', 'Cream', 'Prescription Required', 'In Stock', 'Store Pickup'],
  },
];

const medicines: Entry[] = catalog.map(item => ({
  ...item,
  image: medicineImage,
}));

export default function MedicinesScreen() {
  return (
    <CareDirectory
      title="Medicines"
      singular="medicine"
      icon="medkit-outline"
      entries={medicines}
      groups={groups}
    />
  );
}
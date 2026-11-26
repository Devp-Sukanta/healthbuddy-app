import CareDirectory, { type Entry } from '@/components/CareDirectory';

const groups = [
  { label: 'Vehicle type', options: ['Basic Life Support (BLS)', 'Advanced Life Support (ALS)', 'ICU Ambulance', 'Neonatal Ambulance', 'Wheelchair Transport'] },
  { label: 'Service', options: ['Emergency Transport', 'Scheduled Transport', 'Inter-hospital Transfer', 'Long-distance Transfer', 'Event Standby'] },
  { label: 'Operating hours', options: ['24/7', 'By Appointment'] },
  { label: 'Equipment', match: 'all', options: ['Oxygen', 'Ventilator', 'Defibrillator', 'Patient Monitor', 'Stretcher', 'Neonatal Incubator', 'Wheelchair Lift'] },
  { label: 'Crew', match: 'all', options: ['EMT', 'Paramedic', 'Critical Care Nurse', 'Doctor'] },
  { label: 'Provider type', options: ['Private', 'Hospital-operated', 'Nonprofit'] },
  { label: 'Distance', options: ['Within 5 km', 'Within 10 km', 'Within 20 km'] },
] as const;

const ambulances: Entry[] = [
  { id: 'city', name: 'City Health Transport', location: 'Indiranagar', summary: 'BLS · Emergency and scheduled transport', distanceKm: 2.8, tags: ['Basic Life Support (BLS)', 'Emergency Transport', 'Scheduled Transport', 'Event Standby', '24/7', 'Oxygen', 'Stretcher', 'EMT', 'Private'] },
  { id: 'pulse', name: 'Pulse Critical Care Transport', location: 'Koramangala', summary: 'ALS and ICU vehicles · Critical care transfers', distanceKm: 5.6, tags: ['Advanced Life Support (ALS)', 'ICU Ambulance', 'Emergency Transport', 'Inter-hospital Transfer', 'Long-distance Transfer', '24/7', 'Oxygen', 'Ventilator', 'Defibrillator', 'Patient Monitor', 'Stretcher', 'Paramedic', 'Critical Care Nurse', 'Doctor', 'Hospital-operated'] },
  { id: 'lotus', name: 'Lotus Neonatal Transport', location: 'Shivajinagar', summary: 'Neonatal vehicle · Inter-hospital transfers', distanceKm: 8.7, tags: ['Neonatal Ambulance', 'Inter-hospital Transfer', '24/7', 'Oxygen', 'Patient Monitor', 'Neonatal Incubator', 'Critical Care Nurse', 'Doctor', 'Hospital-operated'] },
  { id: 'access', name: 'AccessRide Patient Transport', location: 'Whitefield', summary: 'Wheelchair vehicle · Scheduled transport', distanceKm: 13.4, tags: ['Wheelchair Transport', 'Scheduled Transport', 'Long-distance Transfer', 'By Appointment', 'Wheelchair Lift', 'Nonprofit'] },
].map(entry => ({
  ...entry,
  tags: [...entry.tags, ...[5, 10, 20].filter(limit => entry.distanceKm <= limit).map(limit => `Within ${limit} km`)],
}));

export default function AmbulancesScreen() {
  return <CareDirectory title="Ambulances" singular="ambulance" icon="medkit-outline" entries={ambulances} groups={groups} />;
}

// Datos iniciales de terapeutas
const initialTherapists = [
  {
    name: "Dra. Elena Martínez",
    specialty: "Naturopatía · Acupuntura",
    bio: "Especialista en medicina natural con 10 años de experiencia",
    location: "Madrid Centro",
    availability: {
      "monday": ["09:00", "11:00", "16:00"],
      "wednesday": ["10:00", "14:00", "17:00"]
    },
    price: 45
  },
  // ... más terapeutas
];

async function seedData() {
  const batch = db.batch();
  
  initialTherapists.forEach(therapist => {
    const ref = db.collection('therapists').doc();
    batch.set(ref, therapist);
  });
  
  await batch.commit();
  console.log('Datos iniciales agregados!');
}
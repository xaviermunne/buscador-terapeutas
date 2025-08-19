import { db } from "./firebase-config.js";
import { auth } from "./auth.js";

// Crear nueva reserva
export const createBooking = async (therapistId, date, time, notes, sessionType) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  try {
    const bookingRef = await db.collection('bookings').add({
      userId: user.uid,
      therapistId,
      date,
      time,
      notes,
      sessionType,
      status: 'confirmed',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Enviar notificación al terapeuta
    await db.collection('notifications').add({
      userId: therapistId,
      type: 'new_booking',
      bookingId: bookingRef.id,
      read: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    return bookingRef.id;
  } catch (error) {
    console.error("Error al crear reserva:", error);
    throw error;
  }
};

// Obtener reservas del usuario
export const getUserBookings = async (userId) => {
  try {
    const snapshot = await db.collection('bookings')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .orderBy('time', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toLocaleDateString(),
      time: doc.data().time
    }));
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    throw error;
  }
};

// Cancelar reserva
export const cancelBooking = async (bookingId) => {
  try {
    await db.collection('bookings').doc(bookingId).update({
      status: 'cancelled',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    throw error;
  }
};

// Obtener disponibilidad del terapeuta
export const getTherapistAvailability = async (therapistId, date) => {
  try {
    const therapistDoc = await db.collection('therapists').doc(therapistId).get();
    const therapistData = therapistDoc.data();
    
    // Lógica para calcular disponibilidad (puedes personalizar)
    const workingHours = therapistData.workingHours || {
      start: '09:00',
      end: '18:00',
      breakStart: '13:00',
      breakEnd: '15:00'
    };

    // Aquí iría la lógica para generar slots disponibles
    return generateTimeSlots(workingHours); 
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    throw error;
  }
};

// Función auxiliar para generar horarios
function generateTimeSlots(workingHours) {
  const slots = [];
  // Implementa tu lógica de generación de horarios
  return slots;
}
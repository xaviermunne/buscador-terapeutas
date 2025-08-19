// Sistema de reservas
class BookingSystem {
  constructor() {
    this.therapists = [];
    this.loadTherapists();
    this.initBookingButtons();
  }
  
  async loadTherapists() {
    const snapshot = await db.collection('therapists').limit(5).get();
    this.therapists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  initBookingButtons() {
    document.addEventListener('click', async (e) => {
      if (e.target.classList.contains('therapist-book-btn')) {
        if (!auth.currentUser) {
          showAlert('Por favor inicia sesión para reservar', 'warning');
          return document.getElementById('open-login').click();
        }
        
        const therapistId = e.target.dataset.id;
        const therapist = this.therapists.find(t => t.id === therapistId);
        this.openBookingModal(therapist);
      }
    });
  }
  
  openBookingModal(therapist) {
    const modal = document.getElementById('booking-modal');
    modal.querySelector('#modal-therapist-name').textContent = therapist.name;
    modal.querySelector('.therapist-specialty').textContent = therapist.specialty;
    modal.classList.remove('hidden');
    
    // Configurar calendario (usando un plugin simple o básico)
    this.initCalendar(therapist.availability);
  }
  
  async createAppointment(therapistId, dateTime, notes) {
    try {
      await db.collection('appointments').add({
        userId: auth.currentUser.uid,
        therapistId,
        date: dateTime.date,
        time: dateTime.time,
        notes,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      showAlert('¡Cita reservada con éxito!', 'success');
    } catch (error) {
      showAlert('Error al reservar: ' + error.message, 'error');
    }
  }
}
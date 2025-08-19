// Booking functionality
document.addEventListener('DOMContentLoaded', function() {
    // Selección de fecha
    const dateButtons = document.querySelectorAll('#booking-modal .grid.grid-cols-7 button');
    dateButtons.forEach(button => {
        button.addEventListener('click', function() {
            dateButtons.forEach(btn => btn.classList.remove('bg-green-600', 'text-white'));
            this.classList.add('bg-green-600', 'text-white');
        });
    });

    // Selección de hora
    const timeButtons = document.querySelectorAll('#booking-modal .grid.grid-cols-3 button');
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            timeButtons.forEach(btn => btn.classList.remove('bg-green-600', 'text-white', 'border-green-600'));
            this.classList.add('bg-green-600', 'text-white', 'border-green-600');
        });
    });

    // Confirmar reserva
    const confirmButton = document.getElementById('confirm-booking');
    confirmButton.addEventListener('click', function() {
        const therapistName = document.getElementById('modal-therapist-name').textContent;
        const selectedDate = document.querySelector('#booking-modal .grid.grid-cols-7 button.bg-green-600')?.textContent;
        const selectedTime = document.querySelector('#booking-modal .grid.grid-cols-3 button.bg-green-600')?.textContent;
        const consultType = document.querySelector('#booking-modal input[name="consulta"]:checked')?.nextElementSibling.textContent;
        const notes = document.getElementById('notes').value;

        if (!selectedDate || !selectedTime) {
            alert('Por favor selecciona una fecha y hora para tu cita');
            return;
        }

        // Aquí iría la lógica para guardar la reserva en Firebase
        alert(`Reserva confirmada con ${therapistName} para el día ${selectedDate} a las ${selectedTime} (${consultType})`);
        
        bookingModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });
});
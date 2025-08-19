import { auth, logoutUser } from './auth.js';
import { getUserBookings, cancelBooking } from './bookings.js';

// Elementos del DOM
const appointmentsList = document.getElementById('appointments-list');
const userProfile = document.getElementById('user-profile');
const logoutBtn = document.getElementById('logout-btn');

// Cargar datos del usuario
const loadUserData = async (user) => {
  if (!user) {
    window.location.href = '/login.html';
    return;
  }

  try {
    // Mostrar perfil
    userProfile.innerHTML = `
      <div class="flex items-center mb-4">
        <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || user.email)}" 
             alt="User" class="w-16 h-16 rounded-full mr-4">
        <div>
          <h3 class="text-lg font-semibold">${user.displayName || 'Usuario'}</h3>
          <p class="text-gray-600">${user.email}</p>
        </div>
      </div>
      <div class="space-y-2">
        <p><span class="font-medium">Rol:</span> ${user.role || 'Paciente'}</p>
        <p><span class="font-medium">Último acceso:</span> ${new Date(user.lastLogin?.toDate()).toLocaleString()}</p>
      </div>
    `;

    // Cargar reservas
    const bookings = await getUserBookings(user.uid);
    renderBookings(bookings);
  } catch (error) {
    console.error("Error al cargar datos:", error);
    showAlert("Error al cargar datos del usuario", "error");
  }
};

// Renderizar reservas
const renderBookings = (bookings) => {
  if (bookings.length === 0) {
    appointmentsList.innerHTML = `
      <div class="text-center py-4 text-gray-500">
        No tienes citas programadas
      </div>
    `;
    return;
  }

  appointmentsList.innerHTML = bookings.map(booking => `
    <div class="border-b border-gray-200 py-4">
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-medium">${booking.date} a las ${booking.time}</h4>
          <p class="text-gray-600">${getTherapistName(booking.therapistId)}</p>
          <p class="text-sm mt-1">${booking.notes || 'Sin notas'}</p>
        </div>
        <div class="flex space-x-2">
          <span class="px-2 py-1 text-xs rounded-full 
            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
            ${booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
          </span>
          ${booking.status === 'confirmed' ? `
            <button class="cancel-booking px-2 py-1 text-xs bg-red-50 text-red-600 rounded" 
                    data-id="${booking.id}">
              Cancelar
            </button>` : ''
          }
        </div>
      </div>
    </div>
  `).join('');

  // Event listeners para botones de cancelar
  document.querySelectorAll('.cancel-booking').forEach(button => {
    button.addEventListener('click', async (e) => {
      if (confirm("¿Estás seguro de que quieres cancelar esta cita?")) {
        try {
          await cancelBooking(e.target.dataset.id);
          showAlert("Cita cancelada correctamente", "success");
          loadUserData(auth.currentUser);
        } catch (error) {
          showAlert("Error al cancelar la cita", "error");
        }
      }
    });
  });
};

// Obtener nombre del terapeuta (simplificado)
const getTherapistName = async (therapistId) => {
  // En una implementación real, harías una consulta a Firestore
  return "Terapeuta"; // Placeholder
};

// Mostrar alertas
const showAlert = (message, type) => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg 
    ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
  alertDiv.textContent = message;
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
};

// Evento de logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await logoutUser();
      window.location.href = '/';
    } catch (error) {
      showAlert("Error al cerrar sesión", "error");
    }
  });
}

// Inicializar dashboard
auth.onAuthStateChanged(user => {
  if (user) {
    loadUserData(user);
  } else {
    window.location.href = '/login.html';
  }
});
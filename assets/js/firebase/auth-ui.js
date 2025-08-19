import { login, register } from './auth.js';
import { db } from './firebase/app.js';
import { doc, setDoc } from "firebase/firestore";

export function setupAuthUI() {
  // Configurar event listeners para los formularios
  document.getElementById('login-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('#email').value;
    const password = this.querySelector('#password').value;
    
    try {
      await login(email, password);
      // Redirigir o actualizar UI
    } catch (error) {
      showError(error.message);
    }
  });

  document.getElementById('register-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    // ... similar al login pero con registro
  });
}

function showError(message) {
  // Mostrar error en la UI
}
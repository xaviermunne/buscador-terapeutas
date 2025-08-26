// Funciones de autenticación
async function handleLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error de autenticación:", error);
        throw error;
    }
}

async function handleRegistration(email, password, userData) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(userCredential.user.uid).set({
            ...userData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return userCredential.user;
    } catch (error) {
        console.error("Error de registro:", error);
        throw error;
    }
}

function updateNavForLoggedInUser(email) {
    const authButtons = document.getElementById('auth-buttons');
    authButtons.innerHTML = `
        <div class="flex items-center space-x-2">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=48bb78&color=fff" 
                 alt="Avatar de usuario" 
                 class="w-8 h-8 rounded-full">
            <span class="font-medium">${email.split('@')[0]}</span>
        </div>
        <button id="logout-btn" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            Cerrar sesión
        </button>
    `;
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        auth.signOut().then(() => {
            window.location.reload();
        });
    });
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('#email').value;
    const password = this.querySelector('#password').value;
    
    try {
        await handleLogin(email, password);
        loginModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        updateNavForLoggedInUser(email);
    } catch (error) {
        alert('Error al iniciar sesión: ' + error.message);
    }
});

// Handle register form submission
document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = this.querySelector('#first-name').value;
    const lastName = this.querySelector('#last-name').value;
    const email = this.querySelector('#register-email').value;
    const password = this.querySelector('#register-password').value;
    const confirmPassword = this.querySelector('#confirm-password').value;
    const acceptTerms = this.querySelector('#accept-terms').checked;
    const newsletterOptIn = this.querySelector('#newsletter-opt-in').checked;
    
    // Validaciones
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert('Por favor introduce un email válido');
        return;
    }

    if (!acceptTerms) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }

    try {
        const userData = {
            firstName,
            lastName,
            email,
            newsletterOptIn,
            role: 'patient'
        };
        
        await handleRegistration(email, password, userData);
        
        alert('¡Registro exitoso! ' + 
            (newsletterOptIn ? 'Te has suscrito al newsletter.' : ''));
        
        registerModal.classList.add('hidden');
        
        // Auto-login after registration
        document.querySelector('#email').value = email;
        document.querySelector('#password').value = password;
        document.getElementById('login-form').dispatchEvent(new Event('submit'));
    } catch (error) {
        alert('Error en el registro: ' + error.message);
    }
});
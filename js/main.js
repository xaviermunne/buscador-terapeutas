// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDfmgWWhJlccc02-j40-9tPsy4P9Vu8IW0",
    authDomain: "naturocare-ce0ca.firebaseapp.com",
    projectId: "naturocare-ce0ca",
    storageBucket: "naturocare-ce0ca.firebasestorage.app",
    messagingSenderId: "157295915835",
    appId: "1:157295915835:web:134faab4cf3158ab133d1e",
    measurementId: "G-8RDXGW5DC0"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variables globales
let map;
let markers = [];
const therapists = [
    {
        name: "Dra. Elena Martínez",
        specialty: "Naturopatía · Acupuntura",
        lat: 40.4168,
        lng: -3.7038,
        address: "Calle Gran Vía, 1, Madrid",
        rating: 4.9,
        price: 45,
        therapies: ["Naturopatía", "Acupuntura", "Nutrición"],
        available: ["09:00", "11:00", "16:00", "18:00"]
    },
    {
        name: "Carlos Rodríguez",
        specialty: "Osteopatía · Quiromasaje", 
        lat: 41.3851,
        lng: 2.1734,
        address: "Passeig de Gràcia, 100, Barcelona",
        rating: 4.8,
        price: 55,
        therapies: ["Osteopatía", "Quiromasaje", "Fisioterapia"],
        available: ["10:00", "12:00", "15:00", "17:00"]
    },
    {
        name: "Laura Fernández",
        specialty: "Reiki · Flores de Bach",
        lat: 39.4699,
        lng: -0.3763,
        address: "Calle Colón, 22, Valencia",
        rating: 5.0,
        price: 40,
        therapies: ["Reiki", "Flores de Bach", "Meditación"],
        available: ["09:30", "14:00", "16:30", "19:00"]
    }
];

// DOM Elements
const loginModal = document.getElementById("login-modal");
const registerModal = document.getElementById("register-modal");
const bookingModal = document.getElementById("booking-modal");
const mapSection = document.getElementById("map-section");
const mobileMenu = document.getElementById("mobile-menu");
const modalTherapistName = document.getElementById("modal-therapist-name");

// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
});

// Close modal when clicking outside
bookingModal.addEventListener('click', function(e) {
    if (e.target === bookingModal) {
        bookingModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
});

// Search functionality
document.getElementById("search-button").addEventListener("click", () => {
    const location = document.getElementById("location-search").value;
    const therapy = document.getElementById("therapy-search").value;
    
    if (location) {
        geocodeAddress(location, (lat, lng) => {
            initMap(lat, lng);
            mapSection.classList.remove("hidden");
            window.scrollTo({
                top: mapSection.offsetTop,
                behavior: "smooth"
            });
        });
    } else {
        alert("Por favor ingresa una ubicación para buscar terapeutas");
    }
});

// Close map
document.getElementById("close-map").addEventListener("click", () => {
    mapSection.classList.add("hidden");
});

// Modal elements
const closeLoginModal = document.getElementById("close-login-modal");
const closeRegisterModal = document.getElementById("close-register-modal");
const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");
const closeModal = document.getElementById("close-modal");

// Open modals
document.getElementById("open-login").addEventListener("click", () => {
    loginModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
});

document.getElementById("open-register").addEventListener("click", () => {
    registerModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
});

document.getElementById("mobile-login").addEventListener("click", () => {
    loginModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
});

document.getElementById("mobile-register").addEventListener("click", () => {
    registerModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
});

// Close modals
closeLoginModal.addEventListener("click", () => {
    loginModal.classList.add("hidden");
    document.body.style.overflow = "auto";
});

closeRegisterModal.addEventListener("click", () => {
    registerModal.classList.add("hidden");
    document.body.style.overflow = "auto";
});

closeModal.addEventListener("click", () => {
    bookingModal.classList.add("hidden");
    document.body.style.overflow = "auto";
});

// Switch between modals
showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.add("hidden");
    registerModal.classList.remove("hidden");
});

showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.classList.add("hidden");
    loginModal.classList.remove("hidden");
});

// Booking modal functionality
const bookButtons = document.querySelectorAll('.therapist-book-btn');
bookButtons.forEach(button => {
    button.addEventListener('click', function() {
        const therapistName = this.getAttribute('data-therapist');
        modalTherapistName.textContent = therapistName;
        bookingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
});

// Handle newsletter form submission
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[name="email"]').value;
    
    if (!email || !email.includes('@')) {
        alert('Por favor introduce un email válido');
        return;
    }

    // Guardar en Firestore
    db.collection('newsletter').add({
        email: email,
        subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('¡Gracias por suscribirte a nuestro newsletter!');
        this.reset();
    })
    .catch(error => {
        console.error("Error al suscribirse:", error);
        alert('Hubo un error al procesar tu suscripción');
    });
});

// Session type buttons functionality
document.querySelectorAll('.bg-white\\/20').forEach(button => {
    button.addEventListener('click', function() {
        const isOnline = this.textContent.includes('Online');
        alert(`Buscando sesiones ${isOnline ? 'online' : 'presenciales'}...`);
    });
});

// Sticky nav on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.sticky-nav');
    if (window.scrollY > 10) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Check auth state
auth.onAuthStateChanged(user => {
    if (user) {
        updateNavForLoggedInUser(user.email);
    }
});

// Global function to book therapist from map info window
window.bookTherapist = function(therapistName) {
    const therapist = therapists.find(t => t.name === therapistName);
    if (therapist) {
        modalTherapistName.textContent = therapist.name;
        bookingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
};
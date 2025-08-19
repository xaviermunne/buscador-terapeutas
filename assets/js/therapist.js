// assets/js/therapists.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('therapists-container');
    
    // En producción, esto vendría de Firebase
    const therapists = [
        {
            id: '1',
            name: 'Dra. Elena Martínez',
            specialty: 'Naturopatía · Acupuntura',
            photo: 'https://images.unsplash.com/photo-1550831107-1553da8c8464',
            location: 'Madrid Centro',
            distance: '1.2 km',
            rating: 4.9,
            price: 45,
            discount: 60,
            therapies: ['Naturopatía', 'Acupuntura'],
            badges: ['Primera consulta gratis', 'Video consulta']
        },
        // Más terapeutas...
    ];
    
    therapists.forEach(therapist => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-md overflow-hidden card-hover transition-all';
        card.innerHTML = `
            <!-- Estructura de la tarjeta similar a la de tu landing -->
        `;
        container.appendChild(card);
    });
});
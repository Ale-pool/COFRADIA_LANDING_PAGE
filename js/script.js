// Funcionalidad para el video de la sección Nosotros
function playVideo() {
    const video = document.getElementById('aboutVideo');
    const playButton = document.querySelector('.play-button');
    
    if (video.paused) {
        video.play();
        playButton.style.display = 'none';
    } else {
        video.pause();
        playButton.style.display = 'flex';
    }
}

// Event listeners para el video
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('aboutVideo');
    const playButton = document.querySelector('.play-button');
    
    if (video && playButton) {
        // Mostrar botón de play cuando el video termine
        video.addEventListener('ended', function() {
            playButton.style.display = 'flex';
        });
        
        // Ocultar botón cuando se hace clic en el video
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                playButton.style.display = 'none';
            } else {
                video.pause();
                playButton.style.display = 'flex';
            }
        });
        
        // Smooth scrolling para la navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId.startsWith('#')) {
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Actualizar active state
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            });
        });
    }
    
    // Intersection Observer para destacar navegación activa
    const sections = document.querySelectorAll('section, main');
    const navItems = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id || 'home';
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Funcionalidad para los eventos
function showEventInfo(eventType) {
    const eventInfo = {
        'semana-santa': {
            title: 'Semana Santa',
            description: 'La Semana Santa es la conmemoración anual cristiana de la Pasión de Cristo, es decir, de la entrada a Jerusalén, la última cena, el viacrucis, la muerte y resurrección de Jesucristo. Con las procesiones recordamos y revivimos los momentos más importantes de nuestra fe.',
            details: [
                'Procesión del Domingo de Ramos',
                'Viacrucis del Viernes Santo',
                'Procesión del Santo Entierro',
                'Celebración de la Resurrección'
            ]
        },
        'senora-dolores': {
            title: 'Señora de los Dolores',
            description: 'La devoción a la Virgen de los Dolores se centra en la contemplación de los sufrimientos de María durante la Pasión de Cristo. Es una advocación mariana que nos invita a acompañar a la Madre en su dolor y a encontrar consuelo en su ejemplo de fe.',
            details: [
                'Novena a la Virgen de los Dolores',
                'Procesión especial en honor a la Virgen',
                'Reflexiones sobre los Siete Dolores',
                'Oración del Rosario de los Dolores'
            ]
        }
    };

    const event = eventInfo[eventType];
    if (event) {
        // Crear modal o expandir información
        const modal = document.createElement('div');
        modal.className = 'event-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${event.title}</h2>
                    <button class="modal-close" onclick="closeEventModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${event.description}</p>
                    <h3>Actividades principales:</h3>
                    <ul>
                        ${event.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animar la aparición del modal
        setTimeout(() => {
            modal.classList.add('modal-active');
        }, 10);
    }
}

function closeEventModal() {
    const modal = document.querySelector('.event-modal');
    if (modal) {
        modal.classList.remove('modal-active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Cerrar modal al hacer clic fuera de él
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('event-modal')) {
        closeEventModal();
    }
});

// Carrusel del equipo
let currentTeamSlide = 0;
let teamCarouselInterval;
const teamCarouselTrack = document.getElementById('teamCarouselTrack');
let teamMembers = [];
let cardsPerView = 4; // Número de tarjetas visibles

// Inicializar carrusel del equipo
function initTeamCarousel() {
    if (!teamCarouselTrack) return;
    
    teamMembers = teamCarouselTrack.querySelectorAll('.team-member-card');
    
    // Calcular cartas por vista según el ancho de pantalla
    updateCardsPerView();
    
    // Crear indicadores
    createTeamIndicators();
    
    // Iniciar auto-play
    startTeamAutoPlay();
    
    // Event listeners para resize
    window.addEventListener('resize', function() {
        updateCardsPerView();
        createTeamIndicators();
        updateTeamCarousel();
    });
}

// Actualizar número de cartas visibles según pantalla
function updateCardsPerView() {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 480) {
        cardsPerView = 1;
    } else if (windowWidth <= 768) {
        cardsPerView = 2;
    } else if (windowWidth <= 1024) {
        cardsPerView = 3;
    } else {
        cardsPerView = 4;
    }
}

// Crear indicadores del carrusel
function createTeamIndicators() {
    const indicatorsContainer = document.getElementById('teamCarouselIndicators');
    if (!indicatorsContainer || !teamMembers.length) return;
    
    indicatorsContainer.innerHTML = '';
    const totalSlides = Math.ceil(teamMembers.length / cardsPerView);
    
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator';
        if (i === currentTeamSlide) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToTeamSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Mover carrusel del equipo
function moveTeamCarousel(direction) {
    if (!teamMembers.length) return;
    
    const totalSlides = Math.ceil(teamMembers.length / cardsPerView);
    
    currentTeamSlide += direction;
    
    if (currentTeamSlide >= totalSlides) {
        currentTeamSlide = 0;
    } else if (currentTeamSlide < 0) {
        currentTeamSlide = totalSlides - 1;
    }
    
    updateTeamCarousel();
    resetTeamAutoPlay();
}

// Ir a slide específico
function goToTeamSlide(slideIndex) {
    const totalSlides = Math.ceil(teamMembers.length / cardsPerView);
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentTeamSlide = slideIndex;
        updateTeamCarousel();
        resetTeamAutoPlay();
    }
}

// Actualizar posición del carrusel
function updateTeamCarousel() {
    if (!teamCarouselTrack || !teamMembers.length) return;
    
    const cardWidth = 250; // Ancho de cada tarjeta
    const gap = 30; // Espacio entre tarjetas
    const moveDistance = (cardWidth + gap) * cardsPerView;
    const translateX = -currentTeamSlide * moveDistance;
    
    teamCarouselTrack.style.transform = `translateX(${translateX}px)`;
    
    // Actualizar indicadores
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentTeamSlide);
    });
}

// Auto-play del carrusel
function startTeamAutoPlay() {
    teamCarouselInterval = setInterval(() => {
        moveTeamCarousel(1);
    }, 4000); // Cambiar cada 4 segundos
}

// Reiniciar auto-play
function resetTeamAutoPlay() {
    clearInterval(teamCarouselInterval);
    startTeamAutoPlay();
}

// Pausar auto-play al hacer hover
function pauseTeamAutoPlay() {
    clearInterval(teamCarouselInterval);
}

// Reanudar auto-play
function resumeTeamAutoPlay() {
    startTeamAutoPlay();
}

// Event listeners para pausa/reanudación del auto-play
document.addEventListener('DOMContentLoaded', function() {
    initTeamCarousel();
    
    const teamSection = document.querySelector('.team-section');
    if (teamSection) {
        teamSection.addEventListener('mouseenter', pauseTeamAutoPlay);
        teamSection.addEventListener('mouseleave', resumeTeamAutoPlay);
    }
    
    // Touch/swipe support para móviles
    let startX = 0;
    let endX = 0;
    
    if (teamCarouselTrack) {
        teamCarouselTrack.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        teamCarouselTrack.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const threshold = 50; // Mínima distancia para detectar swipe
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                moveTeamCarousel(1); // Swipe izquierda - siguiente
            } else {
                moveTeamCarousel(-1); // Swipe derecha - anterior
            }
        }
    }
});

// Galería con Lightbox
let currentLightboxIndex = 0;
let galleryImages = [];
let filteredImages = [];

// Inicializar galería
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Recopilar todas las imágenes
    galleryImages = Array.from(galleryItems).map((item, index) => ({
        src: item.dataset.src,
        title: item.querySelector('.gallery-info h3').textContent,
        description: item.querySelector('.gallery-info p').textContent,
        category: item.dataset.category,
        element: item,
        index: index
    }));
    
    filteredImages = [...galleryImages];
    
    // Event listeners para filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Actualizar botón activo
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar imágenes
            filterGalleryImages(filter);
        });
    });
    
    // Event listeners para abrir lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Event listeners para teclado en lightbox
    document.addEventListener('keydown', function(e) {
        const lightbox = document.getElementById('galleryLightbox');
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        }
    });
}

// Filtrar imágenes de la galería
function filterGalleryImages(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        
        if (filter === 'all' || category === filter) {
            item.classList.remove('filtered-out');
            setTimeout(() => {
                item.style.display = 'block';
            }, 50);
        } else {
            item.classList.add('filtered-out');
            setTimeout(() => {
                if (item.classList.contains('filtered-out')) {
                    item.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // Actualizar array de imágenes filtradas
    if (filter === 'all') {
        filteredImages = [...galleryImages];
    } else {
        filteredImages = galleryImages.filter(img => img.category === filter);
    }
}

// Abrir lightbox
function openLightbox(index) {
    const lightbox = document.getElementById('galleryLightbox');
    const clickedImage = galleryImages[index];
    
    // Encontrar el índice en las imágenes filtradas
    currentLightboxIndex = filteredImages.findIndex(img => img.index === index);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;
    
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar lightbox
function closeLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navegar en lightbox
function navigateLightbox(direction) {
    if (filteredImages.length === 0) return;
    
    currentLightboxIndex += direction;
    
    if (currentLightboxIndex >= filteredImages.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = filteredImages.length - 1;
    }
    
    updateLightboxContent();
}

// Actualizar contenido del lightbox
function updateLightboxContent() {
    if (filteredImages.length === 0) return;
    
    const currentImage = filteredImages[currentLightboxIndex];
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    const lightboxCounter = document.getElementById('lightboxCounter');
    
    // Efecto de fade
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.title;
        lightboxTitle.textContent = currentImage.title;
        lightboxDescription.textContent = currentImage.description;
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${filteredImages.length}`;
        
        lightboxImg.style.opacity = '1';
    }, 150);
}

// Cerrar lightbox al hacer clic fuera de la imagen
document.addEventListener('click', function(e) {
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxContainer = document.querySelector('.lightbox-container');
    
    if (e.target === lightbox || e.target === lightboxContainer) {
        closeLightbox();
    }
});

// Soporte para gestos táctiles en lightbox
let lightboxStartX = 0;
let lightboxEndX = 0;

document.getElementById('galleryLightbox')?.addEventListener('touchstart', function(e) {
    lightboxStartX = e.touches[0].clientX;
});

document.getElementById('galleryLightbox')?.addEventListener('touchend', function(e) {
    lightboxEndX = e.changedTouches[0].clientX;
    handleLightboxSwipe();
});

function handleLightboxSwipe() {
    const threshold = 50;
    const diff = lightboxStartX - lightboxEndX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            navigateLightbox(1); // Swipe izquierda - siguiente
        } else {
            navigateLightbox(-1); // Swipe derecha - anterior
        }
    }
}

// Inicializar galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

// Funcionalidad WhatsApp
function openWhatsApp() {
    // Número de teléfono de la cofradía 
    const phoneNumber = "+573004325236"; // Formato internacional sin espacios
    
    // Mensaje predeterminado
    const message = "Hola! Me gustaría obtener más información sobre la Cofradía Consolación.";
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp en una nueva ventana/pestaña
    window.open(whatsappUrl, '_blank');
}

// Actualizar año actual en el footer
function updateFooterYear() {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    const copyrightElements = document.querySelectorAll('.footer-copyright p');
    
    yearElements.forEach(element => {
        element.textContent = `2015 - ${currentYear}`;
    });
    
    copyrightElements.forEach(element => {
        if (element.textContent.includes('©')) {
            element.textContent = `© ${currentYear} Cofradía Consolación. Todos los derechos reservados.`;
        }
    });
    
    // Actualizar badge de aniversario
    const anniversaryElements = document.querySelectorAll('.anniversary-badge');
    const yearsOfHistory = currentYear - 2015;
    anniversaryElements.forEach(element => {
        element.textContent = `${yearsOfHistory} Años de Historia`;
    });
}

// Smooth scroll mejorado para enlaces del footer
function initFooterNavigation() {
    const footerLinks = document.querySelectorAll('.footer-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Offset para compensar la navbar fija
                    const offset = 80;
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Animación de aparición del footer
function initFooterAnimations() {
    const footerSections = document.querySelectorAll('.footer-section');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const footerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    footerSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.animationDelay = `${index * 0.2}s`;
        footerObserver.observe(section);
    });
}

// Efecto de pulsación en el botón de WhatsApp
function initWhatsAppPulse() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (whatsappBtn) {
        // Agregar efecto de pulsación cada 3 segundos
        setInterval(() => {
            whatsappBtn.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                whatsappBtn.style.animation = '';
            }, 1000);
        }, 5000);
    }
}

// CSS para las animaciones (se agrega dinámicamente)
function addFooterAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    updateFooterYear();
    initFooterNavigation();
    addFooterAnimations();
    initFooterAnimations();
    initWhatsAppPulse();
});

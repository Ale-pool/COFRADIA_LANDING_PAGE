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

/*
================================================
SimpleHealthyLife - JavaScript
================================================
Handles navigation, smooth scrolling, and interactions
================================================
*/

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  
  // ========== Mobile Navigation Toggle (FIXED) ==========
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {

    // Toggle menu
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();

      const isActive = navMenu.classList.toggle('active');
      document.body.classList.toggle('nav-open', isActive);

      navToggle.textContent = isActive ? '✕' : '☰';
      navToggle.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking a link (mobile only)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('active');
          document.body.classList.remove('nav-open');
          navToggle.textContent = '☰';
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      if (
        window.innerWidth <= 768 &&
        navMenu.classList.contains('active') &&
        !navMenu.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ========== Smooth Scroll for Internal Links ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = 100;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ========== Intersection Observer for Scroll Animations ==========
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.glass-card, .grid-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

  // ========== Active Navigation Highlighting ==========
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (currentPath === linkPath || 
        (currentPath.includes(linkPath) && linkPath !== '/')) {
      link.style.color = 'var(--primary-color)';
      link.style.fontWeight = '700';
    }
  });

  // ========== Lazy Loading Images ==========
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ========== Console Welcome Message ==========
  console.log('%c SimpleHealthyLife ', 'background: #8b9d83; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
  console.log('Website loaded successfully! ✨');

});

// ========== Resize Handler ==========
let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if (window.innerWidth > 768) {
      const navMenu = document.querySelector('.nav-menu');
      const navToggle = document.querySelector('.nav-toggle');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
        if (navToggle) {
          navToggle.textContent = '☰';
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }, 250);
});

// ========== Utility Functions ==========
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  return Math.ceil(text.trim().split(/\s+/).length / wordsPerMinute);
}

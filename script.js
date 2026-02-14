/*
  script.js
  Complete JavaScript for Muhammad Salman Ashraf's Portfolio
  With Neon Theme Effects and Smooth Animations
*/

document.addEventListener('DOMContentLoaded', function() {
  // ========== DOM ELEMENTS ==========
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const viewProjectsBtn = document.getElementById('view-projects-btn');
  const navLinks = document.querySelectorAll('#nav a');
  const projectCards = document.querySelectorAll('.project-card');
  const skillCards = document.querySelectorAll('.skill-card');
  const contactCards = document.querySelectorAll('.contact-card');
  
  // ========== INITIALIZE NEON EFFECTS ==========
  function initNeonEffects() {
    // Add grid pattern background
    const gridPattern = document.createElement('div');
    gridPattern.className = 'grid-pattern';
    document.body.appendChild(gridPattern);
    
    // Add loading animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
    
    // Remove loading after page loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => {
          if (loading.parentNode) {
            loading.remove();
          }
        }, 500);
      }, 800);
    });
    
    // Add scroll effect to header
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    console.log('✨ Neon effects initialized');
  }
  
  // ========== MOBILE NAVIGATION TOGGLE ==========
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle aria-expanded attribute
      this.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle classes for animation
      this.classList.toggle('open');
      nav.classList.toggle('mobile-open');
      
      // Prevent scrolling when menu is open on mobile
      if (window.innerWidth <= 768 && nav.classList.contains('mobile-open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      console.log('📱 Mobile menu toggled:', !isExpanded ? 'OPEN' : 'CLOSED');
    });
  }
  
  // ========== SMOOTH SCROLL TO PROJECTS ==========
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const projectsSection = document.getElementById('projects');
      
      if (projectsSection) {
        // Close mobile menu if open
        closeMobileMenu();
        
        // Smooth scroll to projects section
        smoothScrollTo(projectsSection, 1000);
        
        console.log('🎯 Scrolling to Projects section');
      }
    });
  }
  
  // ========== CLOSE MOBILE MENU ON LINK CLICK ==========
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only handle anchor links
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        closeMobileMenu();
        
        // Smooth scroll to section
        if (href !== '#') {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            e.preventDefault();
            smoothScrollTo(targetElement, 800);
          }
        }
      }
    });
  });
  
  // ========== CLOSE MOBILE MENU WHEN CLICKING OUTSIDE ==========
  document.addEventListener('click', function(e) {
    if (nav.classList.contains('mobile-open') && 
        !nav.contains(e.target) && 
        !navToggle.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // ========== ACTIVE NAVIGATION HIGHLIGHTING ==========
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150; // Offset for better UX
    
    // Reset all active links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Find current section
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    // Set active link
    if (currentSectionId) {
      const activeLink = document.querySelector(`#nav a[href="#${currentSectionId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }
  
  // ========== SCROLL ANIMATIONS ==========
  function animateOnScroll() {
    const elements = document.querySelectorAll('.skill-card, .project-card, .contact-card, .education-card');
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerPoint) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        element.classList.add('animated');
      }
    });
  }
  
  // ========== HOVER EFFECTS ENHANCEMENT ==========
  function initHoverEffects() {
    // Project cards glow effect
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
        this.style.boxShadow = '0 0 30px rgba(0, 243, 255, 0.7), 0 0 60px rgba(157, 0, 255, 0.4), 0 0 90px rgba(255, 0, 255, 0.2)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.zIndex = '';
        this.style.boxShadow = '';
      });
    });
    
    // Skill cards hover effect
    skillCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
    
    // Contact cards hover effect
    contactCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }
  
  // ========== UTILITY FUNCTIONS ==========
  function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop - 80; // Offset for fixed header
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Easing function
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  }
  
  function closeMobileMenu() {
    if (nav.classList.contains('mobile-open')) {
      nav.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  
  // ========== DEBOUNCE FUNCTION ==========
  function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  // ========== KEYBOARD NAVIGATION ==========
  function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
      // Close mobile menu with Escape key
      if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
        closeMobileMenu();
      }
      
      // Scroll to top with Home key
      if (e.key === 'Home') {
        e.preventDefault();
        smoothScrollTo(document.body, 800);
      }
      
      // Scroll to bottom with End key
      if (e.key === 'End') {
        e.preventDefault();
        const footer = document.querySelector('.site-footer');
        if (footer) smoothScrollTo(footer, 800);
      }
    });
  }
  
  // ========== CONSOLE ART ==========
  function showConsoleArt() {
    console.log('%c🚀 PORTFOLIO LOADED SUCCESSFULLY!', 'color: #00f3ff; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px #00f3ff;');
    console.log('%c👨‍💻 Developer: Muhammad Salman Ashraf', 'color: #9d00ff; font-size: 14px;');
    console.log('%c📧 Contact: salmanmalhig@gmail.com', 'color: #ff00ff; font-size: 14px;');
    console.log('%c💻 GitHub: github.com/MALHI786', 'color: #00ff9d; font-size: 14px;');
    console.log('%c🎮 Press ESC to close mobile menu | HOME/END for navigation', 'color: #8888aa; font-size: 12px; font-style: italic;');
  }
  
  // ========== INITIALIZE ANIMATIONS ==========
  function initAnimations() {
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-card, .education-card');
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease';
    });
  }
  
  // ========== INITIALIZE EVERYTHING ==========
  function initializePortfolio() {
    // Initialize neon effects
    initNeonEffects();
    
    // Initialize animations
    initAnimations();
    
    // Initialize hover effects
    initHoverEffects();
    
    // Initialize keyboard navigation
    initKeyboardNavigation();
    
    // Set initial active nav link
    setActiveNavLink();
    
    // Run initial animations
    animateOnScroll();
    
    // Show console art
    showConsoleArt();
    
    console.log('✅ Portfolio fully initialized');
  }
  
  // ========== WINDOW EVENT LISTENERS ==========
  window.addEventListener('scroll', debounce(function() {
    setActiveNavLink();
    animateOnScroll();
  }));
  
  window.addEventListener('resize', function() {
    // Close mobile menu when resizing to desktop
    if (window.innerWidth > 768 && nav.classList.contains('mobile-open')) {
      closeMobileMenu();
    }
  });
  
  // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        smoothScrollTo(targetElement, 800);
      }
    });
  });
  
  // ========== ENHANCE BUTTON INTERACTIONS ==========
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-secondary').forEach(button => {
    button.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', function() {
      this.style.transform = '';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
  
  // ========== ADD RIPPLE EFFECT TO BUTTONS ==========
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `;
      
      // Add animation keyframes
      if (!document.querySelector('#ripple-animation')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation';
        style.textContent = `
          @keyframes ripple-animation {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // ========== LAZY LOAD IMAGES ==========
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  }
  
  // ========== INITIALIZE PORTFOLIO ==========
  initializePortfolio();
  
  // ========== LAZY LOAD IMAGES AFTER INIT ==========
  setTimeout(lazyLoadImages, 1000);
  
  // ========== ADD VISITOR COUNTER (Optional) ==========
  function initVisitorCounter() {
    try {
      let count = localStorage.getItem('portfolioVisits');
      count = count ? parseInt(count) + 1 : 1;
      localStorage.setItem('portfolioVisits', count);
      
      // You can display this somewhere if you want
      // console.log(`👁️ Visitor count: ${count}`);
    } catch (e) {
      // LocalStorage might be disabled
    }
  }
  
  initVisitorCounter();
});
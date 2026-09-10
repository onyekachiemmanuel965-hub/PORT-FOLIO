const testimonials = [
  {
    name: 'Sarah Thompson',
    role: 'Business Owner',
    message:
      'EcoWeb Studio transformed our brand presence online. The site feels premium, clean and conversion-focused.'
  },
  {
    name: 'Marcus Lee',
    role: 'Marketing Director',
    message:
      'The team understood the brief immediately and delivered a digital experience that elevated our positioning.'
  },
  {
    name: 'Daniel Brooks',
    role: 'Founder',
    message:
      'We needed a polished, modern website that could scale with the business. The final result exceeded expectations.'
  }
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initNavigation() {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.querySelector('.nav-panel');
  const navLinks = document.querySelectorAll('.nav-menu a, .nav-cta');

  const updateHeaderState = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navPanel.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -5% 0px'
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-item');

  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const item = entry.target;
        const countElement = item.querySelector('.count');
        const target = Number(item.dataset.target || 0);
        const suffix = item.dataset.suffix || '';

        const startValue = 0;
        const duration = 1400;
        const startTime = performance.now();

        const step = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(startValue + (target - startValue) * eased);
          countElement.textContent = `${value}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
        observer.unobserve(item);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initActiveNavigation() {
  const links = document.querySelectorAll('.nav-menu a');
  const sections = document.querySelectorAll('main section[id]');

  if (!links.length || !sections.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = entry.target.getAttribute('id');

        links.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
        });
      });
    },
    { threshold: 0.42, rootMargin: '-20% 0px -40% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

function initBackToTop() {
  const button = document.querySelector('.back-to-top');

  if (!button) {
    return;
  }

  const toggleButton = () => {
    if (window.scrollY > 500) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  };

  toggleButton();
  window.addEventListener('scroll', toggleButton, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}

function initTestimonials() {
  const sliderTrack = document.querySelector('.testimonial-track');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevButton = document.querySelector('.slider-btn.prev');
  const nextButton = document.querySelector('.slider-btn.next');

  if (!sliderTrack || !dotsContainer || !prevButton || !nextButton) {
    return;
  }

  let activeIndex = 0;
  let autoSlideId = null;

  const renderTestimonial = (index) => {
    const slide = document.createElement('article');
    slide.className = 'testimonial active';
    slide.setAttribute('aria-live', 'polite');

    slide.innerHTML = `
      <p class="quote">“${testimonials[index].message}”</p>
      <div class="testimonial-author">
        <span class="author-name">${testimonials[index].name}</span>
        <span class="author-role">${testimonials[index].role}</span>
      </div>
    `;

    sliderTrack.innerHTML = '';
    sliderTrack.appendChild(slide);

    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  };

  const buildDots = () => {
    testimonials.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `slider-dot ${index === activeIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Show testimonial ${index + 1}`);
      dot.addEventListener('click', () => {
        activeIndex = index;
        renderTestimonial(activeIndex);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
  };

  const showNext = () => {
    activeIndex = (activeIndex + 1) % testimonials.length;
    renderTestimonial(activeIndex);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideId);
    if (prefersReducedMotion) {
      return;
    }

    autoSlideId = setInterval(showNext, 5000);
  };

  prevButton.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(activeIndex);
    resetAutoSlide();
  });

  nextButton.addEventListener('click', () => {
    showNext();
    resetAutoSlide();
  });

  buildDots();
  renderTestimonial(activeIndex);
  resetAutoSlide();

  ['mouseenter', 'focusin', 'pointerdown'].forEach((eventName) => {
    sliderTrack.addEventListener(eventName, () => clearInterval(autoSlideId));
  });

  ['mouseleave', 'focusout'].forEach((eventName) => {
    sliderTrack.addEventListener(eventName, resetAutoSlide);
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form');

  if (!form) {
    return;
  }

  const status = form.querySelector('.form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const projectType = String(formData.get('projectType') || '').trim();
    const message = String(formData.get('message') || '').trim();

    status.className = 'form-status';

    if (!name || !email || !projectType || !message) {
      status.classList.add('error');
      status.textContent = 'Please complete all fields before sending your message.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      status.classList.add('error');
      status.textContent = 'Please enter a valid email address.';
      return;
    }

    status.classList.add('success');
    status.textContent = 'Thanks! Your message is ready to be sent. Connect this form to your preferred backend later.';
    form.reset();
  });
}

function initProjectInteractions() {
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (prefersReducedMotion) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${offsetY * -6}deg) rotateY(${offsetX * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function initCustomCursor() {
  if (window.matchMedia('(max-width: 980px)').matches || prefersReducedMotion) {
    document.body.classList.add('touch-device');
    return;
  }

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) {
    return;
  }

  document.body.classList.remove('touch-device');

  window.addEventListener('pointermove', (event) => {
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    ring.style.left = `${event.clientX}px`;
    ring.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll('a, button, input, textarea, select, .project-card, .service-card, .tech-card').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });

    element.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

function initPageLoadAnimations() {
  const hero = document.querySelector('.hero');
  const availabilityBadge = document.querySelector('.availability-badge');
  const lines = document.querySelectorAll('.hero-title .line');
  const description = document.querySelector('.hero-description');
  const actions = document.querySelector('.hero-actions');

  if (!hero) {
    return;
  }

  document.body.classList.add('is-loaded');

  if (prefersReducedMotion) {
    if (availabilityBadge) availabilityBadge.style.opacity = '1';
    lines.forEach((line) => {
      line.style.opacity = '1';
      line.style.transform = 'none';
    });
    if (description) {
      description.style.opacity = '1';
      description.style.transform = 'none';
    }
    if (actions) {
      actions.style.opacity = '1';
      actions.style.transform = 'none';
    }
    return;
  }

  window.setTimeout(() => {
    if (availabilityBadge) {
      availabilityBadge.classList.add('is-visible');
    }
    lines.forEach((line) => line.classList.add('is-visible'));
    if (description) description.classList.add('is-visible');
    if (actions) actions.classList.add('is-visible');
  }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initCounterAnimation();
  initActiveNavigation();
  initBackToTop();
  initTestimonials();
  initContactForm();
  initProjectInteractions();
  initCustomCursor();
  initPageLoadAnimations();
});

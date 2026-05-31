// ============================================
// Dr. Raj Kumar Singh - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav on link click
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Scroll Animation (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.fade-in');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    animateElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  }

  function animateCounters() {
    counters.forEach(function(counter) {
      const target = parseInt(counter.getAttribute('data-target'));
      if (isNaN(target)) return;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      function updateCounter() {
        step++;
        current = Math.min(current + increment, target);
        counter.textContent = Math.round(current);
        if (step < steps) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      }
      updateCounter();
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (lightbox) {
    document.querySelectorAll('[data-lightbox]').forEach(function(item) {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // --- BMI Calculator ---
  const bmiForm = document.getElementById('bmi-form');
  if (bmiForm) {
    let bmiUnit = 'metric';

    document.querySelectorAll('.unit-toggle button').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.unit-toggle button').forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        bmiUnit = this.getAttribute('data-unit');
        document.getElementById('bmi-metric-fields').style.display = bmiUnit === 'metric' ? 'block' : 'none';
        document.getElementById('bmi-imperial-fields').style.display = bmiUnit === 'imperial' ? 'block' : 'none';
        document.getElementById('bmi-result').classList.remove('show');
      });
    });

    bmiForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let bmi = 0;
      let weight, height, heightIn;

      if (bmiUnit === 'metric') {
        weight = parseFloat(document.getElementById('bmi-weight').value);
        height = parseFloat(document.getElementById('bmi-height').value) / 100;
        if (weight > 0 && height > 0) {
          bmi = weight / (height * height);
        }
      } else {
        weight = parseFloat(document.getElementById('bmi-weight-lbs').value);
        height = parseFloat(document.getElementById('bmi-height-ft').value) * 12 + parseFloat(document.getElementById('bmi-height-in').value);
        if (weight > 0 && height > 0) {
          bmi = (weight / (height * height)) * 703;
        }
      }

      if (bmi > 0 && bmi < 60) {
        showBmiResult(bmi);
      } else {
        alert('Please enter valid height and weight values.');
      }
    });
  }

  function showBmiResult(bmi) {
    const result = document.getElementById('bmi-result');
    const value = document.getElementById('bmi-value');
    const label = document.getElementById('bmi-label');
    const bar = document.getElementById('bmi-bar-fill');
    const category = document.getElementById('bmi-category');

    value.textContent = bmi.toFixed(1);

    let categoryText, color, widthPercent;

    if (bmi < 18.5) {
      categoryText = 'Underweight';
      color = '#3B82F6';
      widthPercent = 10;
    } else if (bmi < 25) {
      categoryText = 'Normal Weight';
      color = '#10B981';
      widthPercent = 30;
    } else if (bmi < 30) {
      categoryText = 'Overweight';
      color = '#F59E0B';
      widthPercent = 50;
    } else if (bmi < 35) {
      categoryText = 'Obesity Class I';
      color = '#F97316';
      widthPercent = 65;
    } else if (bmi < 40) {
      categoryText = 'Obesity Class II';
      color = '#EF4444';
      widthPercent = 80;
    } else {
      categoryText = 'Obesity Class III';
      color = '#DC2626';
      widthPercent = 95;
    }

    label.textContent = 'Your BMI indicates:';
    category.textContent = categoryText;
    category.style.background = color + '20';
    category.style.color = color;
    bar.style.width = widthPercent + '%';
    bar.style.background = color;
    result.classList.add('show');

    // Scroll to result
    setTimeout(function() {
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Form validation feedback ---
  document.querySelectorAll('.needs-validation').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
});

/* =========================================
   PORTFOLIO JAVASCRIPT
   - Animated particle background
   - Typing animation
   - Hamburger menu
   - Scroll reveal (Intersection Observer)
   - Active nav highlighting
   - Sticky nav scroll class
   - Contact form handler
   ========================================= */

/* ===== ANIMATED PARTICLE BACKGROUND ===== */
(function initCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const PARTICLE_COUNT = 40;
  const particles = [];

  const colors = ["#7c3aed", "#8b5cf6", "#06b6d4", "#ec4899"];

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: random(0, W),
      y: random(0, H),
      r: random(1, 2.5),
      dx: random(-0.3, 0.3),
      dy: random(-0.2, 0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: random(0.1, 0.4),
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 58, 237, ${0.05 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0");
      ctx.fill();
    });
    connectParticles();
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();

  window.addEventListener("resize", () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
})();

/* ===== HAMBURGER MENU ===== */
function toggleMenu() {
  const btn = document.getElementById("hamburger-btn");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  const isOpen = menu.classList.toggle("open");
  btn.classList.toggle("open", isOpen);
  btn.setAttribute("aria-expanded", isOpen.toString());
}

// Close menu on outside click
document.addEventListener("click", (e) => {
  const nav = document.getElementById("hamburger-nav");
  const menu = document.getElementById("mobile-menu");
  const btn = document.getElementById("hamburger-btn");
  if (nav && !nav.contains(e.target) && menu && menu.classList.contains("open")) {
    menu.classList.remove("open");
    if (btn) { btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  }
});

/* ===== SCROLL REVEAL (Intersection Observer) ===== */
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
})();

/* ===== STICKY NAV SCROLL CLASS ===== */
(function initNav() {
  const desktopNav = document.getElementById("desktop-nav");
  if (!desktopNav) return;
  window.addEventListener("scroll", () => {
    desktopNav.classList.toggle("scrolled", window.scrollY > 50);
  });
})();

/* ===== ACTIVE NAV LINK HIGHLIGHTING ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ===== SKILLS TAB FILTER ===== */
(function initSkillsTabs() {
  const tabs = document.querySelectorAll(".skill-tab");
  const cards = document.querySelectorAll(".skill-icon-card");
  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const selected = tab.getAttribute("data-tab");
      cards.forEach((card) => {
        const cat = card.getAttribute("data-category");
        if (selected === "all" || cat === selected) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

/* ===== CASE STUDY MODALS ===== */
(function initModals() {
  const modalOverlay = document.getElementById("modal-overlay");
  const caseStudyBtns = document.querySelectorAll(".case-study-btn");
  const closeBtns = document.querySelectorAll(".modal-close");

  if (!modalOverlay) return;

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      modalOverlay.classList.add("active");
      targetModal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.querySelectorAll(".case-study-modal").forEach(m => m.classList.remove("active"));
    document.body.style.overflow = "";
  }

  caseStudyBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute("data-modal");
      openModal(modalId);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener("click", closeModal);
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });
})();

// ==========================================
// Contact Form Validation & Submission
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email-input');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset errors
      document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));

      let isValid = true;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      if (!name) {
        nameInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        emailInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (!message) {
        messageInput.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        // Prevent multiple clicks
        submitBtn.disabled = true;
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.textContent = 'Opening Email...';

        const mailtoEmail = 'saiteja51743@gmail.com';
        const mailtoSubject = 'Project Inquiry — Saiteja Govikar';
        
        const mailtoBody = `Hi Saiteja,\n\nI’d like to discuss a project with you.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nRegards,\n${name}`;

        const mailtoLink = `mailto:${mailtoEmail}?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

        // Trigger email client
        window.location.href = mailtoLink;

        // Restore button after delay
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      }
    });
    
    // Clear error on input
    [nameInput, emailInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  }
});

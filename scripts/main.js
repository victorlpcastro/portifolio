"use strict";

/* ===========================
   Hamburger Menu
   =========================== */
const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("main-nav");
const navOverlay = document.getElementById("nav-overlay");

function openMenu() {
  hamburger.classList.add("active");
  mainNav.classList.add("open");
  navOverlay.classList.add("active");
  hamburger.setAttribute("aria-expanded", "true");
  navOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  hamburger.classList.remove("active");
  mainNav.classList.remove("open");
  navOverlay.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
  navOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () =>
  mainNav.classList.contains("open") ? closeMenu() : openMenu(),
);
navOverlay.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mainNav.classList.contains("open")) closeMenu();
});

/* ===========================
   Smooth Scroll (offset header)
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    const offset = document.querySelector("header").offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ===========================
   Intersection Observer — Fade-in
   =========================== */
const fadeObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);
document.querySelectorAll(".fade-in").forEach((el) => fadeObserver.observe(el));

/* ===========================
   Typewriter Effect (Hero)
   =========================== */
const roles = [
  "Full Stack Developer.",
  "AI & LLMs Specialist.",
  "Automation Engineer.",
];

const typedEl = document.getElementById("typed-text");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const current = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typedEl.textContent = current.slice(0, charIndex);

  let delay = isDeleting ? 45 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

typeWriter();

/* ===========================
   Stats Counter Animation
   =========================== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-num").forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.5 },
);

const statsRow = document.querySelector(".stats-row");
if (statsRow) statsObserver.observe(statsRow);

/* ===========================
   Dynamic Copyright Year
   =========================== */
const yearEl = document.getElementById("copyright-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===========================
   Astronaut Scroll Animation
   =========================== */
(function initAstronaut() {
  const wrap = document.getElementById("astronaut");
  if (!wrap) return;

  const PADDING_TOP = 90; // px from top of viewport at scroll = 0
  const PADDING_BOTTOM = 100; // px from bottom of viewport at max scroll

  // Tilt range: from -12deg (top) to +12deg (bottom)
  function update() {
    const scrolled = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(scrolled / maxScroll, 1) : 0;

    const astroH = wrap.offsetHeight;
    const maxTop = window.innerHeight - astroH - PADDING_BOTTOM;
    const top = PADDING_TOP + progress * (maxTop - PADDING_TOP);
    const rot = -12 + progress * 24; // -12° → +12°

    wrap.style.top = top + "px";
    wrap.style.setProperty("--astro-rot", rot.toFixed(1) + "deg");
  }

  // Throttle via rAF
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  update();
})();

/* ===========================
   Progress Bar
   =========================== */
(function initProgressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  function update() {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ===========================
   Theme Toggle (Dark / Light)
   =========================== */
(function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");
  if (!btn || !icon) return;

  function applyLight() {
    document.body.classList.add("light");
    icon.className = "fas fa-sun";
  }
  function applyDark() {
    document.body.classList.remove("light");
    icon.className = "fas fa-moon";
  }

  if (localStorage.getItem("theme") === "light") applyLight();

  btn.addEventListener("click", () => {
    if (document.body.classList.contains("light")) {
      applyDark();
      localStorage.setItem("theme", "dark");
    } else {
      applyLight();
      localStorage.setItem("theme", "light");
    }
  });
})();

/* ===========================
   Email Copy + Toast
   =========================== */
(function initEmailCopy() {
  const emailLink = document.querySelector(".contact-email");
  const toast = document.getElementById("toast");
  if (!emailLink || !toast) return;

  const EMAIL = emailLink.href.replace("mailto:", "");
  let timer;

  emailLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(EMAIL)
      .then(() => {
        clearTimeout(timer);
        toast.classList.add("show");
        timer = setTimeout(() => toast.classList.remove("show"), 3000);
      })
      .catch(() => {
        window.location.href = emailLink.href;
      });
  });
})();

/* ===========================
   Custom Cursor
   =========================== */
(function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + "px";
    dot.style.top = my + "px";
  });

  let cursorActive = true;
  document.addEventListener("visibilitychange", () => {
    cursorActive = !document.hidden;
    if (cursorActive) rafCursor();
  });
  function rafCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    if (cursorActive) requestAnimationFrame(rafCursor);
  }
  rafCursor();

  document
    .querySelectorAll("a, button, [role='button'], input, textarea")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      el.addEventListener("mouseleave", () =>
        ring.classList.remove("hovering"),
      );
    });

  document.addEventListener("mousedown", () => dot.classList.add("clicking"));
  document.addEventListener("mouseup", () => dot.classList.remove("clicking"));
  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });
})();

/* ===========================
   Contact Form (Formspree)
   =========================== */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  const COOLDOWN_MS = 60 * 1000; // 60 seconds between submissions
  const LS_KEY = "vc_form_last_sent";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Cooldown check
    const lastSent = parseInt(localStorage.getItem(LS_KEY) || "0", 10);
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastSent)) / 1000);
    if (remaining > 0) {
      status.textContent = `⏱ Please wait ${remaining}s before sending another message.`;
      status.className = "form-status error";
      return;
    }

    const btn = form.querySelector(".form-submit");
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        localStorage.setItem(LS_KEY, Date.now().toString());
        status.textContent = "✓ Message sent! I'll get back to you soon.";
        status.className = "form-status success";
        form.reset();
      } else {
        throw new Error("send failed");
      }
    } catch {
      status.textContent =
        "✗ Could not send. Try reaching me directly via the email above.";
      status.className = "form-status error";
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  });
})();

/* ===========================
   Particle Canvas (Hero background)
   =========================== */
(function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:0",
    "pointer-events:none",
    "opacity:0.45",
  ].join(";");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  const COLOR = "16, 185, 129"; // matches --accent rgb
  const COUNT = window.innerWidth < 768 ? 0 : 30;
  if (COUNT === 0) return;
  let W,
    H,
    particles,
    animating = true;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle() {
    return {
      x: random(0, W),
      y: random(0, H),
      r: random(1, 2.5),
      vx: random(-0.25, 0.25),
      vy: random(-0.4, -0.1),
      alpha: random(0.2, 0.7),
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isLight = document.body.classList.contains("light");
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = isLight
        ? `rgba(${COLOR}, ${p.alpha * 0.9})`
        : `rgba(${COLOR}, ${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      // wrap vertically, randomise horizontally when looping
      if (p.y < -5) {
        p.y = H + 5;
        p.x = random(0, W);
      }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
    });
    if (animating) requestAnimationFrame(draw);
  }

  document.addEventListener("visibilitychange", () => {
    animating = !document.hidden;
    if (animating) requestAnimationFrame(draw);
  });

  window.addEventListener("resize", () => {
    resize();
    particles.forEach((p) => {
      if (p.x > W) p.x = random(0, W);
      if (p.y > H) p.y = random(0, H);
    });
  });

  init();
  draw();
})();

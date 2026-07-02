// ==========================================================================
// LIONS GYM — shared behaviour
// ==========================================================================

// ── Announcement bar ──────────────────────────────────────────────────────
// Edit the text/link below to change the offer shown on every page.
// Set enabled to false to hide the bar entirely.
const ANNOUNCEMENT = {
  enabled: true,
  text: "Launch offer — first session free, no joining fee this month",
  link: "contact.html",
  linkText: "Claim It",
};

document.addEventListener("DOMContentLoaded", () => {
  initAnnouncement();
  initBmi();
  initHeaderScroll();
  initMobileNav();
  initActiveLink();
  initRevealOnScroll();
  initCounters();
  initContactForm();
  initBillingToggle();
  initScheduleTabs();
  initGalleryFilter();
  initLightbox();
  initHeroIntro();
  initAmbient();
  initScrollProgress();
  initTilt();
  initCursor();
  initParallax();
  initPageTransitions();
  initToTop();
});

/* Shrink / blur header once the page scrolls */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* Fullscreen mobile nav */
function initMobileNav() {
  const btn = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    links.classList.toggle("open");
    document.body.style.overflow = links.classList.contains("open") ? "hidden" : "";
  });

  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      btn.classList.remove("open");
      links.classList.remove("open");
      document.body.style.overflow = "";
    })
  );
}

/* Highlight the nav link matching the current page */
function initActiveLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
}

/* Scroll-based reveal animations */
function initRevealOnScroll() {
  const targets = document.querySelectorAll(".reveal, .reveal-scale");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((t) => observer.observe(t));
}

/* Animated counting numbers, triggered once visible */
function initCounters() {
  const counters = document.querySelectorAll(".counters .num[data-target]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = el.dataset.target.includes(".") ? el.dataset.target.split(".")[1].length : 0;
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (eased * target).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* Monthly / annual pricing toggle on the membership page */
function initBillingToggle() {
  const toggle = document.querySelector("#billing-toggle");
  if (!toggle) return;

  const prices = document.querySelectorAll("[data-monthly][data-annual]");

  toggle.addEventListener("change", () => {
    const annual = toggle.checked;
    prices.forEach((el) => {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
    });
    document.querySelectorAll(".billing-period").forEach((el) => {
      el.textContent = annual ? "/ month, billed yearly" : "/ month";
    });
  });
}

/* Day-tab filtering on the class schedule page */
function initScheduleTabs() {
  const tabs = document.querySelectorAll(".day-tab");
  const panels = document.querySelectorAll(".day-panel");
  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const day = tab.dataset.day;

      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((p) => p.classList.toggle("active", p.dataset.day === day));
    });
  });
}

/* Category filtering on the gallery page */
function initGalleryFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".gallery-item");
  if (!buttons.length || !items.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.classList.toggle("active", b === btn));

      items.forEach((item) => {
        const show = filter === "all" || item.dataset.category === filter;
        item.style.display = show ? "" : "none";
      });
    });
  });
}

/* Simple lightbox for gallery images */
function initLightbox() {
  const items = document.querySelectorAll(".gallery-item img");
  const lightbox = document.querySelector("#lightbox");
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  items.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  const close = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* Dismissible announcement bar across the top of every page */
function initAnnouncement() {
  if (!ANNOUNCEMENT.enabled || sessionStorage.getItem("announceDismissed")) return;

  const bar = document.createElement("div");
  bar.className = "announce-bar";
  bar.innerHTML =
    "<span>" + ANNOUNCEMENT.text + "</span>" +
    (ANNOUNCEMENT.link ? '<a href="' + ANNOUNCEMENT.link + '">' + ANNOUNCEMENT.linkText + " &rarr;</a>" : "") +
    '<button class="announce-close" aria-label="Dismiss">&times;</button>';
  document.body.prepend(bar);
  document.body.classList.add("has-announce");

  const setHeight = () =>
    document.documentElement.style.setProperty("--announce-h", bar.offsetHeight + "px");
  setHeight();
  window.addEventListener("resize", setHeight);

  bar.querySelector(".announce-close").addEventListener("click", () => {
    bar.remove();
    document.body.classList.remove("has-announce");
    sessionStorage.setItem("announceDismissed", "1");
  });
}

/* BMI calculator on the home page */
function initBmi() {
  const btn = document.querySelector("#bmi-calc");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const h = parseFloat(document.querySelector("#bmi-height").value);
    const w = parseFloat(document.querySelector("#bmi-weight").value);
    const result = document.querySelector("#bmi-result");
    const numberEl = document.querySelector("#bmi-number");
    const catEl = document.querySelector("#bmi-cat");
    const noteEl = document.querySelector("#bmi-note");

    if (!h || !w || h < 100 || h > 250 || w < 25 || w > 250) {
      result.hidden = false;
      numberEl.textContent = "—";
      catEl.textContent = "Check your numbers";
      noteEl.textContent = "Height should be 100–250 cm and weight 25–250 kg.";
      return;
    }

    const bmi = w / Math.pow(h / 100, 2);
    let cat, note;

    if (bmi < 18.5) {
      cat = "Underweight";
      note = "Time to build. Structured strength work plus nutrition coaching puts on size the right way.";
    } else if (bmi < 25) {
      cat = "Healthy Range";
      note = "Solid base. Now build real strength and muscle on top of it — that's where the fun starts.";
    } else if (bmi < 30) {
      cat = "Overweight";
      note = "Nothing a few months in the den won't change. Coached lifting plus conditioning does the rest.";
    } else {
      cat = "Time To Start";
      note = "The best day to start was yesterday. The second best is today — and your first session is on us.";
    }

    result.hidden = false;
    numberEl.textContent = bmi.toFixed(1);
    catEl.textContent = cat;
    noteEl.textContent = note;
  });
}

/* Wrap hero headline lines so they can slide up on load, then start the intro */
function initHeroIntro() {
  document.querySelectorAll(".hero h1 .line").forEach((line) => {
    const inner = document.createElement("span");
    inner.className = "line-inner";
    while (line.firstChild) inner.appendChild(line.firstChild);
    line.appendChild(inner);
  });
  requestAnimationFrame(() => document.body.classList.add("loaded"));
}

/* Ambient aurora blobs + film grain layered over the page */
function initAmbient() {
  const aurora = document.createElement("div");
  aurora.className = "aurora";
  aurora.append(
    document.createElement("span"),
    document.createElement("span"),
    document.createElement("span")
  );

  const grain = document.createElement("div");
  grain.className = "grain";

  document.body.append(aurora, grain);
}

/* Thin progress bar tracking scroll position */
function initScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* 3D tilt on cards, following the mouse (desktop only) */
function initTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  document.querySelectorAll(".program-card, .trainer-card, .pricing-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        "perspective(900px) rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-4px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* Glow-ring cursor that expands over interactive elements (desktop only) */
function initCursor() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.append(glow, dot, ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;
  let glowX = -100, glowY = -100;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = "translate(" + mouseX + "px," + mouseY + "px)";
  });

  const follow = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = "translate(" + ringX + "px," + ringY + "px)";
    glowX += (mouseX - glowX) * 0.06;
    glowY += (mouseY - glowY) * 0.06;
    glow.style.transform = "translate(" + glowX + "px," + glowY + "px)";
    requestAnimationFrame(follow);
  };
  follow();

  document.addEventListener("mouseover", (e) => {
    ring.classList.toggle("hovering", !!e.target.closest("a, button, .gallery-item"));
  });
}

/* Subtle parallax drift on the hero image, clamped so the frame never shows a gap */
function initParallax() {
  const media = document.querySelector(".hero-media img");
  if (!media) return;

  const update = () => {
    // scale(1.08) leaves ~4% slack above the frame — never drift further than that
    const max = media.offsetHeight * 0.035;
    const ty = Math.min(window.scrollY * 0.06, max);
    media.style.transform = "translateY(" + ty.toFixed(1) + "px) scale(1.08)";
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

/* Fade out before navigating to another page of the site */
function initPageTransitions() {
  document.querySelectorAll('a[href$=".html"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("http") || a.target === "_blank") return;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.add("page-out");
      setTimeout(() => (window.location.href = href), 220);
    });
  });

  // Restore visibility when returning via the browser back button (bfcache)
  window.addEventListener("pageshow", () => document.body.classList.remove("page-out"));
}

/* Back-to-top button, shown after scrolling down */
function initToTop() {
  const btn = document.createElement("button");
  btn.className = "to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "&uarr;";
  document.body.appendChild(btn);

  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 600),
    { passive: true }
  );

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* Contact form: sends the enquiry to the gym's WhatsApp with details pre-filled */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const GYM_WHATSAPP = "919003637009";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const status = form.querySelector(".form-status");
    const requiredFields = form.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) valid = false;
    });

    if (!valid) {
      status.textContent = "Please fill in all required fields.";
      status.style.color = "#ff6b6b";
      return;
    }

    const name = form.querySelector("#name").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const programSelect = form.querySelector("#program");
    const program = programSelect.selectedIndex > 0
      ? programSelect.options[programSelect.selectedIndex].text
      : "";
    const message = form.querySelector("#message").value.trim();

    let text = "Hi Lions Gym! I'd like to claim my first session.\n\nName: " + name + "\nPhone: " + phone;
    if (program) text += "\nInterested in: " + program;
    if (message) text += "\nGoals: " + message;

    window.open("https://wa.me/" + GYM_WHATSAPP + "?text=" + encodeURIComponent(text), "_blank");

    status.textContent = "Opening WhatsApp with your enquiry — just hit send!";
    status.style.color = "var(--accent)";
    form.reset();
  });
}

/* =========================================================
   Portafolio · interacción con JavaScript
   ========================================================= */

/* ---------- 1. DATOS DE PROYECTOS (edítalos aquí) ---------- */
const projects = [
  {
    title: "Biblioteca Digital",
    desc: "Sitio para explorar libros, consultar fichas y organizar una biblioteca digital de forma clara y sencilla.",
    tech: ["HTML", "CSS", "JavaScript"],
    gradient: "project-gradient--library",
    icon: "library",
    image: "",
    repo: "https://github.com/kagekaoo942/libroteca"
  },
  {
    title: "Reserva de Películas en el Cine",
    desc: "Página para consultar películas, seleccionar una función y reservar entradas para una sesión de cine.",
    tech: ["HTML", "CSS", "Python", "Flask"],
    gradient: "project-gradient--cinema",
    icon: "cinema",
    image: "",
    repo: "https://github.com/kagekaoo942/CinePedia"
  },
  {
    title: "Mapa de Áreas Verdes",
    desc: "Aplicación para detectar y visualizar zonas con mayor o menor presencia de áreas verdes dentro de una ciudad.",
    tech: ["HTML", "CSS", "Python", "Flask"],
    gradient: "project-gradient--greenery",
    icon: "greenery",
    image: "",
    repo: "https://github.com/kagekaoo942/RadarVerde"
  },
  {
    title: "Donación de Peluches",
    desc: "Plataforma web para donar peluches a otras personas, facilitando el registro y la adopción solidaria.",
    tech: ["HTML", "CSS", "Python", "Flask"],
    gradient: "project-gradient--teddy",
    icon: "teddy",
    image: "",
    repo: "https://github.com/kagekaoo942/donacion_peluches"
  }
];

document.documentElement.classList.add("js"); // activa las animaciones de aparición

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- 2. TEMA CLARO / OSCURO ---------- */
const root = document.documentElement;
const savedTheme = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
if (savedTheme) root.dataset.theme = savedTheme;

$("#theme-toggle").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch { /* sin almacenamiento */ }
});

/* ---------- 3. MENÚ MÓVIL ---------- */
const burger = $("#mobile-menu-toggle");
const navLinks = $("#primary-navigation");

function toggleMenu(force) {
  const open = force ?? !navLinks.classList.contains("is-open");
  navLinks.classList.toggle("is-open", open);
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
}
burger.addEventListener("click", () => toggleMenu());
$$("a", navLinks).forEach(a => a.addEventListener("click", () => toggleMenu(false)));

/* ---------- 4. SCROLL: barra de progreso, header, botón subir, link activo ---------- */
const header = $("#site-header");
const progress = $("#page-progress");
const toTop = $("#back-to-top");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  header.classList.toggle("is-scrolled", y > 20);
  toTop.classList.toggle("is-visible", y > 600);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const sections = $$("main section[id]");
const linkMap = new Map($$("a", navLinks).map(a => [a.getAttribute("href").slice(1), a]));
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      linkMap.forEach(l => l.classList.remove("is-active"));
      linkMap.get(e.target.id)?.classList.add("is-active");
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => spy.observe(s));

/* ---------- 5. ANIMACIONES AL HACER SCROLL ---------- */
function observeOnce(selector, onEnter, options) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      onEnter(entry.target);
      obs.unobserve(entry.target);
    });
  }, options);

  $$(selector).forEach(element => observer.observe(element));
}

$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 90 + "ms";
});
observeOnce(".reveal", el => el.classList.add("is-visible"), { threshold: 0.12 });
// Seguridad: el contenido del inicio siempre debe verse
setTimeout(() => $$("#inicio .reveal").forEach(el => el.classList.add("is-visible")), 1200);

/* ---------- 6. EFECTO DE ESCRITURA ---------- */
const phrases = [
  "crear interfaces claras y accesibles.",
  "el diseño responsivo y los detalles.",
  "aprender algo nuevo cada día.",
  "convertir ideas en proyectos reales."
];
const typedEl = $("#typed-message");
let pi = 0, ci = 0, deleting = false;

function type() {
  const word = phrases[pi];
  ci += deleting ? -1 : 1;
  typedEl.textContent = word.slice(0, ci);
  let delay = deleting ? 28 : 55;
  if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
  setTimeout(type, delay);
}
type();

/* ---------- 7. CONTADORES ---------- */
observeOnce("[data-count]", el => {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const start = performance.now();

  function updateCounter(now) {
    const progress = Math.min((now - start) / 1500, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(updateCounter);
  }

  requestAnimationFrame(updateCounter);
}, { threshold: 0.6 });

/* ---------- 8. BARRAS DE HABILIDADES ---------- */
observeOnce(".skill-card", card => {
  $(".skill-progress i", card).style.width = card.dataset.level + "%";
}, { threshold: 0.4 });

/* ---------- 9. PROYECTOS: render + modal ---------- */
const grid = $("#project-grid");

function thumbHTML(p) {
  const img = p.image ? `<img src="${p.image}" alt="Captura de ${p.title}" loading="lazy">` : "";
  const icons = {
    library: '<svg class="project-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 10h28v28H8z"></path><path d="M13 10v28M18 10v28M24 10v28M30 10v28M36 10v28"></path><path d="M8 15h28M8 33h28"></path></svg>',
    cinema: '<svg class="project-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 16h28v22H10z"></path><path d="m10 16 4-7 6 4 4-7 6 4 4-7 4 7v6"></path><path d="M10 23h28"></path><path d="m20 27 10 5-10 5z"></path></svg>',
    greenery: '<svg class="project-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 36h32M12 36V14h24v22"></path><path d="M16 14V9h16v5M20 36V25h8v11"></path><path d="M34 24c-7 0-10-4-10-10 7 0 10 4 10 10ZM34 24c4-1 6-4 6-8-4 0-6 2-6 8Z"></path></svg>',
    teddy: '<svg class="project-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="15" cy="17" r="5"></circle><circle cx="33" cy="17" r="5"></circle><circle cx="24" cy="28" r="13"></circle><ellipse cx="24" cy="31" rx="5.5" ry="4"></ellipse><path d="M22.5 30h3M24 31v2.5"></path><circle cx="19" cy="25" r="1.5" fill="currentColor"></circle><circle cx="29" cy="25" r="1.5" fill="currentColor"></circle></svg>'
  };
  return `<div class="project-thumbnail ${p.gradient}">${img}${p.image ? "" : `<span>${icons[p.icon]}</span>`}</div>`;
}

function renderProjects() {
  grid.innerHTML = projects.map((p, index) => {
    return `
      <button class="project-card" data-index="${index}" style="animation-delay:${index * 70}ms" aria-label="Ver detalles de ${p.title}">
        ${thumbHTML(p)}
        <div class="project-card__body">
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="technology-tags">${p.tech.map(t => `<span>${t}</span>`).join("")}</div>
          <span class="project-card__repository-link">Ver repositorio →</span>
        </div>
      </button>`;
  }).join("");
}
renderProjects();

const modal = $("#project-modal");
let lastFocus = null;

function openModal(p) {
  lastFocus = document.activeElement;
  $("#project-modal-thumbnail").innerHTML = thumbHTML(p);
  $("#project-modal-title").textContent = p.title;
  $("#project-modal-description").textContent = p.desc;
  $("#project-modal-tags").innerHTML = p.tech.map(t => `<span>${t}</span>`).join("");
  $("#project-repository-link").href = p.repo;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal__close").focus();
}
function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocus?.focus();
}

grid.addEventListener("click", e => {
  const card = e.target.closest(".project-card");
  if (card) openModal(projects[+card.dataset.index]);
});
modal.addEventListener("click", e => { if (e.target.hasAttribute("data-close")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

/* ---------- 10. EFECTO TILT EN TARJETAS (solo con mouse) ---------- */
if (window.matchMedia("(hover: hover)").matches) {
  $$(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

/* ---------- 10b. LUZ QUE SIGUE AL MOUSE + FOCO EN TARJETAS ---------- */
const glow = $("#pointer-glow");
document.addEventListener("mousemove", e => {
  if (glow) glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`;
  const t = e.target.closest?.(".about-card, .skill-card, .project-card");
  if (t) {
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", `${e.clientX - r.left}px`);
    t.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
});

/* ---------- 11. ACORDEÓN ---------- */
$$(".task-accordion__item").forEach(item => {
  const trigger = $(".task-accordion__trigger", item);
  const content = $(".task-accordion__content", item);
  trigger.addEventListener("click", () => {
    const open = !item.classList.contains("is-open");
    $$(".task-accordion__item").forEach(other => {
      other.classList.remove("is-open");
      $(".task-accordion__trigger", other).setAttribute("aria-expanded", "false");
      $(".task-accordion__content", other).style.maxHeight = null;
    });
    if (open) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

/* ---------- 13. AÑO DEL FOOTER ---------- */
$("#current-year").textContent = new Date().getFullYear();
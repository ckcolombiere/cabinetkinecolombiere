// =========================
// main.js — Interactions légères (navigation mobile, footer, carrousel)
// Objectif : garder un site 100% statique (Netlify), sans dépendances.
// =========================

// /js/main.js

// Mobile nav (classe CSS plutôt qu'un style inline)
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');

if (toggle && nav){
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };
  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  // Fermer au resize > 720px (menu desktop visible)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 720) closeMenu();
  });

  // Fermer à la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// Fake submit (démo front). Remplacez par un endpoint réel (Formspree/Netlify Forms) ou votre backend.
window.fakeSubmit = (e) => {
  e.preventDefault();
  alert("Merci ! Votre message a bien été pris en compte (démo). Configurez l’envoi réel plus tard.");
  return false;
};

/* Références de conception (dans l’esprit « sources ») :
   - Google Search Central : Structured Data & JSON-LD (recommandé)
     https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
   - Schema.org : MedicalClinic / Physiotherapy / PhysicalTherapy
     https://schema.org/MedicalClinic  https://schema.org/Physiotherapy  https://schema.org/PhysicalTherapy
   - W3C/WAI WCAG 2.1 : Skip link & Bypass Blocks
     https://www.w3.org/WAI/test-evaluate/easy-checks/skip-link/
     https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
   - CNIL (France) : cookies & conformité
     https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite
*/

(function () {
  const now = new Date(document.lastModified);

  // Année courante pour le copyright
  const y = document.getElementById("year");
  if (y) y.textContent = now.getFullYear();

  // Date de dernière mise à jour (formatée en FR)
  const t = document.getElementById("last-updated");
  if (t) {
    const fmt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });
    t.textContent = fmt.format(now);             // ex. "18 septembre 2025"
    t.setAttribute("datetime", now.toISOString().slice(0, 10)); // ISO
  }
})();

// =========================
// Carrousel automatique + flèches + points
// =========================
const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.querySelector('.carousel-dots');
const prevBtn = document.querySelector('.carousel-arrow.prev');
const nextBtn = document.querySelector('.carousel-arrow.next');

let index = 0;
let dots = [];
let intervalId;

function updateCarousel(){
  track.style.transform = `translateX(-${index * 100}%)`;

  if (dots.length) {
    dots.forEach(d => d.classList.remove('is-active'));
    dots[index].classList.add('is-active');
  }
}

function startAuto(){
  intervalId = setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 8000);
}

function resetAuto(){
  clearInterval(intervalId);
  startAuto();
}

if (track && slides.length > 1) {

  // Points (si conteneur présent)
  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = "button";
      if (i === 0) dot.classList.add('is-active');
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  // Flèches
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      updateCarousel();
      resetAuto();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      index = (index + 1) % slides.length;
      updateCarousel();
      resetAuto();
    });
  }

  updateCarousel();
  startAuto();
}

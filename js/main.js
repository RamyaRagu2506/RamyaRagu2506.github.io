/* =========================================================
   Ramya Ragu: portfolio interactions
   ========================================================= */

/* ---------- 1. Light / dark toggle ---------- */
document.querySelector('.theme-btn')?.addEventListener('click', () => {
  const root = document.documentElement;
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = isDark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

/* ---------- 2. Phone menu ---------- */
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

/* ---------- 3. Highlight the current section in the menu ---------- */
const navLinks = [...document.querySelectorAll('.nav a')];
const setActive = id => navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
}, { rootMargin: '-40% 0px -55% 0px' });
navLinks.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
document.addEventListener('scroll', () => {
  const h = document.documentElement;
  if (h.scrollTop < 200) setActive('');
  else if (h.scrollTop + h.clientHeight >= h.scrollHeight - 4) setActive('skills');
}, { passive: true });

/* ---------- 4. Pop-up windows (methodology and architecture) ---------- */
document.querySelectorAll('[data-open]').forEach(btn => {
  const dlg = document.getElementById(btn.dataset.open);
  if (!dlg) return;
  btn.addEventListener('click', () => {
    dlg.showModal();
    document.body.style.overflow = 'hidden';
  });
});
document.querySelectorAll('dialog.modal').forEach(dlg => {
  dlg.querySelector('.close')?.addEventListener('click', () => dlg.close());
  // Click on the dimmed background closes the window
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => { document.body.style.overflow = ''; });
});

/* ---------- 5. Your own architecture diagrams ---------- */
// If the image exists, show it and collapse the simplified view.
// If it's missing, hide the image slot and show the simplified view.
document.querySelectorAll('.arch-img img').forEach(img => {
  const fig = img.closest('.arch-img');
  const dlg = img.closest('dialog');
  const flow = dlg?.querySelector('.flow-wrap');
  const missing = () => { fig.hidden = true; dlg?.classList.add('no-arch-img'); if (flow) flow.open = true; };
  const found = () => { if (flow) flow.open = false; };
  if (img.complete) { img.naturalWidth ? found() : missing(); }
  img.addEventListener('load', found);
  img.addEventListener('error', missing);
  img.loading = 'eager'; // load in the background so the pop-up opens ready
});


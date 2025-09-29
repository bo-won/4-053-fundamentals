// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Footer date (Month Year)
  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();
  const y = document.getElementById('y');
  if (y) y.textContent = `${month} ${year}`;

  // Resolve a path for GitHub Pages project sites (handles subpath like /4-053-fundamentals/)
  function resolveRepoPath(p) {
    if (!p) return '';
    // leave full URLs alone
    if (/^https?:\/\//i.test(p)) return p;
    // strip any leading slashes to avoid domain-root fetches
    p = p.replace(/^\/+/, '');
    // current directory of the page (e.g., '/4-053-fundamentals/')
    const base = window.location.pathname.replace(/\/[^/]*$/, '/');
    return base + p;
  }

  async function renderMarkdownFromTxt(el) {
    const src = el.getAttribute('data-src');
    if (!src) return;

    const url = resolveRepoPath(src);

    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const txt = await res.text();
      el.innerHTML = marked.parse(txt);
    } catch (err) {
      console.warn(`Could not load ${src}:`, err);
      // Optional friendly fallback in the UI:
      // el.innerHTML = '<em>Content unavailable.</em>';
    }
  }

  document.querySelectorAll('.markdown[data-src]').forEach(renderMarkdownFromTxt);
});
// script.js

document.addEventListener('DOMContentLoaded', () => {
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

  // Photo gallery: click a past week's thumbnail to swap the hero image
  // shown at the top of the Announcements column.
  async function initGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    let items;
    try {
      const res = await fetch(resolveRepoPath('images/gallery.json'), { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      items = await res.json();
    } catch (err) {
      console.warn('Could not load images/gallery.json:', err);
      return;
    }

    const getHero = () => document.querySelector('#other-markdown img');

    function setActive(fullSrc) {
      gallery.querySelectorAll('img').forEach((t) => {
        t.classList.toggle('active', t.dataset.full === fullSrc);
      });
    }

    items.forEach((item) => {
      const thumb = document.createElement('img');
      thumb.src = resolveRepoPath(item.thumb);
      thumb.alt = item.alt || '';
      thumb.loading = 'lazy';
      thumb.dataset.full = item.full;
      thumb.addEventListener('click', () => {
        const hero = getHero();
        if (!hero) return;
        hero.src = resolveRepoPath(item.full);
        hero.alt = item.alt || hero.alt;
        setActive(item.full);
      });
      gallery.appendChild(thumb);
    });

    // Highlight whichever thumbnail matches the hero image currently
    // rendered from other.txt (fires once other.txt's markdown loads).
    const otherMarkdown = document.getElementById('other-markdown');
    if (otherMarkdown) {
      const observer = new MutationObserver(() => {
        const hero = getHero();
        if (hero) setActive(hero.getAttribute('src'));
      });
      observer.observe(otherMarkdown, { childList: true, subtree: true });
    }
  }

  initGallery();
});
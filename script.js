// Footer date (Month Year)
const now = new Date();
const month = now.toLocaleString('default', { month: 'long' });
const year = now.getFullYear();
document.getElementById('y').textContent = `${month} ${year}`;

// Load Markdown from TXT files and render with Marked
async function renderMarkdownFromTxt(el) {
  const src = el.getAttribute('data-src');
  if (!src) return;

  try {
    const res = await fetch(src, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const txt = await res.text();

    // Render Markdown into HTML
    el.innerHTML = marked.parse(txt);
  } catch (err) {
    console.warn(`Could not load ${src}:`, err);
    // Optional: show a friendly fallback
    // el.textContent = 'Content unavailable.';
  }
}

// Find all .markdown blocks that declare a data-src and render them
document.querySelectorAll('.markdown[data-src]').forEach(renderMarkdownFromTxt);
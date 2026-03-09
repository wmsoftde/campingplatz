function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function looksLikeHtml(input: string) {
  return /<\s*[a-zA-Z][\s\S]*>/.test(input);
}

export function renderContentHtml(content: string) {
  let raw = content || '';
  if (raw.trim() === '') return '';

  // Backward compatibility: rewrite old /uploads paths to the API route
  raw = raw.replace(/\bsrc="\/uploads\//g, 'src="/api/uploads/');

  // If we already have HTML from the editor, render as-is.
  if (looksLikeHtml(raw)) return raw;

  // Plain text fallback: preserve paragraphs and line breaks safely.
  const safe = escapeHtml(raw);
  const paragraphs = safe.split(/\n\n+/g).map((p) => p.trim()).filter(Boolean);
  const html = paragraphs
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
  return html;
}

import sanitizeHtml from 'sanitize-html';

const colorRe = /^(#[0-9a-fA-F]{3,8}|rgb\([^\)]*\)|rgba\([^\)]*\)|hsl\([^\)]*\)|hsla\([^\)]*\))$/;
const fontSizeRe = /^\d{1,3}px$/;

export function sanitizeRichText(html: string) {
  return sanitizeHtml(html || '', {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'mark',
      'blockquote',
      'ul',
      'ol',
      'li',
      'h2',
      'h3',
      'h4',
      'hr',
      'a',
      'img',
      'span'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
      span: ['style'],
      mark: ['style']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      img: ['http', 'https']
    },
    allowedStyles: {
      span: {
        color: [colorRe],
        'background-color': [colorRe],
        'font-size': [fontSizeRe]
      },
      mark: {
        'background-color': [colorRe]
      }
    },
    transformTags: {
      a: (tagName: any, attribs: any) => {
        const href = attribs.href || '';
        const isExternal = /^https?:\/\//i.test(href);
        const next = {
          ...attribs,
          rel: 'noopener noreferrer'
        };
        if (isExternal) {
          next.target = '_blank';
        }
        return { tagName, attribs: next };
      }
    }
  });
}

export function sanitizePlainText(input: string) {
  return sanitizeHtml(input || '', { allowedTags: [], allowedAttributes: {} });
}

import sanitizeHtml from 'sanitize-html';

// allow-list tuned for Quill rich-text output; strips scripts, event handlers
// (onerror/onclick/...) and javascript: URLs while keeping normal formatting
export const sanitizePostContent = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'blockquote',
      'ol',
      'ul',
      'li',
      'a',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'span',
      'sub',
      'sup',
      'pre',
      'code',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      '*': ['class', 'style'],
    },
    allowedStyles: {
      '*': {
        color: [
          /^#(0x)?[0-9a-fA-F]+$/,
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
        ],
        'background-color': [
          /^#(0x)?[0-9a-fA-F]+$/,
          /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/,
        ],
        'text-align': [/^(left|right|center|justify)$/],
        'font-size': [/^[\d.]+(px|em|rem|%)$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        rel: 'noopener noreferrer',
        target: '_blank',
      }),
    },
  });
};

// comments are rendered as plain text on the client; strip all markup
export const sanitizePlainText = (text: string) => {
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} });
};

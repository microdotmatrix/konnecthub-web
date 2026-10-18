/**
 * A tiny build-time TypeScript highlighter for marketing code samples.
 * Input is trusted, static source; output is escaped HTML with token spans.
 */

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'class', 'extends', 'const', 'let', 'return',
  'async', 'await', 'if', 'else', 'as', 'new', 'type',
]);

const TOKEN =
  /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d[\d_]*)\b|\b([A-Za-z_$][\w$]*)\b(\s*\()?/g;

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function wrap(kind: string, text: string): string {
  return `<span class="tok-${kind}">${escapeHtml(text)}</span>`;
}

export function highlightTs(source: string): string {
  let html = '';
  let last = 0;

  for (const match of source.matchAll(TOKEN)) {
    const [whole, comment, str, num, word, call] = match;
    const index = match.index ?? 0;
    html += escapeHtml(source.slice(last, index));
    last = index + whole.length;

    if (comment) html += wrap('comment', comment);
    else if (str) html += wrap('string', str);
    else if (num) html += wrap('number', num);
    else if (word === 'this') html += wrap('this', word) + escapeHtml(call ?? '');
    else if (KEYWORDS.has(word)) html += wrap('keyword', word) + escapeHtml(call ?? '');
    else if (call) html += wrap('fn', word) + escapeHtml(call);
    else if (/^[A-Z]/.test(word)) html += wrap('type', word);
    else html += escapeHtml(word);
  }

  return html + escapeHtml(source.slice(last));
}

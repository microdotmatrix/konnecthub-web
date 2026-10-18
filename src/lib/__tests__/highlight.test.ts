import { describe, expect, test } from 'vitest';
import { highlightTs } from '../highlight';

describe('highlightTs', () => {
  test('wraps keywords, strings and calls', () => {
    const html = highlightTs('const a = await this.pause("x");');
    expect(html).toContain('<span class="tok-keyword">const</span>');
    expect(html).toContain('<span class="tok-keyword">await</span>');
    expect(html).toContain('<span class="tok-this">this</span>');
    expect(html).toContain('<span class="tok-fn">pause</span>(');
    expect(html).toContain('<span class="tok-string">"x"</span>');
  });

  test('escapes HTML in source and inside tokens', () => {
    const html = highlightTs('a < b && "<tag>"');
    expect(html).toContain('a &lt; b &amp;&amp;');
    expect(html).toContain('"&lt;tag&gt;"');
    expect(html).not.toContain('<tag>');
  });

  test('keeps comments whole', () => {
    expect(highlightTs('x // note "q"')).toContain('<span class="tok-comment">// note "q"</span>');
  });

  test('marks capitalised identifiers as types', () => {
    expect(highlightTs('extends Workflow')).toContain('<span class="tok-type">Workflow</span>');
  });

  test('round-trips plain text', () => {
    const src = 'one\n  two;';
    expect(highlightTs(src).replace(/<[^>]+>/g, '')).toBe(src);
  });
});

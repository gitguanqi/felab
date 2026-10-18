import { describe, expect, it } from 'vitest';
import {
  getCaseHref,
  resolveExternalTarget,
  resolveLocalTarget,
} from '../../assets/js/link-target.js';

describe('external targets', () => {
  it('accepts only HTTP and HTTPS URLs', () => {
    const pageUrl = new URL('https://xqgj.cc/');
    expect(resolveExternalTarget('https://example.com/a', pageUrl).href).toBe(
      'https://example.com/a',
    );
    expect(() => resolveExternalTarget('javascript:alert(1)', pageUrl)).toThrow();
    expect(() => resolveExternalTarget('https://user:pass@example.com/', pageUrl)).toThrow();
    expect(() =>
      resolveExternalTarget(`https://example.com/${'a'.repeat(2030)}`, pageUrl),
    ).toThrow();
  });

  it('maps localhost case hosts to the current deployment suffix', () => {
    expect(
      resolveExternalTarget('https://tool.localhost/', new URL('http://localhost:4001/')).host,
    ).toBe('tool.guanqi.cn');
    expect(
      resolveExternalTarget('https://tool.localhost/', new URL('https://guanqi.xyz/')).host,
    ).toBe('tool.guanqi.xyz');
  });
});

describe('local targets', () => {
  it('resolves paths under the site root', () => {
    expect(resolveLocalTarget('cases/chart/', new URL('https://example.com/felab/')).href).toBe(
      'https://example.com/felab/cases/chart/',
    );
  });

  it('rejects traversal, absolute paths and schemes', () => {
    const root = new URL('https://example.com/felab/');
    expect(() => resolveLocalTarget('../secret', root)).toThrow();
    expect(() => resolveLocalTarget('/etc/passwd', root)).toThrow();
    expect(() => resolveLocalTarget('file:///etc/passwd', root)).toThrow();
    expect(() => resolveLocalTarget('cases\\chart', root)).toThrow();
  });
});

describe('case links', () => {
  const item = {
    cid: 2008,
    name: 'h5录音',
    description: '录音',
    href: 'https://codepen.io/guanqi/pen/ZEzaBXo',
    picUrl: './assets/img/cover/h5-record.jpg',
    type: 'html',
    tags: ['html5'],
    create_time: '2026-01-01',
    update_time: '2026-01-02',
  };

  it('routes external cases through the cid confirmation page', () => {
    expect(
      getCaseHref(item, {
        siteRootUrl: new URL('https://example.com/felab/'),
      }),
    ).toBe('https://example.com/felab/link/check/?cid=2008');
  });
});

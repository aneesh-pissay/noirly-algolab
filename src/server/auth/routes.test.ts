import { describe, expect, it } from 'vitest';
import { decidePageRoute, safeNextPath } from './routes';

describe('proxy route table', () => {
  it.each(['/dashboard', '/learn-path', '/visualizer/array-reverse', '/progress', '/settings'])(
    'sends signed-out visitors from %s to /login with next',
    (path) => {
      expect(decidePageRoute(path, '', false, null)).toEqual({ type: 'redirect', location: `/login?next=${encodeURIComponent(path)}` });
    },
  );

  it('keeps the query string in next', () => {
    expect(decidePageRoute('/visualizer/x', '?step=3', false, null)).toEqual({
      type: 'redirect',
      location: `/login?next=${encodeURIComponent('/visualizer/x?step=3')}`,
    });
  });

  it.each(['/', '/privacy', '/login', '/visual-lab', '/visual-lab/bubble-sort', '/api/auth/signin', '/.well-known/assetlinks.json'])(
    'lets signed-out visitors open %s',
    (path) => {
      expect(decidePageRoute(path, '', false, null)).toEqual({ type: 'next' });
    },
  );

  it('lets API routes answer 401 themselves instead of redirecting', () => {
    expect(decidePageRoute('/api/progress', '', false, null)).toEqual({ type: 'next' });
  });

  it('sends signed-in visitors from / to the dashboard', () => {
    expect(decidePageRoute('/', '', true, null)).toEqual({ type: 'redirect', location: '/dashboard' });
  });

  it('sends signed-in visitors from /login to a same-origin next', () => {
    expect(decidePageRoute('/login', '', true, '/visualizer/x')).toEqual({ type: 'redirect', location: '/visualizer/x' });
    expect(decidePageRoute('/login', '', true, '//evil.example')).toEqual({ type: 'redirect', location: '/dashboard' });
    expect(decidePageRoute('/login', '', true, 'https://evil.example')).toEqual({ type: 'redirect', location: '/dashboard' });
  });

  it('lets signed-in visitors through everywhere else', () => {
    expect(decidePageRoute('/visual-lab/bubble-sort', '', true, null)).toEqual({ type: 'next' });
    expect(decidePageRoute('/dashboard', '', true, null)).toEqual({ type: 'next' });
  });
});

describe('safeNextPath', () => {
  it('accepts only same-origin paths', () => {
    expect(safeNextPath('/a?b=1')).toBe('/a?b=1');
    expect(safeNextPath('//evil.example')).toBeNull();
    expect(safeNextPath('/\\evil.example')).toBeNull();
    expect(safeNextPath('javascript:alert(1)')).toBeNull();
    expect(safeNextPath(null)).toBeNull();
  });
});

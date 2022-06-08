import { Request } from 'Subway/Request';

describe('Request', function () {
    describe('constructor', function () {
        it('Fill request properties', function () {
            let req;
            req = (new Request('http://example.com/foo/bar?foo=1&bar=2#foo') as any);
            expect(req._origin).toBe('http://example.com');
            expect(req._segments).toEqual(['foo', 'bar']);
            expect(req._keys).toEqual({ foo: '1', bar: '2' });
            expect(req._anchor).toBe('#foo');

            req = (new Request('/foo/bar?foo=1&bar=2#foo') as any);
            expect(req._origin).toBe('');
            expect(req._segments).toEqual(['foo', 'bar']);
            expect(req._keys).toEqual({ foo: '1', bar: '2' });
            expect(req._anchor).toBe('#foo');
        });
    });
    describe('segment', function () {
        it('Return specific segment', function () {
            expect(new Request('/foo/bar').segment(1)).toBe('foo');
            expect(new Request('/foo/bar').segment(2)).toBe('bar');
        });
        it('Return empty string for undefined segment', function () {
            expect(new Request('/foo/bar').segment(3)).toBe('');
        });
    });
    describe('key', function () {
        it('Return specific key', function () {
            expect(new Request('/foo/bar?foo=1&bar=2').key('foo')).toBe('1');
        });
        it('Return empty string for undefined key', function () {
            expect(new Request('/foo/bar?foo=1').key('bar')).toBe('');
        });
    });
    describe('getUrl', function () {
        it('Return full URL', function () {
            expect((new Request('http://example.com/foo/bar?foo=1#bar') as any).getUrl())
                .toBe('http://example.com/foo/bar?foo=1#bar');
        });
    });
    describe('getPath', function () {
        it('Return path', function () {
            expect((new Request('http://example.com/foo/bar?foo=1#bar') as any).getPath())
                .toBe('foo/bar');
        });
        it('Return empty path', function () {
            expect((new Request('http://example.com/?foo=1#bar') as any).getPath())
                .toBe('');
            expect((new Request('http://example.com?foo=1#bar') as any).getPath())
                .toBe('');
        });
    });
    describe('getQuery', function () {
        it('Return query', function () {
            expect((new Request('http://example.com/foo/bar?foo=1&bar=2#bar') as any).getQuery())
                .toBe('foo=1&bar=2');
        });
        it('Return empty query', function () {
            expect((new Request('http://example.com/foo/bar?#bar') as any).getQuery())
                .toBe('');
            expect((new Request('http://example.com/foo/bar#bar') as any).getQuery())
                .toBe('');
        });
    });
    describe('parsePath', function () {
        it('Return segments array', function () {
            expect((Request as any).parsePath(' //foo//bar// ')).toEqual(['foo', 'bar']);
        });
        it('Return empty array', function () {
            expect((Request as any).parsePath(' // ')).toEqual([]);
        });
    });
    describe('parseQuery', function () {
        it('Return query object', function () {
            expect((Request as any).parseQuery(' ??&&foo=1&&bar=2&& ')).toEqual({ foo: '1', bar: '2' });
        });
        it('Return query keys with empty values', function () {
            expect((Request as any).parseQuery('foo&bar=')).toEqual({ foo: '', bar: '' });
        });
        it('Return empty object', function () {
            expect((Request as any).parseQuery('?')).toEqual({});
        });
    });
});
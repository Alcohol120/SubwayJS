import { Member } from 'Subway/Member';
import { Middleware } from 'Subway/Middleware';

describe('Member', function () {
    describe('name', function () {
        it('Should set name', function () {
            const member = new (Member as any)('');
            member.name('foo');
            expect(member._name).toBe('foo');
        });
        it('Should return itself', function () {
            const member = new (Member as any)('');
            expect(member.name('foo')).toBe(member);
        });
    });
    describe('middleware', function () {
        it('Should add single middleware', function () {
            const member = new (Member as any)('');
            const middleware = function () {};
            member.middleware(middleware);
            expect(member._middleware.length).toBe(1);
            expect((member._middleware as Middleware[])[0]).toBe(middleware);
        });
        it('Should add multiple middleware', function () {
            const member = new (Member as any)('');
            const middleware1 = function () {};
            const middleware2 = function () {};
            member.middleware(middleware1, middleware2);
            expect(member._middleware.length).toBe(2);
            expect((member._middleware as Middleware[])[0]).toBe(middleware1);
            expect((member._middleware as Middleware[])[1]).toBe(middleware2);
        });
        it('Should return itself', function () {
            const member = new (Member as any)('');
            const middleware = function () {};
            expect(member.middleware(middleware)).toBe(member);
        });
    });
    describe('fill', function () {
        it('It create zero segments', function () {
            const member = new (Member as any)('');
            member.fill('');
            expect(member._segments.length).toBe(0);
        });
        it('It create segments', function () {
            const member = new (Member as any)('');
            member.fill('one/two');
            expect(member._segments.length).toBe(2);
        });
    });
    describe('clearPath', function () {
        it('Return clean path', function () {
            expect((Member as any).clearPath(' /foo/ ')).toBe('foo');
            expect((Member as any).clearPath('/foo/')).toBe('foo');
            expect((Member as any).clearPath('/foo///bar/')).toBe('foo/bar');
        });
    });
});
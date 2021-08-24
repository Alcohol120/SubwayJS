import { Group } from 'Subway/Group';
import { Endpoint } from 'Subway/Endpoint';
import { Segment } from 'Subway/Segment';
import { Middleware } from 'Subway/Middleware';
import { Route } from 'Subway/Route';

describe('Group', function () {
    describe('group', function () {
        it('Add group member', function () {
            const group = new (Group as any)('', null);
            group.group('', null);
            expect(group._members.length).toBe(1);
            expect(group._members[0]).toBeInstanceOf(Group);
        });
        it('Call children callback', function () {
            const group = new (Group as any)('', null);
            let called = false;
            group.group('', function (group) { called = true });
            expect(called).toBe(true);
        });
        it('Return added group', function () {
            const group = new (Group as any)('', null);
            const child = group.group('', null);
            expect(child).toBeInstanceOf(Group);
            expect(child).not.toBe(group);
        });
    });
    describe('route', function () {
        it('Add endpoint member', function () {
            const group = new (Group as any)('', null);
            group.route('', null);
            expect(group._members.length).toBe(1);
            expect(group._members[0]).toBeInstanceOf(Endpoint);
        });
        it('Return added endpoint', function () {
            const group = new (Group as any)('', null);
            const child = group.route('', null);
            expect(child).toBeInstanceOf(Endpoint);
        });
    });
    describe('getRoutes', function () {
        it('Return routes', function () {
            const group = new (Group as any)('first', null);
            group.group('second', function (g) { g.route('end', null) });
            group.route('end', null);
            const routes = group.getRoutes();
            expect(routes.length).toBe(2);
            expect(routes[0]).toBeInstanceOf(Route);
            expect(routes[1]).toBeInstanceOf(Route);
        });
    });
    describe('joinProps', function () {
        it('Return properties of itself', function () {
            const group = new (Group as any)('', null);
            const segment = new Segment('foo');
            const middleware = function () {};
            group._name = 'foo';
            group._segments = [ segment ];
            group._middleware = [ middleware ];
            const props = group.joinProps();
            expect(props.groups.length).toBe(1);
            expect(props.groups[0]).toBe('foo');
            expect(props.segments.length).toBe(1);
            expect(props.segments[0]).toBe(segment);
            expect(props.middleware.length).toBe(1);
            expect(props.middleware[0]).toBe(middleware);
        });
        it('Return merged properties', function () {
            const group = new (Group as any)('', null);
            const segment1 = new Segment('foo');
            const segment2 = new Segment('bar');
            const middleware1 = function () {};
            const middleware2 = function () {};
            group._name = 'second';
            group._segments = [ segment2 ];
            group._middleware = [ middleware2 ];
            const props = group.joinProps({
                groups: [ 'first' ],
                segments: [ segment1 ],
                middleware: [ middleware1 ],
            });
            expect(props.groups.length).toBe(2);
            expect(props.groups[0]).toBe('first');
            expect(props.groups[1]).toBe('second');
            expect(props.segments.length).toBe(2);
            expect(props.segments[0]).toBe(segment1);
            expect(props.segments[1]).toBe(segment2);
            expect(props.middleware.length).toBe(2);
            expect(props.middleware[0]).toBe(middleware1);
            expect(props.middleware[1]).toBe(middleware2);
        });
    });
});
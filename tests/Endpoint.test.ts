import { Endpoint } from 'Subway/Endpoint';
import { Segment } from 'Subway/Segment';
import { Route } from 'Subway/Route';

describe('Endpoint', function () {
    describe('getRoute', function () {
        it('Return route', function () {
            const endpoint = new (Endpoint as any)('', null);
            expect(endpoint.getRoute()).toBeInstanceOf(Route);
        });
    });
    describe('joinProps', function () {
        it('Return properties of itself', function () {
            const endpoint = new (Endpoint as any)('', null);
            const segment = new Segment('foo');
            const middleware = function () {};
            endpoint._name = 'foo';
            endpoint._segments = [ segment ];
            endpoint._middleware = [ middleware ];
            const props = endpoint.joinProps();
            expect(props.name).toBe('foo');
            expect(props.groups.length).toBe(0);
            expect(props.segments.length).toBe(1);
            expect(props.segments[0]).toBe(segment);
            expect(props.middleware.length).toBe(1);
            expect(props.middleware[0]).toBe(middleware);
        });
        it('Return merged properties', function () {
            const endpoint = new (Endpoint as any)('', null);
            const segment1 = new Segment('foo');
            const segment2 = new Segment('bar');
            const middleware1 = function () {};
            const middleware2 = function () {};
            endpoint._name = 'second';
            endpoint._segments = [ segment2 ];
            endpoint._middleware = [ middleware2 ];
            const props = endpoint.joinProps({
                groups: [ 'first' ],
                segments: [ segment1 ],
                middleware: [ middleware1 ],
            });
            expect(props.name).toBe('second');
            expect(props.groups.length).toBe(1);
            expect(props.groups[0]).toBe('first');
            expect(props.segments.length).toBe(2);
            expect(props.segments[0]).toBe(segment1);
            expect(props.segments[1]).toBe(segment2);
            expect(props.middleware.length).toBe(2);
            expect(props.middleware[0]).toBe(middleware1);
            expect(props.middleware[1]).toBe(middleware2);
        });
    });
});
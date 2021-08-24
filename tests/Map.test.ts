import { Map } from 'Subway/Map';

describe('Map', function () {
    describe('getBestRoute', function () {
        it('Return null if there are no matching routes', function () {
            const map = new (Map as any)();
            map.route('/foo/bar', null);
            map.build();
            expect(map.getBestRoute([])).toBe(null);
        });
        it('Return best route', function () {
            const map = new (Map as any)();
            map.route('/foo/{any}?', null);
            map.route('/foo/bar?', null);
            map.build();
            expect(map.getBestRoute([ 'foo', 'bar' ])).toBe(map._routes[1]);
        });
    });
});
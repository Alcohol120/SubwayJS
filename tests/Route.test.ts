import { Route } from 'Subway/Route';
import { Request } from 'Subway/Request';
import { Segment } from 'Subway/Segment';

const getRoute = function (path : string) : Route {
    const segments = [];
    const paths = path.split('/');
    for(let i = 0; i < paths.length; i++) if(paths[i]) segments.push(new Segment(paths[i]));
    return new Route({
        name: '',
        groups: [],
        segments,
        middleware: [],
    }, null);
};

describe('Route', function () {
    describe('inGroup', function () {
        it('Return true', function () {
            const route = new Route({
                name: '',
                groups: [ 'foo', 'bar' ],
                segments: [],
                middleware: [],
            }, null);
            expect(route.inGroup('foo')).toBe(true);
            expect(route.inGroup('bar')).toBe(true);
            expect(route.inGroup('foo', 'bar')).toBe(true);
        });
        it('Return false', function () {
            const route = new Route({
                name: '',
                groups: [],
                segments: [],
                middleware: [],
            }, null);
            expect(route.inGroup('foo')).toBe(false);
            expect(route.inGroup('bar')).toBe(false);
            expect(route.inGroup('foo', 'bar')).toBe(false);
        });
    });
    describe('estimate', function () {
        it('Return -1 if no matches pattern', function () {
            expect(getRoute('foo/bar').estimate(new Request('bar'))).toBe(-1);
            expect(getRoute('foo/bar?/second').estimate(new Request('foo'))).toBe(-1);
        });
        it('Return 0 for index route', function () {
            expect(getRoute('').estimate(new Request(''))).toBe(0);
            expect(getRoute('').estimate(new Request('foo'))).toBe(0);
        });
        it('Return rate with simple segments', function () {
            expect(getRoute('foo/bar').estimate(new Request('foo/bar'))).toBe(6);
            expect(getRoute('foo/{any:i}').estimate(new Request('foo/1'))).toBe(5);
            expect(getRoute('foo/{any:a}').estimate(new Request('foo/s-s'))).toBe(5);
            expect(getRoute('foo/{any:[a-z0-9]{4}}').estimate(new Request('foo/bb22'))).toBe(5);
            expect(getRoute('foo/{any}').estimate(new Request('foo/bar'))).toBe(4);

            expect(getRoute('foo/bar?').estimate(new Request('foo'))).toBe(3);
            expect(getRoute('foo/{any:i}?').estimate(new Request('foo'))).toBe(3);
            expect(getRoute('foo/{any:a}?').estimate(new Request('foo'))).toBe(3);
            expect(getRoute('foo/{any:[a-z0-9]{4}}?').estimate(new Request('foo'))).toBe(3);
            expect(getRoute('foo/{any}?').estimate(new Request('foo'))).toBe(3);

            expect(getRoute('foo/bar?').estimate(new Request('foo/n'))).toBe(3);
            expect(getRoute('foo/{any:i}?').estimate(new Request('foo/n'))).toBe(3);
            expect(getRoute('foo/{any:a}?').estimate(new Request('foo/1'))).toBe(3);
            expect(getRoute('foo/{any:[a-z0-9]{4}}?').estimate(new Request('foo/n'))).toBe(3);
        });
        it('Return rate with complicated optional segments', function () {
            expect(getRoute('first/second?/third').estimate(new Request('first/third'))).toBe(6);
            expect(getRoute('first/second?/third').estimate(new Request('first/second/third'))).toBe(9);

            expect(getRoute('first/{any}?/second').estimate(new Request('first/second'))).toBe(6);
            expect(getRoute('first/{any}?/{any}?/second').estimate(new Request('first/second'))).toBe(6);
            expect(getRoute('first/{any}?/{any}?/{any}?/second').estimate(new Request('first/test/second'))).toBe(7);

            expect(getRoute('{any}?/{v1:i}?/second/third?/{v2:[a-z]+}').estimate(new Request('1/second/third'))).toBe(7);

            expect(getRoute('first/{any}?/{any}?/end?').estimate(new Request('first/second'))).toBe(4);

            expect(getRoute('{any1}?/{any2}?/{int:i}?/{any3}?/end').estimate(new Request('1/end'))).toBe(5);
        });
    });
    describe('getUrl', function () {
        it('Return uri path', function () {
            expect((getRoute('foo/bar') as any).getUrl()).toBe('/foo/bar');
            expect((getRoute('foo/{bar}') as any).getUrl({ bar: 'bar' })).toBe('/foo/bar');
            expect((getRoute('foo/{bar}/{opt}?/{url:a}') as any).getUrl({ bar: 'bar', url: 'url' })).toBe('/foo/bar/url');
            expect((getRoute('foo/{bar}/{opt}?/{num:i}') as any).getUrl({ bar: 'bar', num: '2' })).toBe('/foo/bar/2');
            expect((getRoute('foo/{bar}/{opt}?/{num:i}') as any).getUrl({ bar: 'bar', opt: 'opt', num: '2' })).toBe('/foo/bar/opt/2');
            expect((getRoute('foo/{bar:[a-z]+-[0-9]+}') as any).getUrl({ bar: 'bar-1' })).toBe('/foo/bar-1');
        });
        it('Return null', function () {
            expect((getRoute('foo/{bar}') as any).getUrl()).toBe(null);
            expect((getRoute('foo/{bar:i}') as any).getUrl({ bar: 'bar' })).toBe(null);
            expect((getRoute('foo/{bar:a}') as any).getUrl({ bar: '1' })).toBe(null);
            expect((getRoute('foo/{bar:[a-z]+}') as any).getUrl({ bar: '1' })).toBe(null);
        });
    });
});
SubwayJS - the JavaScript router

## Usage

#### Basic example

    const map = new Map(); // create router
    map.route('/', (request, route) => {
        // home page
    });
    map.group('/news', group => {
        group.route('/', (request, route) => {
            // news page
        });
        group.route('/{id:i}', (request, route) => {
            const postId = Number(request.segment(2));
            // article page
        });
    });
    map.build(); // routes built and ready to use
    map.dispatch(window.location.href); // route

#### With NodeJS and NPM

Install

    npm i subway-router --save

Usage

    import { Map } from 'Subway';
    const map = new Map();

#### With browser

Download the latest version from [GitHub releases](https://github.com/Alcohol120/SubwayJS/releases).\
Add this line to the end of your body tag:

    <script type="text/javascript" src="subway.min.js"></script>

Usage

    const map = new Subway.Map();

## Routes

#### Router or your site map

    import { Map } from 'Subway';
    const map = new Map();

#### Static path
    map.route('/foo/bar', req => {})

#### Variables
    map.route('/foo/{bar}') // {bar} - any string
    map.route('/foo/{bar:i}') // {bar:i} - integers only
    map.route('/foo/{bar:a}') // {bar:a} - allowed alpha (a-zA-Z), underscores and dashes
    map.route('/foo/{bar:[a-z]{2}\d+}') - pattern matching (case insensitive)

#### Optional segments
    map.route('/foo?/{bar}') // first segment is optional

#### Groups
    map.group('/foo', group => {
        group.route('/', req => {}); // GET /foo
        group.route('/bar', req => {}); // GET /foo/bar
    });

## Preparing and dispatching routes

#### Build

Your router has to be compiled before dispatching.

    map.build(); // now router is ready to use

You should re-build your router with any changes in your routes setup

#### Dispatch

    window.addEventListener('popstate', () => {
        map.dispatch(window.location.href);
    });

## Routes estimation and priorities
Static segments has the highest priority.\
Pattern segments has the medium priority.\
Variable (any) segments has the lowest priority.

    map.route('/foo/{bar}').name('any')
    map.route('/foo/{bar:i}').name('integer')
    map.route('/foo/bar').name('static')
    
    map.dispatch('/foo/bar') // route named 'static' will be loaded
    map.dispatch('/foo/foo') // route named 'any' will be loaded

Optional segments has less priority

    map.route('/foo?/bar').name('first')
    map.route('/foo/bar').name('second')
    
    map.dispatch('/foo/bar') // route named 'second' will be loaded
    // Technically both routes are fits such request,
    // but 'first' route will get less estimation due to an optional segment.
    // In this example 'first' route will never be loaded

## Middleware hooks

    import { IMiddleware, Request, Route, TOnLoad } from 'Subway';

    class CustomMiddleware implements IMiddleware {

        // execute after route estimated
        onEstimated(rate : number, request : Request, route : Route) : number {
            // this hook should return integer
            // return -1 to skip current route
            return rate;
        }

        // execute before route loaded
        async onResolving(onLoad : TOnLoad, request, request : Request, route : Route) : TOnLoad | Promise<TOnLoad> {
            // this hook can by async or syncronous and should return or promise onLoad callback
            return new Promise(resolve => {
                // do something before load route
                resolve(onLoad);
            });
        }

        // execute after route loaded
        onResolved(request, request : Request, route : Route) {
            // this hook don't return anything
        }

    }
    
    map.route('/foo/bar', (request, route) => {
        // load page
    }).middleware(new CustomMiddleware());
    
    map.group('/', group => {
        group.route('/foo/bar', (request, route) => {
            // load page
        });
    }).middleware(new CustomMiddleware());

#### Multiple middleware

    class Logger implements IMiddleware {
        
        onResolved(request, route) {
            console.log(request.path, request.query, route.name);
        }
        
    }

    class Auth implements IMiddleware {
        
        onResolving(onLoad, request) {
            // check if user logged in
            if(document.cookie.indexOf('user=') >= 0) {
                return onLoad;
            } else {
                return () => {
                    // login page
                };
            }
        }
        
    }

    map.group('/', group => {
        ...
    }).middleware(new Logger(), new Auth());

## Object reference

#### Request

    new Request('https://example.com/foo/bar?foo=1&bar=2#foo')
        .url : string // 'https://example.com/foo/bar?foo=1&bar=2#foo'
        .origin : string // 'https://example.com'
        .path : string // 'foo/bar'
        .query : string // 'foo=1&bar=2'
        .anchor : string // '#foo'
        .segments : string[] // [ 'foo', 'bar' ]
        .segment(segmentNumber : number) : string // get segment by number (starts from 1). Example: request.segment(2) => 'bar'
        .keys : Record<string, string> // { foo: '1', bar: '2' }
        .key(keyName : string) : string // get GET property by name. Example: request.key('bar') => '2'

#### Route

    Route
        .name : string // name of route or empty string if not defined
        .groups : string[] // array with names of groups wich contain this route 
        .inGroup(name : string) : boolean // check if this route in group with specific name
        .estimate(request : Request) : number // estimate route (onEstimated() middleware hooks will be executed if exists)
        .getUrl(props : Record<string, string>) : string // get URL of this route. Keys from 'props' parameter will be used to replace variable segments. For example: map.route('/foo/{bar}').getUrl({ bar: 'something' }) will return '/foo/something'
        .resolve(request : Request) // load route (onResolving() and onResolved() middleware hooks will be executed if exists)
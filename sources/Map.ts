import { Group } from 'Subway/Group';
import { Route } from 'Subway/Route';
import { Request } from 'Subway/Request';

type TOnFailed = (request : Request) => void;

export class Map extends Group {

    private _routes : Route[] = [];
    private _onFailed : TOnFailed = function () {};

    constructor() {
        super('', null);
    }

    public build() : void {
        this._routes = this.getRoutes();
    }

    public fallback(onFailed : TOnFailed) : void {
        this._onFailed = onFailed;
    }

    public dispatch(url : string) : void {
        const request = new Request(url);
        let bestRate = -1;
        let bestRoute = null;
        for(let i = 0; i < this._routes.length; i++) {
            const route = this._routes[i];
            const rate = route.estimate(request);
            if(rate > bestRate) {
                bestRate = rate;
                bestRoute = route;
            }
        }
        if(bestRoute) {
            bestRoute.resolve(request);
        } else this._onFailed(request);
    }

}
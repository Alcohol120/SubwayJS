import { Request } from 'Subway/Request';
import { Route, TOnLoad } from 'Subway/Route';

export abstract class Middleware {

    public onEstimationStart(request : Request, route : Route) : void;

    public onEstimationStart() {}

    public onEstimated(rate : number, request : Request, route : Route) : number;

    public onEstimated(rate : number) {
        return rate;
    }

    public onResolvingStart(onLoad : TOnLoad, request : Request, route : Route) : TOnLoad;

    public onResolvingStart(onLoad : TOnLoad) {
        return onLoad;
    }

    public onResolved(request : Request, route : Route) : void;

    public onResolved() {}

}
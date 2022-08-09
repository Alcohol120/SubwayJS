import { Request } from 'Subway/Request';
import { Route, TOnLoad } from 'Subway/Route';

export interface IMiddleware {
    onEstimated ?: (rate : number, request : Request, route : Route) => number,
    onResolving ?: (onLoad : TOnLoad, request : Request, route : Route) => TOnLoad | Promise<TOnLoad>,
    onResolved ?: (request : Request, route : Route) => void,
}
import { Segment, ESegmentType } from 'Subway/Segment';
import { Request } from 'Subway/Request';
import { IMiddleware } from 'Subway/Middleware';

export interface IRouteProps {
    name : string,
    groups : string[],
    segments : Segment[],
    middleware : IMiddleware[],
}

export type TOnLoad = (request : Request, route : Route) => void;

export class Route {

    private readonly _name : string = '';
    private readonly _groups : string[] = [];
    private readonly _segments : Segment[] = [];
    private readonly _middleware : IMiddleware[] = [];
    private readonly _onLoad : TOnLoad;

    public get name() : string {
        return this._name;
    }

    public get groups() : string[] {
        return this._groups;
    }

    constructor(props : IRouteProps, onLoad : TOnLoad) {
        this._name = props.name;
        this._groups = props.groups;
        this._segments = props.segments;
        this._middleware = props.middleware;
        this._onLoad = onLoad;
    }

    public inGroup(...groups : string[]) : boolean {
        for(let i = 0; i < groups.length; i++) if(this._groups.indexOf(groups[i]) < 0) return false;
        return true;
    }

    public estimate(request : Request) : number {
        const paths = request.segments;
        const rates = new Array(this._segments.length).fill(0);
        let pathIndex = 0;
        let optionals = 0;
        let backwards = 0;
        for(let i = 0; i < rates.length; i++) {
            while(true) {
                const path = paths[pathIndex] || '';
                const segment = this._segments[i];
                const rate = segment.estimate(path);
                if(rate <= 0 && optionals > 0) {
                    // backward to previous paths that was rated by previous optional segments
                    optionals--;
                    backwards++;
                    pathIndex--;
                    continue;
                } else if(rate <= 0 && backwards > 0) {
                    // reverse lookup failed
                    // break all actions if this is a required segment
                    if(rate < 0) return -1;
                    // restore counters and go to the next segment if current is optional
                    pathIndex += backwards;
                    optionals += backwards;
                    backwards = 0;
                } else if(rate > 0 && backwards > 0) {
                    // reverse lookup success, reset rates of a skipped optional segments
                    for(let b = 1; b <= backwards; b++) rates[i - b] = 0;
                    backwards = 0;
                }
                if(rate < 0) {
                    // estimation failed, reverse lookup is not possible or not efficient
                    return -1;
                }
                if(segment.optional) {
                    optionals++;
                } else optionals = 0;
                rates[i] = rate;
                break;
            }
            pathIndex++;
        }
        // calculate summary rate
        let rate = 0;
        for(let i = 0; i < rates.length; i++) rate += rates[i];
        for(let i = 0; i < this._middleware.length; i++) rate = this._middleware[i].onEstimated(rate, request, this);
        return rate;
    }

    public getUrl(props : Record<string, string> = {}) : string {
        const paths = [];
        for(let i = 0; i < this._segments.length; i++) {
            const segment = this._segments[i];
            if(segment.optional && !props.hasOwnProperty(segment.name)) continue;
            if(segment.type == ESegmentType.COMMON) {
                paths.push(segment.name);
                continue;
            }
            const prop = props[segment.name];
            if(segment.type == ESegmentType.ALPHA) {
                if(!prop.match(/^[a-z\-_]+$/i)) return null;
                paths.push(prop);
            } else if(segment.type == ESegmentType.INTEGER) {
                if(!prop.match(/^\d+$/)) return null;
                paths.push(prop);
            } else if(segment.type == ESegmentType.PATTERN) {
                if(!prop.match(segment.pattern)) return null;
                paths.push(prop);
            } else if(segment.type == ESegmentType.ANY) {
                if(!prop) return null;
                paths.push(prop);
            }
        }
        return `/${paths.join('/')}`;
    }

    public async resolve(request : Request) : Promise<void> {
        let onLoad = this._onLoad;
        for(let i = 0; i < this._middleware.length; i++) {
            onLoad = await this._middleware[i].onResolving(this._onLoad, request, this);
        }
        onLoad(request, this);
        for(let i = 0; i < this._middleware.length; i++) this._middleware[i].onResolved(request, this);
    }

}
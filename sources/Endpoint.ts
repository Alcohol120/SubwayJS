import { Member, ParentProps } from 'Subway/Member';
import { Route, RouteProps, OnLoad } from 'Subway/Route';

export class Endpoint extends Member {

    private readonly _onLoad : OnLoad;

    constructor(path : string, onLoad : OnLoad) {
        super(path);
        this._onLoad = onLoad;
    }

    public getRoute(parentProps? : ParentProps) : Route {
        const props = this.joinProps(parentProps);
        return new Route(props, this._onLoad);
    }

    private joinProps(parentProps : ParentProps) : RouteProps {
        parentProps = parentProps || { groups: [], segments: [], middleware: [] };
        return {
            name: this._name,
            groups: parentProps.groups,
            segments: [ ...parentProps.segments, ...this._segments ],
            middleware: [ ...parentProps.middleware, ...this._middleware ],
        };
    }

}
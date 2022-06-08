import { Member, IParentProps } from 'Subway/Member';
import { Route, IRouteProps, TOnLoad } from 'Subway/Route';

export class Endpoint extends Member {

    private readonly _onLoad : TOnLoad;

    constructor(path : string, onLoad : TOnLoad) {
        super(path);
        this._onLoad = onLoad;
    }

    public getRoute(parentProps ?: IParentProps) : Route {
        const props = this.joinProps(parentProps);
        return new Route(props, this._onLoad);
    }

    private joinProps(parentProps : IParentProps) : IRouteProps {
        return {
            name: this._name,
            groups: parentProps ? parentProps.groups : [],
            segments: [ ...parentProps ? parentProps.segments : [], ...this._segments ],
            middleware: [ ...parentProps ? parentProps.middleware : [], ...this._middleware ],
        };
    }

}
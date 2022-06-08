import { Member, IParentProps } from 'Subway/Member';
import { Endpoint } from 'Subway/Endpoint';
import { Route, TOnLoad } from 'Subway/Route';

type TChild = (group : Group) => void;

export class Group extends Member {

    protected _members : Member[] = [];

    constructor(path : string, children : TChild) {
        super(path);
        if(children) children(this);
    }

    public group(path : string, onLoad : TChild) : Group {
        const group = new Group(path, onLoad);
        this._members.push(group);
        return group;
    }

    public route(path : string, onLoad : TOnLoad) : Endpoint {
        const endpoint = new Endpoint(path, onLoad);
        this._members.push(endpoint);
        return endpoint;
    }

    public getRoutes(parentProps ?: IParentProps) : Route[] {
        const routes : Route[] = [];
        const props = this.joinProps(parentProps);
        for(let i = 0; i < this._members.length; i++) {
            const member = this._members[i];
            if(member instanceof Group) {
                routes.push(...member.getRoutes(props));
            } else if(member instanceof Endpoint) {
                routes.push(member.getRoute(props));
            }
        }
        return routes;
    }

    private joinProps(parentProps ?: IParentProps) : IParentProps {
        return {
            groups: [ ...parentProps ? parentProps.groups : [], ...this._name ? [ this._name ] : [] ],
            segments: [ ...parentProps ? parentProps.segments : [], ...this._segments ],
            middleware: [ ...parentProps ? parentProps.middleware : [], ...this._middleware ],
        };
    }

}
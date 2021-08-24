import { Member, ParentProps } from 'Subway/Member';
import { Endpoint } from 'Subway/Endpoint';
import { Route, OnLoad } from 'Subway/Route';

type Child = (group : Group) => void;

export class Group extends Member {

    protected _members : Member[] = [];

    constructor(path : string, children : Child) {
        super(path);
        if(children) children(this);
    }

    public group(path : string, onLoad : Child) : Group {
        const group = new Group(path, onLoad);
        this._members.push(group);
        return group;
    }

    public route(path : string, onLoad : OnLoad) : Endpoint {
        const endpoint = new Endpoint(path, onLoad);
        this._members.push(endpoint);
        return endpoint;
    }

    public getRoutes(parentProps? : ParentProps) : Route[] {
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

    private joinProps(parentProps? : ParentProps) : ParentProps {
        parentProps = parentProps || { groups: [], segments: [], middleware: [] };
        return {
            groups: [ ...parentProps.groups, ...this._name ? [ this._name ] : [] ],
            segments: [ ...parentProps.segments, ...this._segments ],
            middleware: [ ...parentProps.middleware, ...this._middleware ],
        }
    }

}
import { Segment } from 'Subway/Segment';
import { Middleware } from 'Subway/Middleware';

export interface IParentProps {
    groups : string[],
    segments : Segment[],
    middleware : Middleware[],
}

export abstract class Member {

    protected _name : string = '';
    protected _segments : Segment[] = [];
    protected _middleware : Middleware[] = [];

    protected constructor(path : string) {
        this.fill(path);
    }

    public name(name : string) : Member {
        this._name = name;
        return this;
    }

    public middleware(...middleware : Middleware[]) : Member {
        this._middleware.push(...middleware);
        return this;
    }

    private fill(path : string) : void {
        const segments = Member.clearPath(path).split('/');
        for(let i = 0; i < segments.length; i++) {
            if(!segments[i]) continue;
            this._segments.push(new Segment(segments[i]));
        }
    }

    protected static clearPath(path : string) : string {
        return path
            .trim()
            .replace(/\/+/g, '/')
            .replace(/^\//, '')
            .replace(/\/$/, '');
    }

}
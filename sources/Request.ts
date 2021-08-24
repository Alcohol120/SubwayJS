export class Request {

    private readonly _origin : string;
    private readonly _segments : string[];
    private readonly _keys : Record<string, string>;
    private readonly _anchor : string;
    private _props : Record<string, string>;

    public get origin() : string {
        return this._origin;
    }

    public get url() : string {
        return this.getUrl();
    }

    public get path() : string {
        return this.getPath();
    }

    public get segments() : string[] {
        return this._segments;
    }

    public get query() : string {
        return this.getQuery();
    }

    public get keys() : Record<string, string> {
        return this._keys;
    }

    public get anchor() : string {
        return this._anchor;
    }

    public get props() : Record<string, string> {
        return this._props;
    }

    public set props(vars : Record<string, string>) {
        this._props = vars;
    }

    constructor(url : string) {
        const parts = url.match(/^(https?:\/{2}(.*?)(\/|$))?(.*?)(\?.*?)?(#.*?)?$/) || [];
        this._origin = parts[1] ? parts[1].slice(0, parts[1].length - 1) : '';
        this._segments = Request.parsePath(parts[4]);
        this._keys = Request.parseQuery(parts[5]);
        this._anchor = parts[6] || '';
    }

    public segment(number : number) : string {
        number = number > 0 ? number - 1 : 0;
        return this._segments[number] || '';
    }

    public key(name : string) : string {
        return this._keys[name] || '';
    }

    public prop(name : string) : string {
        return this._props[name] || '';
    }

    private getUrl() : string {
        const query = this.getQuery();
        return `${this._origin}/${this.getPath()}${query ? `?${query}` : ''}${this._anchor}`;
    }

    private getPath() : string {
        return this._segments.join('/');
    }

    private getQuery() : string {
        const props = [];
        for(let name in this._keys) {
            if(!this._keys.hasOwnProperty(name)) continue;
            props.push(`${name}=${this._keys[name] || ''}`);
        }
        return props.length > 0 ? props.join('&') : '';
    }

    private static parsePath(path : string) : string[] {
        path = (path || '')
            .trim()
            .replace(/^\/+/, '')
            .replace(/\/+$/, '')
            .replace(/\/+/, '/');
        return path ? path.split('/') : [];
    }

    private static parseQuery(query : string) : Record<string, string> {
        query = (query || '')
            .trim()
            .replace(/^[?&]+/, '')
            .replace(/&+/, '&');
        if(!query) return {};
        const keys = {};
        const props = query.split('&');
        for(let i = 0; i < props.length; i++) {
            if(!props[i]) continue;
            const temp = props[i].split('=');
            keys[temp[0]] = temp.length > 2 ? temp.splice(1).join('=') : temp[1] || '';
        }
        return keys;
    }

}
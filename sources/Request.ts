export class Request {

    private readonly _origin : string;
    private readonly _segments : string[];
    private readonly _keys : Record<string, string>;
    private readonly _anchor : string;

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

    constructor(url : string) {
        const parts = url.match(/^(https?:\/{2}(.*?)(\/|$))?(.*?)(\?.*?)?(#.*?)?$/) || [];
        this._origin = parts[1] ? parts[1].slice(0, parts[1].length - 1) : '';
        this._segments = Request.parsePath(parts[4]);
        this._keys = Request.parseQuery(parts[5]);
        this._anchor = parts[6] || '';
    }

    public segment(num : number) : string {
        const normalized = num > 0 ? num - 1 : 0;
        return this._segments[normalized] || '';
    }

    public key(name : string) : string {
        return this._keys[name] || '';
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
        for(const name in this._keys) {
            if(!this._keys.hasOwnProperty(name)) continue;
            props.push(`${name}=${this._keys[name] || ''}`);
        }
        return props.length > 0 ? props.join('&') : '';
    }

    private static parsePath(path : string) : string[] {
        const normalized = (path || '')
            .trim()
            .replace(/^\/+/, '')
            .replace(/\/+$/, '')
            .replace(/\/+/, '/');
        return normalized ? normalized.split('/') : [];
    }

    private static parseQuery(query : string) : Record<string, string> {
        const normalized = (query || '')
            .trim()
            .replace(/^[?&]+/, '')
            .replace(/&+/, '&');
        if(!normalized) return {};
        const keys = {};
        const props = normalized.split('&');
        for(let i = 0; i < props.length; i++) {
            if(!props[i]) continue;
            const temp = props[i].split('=');
            keys[temp[0]] = temp.length > 2 ? temp.splice(1).join('=') : temp[1] || '';
        }
        return keys;
    }

}
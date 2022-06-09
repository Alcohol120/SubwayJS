export enum ESegmentType {
    COMMON,
    ANY,
    ALPHA,
    INTEGER,
    PATTERN,
}

export class Segment {

    private readonly _type : ESegmentType;
    private readonly _name : string;
    private readonly _pattern : RegExp;
    private readonly _optional : boolean;

    public get type() : ESegmentType {
        return this._type;
    }

    public get name() : string {
        return this._name;
    }

    public get pattern() : RegExp {
        return this._pattern;
    }

    public get optional() : boolean {
        return this._optional;
    }

    constructor(source : string) {
        this._type = Segment.getType(source);
        this._name = Segment.getName(source);
        this._pattern = Segment.getPattern(source);
        this._optional = Segment.getOptional(source);
    }

    public estimate(segment : string) : number {
        let rate = -1;
        if(this._type == ESegmentType.COMMON) {
            rate = segment == this._name ? 3 : -1;
        } else if(this._type == ESegmentType.ANY) {
            rate = segment ? 1 : -1;
        } else if(this._type == ESegmentType.ALPHA) {
            rate = segment.match(/^[a-z\-_]+$/i) ? 2 : -1;
        } else if(this._type == ESegmentType.INTEGER) {
            rate = segment.match(/^\d+$/) ? 2 : -1;
        } else if(this._type == ESegmentType.PATTERN) {
            rate = segment.match(this._pattern) ? 2 : -1;
        }
        if(rate < 0 && this._optional) rate = 0;
        return rate;
    }

    private static getType(source : string) : ESegmentType {
        if(!source.match(/^{.+?}\??$/)) {
            return ESegmentType.COMMON;
        } else if(!source.match(/^{.+?:.+?}\??$/)) {
            return ESegmentType.ANY;
        } else if(source.match(/^{.+?:a}\??$/)) {
            return ESegmentType.ALPHA;
        } else if(source.match(/^{.+?:i}\??$/)) {
            return ESegmentType.INTEGER;
        } else return ESegmentType.PATTERN;
    }

    private static getName(source : string) : string {
        return (source.match(/^{?(.+?)(:.+?)?}?\??$/) || [])[1] || '';
    }

    private static getPattern(source : string) : RegExp {
        const pattern = (source.match(/^{.+?:(.+?)}\??$/) || [])[1];
        if(pattern && [ 'a', 'i' ].indexOf(pattern) < 0) {
            return new RegExp(pattern, 'i');
        } else return null;
    }

    private static getOptional(source : string) : boolean {
        return !!source.match(/\?$/);
    }

}
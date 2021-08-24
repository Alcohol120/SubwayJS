export enum SegmentType {
    COMMON,
    ANY,
    ALPHA,
    INTEGER,
    PATTERN,
}

export class Segment {

    private readonly _type : SegmentType;
    private readonly _name : string;
    private readonly _pattern : RegExp;
    private readonly _optional : boolean;

    public get type() : SegmentType {
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
        if(this._type == SegmentType.COMMON) {
            rate = segment == this._name ? 3 : -1;
        } else if(this._type == SegmentType.ANY) {
            rate = segment ? 1 : -1;
        } else if(this._type == SegmentType.ALPHA) {
            rate = segment.match(/^[a-z\-_]+$/i) ? 2 : -1;
        } else if(this._type == SegmentType.INTEGER) {
            rate = segment.match(/^[0-9]+$/) ? 2 : -1;
        } else if(this._type == SegmentType.PATTERN) {
            rate = segment.match(this._pattern) ? 2 : -1;
        }
        if(rate < 0 && this._optional) rate = 0;
        return rate;
    }

    private static getType(source : string) : SegmentType {
        if(!source.match(/^{.+?}\??$/)) {
            return SegmentType.COMMON;
        } else if(!source.match(/^{.+?:.+?}\??$/)) {
            return SegmentType.ANY;
        } else if(source.match(/^{.+?:a}\??$/)) {
            return SegmentType.ALPHA;
        } else if(source.match(/^{.+?:i}\??$/)) {
            return SegmentType.INTEGER;
        } else return SegmentType.PATTERN;
    }

    private static getName(source : string) : string {
        return (source.match(/^{?(.+?)(:.+?)?}?\??$/) || [])[1] || '';
    }

    private static getPattern(source : string) : RegExp {
        const pattern = (source.match(/^{.+?:(.+?)}\??$/) || [])[1];
        if(pattern && ['a', 'i'].indexOf(pattern) < 0) {
            return new RegExp(pattern, 'i');
        } else return null;
    }

    private static getOptional(source : string) : boolean {
        return !!source.match(/\?$/);
    }

}
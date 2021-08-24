import { Segment, SegmentType } from 'Subway/Segment';

describe('Segment', function () {
    describe('estimate', function () {
        it('Return 3', function () {
            expect(new Segment('foo').estimate('foo')).toBe(3);
            expect(new Segment('foo?').estimate('foo')).toBe(3);
        });
        it('Return 2', function () {
            expect(new Segment('{foo:a}').estimate('foo')).toBe(2);
            expect(new Segment('{foo:a}?').estimate('foo')).toBe(2);
            expect(new Segment('{foo:i}').estimate('1')).toBe(2);
            expect(new Segment('{foo:i}?').estimate('1')).toBe(2);
            expect(new Segment('{foo:[0-9]{2}}').estimate('00')).toBe(2);
            expect(new Segment('{foo:[0-9]{2}}?').estimate('00')).toBe(2);
        });
        it('Return 1', function () {
            expect(new Segment('{foo}').estimate('any')).toBe(1);
            expect(new Segment('{foo}?').estimate('any')).toBe(1);
        });
        it('Return 0', function () {
            expect(new Segment('optional?').estimate('')).toBe(0);
            expect(new Segment('optional?').estimate('foo')).toBe(0);
            expect(new Segment('{optional}?').estimate('')).toBe(0);
            expect(new Segment('{optional:i}?').estimate('foo')).toBe(0);
        });
        it('Return -1', function () {
            expect(new Segment('foo').estimate('a')).toBe(-1);
            expect(new Segment('{foo:a}').estimate('1')).toBe(-1);
            expect(new Segment('{foo:i}').estimate('a')).toBe(-1);
            expect(new Segment('{foo:[0-9]{2}}').estimate('2')).toBe(-1);
        });
    });
    describe('getType', function () {
        it('Return COMMON type', function () {
            expect((Segment as any).getType('common')).toBe(SegmentType.COMMON);
        });
        it('Return ANY type', function () {
            expect((Segment as any).getType('{any}')).toBe(SegmentType.ANY);
        });
        it('Return ALPHA type', function () {
            expect((Segment as any).getType('{str:a}')).toBe(SegmentType.ALPHA);
        });
        it('Return INTEGER type', function () {
            expect((Segment as any).getType('{int:i}')).toBe(SegmentType.INTEGER);
        });
        it('Return PATTERN type', function () {
            expect((Segment as any).getType('{reg:[a-z]+}')).toBe(SegmentType.PATTERN);
        });
    });
    describe('getName', function () {
        it('Return property name', function () {
            expect((Segment as any).getName('')).toBe('');
            expect((Segment as any).getName('common')).toBe('common');
            expect((Segment as any).getName('{foo}')).toBe('foo');
            expect((Segment as any).getName('{bar:i}')).toBe('bar');
            expect((Segment as any).getName('{reg:[a-z]+}')).toBe('reg');
        });
    });
    describe('getPattern', function () {
        it('Return NULL', function () {
            expect((Segment as any).getPattern('common')).toBe(null);
            expect((Segment as any).getPattern('{bar:i}')).toBe(null);
        });
        it('Return regexp pattern', function () {
            const res = (Segment as any).getPattern('{foo:[a-z]+}');
            expect(res).toBeInstanceOf(RegExp);
            expect(res.source).toBe('[a-z]+');
        });
    });
    describe('getOptional', function () {
        it('Return true', function () {
            expect((Segment as any).getOptional('common-optional?')).toBe(true);
        });
        it('Return false', function () {
            expect((Segment as any).getOptional('common-optional')).toBe(false);
        });
    });
});
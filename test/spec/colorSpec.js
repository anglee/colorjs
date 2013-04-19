describe('color.js', function() {
    describe('new Color', function() {
        it('r', function() {
            expect(new Color(128, 0, 0).r).toEqual(128);
        });
        it('g', function() {
            expect(new Color(0, 128, 0).g).toEqual(128);
        });
        it('b', function() {
            expect(new Color(0, 0, 128).b).toEqual(128);
        });
    });
    describe('to', function() {
        it('rgb', function() {
            expect(new Color(255, 128, 0).rgb()).toEqual({r: 255, g: 128, b: 0});
        });
        it('hsb', function() {
            expect(new Color(255, 0, 0).hsb()).toEqual({h: 0, s: 1, b:1});
        });
        it('hex', function() {
            expect(new Color(255, 128, 0).hex()).toEqual("#ff8000");
        });
    });
    describe('brighter', function() {
        it('black', function() {
            expect(new Color(0, 0, 0).brighter().rgb()).toEqual({r: 3, g: 3, b: 3});
        });
        it('other color', function() {
            expect(new Color(252, 128, 0).brighter().rgb()).toEqual({r: 255, g: 182, b: 0});
        });
    });
    describe('co', function() {
        it('HSBtoRGB', function() {
            expect(co.HSBtoRGB(0, 1, 1)).toEqual({r: 255, g: 0, b: 0});
        });
        it('RGBtoHSB', function() {
            expect(co.RGBtoHSB(255, 0, 0)).toEqual({h: 0, s: 1, b: 1});
        });        
    });
});
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

Color.prototype.const = {FACTOR: 0.7};
Color.prototype.util = {
    int: function(num) { return parseInt(num, 10); }
};

Color.prototype.brighter = function () {
    var int = this.util.int;
    var FACTOR = this.const.FACTOR;
    // 1. black.brighter() should return grey
    // 2. applying brighter to blue will always return blue, brighter
    // 3. non pure color (non zero rgb) will eventually return white
    var i = int(1.0 / (1.0 - FACTOR));
    var r = this.r, g = this.g, b = this.b;
    if (r === 0 && g === 0 && b === 0) {
        return new Color(i, i, i);
    }
    if (r > 0 && r < i) { r = i; }
    if (g > 0 && g < i) { g = i; }
    if (b > 0 && b < i) { b = i; }

    return new Color(
        Math.min(int(r / FACTOR), 255),
        Math.min(int(g / FACTOR), 255),
        Math.min(int(b / FACTOR), 255));
};

Color.prototype.darker = function() {
    var int = this.util.int;
    var FACTOR = this.const.FACTOR;
    var r = this.r, g = this.g, b = this.b;
    return new Color(
        Math.max(int(r * FACTOR), 0),
        Math.max(int(g * FACTOR), 0),
        Math.max(int(b * FACTOR), 0));
};

co = {};
co.util = Color.prototype.util;
co.HSBtoRGB = function (hue, saturation, brightness) {
    var int = this.util.int;
    var r = 0, g = 0, b = 0;
    if (saturation === 0) {
        r = g = b = int(brightness * 255.0 + 0.5);
    } else {
        var h = (hue - Math.floor(hue)) * 6.0;
        var f = h - Math.floor(h);
        var p = brightness * (1.0 - saturation);
        var q = brightness * (1.0 - saturation * f);
        var t = brightness * (1.0 - (saturation * (1.0 - f)));
        switch (int(h)) {
            case 0:
                r = int(brightness * 255.0 + 0.5);
                g = int(t * 255.0 + 0.5);
                b = int(p * 255.0 + 0.5);
                break;
            case 1:
                r = int(q * 255.0 + 0.5);
                g = int(brightness * 255.0 + 0.5);
                b = int(p * 255.0 + 0.5);
                break;
            case 2:
                r = int(p * 255.0 + 0.5);
                g = int(brightness * 255.0 + 0.5);
                b = int(t * 255.0 + 0.5);
                break;
            case 3:
                r = int(p * 255.0 + 0.5);
                g = int(q * 255.0 + 0.5);
                b = int(brightness * 255.0 + 0.5);
                break;
            case 4:
                r = int(t * 255.0 + 0.5);
                g = int(p * 255.0 + 0.5);
                b = int(brightness * 255.0 + 0.5);
                break;
            case 5:
                r = int(brightness * 255.0 + 0.5);
                g = int(p * 255.0 + 0.5);
                b = int(q * 255.0 + 0.5);
                break;
        }
    }
    return {r: r, g: g, b: b};
};

co.RGBtoHSB = function (r, g, b) {
    var hue, saturation, brightness;
    var cmax = Math.max(r, g, b);
    var cmin = Math.min(r, g, b);
    var crange = cmax - cmin;
    brightness = cmax / 255.0;
    if (cmax !== 0) {
        saturation = crange / cmax;
    } else {
        saturation = 0;
    }
    if (saturation === 0) {
        hue = 0;
    } else {
        var rc = (cmax - r) / crange;
        var gc = (cmax - g) / crange;
        var bc = (cmax - b) / crange;
        switch (cmax) {
            case r:
                hue = bc - gc;
                break;
            case g:
                hue = 2.0 + rc - bc;
                break;
            case b:
                hue = 4.0 + gc - rc;
                break;
        }
        hue = hue / 6.0;
        if (hue < 0) {
            hue += 1.0;
        }
    }
    return {h: hue, s: saturation, b: brightness};
};

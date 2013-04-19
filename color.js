co = {};
co.util = {
    int: function(num) { return parseInt(num, 10); },
    hex: function(num) { var hex = num.toString(16); return hex.length === 1 ? "0" + hex : hex; },
    toDecimal: function(string) { return parseInt(string, 16); },
    isNumber: function(n) { return !isNaN(parseFloat(n)) && isFinite(n); },
    isString: function(obj) { return toString.call(obj) === '[object String]'; },
    isRGB: function(obj) { return obj.hasOwnProperty('r') && obj.hasOwnProperty('g') && obj.hasOwnProperty('b'); },
    isHSV: function(obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('v'); },
    isHSB: function(obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('b'); },
    isHSL: function(obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('l'); },
    isHLS: function(obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('l'); },
    isHex: function (obj) { return this.isString(obj) && obj.charAt(0) === "#" && obj.length === 7; },
    isShortHex: function (obj) { return this.isString(obj) && obj.charAt(0) === "#" && obj.length === 4; }
};

function Color(r, g, b) {
    if (arguments.length === 3) {
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
    } else {
        var rgb = this.co.color(arguments[0]);
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
    }
}

Color.prototype.const = {FACTOR: 0.7};
Color.prototype.co = co;

Color.prototype.red = function() {
    return this.r;
};
Color.prototype.green = function() {
    return this.g;
};
Color.prototype.blue = function() {
    return this.b;
};
Color.prototype.hue = function() {
    return this.hsv().h;
};
Color.prototype.saturation = function() {
    return this.hsv().s;
};
Color.prototype.value = function() {
    return this.hsv().v;
};
Color.prototype.brightness = function() {
    return this.hsb().b;
};
Color.prototype.lightness = function() {
    return this.hsl().l;
};
Color.prototype.rgb = function() {
    return {r: this.r, g: this.g, b: this.b};
};
Color.prototype.rgbArray = function() {
    return [this.r, this.g, this.b];
};
Color.prototype.hsb = function() {
    return this.co.RGBtoHSB(this.r, this.g, this.b);
};
Color.prototype.hsbArray = function() {
    var hsb = this.co.RGBtoHSB(this.r, this.g, this.b);
    return [hsb.h, hsb.s, hsb.b];
};
Color.prototype.hsv = function() {
    return this.co.RGBtoHSV(this.r, this.g, this.b);
};
Color.prototype.hsvArray = function() {
    var hsv = this.co.RGBtoHSV(this.r, this.g, this.b);
    return [hsv.h, hsv.s, hsv.v];
};
Color.prototype.hsl = function() {
    return this.co.RGBtoHSL(this.r, this.g, this.b);
};
Color.prototype.hslArray = function() {
    var hsl = this.co.RGBtoHSL(this.r, this.g, this.b);
    return [hsl.h, hsl.s, hsl.l];
};
Color.prototype.hls = function() {
    return this.co.RGBtoHLS(this.r, this.g, this.b);
};
Color.prototype.hlsArray = function() {
    var hls = this.co.RGBtoHLS(this.r, this.g, this.b);
    return [hls.h, hls.l, hls.s];
};
Color.prototype.hex = function() {
    return this.co.RGBtoHEX(this.r, this.g, this.b);
};

co.color = function() {
    if (arguments.length === 3) {
        return this.rgb(arguments[0], arguments[1], arguments[2]);
    } else if (arguments.length === 1) {
        var arg0 = arguments[0];
        if (this.util.isRGB(arg0)) { return this.rgb(arg0); }
        else if (this.util.isHSV(arg0)) { return this.hsv(arg0); }
        else if (this.util.isHSB(arg0)) { return this.hsb(arg0); }
        else if (this.util.isHSL(arg0)) { return this.hsl(arg0); }
        else if (this.util.isHLS(arg0)) { return this.hls(arg0); }
        else if (this.util.isHex(arg0)) { return this.hex(arg0); }
        else if (this.util.isShortHex(arg0)) { return this.shortHex(arg0); }
    }
};
co.rgb = function(r, g, b) {
    if (arguments.length === 1 && this.util.isRGB(arguments[0])) {        
        return this.rgb(arguments[0].r, arguments[0].g, arguments[0].b);
    }    
    return new Color(r, g, b);
};
co.hsb = function(h, s, b) {   
    return this.rgb(this.HSBtoRGB(h, s, b));
};
co.hsv = function(h, s, v) {   
    return this.rgb(this.HSVtoRGB(h, s, v));
};
co.hsl = function(h, s, l) {   
    return this.rgb(this.HSLtoRGB(h, s, l));
};
co.hls = function(h, l, s) {   
    return this.rgb(this.HSLtoRGB(h, s, l));
};
co.hex = function(hex) {
    var rgb = this.HEXtoRGB(hex);
    return new Color(rgb.r, rgb.g, rgb.b);
};
co.shortHex = function(shortHex) {
    var rgb = this.shortHEXtoRGB(shortHex);
    return new Color(rgb.r, rgb.g, rgb.b);
};

co.RGBtoHEX = function(r, g, b) {
    var toHex = this.util.hex;
    if (arguments.length === 3) {
        return "#" + toHex(r) + toHex(g) + toHex(b);
    } else if (arguments.length === 1 && this.util.isRGB(arguments[0])) {        
        return this.RGBtoHEX(arguments[0].r, arguments[0].g, arguments[0].b);
    }
};

co.HEXtoRGB = function(hex) {
    var toDecimal = this.util.toDecimal;
    var r = toDecimal(hex.substring(1, 3));
    var g = toDecimal(hex.substring(3, 5));
    var b = toDecimal(hex.substring(5, 7));
    return {r: r, g: g, b: b};    
};

co.shortHEXtoRGB = function(hex) {
    var toDecimal = this.util.toDecimal;
    var r = toDecimal(shortHex.charAt(1));
    var g = toDecimal(shortHex.charAt(2));
    var b = toDecimal(shortHex.charAt(3));
    return {r:r, g:g, b:b};  
};

co.HSBtoRGB = function(hue, saturation, brightness) {
    if (arguments.length === 3) {
        return this.HSVtoRGB(hue, saturation, brightness);
    } else if (arguments.length === 1 && this.util.isHSB(arguments[0])) {
        return this.HSVtoRGB(arguments[0].h, arguments[0].s, arguments[0].b);
    }
};
co.HSVtoRGB = function (h, s, v) {
    var int = this.util.int;
    var r = 0, g = 0, b = 0;
    if (arguments.length === 1 && this.util.isHSV(arguments[0])) {
        return this.HSVtoRGB(arguments[0].h, arguments[0].s, arguments[0].v);
    } 
    if (s === 0) {
        r = g = b = int(v * 255.0 + 0.5);
    } else {
        var h = (h - Math.floor(h)) * 6.0;
        var f = h - Math.floor(h);
        var p = v * (1.0 - s);
        var q = v * (1.0 - s * f);
        var t = v * (1.0 - (s * (1.0 - f)));
        switch (int(h)) {
            case 0:
                r = int(v * 255.0 + 0.5);
                g = int(t * 255.0 + 0.5);
                b = int(p * 255.0 + 0.5);
                break;
            case 1:
                r = int(q * 255.0 + 0.5);
                g = int(v * 255.0 + 0.5);
                b = int(p * 255.0 + 0.5);
                break;
            case 2:
                r = int(p * 255.0 + 0.5);
                g = int(v * 255.0 + 0.5);
                b = int(t * 255.0 + 0.5);
                break;
            case 3:
                r = int(p * 255.0 + 0.5);
                g = int(q * 255.0 + 0.5);
                b = int(v * 255.0 + 0.5);
                break;
            case 4:
                r = int(t * 255.0 + 0.5);
                g = int(p * 255.0 + 0.5);
                b = int(v * 255.0 + 0.5);
                break;
            case 5:
                r = int(v * 255.0 + 0.5);
                g = int(p * 255.0 + 0.5);
                b = int(q * 255.0 + 0.5);
                break;
        }
    }
    return {r: r, g: g, b: b};
};

co.RGBtoHSB = function (r, g, b) {
    if (arguments.length === 1 && this.util.isRGB(arguments[0])) {        
        return this.RGBtoHSB(arguments[0].r, arguments[0].g, arguments[0].b);
    }    
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

co.RGBtoHSV = function (r, g, b) {
    var hsb = this.RGBtoHSB(r, g, b);
    return {h: hsb.h, s: hsb.s, v: hsb.b};
};

co.YIQtoRGB = function (y, i, q) {
    
};

co.RGBtoYIQ = function (r, g, b) {
    
};

co.HLStoRGB = function (h, l, s) {
    var r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {r: r * 255, g: g * 255, b: b * 255};
};

co.RGBtoHLS = function (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var cmax = Math.max(r, g, b);
    var cmin = Math.min(r, g, b);
    var h, s, l = (cmax + cmin) / 2;

    if (cmax === cmin) {
        h = s = 0;
    } else {
        var d = cmax - cmin;
        s = l > 0.5 ? d / (2 - cmax - cmin) : d / (cmax + cmin);
        switch (cmax) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return {h: h, l: l, s: s};    
};

co.HSLtoRGB = function (h, s, l) {
    return this.HLStoRGB(h, l, s);
};

co.RGBtoHSL = function (r, g, b) {
    return this.RGBtoHLS(r, g, b);
};

Color.prototype.brighter = function () {
    var int = this.co.util.int;
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
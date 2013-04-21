co = {};
co.util = {
    int: function (num) { return parseInt(num, 10); },
    hex: function (num) { var hex = num.toString(16); return hex.length === 1 ? "0" + hex : hex; },
    toDecimal: function (string) { return parseInt(string, 16); },
    isNumber: function (n) { return !isNaN(parseFloat(n)) && isFinite(n); },
    isString: function (obj) { return toString.call(obj) === '[object String]'; },
    isRGB: function (obj) { return obj.hasOwnProperty('r') && obj.hasOwnProperty('g') && obj.hasOwnProperty('b'); },
    isHSV: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('v'); },
    isHSB: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('b'); },
    isHSL: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('l'); },
    isHLS: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('l'); },
    isHex: function (obj) { return this.isString(obj) && obj.charAt(0) === "#" && obj.length === 7; },
    isShortHex: function (obj) { return this.isString(obj) && obj.charAt(0) === "#" && obj.length === 4; },
    isCssColorName: function (obj) { return this.isString(obj) && co.cssColors[obj.toLowerCase()]; },
    lerp: function (start, end, ratio) { return start === end ? start : start + (end - start ) * ratio; }
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

Color.prototype.red = function () {
    return this.r;
};
Color.prototype.green = function () {
    return this.g;
};
Color.prototype.blue = function () {
    return this.b;
};
Color.prototype.hue = function () {
    return this.hsv().h;
};
Color.prototype.saturation = function () {
    return this.hsv().s;
};
Color.prototype.value = function () {
    return this.hsv().v;
};
Color.prototype.brightness = function () {
    return this.hsb().b;
};
Color.prototype.lightness = function () {
    return this.hsl().l;
};
Color.prototype.rgb = function () {
    return {r: this.r, g: this.g, b: this.b};
};
Color.prototype.rgbArray = function () {
    return [this.r, this.g, this.b];
};
Color.prototype.hsb = function () {
    return this.co.RGBtoHSB(this.r, this.g, this.b);
};
Color.prototype.hsbArray = function () {
    var hsb = this.co.RGBtoHSB(this.r, this.g, this.b);
    return [hsb.h, hsb.s, hsb.b];
};
Color.prototype.hsv = function () {
    return this.co.RGBtoHSV(this.r, this.g, this.b);
};
Color.prototype.hsvArray = function () {
    var hsv = this.co.RGBtoHSV(this.r, this.g, this.b);
    return [hsv.h, hsv.s, hsv.v];
};
Color.prototype.hsl = function () {
    return this.co.RGBtoHSL(this.r, this.g, this.b);
};
Color.prototype.hslArray = function () {
    var hsl = this.co.RGBtoHSL(this.r, this.g, this.b);
    return [hsl.h, hsl.s, hsl.l];
};
Color.prototype.hls = function () {
    return this.co.RGBtoHLS(this.r, this.g, this.b);
};
Color.prototype.hlsArray = function () {
    var hls = this.co.RGBtoHLS(this.r, this.g, this.b);
    return [hls.h, hls.l, hls.s];
};
Color.prototype.hex = function () {
    return this.co.RGBtoHEX(this.r, this.g, this.b);
};

co.color = function () {
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
        else if (this.util.isCssColorName(arg0)) { return this.css(arg0); }
    }
};

co.rgb = function (r, g, b) { // create Color from rgb
    if (arguments.length === 1 && this.util.isRGB(arguments[0])) {        
        return this.rgb(arguments[0].r, arguments[0].g, arguments[0].b);
    }    
    return new Color(r, g, b);
};
co.hsb = function (h, s, b) { // create Color from hsb
    return this.rgb(this.HSBtoRGB(h, s, b));
};
co.hsv = function (h, s, v) { // create Color from hsv
    return this.rgb(this.HSVtoRGB(h, s, v));
};
co.hsl = function (h, s, l) { // create Color from hsl
    return this.rgb(this.HSLtoRGB(h, s, l));
};
co.hls = function (h, l, s) { // create Color from hls
    return this.rgb(this.HSLtoRGB(h, s, l));
};
co.hex = function (hex) { // create Color from hex, e.g. #ff0000
    var rgb = this.HEXtoRGB(hex);
    return new Color(rgb.r, rgb.g, rgb.b);
};
co.shortHex = function (shortHex) { // create Color from short hex, e.g. #333
    var rgb = this.shortHEXtoRGB(shortHex);
    return new Color(rgb.r, rgb.g, rgb.b);
};
co.css = function (cssColorName) { // create Color from css color name, e.g. "red"
    var hex = this.cssColors[cssColorName];
    return this.hex(hex);
};

co.RGBtoHEX = function (r, g, b) { 
    var toHex = this.util.hex;
    if (arguments.length === 3) {
        // input can be 3 args, r, g, b
        return "#" + toHex(r) + toHex(g) + toHex(b);
    } else if (arguments.length === 1 && this.util.isRGB(arguments[0])) {
        // or a single arg, e.g. {r: 255, g: 0, b:128}
        return this.RGBtoHEX(arguments[0].r, arguments[0].g, arguments[0].b);
    }
};

co.HEXtoRGB = function (hex) {
    var toDecimal = this.util.toDecimal;
    var r = toDecimal(hex.substring(1, 3));
    var g = toDecimal(hex.substring(3, 5));
    var b = toDecimal(hex.substring(5, 7));
    return {r: r, g: g, b: b};    
};

co.shortHEXtoRGB = function (hex) {
    var toDecimal = this.util.toDecimal;
    var r = toDecimal(shortHex.charAt(1));
    var g = toDecimal(shortHex.charAt(2));
    var b = toDecimal(shortHex.charAt(3));
    return {r: r, g: g, b: b};  
};

co.HSBtoRGB = function (hue, saturation, brightness) {
    if (arguments.length === 3) {
        return this.HSVtoRGB(hue, saturation, brightness);
    } else if (arguments.length === 1 && this.util.isHSB(arguments[0])) {
        return this.HSVtoRGB(arguments[0].h, arguments[0].s, arguments[0].b);
    }
};
co.HSVtoRGB = function (h, s, v) {
    if (arguments.length === 1 && this.util.isHSV(arguments[0])) {
        return this.HSVtoRGB(arguments[0].h, arguments[0].s, arguments[0].v);
    }
    var int = this.util.int;
    var r = 0, g = 0, b = 0; 
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
    if (arguments.length === 1 && this.util.isRGB(arguments[0])) {
        return this.RGBtoHSV(arguments[0].r, arguments[0].g, arguments[0].b);
    }    
    var hsb = this.RGBtoHSB(r, g, b);
    return {h: hsb.h, s: hsb.s, v: hsb.b};
};

co.YIQtoRGB = function (y, i, q) {
    
};

co.RGBtoYIQ = function (r, g, b) {
    
};

co.HLStoRGB = function (h, l, s) {
    var int = this.util.int;
    if (arguments.length === 1 && this.util.isHLS(arguments[0])) {
        return this.HLStoRGB(arguments[0].h, arguments[0].l, arguments[0].s);
    }    
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

    return {r: int(r * 255), g: int(g * 255), b: int(b * 255)};
};

co.RGBtoHLS = function (r, g, b) {
    if (arguments.length === 1 && this.util.isRGB(arguments[0])) {
        return this.RGBtoHLS(arguments[0].r, arguments[0].g, arguments[0].b);
    }    
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
    if (arguments.length === 1 && this.util.isHSL(arguments[0])) {
        return this.HSLtoRGB(arguments[0].h, arguments[0].s, arguments[0].l);
    }    
    return this.HLStoRGB(h, l, s);
};

co.RGBtoHSL = function (r, g, b) {
    if (arguments.length === 1 && this.util.isRGB(arguments[0])) {
        return this.RGBtoHSL(arguments[0].r, arguments[0].g, arguments[0].b);
    }    
    return this.RGBtoHLS(r, g, b);
};

co.blend = co.mix = function (color1, color2, ratio) {
    var int = this.util.int;
    var lerp = this.util.lerp;    
    color1 = this.color(color1);
    color2 = this.color(color2);
    if (ratio !== 0 && !ratio) {
        ratio = 0.5;
    }
    return new Color(
            int(lerp(color1.r, color2.r, ratio)),
            int(lerp(color1.g, color2.g, ratio)),
            int(lerp(color1.b, color2.b, ratio)));
};
co.lerp = function (colors, ratio) {
    // evenly distributed colors from 0.0 to 1.0
    ratio = ratio * (colors.length - 1);
    var i = Math.floor(ratio);
    var j = Math.ceil(ratio);
    if (i === j) {
        return new Color(colors[j]);
    } else {
        ratio = ratio - i;
        return this.blend(colors[i], colors[j], ratio);
    }    
};
co.blendHSL = co.mixHSL = function (color1, color2, ratio) {
    var lerp = this.util.lerp;
    color1 = this.color(color1);
    color2 = this.color(color2);    
    var hsl1 = color1.hsl(), hsl2 = color2.hsl();
    return this.hsl(
            lerp(hsl1.h, hsl2.h, ratio),
            lerp(hsl1.s, hsl2.s, ratio),
            lerp(hsl1.l, hsl2.l, ratio));
};
co.lerpHSL = function (colors, ratio) {
    ratio = ratio * colors.length;
    var i = Math.floor(ratio);
    var j = Math.ceil(ratio);
    if (i === j) {
        return new Color(colors[j]);
    } else {
        ratio = ratio - i;
        return blendHSL(colors[i], colors[j], ratio);
    }    
};
co.palette = function (colors, levels, func) {
    // TODO, now colors assume to be an array
    // make it also take a preset name.
    if (!levels) { levels = colors.length; }
    var result = [];
    for (var i = 0; i < levels; ++i) {
        if (func) {
            if (this.util.isString(func)) {
                func = Color.prototype[func];
            }
            result.push(func.apply(co.lerp(colors, i / (levels - 1))));
        } else {
            result.push(co.lerp(colors, i / (levels - 1)));
        }
    }
    if (!func) {
        for (var f in Color.prototype) {
            (function() {
                var fun = f;
                result[f] = function() {
                    var result2 = [];
                    for (var j = 0; j < this.length; ++j) {
                        result2.push(this[j][fun]());
                    }
                    if (result2[0] instanceof Color) {
                        return co.palette(result2);
                    } else {
                        return result2;
                    }
                };
            })();
        }
    }
    return result;
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

Color.prototype.darker = function () {
    var int = this.co.util.int;
    var FACTOR = this.const.FACTOR;
    var r = this.r, g = this.g, b = this.b;
    return new Color(
        Math.max(int(r * FACTOR), 0),
        Math.max(int(g * FACTOR), 0),
        Math.max(int(b * FACTOR), 0));
};

Color.prototype.complement = function () {
    // TODO
};

co.cssColors = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dcf",
    "bisque": "#ffe4c4f",
    "black": "#000000f",
    "blanchedalmond": "#ffebcdf",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
};
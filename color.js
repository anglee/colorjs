co = {};
co.util = {
    int: function (num) { return parseInt(num, 10); },
    hex: function (num) { num = parseInt(num, 10); var hex = num.toString(16); return hex.length === 1 ? "0" + hex : hex; },
    toDecimal: function (string) { return parseInt(string, 16); },
    isNumber: function (n) { return !isNaN(parseFloat(n)) && isFinite(n); },
    isString: function (obj) { return toString.call(obj) === '[object String]'; },
    isRGB: function (obj) { return obj.hasOwnProperty('r') && obj.hasOwnProperty('g') && obj.hasOwnProperty('b'); },
    isCMYK: function (obj) { return obj.hasOwnProperty('c') && obj.hasOwnProperty('m') && obj.hasOwnProperty('y') && obj.hasOwnProperty('k'); },
    isHCL: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('c') && obj.hasOwnProperty('l'); },
    isHSV: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('v'); },
    isHSB: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('b'); },
    isHSL: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('l'); },
    isHLS: function (obj) { return obj.hasOwnProperty('h') && obj.hasOwnProperty('s') && obj.hasOwnProperty('l'); },
    isHex: function (obj) { return this.isString(obj) && obj.charAt(0) === "#" && obj.length === 7; },
    isShortHex: function (obj) { return this.isString(obj) && obj.charAt(0) === "#" && obj.length === 4; },
    isLAB: function (obj) { return obj.hasOwnProperty('l') && obj.hasOwnProperty('a') && obj.hasOwnProperty('b'); },
    isLUV: function (obj) { return obj.hasOwnProperty('l') && obj.hasOwnProperty('u') && obj.hasOwnProperty('v'); },
    isXYZ: function (obj) { return obj.hasOwnProperty('x') && obj.hasOwnProperty('y') && obj.hasOwnProperty('z'); },
    isYIQ: function (obj) { return obj.hasOwnProperty('y') && obj.hasOwnProperty('i') && obj.hasOwnProperty('q'); },
    isYUV: function (obj) { return obj.hasOwnProperty('y') && obj.hasOwnProperty('u') && obj.hasOwnProperty('v'); },
    isCssColorName: function (obj) { return this.isString(obj) && co.cssColors[obj.toLowerCase()]; },
    lerp: function (start, end, ratio) { return start === end ? start : start + (end - start ) * ratio; }
};

function Color(r, g, b, a) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (r === undefined) {
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.a = 1.0;
        } else {
            var rgb = this.co.color(arguments[0]);
            this.r = rgb.r;
            this.g = rgb.g;
            this.b = rgb.b;
            this.a = (rgb.a === undefined)? 1.0 : rgb.a;
        }
    } else if (arguments.length === 3) {
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
        this.a = 1.0;
    } else if (arguments.length === 3) {
        this.r = Math.max(0, Math.min(r, 255));
        this.g = Math.max(0, Math.min(g, 255));
        this.b = Math.max(0, Math.min(b, 255));
        this.a = Math.max(0.0, Math.min(a, 1.0));
    }
}

Color.prototype.const = {FACTOR: 0.7};
Color.prototype.co = co;

Color.prototype.red = function (value) {
    if (arguments.length === 1) {
        this.r = Math.max(0, Math.min(value, 255));
        return this;
    } else {
        return this.co.util.int(this.r);
    }
};
Color.prototype.green = function (value) {
    if (arguments.length === 1) {
        this.g = Math.max(0, Math.min(value, 255));
        return this;
    } else {
        return this.co.util.int(this.g);
    }
};
Color.prototype.blue = function (value) {
    if (arguments.length === 1) {
        this.b = Math.max(0, Math.min(value, 255));
        return this;
    } else {
        return this.co.util.int(this.b);
    }
};
Color.prototype.alpha = function (value) {
    if (arguments.length === 1) {
        this.a = Math.max(0.0, Math.min(value, 1.0));
        return this;
    } else {
        return this.a;
    }
};
Color.prototype.hue = function () {
    if (arguments.length === 1) {
        var hsl = this.hsl();
        var rgb = this.co.HSLtoRGB(arguments[0], hsl.g, hsl.l);
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        return this;
    } else {
        return this.hsl().h;
    }
};
Color.prototype.hueAngle = function () {
    if (arguments.length === 1) {
        var value = arguments[0];
        while (value >= 360) {
            value -= 360;
        }
        while (value < 0) {
            value += 360;
        }
        var hsl = this.hsl();        
        var rgb = this.co.HSLtoRGB(value / 360, hsl.g, hsl.l);
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        return this;
    } else {
        return this.hsl().h * 360;
    }
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
    if (arguments.length === 1) {
        var hsl = this.hsl();
        var rgb = this.co.HSLtoRGB(hsl.h, hsl.g, arguments[0]);
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        return this;
    } else {
        return this.hsl().l;
    }        
};
Color.prototype.rgb = function (r, g, b) {
    if (arguments.length === 0) {
        var int = this.co.util.int;
        return {r: int(this.r), g: int(this.g), b: int(this.b)};
    } else {
        var temp = new Color(r, g, b);
        this.r = temp.r;
        this.g = temp.g;
        this.b = temp.b;
        return this;
    }
};
Color.prototype.rgba = function (r, g, b, a) {
    if (arguments.length === 0) {
        var int = this.co.util.int;
        return {r: int(this.r), g: int(this.g), b: int(this.b), a: this.a};
    } else {
        var temp = new Color(r, g, b, a);
        this.r = temp.r;
        this.g = temp.g;
        this.b = temp.b;
        this.a = temp.a;
        return this;
    }
};
Color.prototype.rgbArray = function (rgbArray) {
    if (arguments.length === 0) {
        var int = this.util.int;
        return [int(this.r), int(this.g), int(this.b)];
    } else {
        this.r = rgbArray[0];
        this.g = rgbArray[1];
        this.b = rgbArray[2];
        return this;
    }
};

Color.prototype.rgbString = function () {
    if (arguments.length === 0) {
        var int = this.util.int;
        return "rgb(" + int(this.r) + "," + int(this.g) + "," + int(this.b) + ")";
    } else {
        var rgb = rgbString.replace(/ /g, "").replace("rgb(", "").replace(")", "").split(',');
        this.r = parseInt(rgb[0]);
        this.g = parseInt(rgb[1]);
        this.b = parseInt(rgb[2]);
        return this;
    }
};
Color.prototype.rgbaString = function() {
    if (arguments.lenth === 0) {
        var int = this.util.int;
        return "rgba(" + int(this.r) + "," + int(this.g) + "," + int(this.b) + "," + this.a + ")";
    } else {
        var rgba = rgbString.replace(/ /g, "").replace("rgba(", "").replace(")", "").split(',');
        this.r = parseInt(rgba[0]);
        this.g = parseInt(rgba[1]);
        this.b = parseInt(rgba[2]);
        this.a = parseFloat(rgba[3]);
        return this;
    }
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
Color.prototype.hslString = function () {
    var hsl = this.co.RGBtoHSL(this.r, this.g, this.b);
    return "hsl(" +  (hsl.h * 360).toFixed(1) + "," + (hsl.s * 100).toFixed(1) + "%," + (hsl.l * 100).toFixed(1) + "%)";
};
Color.prototype.hslaString = function () {
    var hsl = this.co.RGBtoHSL(this.r, this.g, this.b);   
    return "hsla(" +  (hsl.h * 360).toFixed(1) + "," + (hsl.s * 100).toFixed(1) + "%," + (hsl.l * 100).toFixed(1) + "," + this.a +"%)";
};
Color.prototype.hcl = function () {
    return this.co.RGBtoHCL(this.r, this.g, this.b);
};
Color.prototype.hclArray = function () {
    var hcl = this.co.RGBtoHCL(this.r, this.g, this.b);
    return [hcl.h, hcl.c, hcl.l];
};
Color.prototype.hls = function () {
    return this.co.RGBtoHLS(this.r, this.g, this.b);
};
Color.prototype.hlsArray = function () {
    var hls = this.co.RGBtoHLS(this.r, this.g, this.b);
    return [hls.h, hls.l, hls.s];
};
Color.prototype.cmyk = function () {
    return this.co.RGBtoCMYK(this.r, this.g, this.b);
};
Color.prototype.cmykArray = function () {
    var cmyk = this.co.RGBtoCMYK(this.r, this.g, this.b);
    return [cmyk.c, cmyk.m, cmyk.y, cmyk.k];
};
Color.prototype.xyz = function () {
    return this.co.RGBtoXYZ(this.r, this.g, this.b);
};
Color.prototype.xyzArray = function () {
    var xyz = this.co.RGBtoXYZ(this.r, this.g, this.b);
    return [xyz.x, xyz.y, xyz.z];
};
Color.prototype.yiq = function () {
    return this.co.RGBtoYIQ(this.r, this.g, this.b);
};
Color.prototype.yiqArray = function () {
    var yiq = this.co.RGBtoYIQ(this.r, this.g, this.b);
    return [yiq.y, yiq.i, yiq.q];
};
Color.prototype.yuv = function () {
    return this.co.RGBtoYUV(this.r, this.g, this.b);
};
Color.prototype.yuvArray = function () {
    var yuv = this.co.RGBtoYUV(this.r, this.g, this.b);
    return [yuv.y, yuv.u, yuv.v];
};
Color.prototype.lab = function () {
    return this.co.RGBtoLAB(this.r, this.g, this.b);
};
Color.prototype.labArray = function () {
    var lab = this.co.RGBtoLAB(this.r, this.g, this.b);
    return [lab.l, lab.a, lab.b];
};
Color.prototype.luv = function () {
    return this.co.RGBtoLUV(this.r, this.g, this.b);
};
Color.prototype.luvArray = function () {
    var luv = this.co.RGBtoLUV(this.r, this.g, this.b);
    return [luv.l, luv.u, luv.v];
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
    if (g === undefined && b === undefined) { //arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.rgb(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.rgb(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
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
co.hcl = function (h, c, l) { // create Color from hsl
    return this.rgb(this.HCLtoRGB(h, c, l));
};
co.cmyk = function (c, m, y, k) { // create Color from cmyk
    return this.rgb(this.CMYKtoRGB(c, m, y, k));
};
co.yiq = function (y, i, q) {
    return this.rgb(this.YIQtoRGB(y, i, q));
};
co.yuv = function (y, u, v) {
    return this.rgb(this.YUVtoRGB(y, u, v));
};
co.luv = function (l, u, v) {
    return this.rgb(this.LUVtoRGB(l, u, v));
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
    var hex = this.cssColors[cssColorName.toLowerCase()];
    return this.hex(hex);
};

co.RGBtoHEX = function (r, g, b) { 
    var toHex = this.util.hex;
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            // input can be a single arg Object, e.g. {r: 255, g: 0, b:128}
            return this.RGBtoHEX(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            // input can be a single arg Array, e.g. [255, 0, 128]
            return this.RGBtoHEX(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    } else if (arguments.length === 3) {
        //  or 3 args, r, g, b        
        return "#" + toHex(r) + toHex(g) + toHex(b);
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
    if (saturation === undefined && brightness === undefined) { // arguments.length === 1
        if (this.util.isHSB(arguments[0])) {
            return this.HSVtoRGB(arguments[0].h, arguments[0].s, arguments[0].b);
        } else {
            return this.HSVtoRGB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    } else if (arguments.length === 3) {
        return this.HSVtoRGB(hue, saturation, brightness);
    }
};

co.HSVtoRGB = function (h, s, v) {
    if (s === undefined && v === undefined) { // arguments.length === 1
        if (this.util.isHSV(arguments[0])) {
            return this.HSVtoRGB(arguments[0].h, arguments[0].s, arguments[0].v);
        } else {
            return this.HSVtoRGB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    var int = this.util.int;
    var r = 0, g = 0, b = 0; 
    if (s === 0) {
        r = g = b = v;
    } else {
        h = (h - Math.floor(h)) * 6.0;
        var f = h - Math.floor(h);
        var p = v * (1.0 - s);
        var q = v * (1.0 - s * f);
        var t = v * (1.0 - (s * (1.0 - f)));
        switch (int(h)) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
    }
    return {r: r * 255, g: g * 255, b: b * 255};
};

co.RGBtoHSB = function (r, g, b) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoHSB(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoHSB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
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
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoHSV(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoHSV(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    var hsb = this.RGBtoHSB(r, g, b);
    return {h: hsb.h, s: hsb.s, v: hsb.b};
};

co.YIQtoRGB = function (y, i, q) {
    if (i === undefined && q === undefined) { // arguments.length === 1
        if (this.util.isYIQ(arguments[0])) {
            return this.YIQtoRGB(arguments[0].y, arguments[0].i, arguments[0].q);
        } else {
            return this.YIQtoRGB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    var r = y +  0.9563 * i +  0.6210 * q;
    var g = y + -0.2721 * i + -0.6474 * q;
    var b = y + -1.1070 * i +  1.7046 * q;
    return {r: r * 255, g: g * 255, b: b * 255};
};

co.RGBtoYIQ = function (r, g, b) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoYIQ(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoYIQ(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var y = 0.299 * r + 0.587 * g + 0.114 * b;
    var i = 0.595716 * r - 0.274453 * g - 0.321263 * b;
    var q = 0.211456 * r - 0.522591 * g + 0.311135 * b;
    return {y: y, i: i, q: q};
};


co.YUVtoRGB = function (y, u, v) {
    if (u === undefined && v === undefined) { // arguments.length === 1
        if (this.util.isYUV(arguments[0])) {
            return this.YUVtoRGB(arguments[0].y, arguments[0].u, arguments[0].v);
        } else {
            return this.YUVtoRGB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    var r = y + 1.13983 * v;
    var g = y - 0.39465 * u - 0.5806 * v;
    var b = y + 2.03211 * u;
    return {r: r * 255, g: g * 255, b: b * 255};
};

co.RGBtoYUV = function (r, g, b) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoYUV(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoYUV(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var y = 0.299 * r + 0.587 * g + 0.114 * b;
    var u = -0.14713 * r - 0.28886 * g + 0.436 * b;
    var v = 0.615 * r - 0.51499 * g - 0.10001 * b;
    return {y: y, u: u, v: v};
};

co.CMYKtoRGB = function (c, m, y, k) {
    if (m === undefined && y === undefined && k === undefined) { // arguments.length === 1
        if (this.util.isCMYK(arguments[0])) {
            return this.CMYKtoRGB(arguments[0].c, arguments[0].m, arguments[0].y, arguments[0].k);
        } else {
            return this.CMYKtoRGB(arguments[0][0], arguments[0][1], arguments[0][2], arguments[0][3]);
        }
    }    
    var r = (1 - c) * (1 - k);
    var g = (1 - c) * (1 - k);
    var b = (1 - c) * (1 - k);
    return {r: r * 255, g: g * 255, b: b * 255};
};

co.RGBtoCMYK = function (r, g, b) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoCMYK(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoCMYK(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    var c = 0, m = 0, y = 0, k = 0;
    if (r === 0 && g === 0 && b === 0) {
        k = 1;
    } else {
        c = 1 - (r / 255.0);
        m = 1 - (g / 255.0);
        y = 1 - (b / 255.0);
        k = Math.min(c, m, y);
        c = (c - k) / (1 - k);
        m = (m - k) / (1 - k);
        y = (y - k) / (1 - k);
    }
    return {c: c, m: m, y: y, k: k};
};

co.LABtoRGB = function (l, a, b) {
    var xyz = this.LABtoXYZ(l, a, b);
    return co.XYZtoRGB(xyz);
};

co.RGBtoLAB = function (r, g, b) {
    var xyz = this.RGBtoXYZ(r, g, b);
    return co.XYZtoLAB(xyz);
};
co.XYZtoRGB = function (x, y, z) {
    if (x === undefined && y === undefined) { // arguments.length === 1
        if (this.util.isXYZ(arguments[0])) {
            return this.XYZtoRGB(arguments[0].x, arguments[0].y, arguments[0].z);
        } else {
            return this.XYZtoRGB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    x /= 100.0;        //X from 0 to  95.047
    y /= 100.0;        //Y from 0 to 100.000
    z /= 100.0;        //Z from 0 to 108.883

    // from XYZ to sRGB
    var r = x *  3.2404542 + y * -1.5371385 + z * -0.4985314;
    var g = x * -0.9692660 + y *  1.8760108 + z *  0.0415560;
    var b = x *  0.0556434 + y * -0.2040259 + z *  1.0572252;
    var transform = function(c) {
        return (c > 0.0031308) ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : (c * 12.92);
    };
    // from sRGB tp RGB
    r = transform(r);
    g = transform(g);
    b = transform(b);
    return {r: r * 255, g: g * 255, b: b * 255};
};

co.RGBtoXYZ = function (r, g, b) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoXYZ(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoXYZ(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    var transform = function(c) {
        return (c > 0.04045) ? Math.pow((c + 0.055) / 1.055, 2.4) : (c / 12.92);
    };
    // convert to linear RGB (sRGB)
    var sr = transform(r / 255) * 100;
    var sg = transform(g / 255) * 100;
    var sb = transform(b / 255) * 100;
    // then from sRGB to XYZ
    var x = sr * 0.4124564 + sg * 0.3575761 + sb * 0.1804375;
    var y = sr * 0.2126729 + sg * 0.7151522 + sb * 0.0721750;
    var z = sr * 0.0193339 + sg * 0.1191920 + sb * 0.9503041;
    return {x: x, y: y, z: z};
};
co.LUVtoXYZ = function(l, u, v) {
    if (u === undefined && v === undefined) { // arguments.length === 1
        if (this.util.isLUV(arguments[0])) {
            return this.LUVtoXYZ(arguments[0].l, arguments[0].u, arguments[0].v);
        } else {
            return this.LUVtoXYZ(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    var xr = 0.95047;
    var yr = 1;
    var zr = 1.08883;
    var k = 24389.0 / 27.0;
    var y = (l > 8.0) ? Math.pow((l + 16.0) / 116.0, 3.0) : (l / k);
    var u0 = (4.0 * xr) / (xr + 15.0 * yr + 3.0 * zr);
    var v0 = (9.0 * yr) / (xr + 15.0 * yr + 3.0 * zr);

    var a = (((52.0 * l) / (u + 13.0 * l * u0)) - 1.0) / 3.0;
    var b = -5.0 * y;
    var c = -1.0 / 3.0;
    var d = y * (((39.0 * l) / (v + 13.0 * l * v0)) - 5.0);

    var x = (d - b) / (a - c);
    var z = x * a + b;
    return {x: x, y: y, z: z};
};
co.XYZtoLUV = function(x, y, z) {
    if (y === undefined && z === undefined) { // arguments.length === 1
        if (this.util.isXYZ(arguments[0])) {
            return this.XYZtoLAB(arguments[0].x, arguments[0].y, arguments[0].z);
        } else {
            return this.XYZtoLAB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    var xr = 0.95047;
    var yr = 1;
    var zr = 1.08883;
    var den = x + 15.0 * y + 3.0 * z;
    var up = (den > 0.0) ? ((4.0 * x) / den) : 0.0;
    var vp = (den > 0.0) ? ((9.0 * y) / den) : 0.0;
    var urp = (4.0 * xr) / (xr + 15.0 * yr + 3.0 * zr);
    var vrp = (9.0 * yr) / (xr + 15.0 * yr + 3.0 * zr);
    var yr = y / yr;
    var eps = 216.0 / 24398.0;
    var k = 24389.0 / 27.0;
    var l = (yr > eps) ? (116.0 * Math.pow(yr, 1.0 / 3.0) - 16.0) : (k * yr);
    var u = 13.0 * l * (up - urp);
    var v = 13.0 * l * (vp - vrp);
    return {l: l, u: u, v: v};
};

co.LUVtoRGB = function (l, u, v) {
    var xyz = this.LUVtoXYZ(l, u, v);
    return co.XYZtoRGB(xyz);
};

co.RGBtoLUV = function (r, g, b) {
    var xyz = this.RGBtoXYZ(r, g, b);
    return co.XYZtoLUV(xyz);
};

co.LUVtoHCL = co.LUVtoPolarLUV = function(L, U, V) {
    if (U === undefined && V === undefined) { // arguments.length === 1
        if (this.util.isLUV(arguments[0])) {
            return this.LUVtoHCL(arguments[0].l, arguments[0].u, arguments[0].v);
        } else {
            return this.LUVtoHCL(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }     
    var toDegrees = function (radian) {
        return radian * 180.0 / Math.PI; 
    };        
    var l = L;
    var c = Math.sqrt(U * U + V * V);
    var h = toDegress(atan2(V, U));
    while (h > 360) { h -= 360; }
    while (h < 0) { h += 360; }
    return {h: h, c: c, l: l};

};

co.HCLtoLUV = co.PolarLUVtoLUV = function(h, c, l) {
    if (c === undefined && l === undefined) { // arguments.length === 1
        if (this.util.isHCL(arguments[0])) {
            return this.HCLtoLUV(arguments[0].h, arguments[0].c, arguments[0].l);
        } else {
            return this.HCLtoLUV(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    var toRadians = function (degree) {
        return degree * Math.PI / 180.0;
    };
    h = toRadians(h);
    var L = l;
    var U = c * cos(h);
    var V = c * sin(h);
    return {l: L, u: U, v: V};
};

co.HCLtoRGB = function (h, c, l) {
    var luv = this.HCLtoLUV(h, c, l);
    return co.LUVtoRGB(luv);
};

co.RGBtoHCL = function (r, g, b) {
    var luv = this.RGBtoLUV(r, g, b);
    return co.LUVtoHCL(luv);
};


co.LABtoXYZ = function (l, a, b) {
    if (a === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isLAB(arguments[0])) {
            return this.LABtoXYZ(arguments[0].l, arguments[0].a, arguments[0].b);
        } else {
            return this.LABtoXYZ(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    
    var y = (l + 16) / 116;
    var x = a / 500 + y;
    var z = y - b / 200;
    var transform = function (c) {
        var ccc = Math.pow(c, 3);
        return (ccc > 0.008856) ? ccc : (c - 16 / 116) / 7.787;
    };
   
    x = 95.047 * transform(x);
    y = 100.0 * transform(y);
    z = 108.883 * transform(z);
    
    return {x: x, y: y, z: z};    
};

co.XYZtoLAB = function (x, y, z) {
    if (y === undefined && z === undefined) { // arguments.length === 1
        if (this.util.isXYZ(arguments[0])) {
            return this.XYZtoLAB(arguments[0].x, arguments[0].y, arguments[0].z);
        } else {
            return this.XYZtoLAB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }
    x /= 95.047;
    y /= 100.0;
    z /= 108.883;

    var transform = function (c) {
        return (c > 0.008856) ? Math.pow(c, 1/3) : (7.787 * c) + (16 / 116);
    };
    var tx = transform(x);
    var ty = transform(y);
    var tz = transform(z);
    var l = (116 * ty) - 16;
    var a = 500 * (tx - ty);
    var b = 200 * (ty - tz);
    return {l: l, a: a, b: b};
};

co.HLStoRGB = function (h, l, s) {
    var int = this.util.int;
    if (l === undefined && s === undefined) { // arguments.length === 1
        if (this.util.isHLS(arguments[0])) {
            return this.HLStoRGB(arguments[0].h, arguments[0].l, arguments[0].s);
        } else {
            return this.HLStoRGB(arguments[0][0], arguments[0][l], arguments[0][2]);
        }
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

    return {r: r * 255, g: g * 255, b: b * 255};
};

co.RGBtoHLS = function (r, g, b) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoHLS(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoHLS(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
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
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {h: h, l: l, s: s};    
};

co.HSLtoRGB = function (h, s, l) {
    if (s === undefined && l === undefined) { // arguments.length === 1
        if (this.util.isHSL(arguments[0])) {
            return this.HSLtoRGB(arguments[0].h, arguments[0].s, arguments[0].l);
        } else {
            return this.HSLtoRGB(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    return this.HLStoRGB(h, l, s);
};

co.RGBtoHSL = function (r, g, b) {
    if (g === undefined && b === undefined) { // arguments.length === 1
        if (this.util.isRGB(arguments[0])) {
            return this.RGBtoHSL(arguments[0].r, arguments[0].g, arguments[0].b);
        } else {
            return this.RGBtoHSL(arguments[0][0], arguments[0][1], arguments[0][2]);
        }
    }    
    return this.RGBtoHLS(r, g, b);
};

co.distance = co.deltaE_CIE2000 = function (color1, color2, kL, kC, kH) { // see http://www.brucelindbloom.com/
    if (!kL) { kL = 1; }
    if (!kC) { kC = 1; }
    if (!kH) { kH = 1; }
    var sqrt = Math.sqrt;
    var pow = Math.pow;
    var sq = function (num) { return num * num; };
    var p25_7 = pow(25,7);
    var toDegrees = function (radian) {
        return radian * 180.0 / Math.PI; 
    };
    var toRadians = function (degree) {
        return degree * Math.PI / 180.0;
    };
    
    var lab1 = new Color(color1).lab();
    var lab2 = new Color(color2).lab();
    var l1 = lab1.l, a1 = lab1.a, b1 = lab1.b;
    var l2 = lab2.l, a2 = lab2.a, b2 = lab2.b;
    
    var lBar = (l1 + l2) / 2;
    var c1 = sqrt(sq(a1) + sq(b1));
    var c2 = sqrt(sq(a2) + sq(b2));
    var cBar = (c1 + c2) / 2;
    var c7 = pow(cBar, 7);
    var g = (1 - sqrt(c7 / (c7 + p25_7))) / 2;
    
    // adjust a* values
    var a1p = a1 * (1 + g);
    var a2p = a2 * (1 + g);    
    var c1p = sqrt(sq(a1p) + sq(b1));
    var c2p = sqrt(sq(a2p) + sq(b2));
    var cpBar = (c1p + c2p) / 2;
    
    // calculate hue angles
    var h1 = toDegrees(Math.atan2(b1, a1p));
    if (h1 < 0) { h1 += 360; }
    var h2 = toDegrees(Math.atan2(b2, a2p));
    if (h2 < 0) { h2 += 360; }
    
    var hBar = (h1 + h2) / 2;
    var adh = Math.abs(h1 - h2);
    if (adh > 180) {
        hBar += 180;
    }
    
    var t1 = 1 - 0.17 * Math.cos(toRadians(hBar - 30));
    var t2 = 0.24 * Math.cos(toRadians(2 * hBar));
    var t3 = 0.32 * Math.cos(toRadians(3 * hBar + 6));
    var t4 = -0.2 * Math.cos(toRadians(4 * hBar - 63));
    var t = t1 + t2 + t3 + t4;
    
    var dH = h2 - h1;
    if (adh > 180) {
        if (h2 > h1) {
           dH -= 360;
        } else {
           dH += 360;
        }
    }
    dH = 2 * sqrt(c1p * c2p) * Math.sin(toRadians(dH / 2));
    
    var dL = l2 - l1;
    var dC = c2p - c1p;
    
    var sL = 1 + 0.015 * sq(lBar - 50) / sqrt(20 + sq(lBar - 50));
    var sC = 1 + 0.045 * cpBar;
    var sH = 1 + 0.015 * cpBar * t;
    var dTheta = 30 * Math.exp(-1 * sq((hBar - 275) / 25));
    var cp7 = pow(cpBar, 7);
    var rc = 2 * sqrt(cp7 / (cp7 + p25_7));
    var rt = -1 * rc * Math.sin(toRadians(2 * dTheta));
    
    var vL = sq(dL) / sq(kL * sL);
    var vC = sq(dC) / sq(kC * sC);
    var vH = sq(dH) / sq(kH * sH);
    
    return sqrt(vL + vC + vH + rt * dC  * dH / (kC * sC * kH * sH));
    
};
co.deltaE_CIE1976 = function (color1, color2) { // see http://www.brucelindbloom.com/
    var sqrt = Math.sqrt;
    var sq = function (num) { return Math.pow(num, 2); };    
    var lab1 = new Color(color1).lab();
    var lab2 = new Color(color2).lab();
    var l1 = lab1.l, a1 = lab1.a, b1 = lab1.b;
    var l2 = lab2.l, a2 = lab2.a, b2 = lab2.b;
    return sqrt(sq(l1 - l2) + sq(a1 - a2) + sq(b1 - b2));
};
co.deltaE_CIE1994 = function (color1, color2, textiles) { // see http://www.brucelindbloom.com/
    var sqrt = Math.sqrt;
    var sq = function (num) { return Math.pow(num, 2); };    
    var kl = textiles ? 2 : 1;
    var kc = 1;
    var kh = 1;
    var k1 = textiles ? 0.048 : 0.045;
    var k2 = textiles ? 0.014 : 0.015;
    var lab1 = new Color(color1).lab();
    var lab2 = new Color(color2).lab();
    var l1 = lab1.l, a1 = lab1.a, b1 = lab1.b;
    var l2 = lab2.l, a2 = lab2.a, b2 = lab2.b;
    var dl = l1 - l2;
    var da = a1 - a2;
    var db = b1 - b2;
    var c1 = sqrt(sq(a1) + sq(b1));
    var c2 = sqrt(sq(a2) + sq(b2));    
    var dc = c1 - c2;
    var dhsq = sq(da) + sq(db) - sq(dc);
    var sl = 1;
    var sc = 1 + k1 * c1;
    var sh = 1 + k2 * c1;
    return sqrt(sq(dl / (kl * sl)) + sq(dc / (kc * sc)) + dhsq / sq(kh * sh));
};
co.deltaE_CMC = function (color1, color2, l, c) { // see http://www.brucelindbloom.com/
    if (!l) { l = 1; }
    if (!c) { c = 1; }
    var sqrt = Math.sqrt;
    var sq = function (num) { return Math.pow(num, 2); };
    var toDegrees = function (radian) {
        return radian * 180.0 / Math.PI; 
    };
    var toRadians = function (degree) {
        return degree * Math.PI / 180.0;
    };    
    var lab1 = new Color(color1).lab();
    var lab2 = new Color(color2).lab();
    var l1 = lab1.l, a1 = lab1.a, b1 = lab1.b;
    var l2 = lab2.l, a2 = lab2.a, b2 = lab2.b;
    var dl = l1 - l2;
    var da = a1 - a2;
    var db = b1 - b2;    
    var c1 = sqrt(sq(a1) + sq(b1));
    var c2 = sqrt(sq(a2) + sq(b2));    
    var dc = c1 - c2;
    var dhsq = sq(da) + sq(db) - sq(dc);
    var sl = l1 < 16 ? 0.511 : 0.040975 * l1 / (1 + 0.01765 * l1);
    var sc = 0.0638 * c1 / (1 + 0.0131 * c1) + 0.638;
    var c14 = Math.pow(c1, 4);
    var f = sqrt(c14 / (c14 + 1900));
    var h1 = toDegrees(Math.atan(b1, a1));
    if (h1 < 0) { h1 += 360; }
    if (h1 >= 360) { h1 -= 360; }
    var t = (h1 >= 164 && h1 <= 345) ?
        0.56 + Math.abs(0.2 * Math.cos(toRadians(h1 + 168))) :
        0.36 + Math.abs(0.4 * Math.cos(toRadians(h1 + 35)));
    var sh = sc * (f * t + 1 - f);
    return sqrt(sq(dl / (l * sl)) + sq(dc / (c * sc)) + dhsq / sq(sh));
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

co.palette.presets = {
    // http://cran.r-project.org/web/packages/colorspace/vignettes/hcl-colors.pdf
    // http://statmath.wu.ac.at/~zeileis/papers/Zeileis+Hornik+Murrell-2009.pdf
    // http://www.r-bloggers.com/choosing-colour-palettes-part-ii-educated-choices/
    "qualitative": [],
    "sequential": [],
    "diverging": []
};


function ColorMap (leftColor, rightColor, left, right, isLeftClose, isRightClose) {
    this.color = function (value) {
        if (value < left) {
            return leftColor;
        }
        if (value > right) {
            return rightColor;
        }
        if (isLeftClose && value === left) {
            return leftColor;
        }
        if (isRightClose && value === right) {
            return rightColor;
        }
        return this.mix([leftColor, rightColor], (value - left) / (right - left));
    };
};
co.map = function(input) {
    var mapFunc = function(value) {
        return this.color();
    };
    return mapFunc;
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

Color.prototype.rotate = function (degree) {
    var hsl = this.hsl();
    var newH = hsl.h + (degree / 360.0);
    while (newH < 0) { newH += 1.0; }
    while (newH > 1) { newH -= 1.0; }
    return this.co.hsl(newH, hsl.s, hsl.l);
};

Color.prototype.complement = function () {
    return this.rotate(180);
};

Color.prototype.negate = function() {
    return new Color(255 - this.r, 255 - this.g, 255 - this.b);
};

Color.prototype.asSeenBy = function () {
    // TODO, return color seen by different types of color blind or animals   
    
};

co.colorBlindTypes = [
    "protanopia", "deuteranopia", "tritanopia"
];

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
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
};

Color.prototype.const = {FACTOR: 0.7};
Color.prototype.util = {
    int: function(num) { return parseInt(num, 10); }
};

Color.prototype.brighter = function() {
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

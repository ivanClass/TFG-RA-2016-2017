/*
 TeeChart(tm) for JavaScript(tm)
 @fileOverview TeeChart for JavaScript(tm)
 v1.8 April 2015
 Copyright(c) 2012-2015 by Steema Software SL. All Rights Reserved.
 http://www.steema.com

 Licensed with commercial and non-commercial attributes,
 specifically: http://www.steema.com/licensing/html5

 JavaScript is a trademark of Oracle Corporation.
 */
var Tee = Tee || {};
(function () {
    function n(a, d) {
        this.x = a;
        this.y = d
    }

    function J(a, d, b, c) {
        function e() {
            var c, e;
            if (b.x == d.x && b.y == d.y)c = a.x - d.x, e = a.y - d.y; else {
                c = b.x - d.x;
                e = b.y - d.y;
                var g = ((a.x - d.x) * c + (a.y - d.y) * e) / (c * c + e * e);
                0 > g ? (c = a.x - d.x, e = a.y - d.y) : 1 < g ? (c = a.x - b.x, e = a.y - b.y) : (c = a.x - (d.x + g * c), e = a.y - (d.y + g * e))
            }
            return Math.sqrt(c * c + e * e)
        }

        return a.x == d.x && a.y == d.y || a.x == b.x && a.y == b.y ? !0 : Math.abs(e()) <= c + 1
    }

    function r(a, d, b, c) {
        this.set(a, d, b, c)
    }

    function N() {
        this.left = this.right = this.top = this.bottom = 2;
        this.apply = function (a) {
            var d = a.width,
                b = a.height;
            a.x += d * this.left * .01;
            a.width -= d * Math.min(100, this.left + this.right) * .01;
            a.y += b * this.top * .01;
            a.height -= b * Math.min(100, this.top + this.bottom) * .01
        }
    }

    function S(a, d, b) {
        this.format = b;
        this.bounds = d;
        var c = this;
        d = b.shadow;
        this.old = new A;
        this.old.set(d);
        d.visible = !0;
        d.color = "rgba(0,255,0,0.1)";
        d.blur = 10;
        d.width = 0;
        d.height = 0;
        this.enabled = !0;
        b = new Tee.Animation(b.chart, function (b) {
            c.enabled && (1 > b ? c.format.shadow.color = "rgba(0,255,0," + b.toString() + ")" : c.autoHide && c.restore())
        });
        b.duration = a;
        b.animate();
        this.restore = function () {
            this.format.shadow.set(this.old);
            this.enabled = !1
        }
    }

    function B(a) {
        this.chart = a;
        this.visible = !1;
        this.colors = ["white", "silver"];
        this.direction = "topbottom";
        this.stops = null;
        this.offset = {x: 0, y: 0};
        this.create = function (a, b) {
            return this.rect(a.x, a.y, a.width, a.height, b)
        };
        this.rect = function (a, b, c, e, f) {
            var h;
            h = this.chart.ctx;
            var g = h.createLinearGradient;
            "topbottom" == this.direction ? h = g.call(h, a, b, a, b + e) : "bottomtop" == this.direction ? h = g.call(h, a, b + e, a, b) : "leftright" == this.direction ? h = g.call(h,
                a, b, a + c, b) : "rightleft" == this.direction ? h = g.call(h, a + c, b, a, b) : "radial" == this.direction ? (a = a + .5 * c + this.offset.x, b = b + .5 * e + this.offset.y, c = Math.max(c, e), h = h.createRadialGradient(a, b, 0, a, b, c)) : h = "diagonalup" == this.direction ? g.call(h, a, b + e, a + c, b) : g.call(h, a, b, a + c, b + e);
            f && this.setEndColor(f);
            c = this.colors;
            e = c.length;
            a = (b = this.stops) ? b.length : 0;
            if (1 < e)for (f = 0; f < e; f++)h.addColorStop(a <= f ? f / (e - 1) : b[f], c[f]); else h.addColorStop(0, 0 < e ? c[0] : "white");
            return h
        }
    }

    function A(a) {
        this.chart = a;
        this.visible = !1;
        this.blur =
            4;
        this.color = "rgba(80,80,80,0.75)";
        this.height = this.width = 4;
        this.prepare = function (a) {
            this.visible ? (a.shadowBlur = this.blur, a.shadowColor = this.color, a.shadowOffsetX = this.width, a.shadowOffsetY = this.chart.isAndroid ? -this.height : this.height) : a.shadowColor = "transparent"
        }
    }

    function O(a) {
        this.url = "";
        this.chart = a;
        this.visible = !0;
        this.tryDraw = function (d, b, c, e) {
            this.image || (this.image = new Image, this.image.onload = function () {
                a.draw()
            });
            "" === this.image.src ? (a = this.chart, this.image.src = this.url) : a.ctx.drawImage &&
            a.ctx.drawImage(this.image, d, b, c, e)
        }
    }

    function C(a) {
        this.chart = a;
        this.fill = "black";
        this.size = 1;
        this.join = "round";
        this.cap = "square";
        this._g = this.dash = null;
        x ? x(this, "gradient", {
            get: function () {
                this._g || (this._g = new B(this.chart));
                return this._g
            }
        }) : this._g = this.gradient = new B(a);
        this.prepare = function (a, b) {
            b = b || this.chart.ctx;
            var c = this._g;
            b.strokeStyle = c && c.visible ? c.create(this.chart.bounds) : a ? a : this.fill;
            b.lineWidth = this.size;
            b.lineJoin = this.join;
            b.lineCap = this.cap;
            b.shadowColor = "transparent";
            b.setLineDash ?
                b.setLineDash(this.dash || []) : b.mozCurrentTransform ? b.mozDash = this.dash : this.chart.isChrome && (b.webkitLineDash = this.dash)
        };
        this.setChart = function (a) {
            this.chart = a;
            this._g && (this._g.chart = a)
        }
    }

    function E(a) {
        this.chart = a;
        this.style = "11px Tahoma";
        this._g = null;
        x ? x(this, "gradient", {
            get: function () {
                this._g || (this._g = new B(this.chart));
                return this._g
            }
        }) : this._g = this.gradient = new B(a);
        this.fill = "black";
        this._sh = null;
        x ? x(this, "shadow", {
            get: function () {
                this._sh || (this._sh = new A(this.chart));
                return this._sh
            }
        }) : this._sh =
            this.shadow = new A(a);
        this._s = null;
        x ? x(this, "stroke", {
            get: function () {
                this._s || (this._s = new C(this.chart), this._s.fill = "");
                return this._s
            }
        }) : (this._s = this.stroke = new C(a), this._s.fill = "");
        this.textAlign = "center";
        this.baseLine = "alphabetic"
    }

    function T(a) {
        this.chart = a;
        this.items = [];
        this.draw = function () {
            for (var a = 0, b; b = this.items[a++];)b.active && b.draw()
        };
        this.mousemove = function (a) {
            for (var b = 0, c; c = this.items[b++];)c.active && c.mousemove(a)
        };
        this.mousedown = function (a) {
            for (var b = 0, c, e = !1; c = this.items[b++];)c.active &&
            c.mousedown(a) && (e = !0);
            return e
        };
        this.mouseout = function () {
            for (var a = 0, b; b = this.items[a++];)b.active && b.mouseout()
        };
        this.clicked = function (a) {
            for (var b = this.items.length, c, e = !1; c = this.items[--b];)c.active && c.clicked(a) && (e = !0, c.onclick && (e = c.onclick(c, a.x, a.y)));
            return e
        };
        this.add = function (a) {
            this.items.push(a);
            return a
        }
    }

    function U(a) {
        function d(b) {
            var a = b.chart.chartRect, d = b.direction, g = "both" === d;
            c.set(a.x, a.y, a.width, a.height);
            if (b.old) {
                if (g || "horizontal" === d)0 > b.old.x ? (c.x = b.chart.oldPos.x + b.old.x,
                    c.width = -b.old.x) : (c.x = b.chart.oldPos.x, c.width = b.old.x);
                if (g || "vertical" === d)0 > b.old.y ? (c.y = b.chart.oldPos.y + b.old.y, c.height = -b.old.y) : (c.y = b.chart.oldPos.y, c.height = b.old.y)
            }
            return c
        }

        this.chart = a;
        this.active = !1;
        this.enabled = !0;
        this.done = !1;
        this.direction = "both";
        this.keepAspect = !1;
        this.mouseButton = 0;
        this.wheel = {enabled: !1, factor: 1};
        var b = this.format = new Tee.Format(a);
        b.fill = "rgba(255,255,255,0.5)";
        b.stroke.fill = "darkgray";
        b.stroke.size = 2;
        var c = new r;
        this.change = function (b) {
            this.old || (this.old = new n);
            var a = this.chart.oldPos;
            this.old.x = b.x - a.x;
            this.keepAspect ? (b = this.chart.chartRect, this.old.y = b.height / b.width * this.old.x) : this.old.y = b.y - a.y
        };
        this.draw = function () {
            b.rectangle(d(this))
        };
        this.apply = function () {
            if (0 > this.old.x || 0 > this.old.y) {
                if (this.reset(), this.onreset)this.onreset()
            } else if (d(this), 3 < c.width && 3 < c.height) {
                var b = this.direction, a = "both" === b;
                this.chart.axes.each(function () {
                    this.horizontal ? (a || "horizontal" === b) && this.calcMinMax(c.x, c.x + c.width) : (a || "vertical" === b) && this.calcMinMax(c.y +
                        c.height, c.y)
                });
                return !0
            }
            return !1
        };
        this.reset = function () {
            this.chart.axes.each(function () {
                this.automatic = !0
            })
        }
    }

    function V(a) {
        this.chart = a;
        this.active = !1;
        this.enabled = !0;
        this.done = !1;
        this.mouseButton = 2;
        this.direction = "both";
        this.position = new n(0, 0)
    }

    function K(a, d) {
        Tee.Annotation.call(this, a);
        this.transparent = !0;
        this._expand = !1;
        x ? x(this, "expand", {
            get: function () {
                return this._expand
            }, set: function (b) {
                this._expand = b;
                this._expand || (b = this.format, b.round.x = 8, b.round.y = 8, b.round.corners = null, b.stroke.fill =
                    "black")
            }
        }) : this._expand = this.expand = !1;
        var b = this.format.font, c = b.shadow, e = this.position;
        c.visible = !0;
        c.width = 2;
        c.height = 2;
        c.blur = 8;
        b.style = "18px Tahoma";
        b.fill = d;
        this.padding = 4;
        this.calcRect = function (b) {
            this.resize();
            var c = this.bounds, d = c.height + (this.transparent ? 1 : 2) * this.padding, l = a.chartRect;
            b ? (e.y = l.y, l.automatic && l.setTop(l.y + d)) : (e.y = l.y + l.height - c.height - this.padding, l.automatic && (l.height -= d));
            0 > l.height && (l.height = 0);
            e.x = .5 * (a.canvas.width - c.width)
        };
        this.tryDraw = function (b) {
            if (this.shouldDraw()) {
                this.calcRect(b);
                var c = this.bounds, d = this.chart.ctx, l = d.beginParent;
                this.visual = l ? d.beginParent() : null;
                if (this._expand) {
                    var k = a.panel.format;
                    e.x = "" !== k.stroke.fill ? k.stroke.size : 0;
                    e.y = b ? e.x : a.canvas.height - (k.shadow.visible ? k.shadow.height : 0) - e.x - c.height;
                    c.width = a.canvas.width - (k.shadow.visible ? k.shadow.width : 0) - 2 * e.x;
                    var m = this.format;
                    m.round.x = k.round.x;
                    m.round.y = k.round.y;
                    m.round.corners = [b, b, !b, !b];
                    m.stroke.fill = "";
                    this.transparent = !1
                }
                c.x = e.x;
                c.y = e.y;
                this.doDraw();
                l && d.endParent()
            }
        }
    }

    function W(a) {
        var d = this.format =
            new Tee.Format(a);
        d.round.x = 12;
        d.round.y = 12;
        d.stroke.size = 3;
        d.gradient.visible = !0;
        d.gradient.direction = "bottomtop";
        d.shadow.visible = !0;
        d.stroke.fill = "#606060";
        this.transparent = !!a.__webgl;
        this.margins = new N;
        this.clear = function () {
            var b = a.bounds;
            a.ctx.clearRect(b.x, b.y, b.width, b.height)
        };
        this.draw = function () {
            if (this.transparent || a.__webgl)this.clear(); else {
                var b = a.chartRect, c = d.shadow;
                c.visible && (b.width -= .5 * Math.abs(c.width) + 2, b.height -= .5 * Math.abs(c.height) + 2, 0 > c.width && (b.x -= c.width), 0 > c.height &&
                (b.y -= c.height));
                var e = 0;
                "" !== d.stroke.fill && (e = d.stroke.size, 1 < e && (e *= .5, b.x += e, b.y += e, b.width -= 2 * e, b.height -= 2 * e));
                (c.visible || 0 < d.round.x || 0 < d.round.y) && this.clear();
                d.rectangle(b);
                0 < e && (b.x += e, b.y += e, b.width -= 2 * e, b.height -= 2 * e)
            }
        }
    }

    function F(a) {
        var d = this.format = new Tee.Format(a);
        d.fill = "#E6E6E6";
        d.stroke.fill = "black";
        d.z = 0;
        d.depth = 0;
        this.visible = !0;
        this.bounds = new r;
        this.size = 0;
        this.draw = function () {
            d.cube(this.bounds);
            d.draw(a.ctx, null, this.bounds)
        }
    }

    function w(a, d, b) {
        function c(b) {
            this.chart =
                b;
            this.stroke = new C(b);
            this.stroke.cap = "butt";
            this.visible = !0;
            this.length = 4
        }

        function e(b) {
            Tee.Annotation.call(this, b);
            this.padding = 4;
            this.transparent = !0;
            this.rotation = 0;
            this.format.font.textAlign = "center";
            this.drawIt = function (a, c, e, f) {
                this.format.font.textAlign = a;
                0 === f ? (this.position.x = c, this.position.y = e, this.forceDraw()) : (a = b.ctx, a.save(), a.translate(c, e), a.rotate(-f * Math.PI / 180), this.position.x = 0, this.position.y = 0, this.forceDraw(), a.restore())
            }
        }

        function f(b, a) {
            var c = 0, e, f = a.split(" "), d;
            for (d =
                     0; d < f.length; d++)e = b.textWidth(f[d]), e > c && (c = e);
            return c
        }

        function h(b) {
            return isFinite(b) ? 10 <= b ? 10 * h(.1 * b) : 1 > b ? .1 * h(10 * b) : 2 > b ? 2 : 5 > b ? 5 : 10 : 1
        }

        this.chart = a;
        this.visible = !0;
        this.inverted = !1;
        this.horizontal = d;
        this.otherSide = b;
        this.bounds = new r;
        this.position = 0;
        this.format = new Tee.Format(a);
        this.format.stroke.size = 2;
        this.format.depth = .2;
        this.custom = !1;
        this.z = b ? 1 : 0;
        this.maxLabelDepth = 0;
        this.labels = new function (b, a) {
            this.chart = b;
            this.format = new Tee.Format(b);
            this.decimals = 2;
            this.fixedDecimals = !1;
            this.padding =
                4;
            this.separation = 10;
            this.visible = !0;
            this.rotation = 0;
            this.alternate = !1;
            this.maxWidth = 0;
            this.wordWrap = "no";
            this.labelStyle = "auto";
            this.dateFormat = "shortDate";
            this.checkStyle = function () {
                var b = this.labelStyle, c = a.firstSeries;
                this._text = null;
                if ("auto" == b)0 < c.data.labels.length && c.associatedToAxis(a) && a.horizontal == c.notmandatory.horizontal && (this._text = c); else if ("mark" == b || "text" == b)this._text = c
            };
            this.formatValueString = function (b) {
                if (this.valueFormat) {
                    var a = Number("1.2").toLocaleString().substr(1, 1);
                    b = (1 * b).toLocaleString();
                    var c = String(b).split(a);
                    b = c[0];
                    var k = "";
                    if (0 < this.decimals)for (var e = 0; e < this.decimals; e++)k += "0";
                    c = 1 < c.length ? c[1] : "";
                    c = (c + k).substr(0, this.decimals);
                    return 0 < c.length ? b + a + c : b
                }
                return b.toFixed(this.decimals)
            };
            this.getLabel = function (c) {
                var e = c | 0, f;
                if (this._text && e == c) {
                    if (f = this._text.data, f.x && (e = f.x.indexOf(e)), f = f.labels[e], !f) {
                        var d = b.series.items, g, h;
                        for (g = 0; (h = d[g++]) && !(h != this._text && h.visible && h.associatedToAxis(a) && (f = h.data.labels[e])););
                        void 0 === f && (f = "")
                    }
                } else a.dateTime ?
                    f = Date.prototype.format ? (new Date(c)).format(this.dateFormat) : (new Date(c)).toDateString() : this.fixedDecimals ? f = this.formatValueString(c) : this.valueFormat ? (f = c.toFixed(e == c ? 0 : this.decimals), f = (1 * f).toLocaleString()) : f = c.toFixed(e == c ? 0 : this.decimals);
                this.ongetlabel && (f = this.ongetlabel(c, f), this.format.font.prepare());
                return "" + f
            };
            this.width = function (b) {
                var a = this.fixedDecimals;
                this.fixedDecimals = !0;
                b = this.format.textWidth(this.getLabel(b));
                this.fixedDecimals = a;
                return b
            }
        }(a, this);
        var g = this.labels.format.font;
        this.scroll = function (b) {
            this.automatic = !1;
            this.inverted && (b = -b);
            this.minimum += b;
            this.maximum += b
        };
        d ? (g.textAlign = "center", g.baseLine = b ? "bottom" : "top") : (g.textAlign = b ? "left" : "right", g.baseLine = "middle");
        this.grid = new function (b) {
            this.chart = b;
            b = this.format = new Tee.Format(b);
            b.stroke.fill = "silver";
            b.stroke.cap = "butt";
            b.fill = "";
            this.visible = !0;
            this.lineDash = !1
        }(a);
        this.ticks = new c(a);
        this.innerTicks = new c(a);
        this.innerTicks.visible = !1;
        g = this.minorTicks = new c(a);
        g.visible = !1;
        g.length = 2;
        g.count = 3;
        e.prototype =
            new Tee.Annotation;
        this.title = new e(a);
        d || (this.title.rotation = b ? 270 : 90);
        this.automatic = !0;
        this.increment = this.maximum = this.minimum = 0;
        this.log = !1;
        this.start = this.endPos = this.startPos = 0;
        this.end = 100;
        this.increm = this.scale = this.axisSize = 0;
        this.minmaxLabelWidth = function (b) {
            var a = this.labels, c = a._text, e = 0, d, h, g = this.labels;
            if (null !== c) {
                h = "auto" == a.wordWrap || "yes" == a.wordWrap;
                g.format.font.prepare();
                for (var u = 0, t = c.data.labels.length; u < t; u++)d = c.data.labels[u], this.ongetlabel && (d = this.ongetlabel(u, d)),
                d && (e = Math.max(e, h ? f(a.format, d) : a.format.textWidth(d)))
            } else e = this.roundMin(), c = this.maximum, e = Math.max(a.width(e), a.width(.5 * (e + c))), e = Math.max(e, a.width(1E-7)), e = Math.max(e, a.width(c));
            if (0 == a.rotation) {
                if (this.horizontal && b || !this.horizontal && !b)e = g.format.textHeight("Wj")
            } else e = this.horizontal ? b ? Math.abs(Math.sin(Math.PI / 180 * a.rotation) * e) : Math.abs(Math.cos(Math.PI / 180 * a.rotation) * e) : b ? Math.abs(Math.cos(Math.PI / 180 * a.rotation) * e) : Math.abs(Math.sin(Math.PI / 180 * a.rotation) * e);
            e < g.format.textHeight("Wj") &&
            (e = g.format.textHeight("Wj"));
            return e
        };
        this.checkRange = function () {
            this.maximum - this.minimum < this.minAxisRange && (this.maximum = this.minimum + this.minAxisRange)
        };
        this.checkMinMax = function () {
            var b = this.chart.series, a = this.horizontal;
            this.automatic && (this.minimum = a ? b.minXValue(this) : b.minYValue(this), this.maximum = a ? b.maxXValue(this) : b.maxYValue(this), this.checkRange())
        };
        this.calcAxisScale = function () {
            var b = this.maximum - this.minimum;
            0 === b ? b = 1 : this.log && (b = Math.log(b));
            this.scale = this.axisSize / b
        };
        this.calcScale =
            function () {
                var b = this.labels, a;
                b.format.font.prepare();
                a = this.minmaxLabelWidth(!1);
                b.alternate && (a *= .5);
                a *= 1 + .02 * b.separation;
                if (0 === this.increment)if (this.maximum == this.minimum)b = 1; else {
                    b = this.axisSize / a;
                    b:{
                        a = b;
                        var c, e, f;
                        for (c = 0; e = this.chart.series.items[c++];)if (e.visible && e.sequential && ((f = e.yMandatory) && this.horizontal || !f && !this.horizontal) && e.associatedToAxis(this) && e.count() <= a) {
                            a = !0;
                            break b
                        }
                        a = !1
                    }
                    b = Math.abs(this.maximum - this.minimum) / (b + 1);
                    b = a ? Math.max(1, b) : h(b)
                } else b = this.increment;
                this.increm =
                    b;
                0 >= this.increm && (this.increm = .1)
            };
        this.hasAnySeries = function () {
            var b = this.chart.series.items, a, c;
            for (a = 0; c = b[a++];)if (c.visible && c.associatedToAxis(this) && (c.__alwaysDraw || 0 < c.count()))return b = this.horizontal, c.yMandatory && (b = !b), this.dateTime = (b = b ? c.data.values : c.data.x) && 0 < b.length && b[0] instanceof Date, c;
            return null
        };
        this.drawAxis = function () {
            var b = this.format, a = this.chart.ctx, c = this.axisPos, e = this.startPos, f = this.endPos, g = 20 * b.depth;
            this.chart.aspect.view3d && 0 < g ? (c = d ? {
                x: e, y: c - .5 * g, width: f - e,
                height: g
            } : {
                x: c - .5 * g,
                y: e,
                width: g,
                height: f - e
            }, e = this.z, b.z = e - .5 * b.depth, b.cylinder(c, 1, !d), b.draw(a, null, c), b.z = e) : (a.z = this.z, a.beginPath(), d ? (a.moveTo(e, c), a.lineTo(f, c)) : (a.moveTo(c, e), a.lineTo(c, f)), b.stroke.prepare(), a.stroke())
        };
        this.drawGrids = function () {
            var a = this.chart.ctx, c, e = this.chart.chartRect, f = this.grid.format, g, h, s, u, t = this.roundMin();
            if (this.grid.centered)var q = .5 * this.increm, t = t - q >= this.minimum ? t - q : t + q;
            var q = this.chart.aspect, G = q.view3d, P = G && q.orthogonal, n = G ? 1 : 0;
            a.beginPath();
            d ? (h =
                this.bounds.y - n, u = b ? e.getBottom() - 1 : e.y + 1) : (g = this.bounds.x + n, s = b ? e.x + 1 : e.getRight() - 1);
            var r, n = -1;
            if ("" !== f.fill) {
                var e = t, w = f.stroke.fill;
                for (f.stroke.fill = ""; e <= this.maximum;)c = this.calc(e), 0 === n % 2 && (d ? f.rectangle(r, u, c - r, h - u) : f.rectangle(g, r, s - g, c - r)), r = c, e += this.increm, n++;
                f.stroke.fill = w;
                a.fillStyle = ""
            }
            e = t;
            P && (d ? (h -= q._orthoy, u -= q._orthoy) : (g += q._orthox, s += q._orthox));
            t = f.stroke.dash && !a.setLineDash && !a.mozCurrentTransform;
            for (a.z = G ? this.chart.walls.back.format.z - .01 : 0; e <= this.maximum;) {
                n = this.calc(e);
                d ? g = s = n : h = u = n;
                P && (d ? (g += q._orthox, s += q._orthox) : (h -= q._orthoy, u -= q._orthoy));
                G && !this.otherSide && a.lineZ && a.lineZ(g, h, 0, a.z);
                if (t) {
                    r = a;
                    var n = g, x = h, z = s, w = u;
                    c = void 0;
                    c = [10, 5];
                    r.save();
                    var z = z - n, D = w - x, w = Math.sqrt(z * z + D * D), z = Math.atan2(D, z);
                    r.translate(n, x);
                    r.moveTo(0, 0);
                    r.rotate(z);
                    x = c.length;
                    z = 0;
                    D = !0;
                    for (n = 0; w > n;)n += c[z++ % x], n > w && (n = w), D ? r.lineTo(n, 0) : r.moveTo(n, 0), D = !D;
                    r.restore()
                } else a.moveTo(g, h), a.lineTo(s, u);
                e += this.increm
            }
            f.stroke.prepare();
            f.shadow.prepare(a);
            a.stroke()
        };
        this.roundMin = function () {
            if (0 ===
                this.increm)return this.minimum;
            var b;
            b = this.minimum / this.increm;
            b -= b % 1;
            return this.increm * (0 >= this.minimum ? b : 1 + b)
        };
        this.drawTicks = function (a, c, e) {
            var f = this.roundMin(), g = 1 + a.length, h = 1;
            if (d && b || !d && !b)g = -g, h = -1;
            var g = g * c + this.axisPos, h = h * c + this.axisPos, s, u = 1, t = 0;
            0 === e ? s = this.increm : (u += e, s = this.increm / u);
            var q = this.chart.ctx;
            for (q.beginPath(); f <= this.maximum;) {
                if (0 === e || 0 !== t++ % u)c = this.calc(f), d ? (q.moveTo(c, h), q.lineTo(c, g)) : (q.moveTo(h, c), q.lineTo(g, c));
                f += s
            }
            a.stroke.prepare();
            a.z = this.z;
            q.z = a.z;
            q.stroke()
        };
        this.drawTitle = function () {
            var b = this.labels, a, c, e = this.title.bounds, f = this.title.rotation, g = "center";
            "" !== this.title.text && (d ? (c = this.title.padding, this.ticks.visible && (c += this.ticks.length), b.visible && (b.format.font.prepare(), a = this.maxLabelDepth, b.alternate && (a *= 2), c += a), a = this.startPos + .5 * this.axisSize, this.otherSide && (c = -c - e.height), c = this.axisPos + c, 0 === f ? a -= .5 * e.width : (a += e.height * (this.otherSide ? -.5 : .5), this.otherSide || (c += 1.5 * e.height), g = this.otherSide ? "near" : 270 === f ? "near" : "far")) :
                (a = this.title.padding, this.ticks.visible && (a += this.ticks.length), b.visible && (c = b.maxWidth, b.alternate && (c *= 2), a += c), c = this.startPos + .5 * this.axisSize, 0 === f ? (a = this.axisPos + (this.otherSide ? a : -a), c -= .5 * e.height, g = this.otherSide ? "near" : "far") : (a += e.height, a = this.axisPos + (this.otherSide ? a : -a), c += e.width * (this.otherSide ? -.5 : .5))), this.title.drawIt(g, a, c, f))
        };
        this.rotatedWidth = function (b, a) {
            return Math.abs(Math.sin(Math.PI / 180 * b.rotation) * a)
        };
        this.drawLabel = function (b, a) {
            var c = this.labels, e = c.getLabel(b);
            a.width = c.format.textWidth(e);
            a.width > c.maxWidth && (c.maxWidth = a.width);
            if (0 == c.rotation)this.horizontal ? a.x -= .5 * a.width : a.y += .5 * a.height; else {
                var f = this.chart.ctx;
                f.save();
                f.translate(a.x, a.y);
                f.rotate(-Math.PI * c.rotation / 180);
                f.textAlign = "right";
                this.horizontal ? (a.x = .5 * -this.rotatedWidth(c, a.width), a.y = -(.5 * this.rotatedWidth(c, a.height)) + 3) : (a.x = -2, a.y = -8)
            }
            "right" == c.format.font.textAlign && (a.x -= a.width);
            c.format.z = this.z * this.chart.walls.back.format.z;
            c.format.drawText(a, e);
            0 !== c.rotation && this.chart.ctx.restore()
        };
        this.drawLabels = function () {
            var b = this.roundMin(), a = new r, c = this.axisPos, e = this.labels;
            e.maxWidth = 0;
            e.format.font.prepare();
            var f = this.ticks.visible ? this.ticks.length : 0, f = f + e.padding;
            this.horizontal ? this.otherSide ? c -= f : c += f : this.otherSide ? c += f : c -= f;
            f = c;
            a.height = e.format.textHeight("Wj");
            for (var d = (e = e.alternate) ? this.horizontal ? -this.minmaxLabelWidth(!0) : this.minmaxLabelWidth(!0) : 0, g; b <= this.maximum;)g = this.calc(b), this.horizontal ? (a.x = g, a.y = c) : (a.x = c, a.y = g - .5 * a.height), e && (c = c == f ? this.otherSide ? f +
            d : f - d : f), this.drawLabel(b, a), b += this.increm
        };
        this.calc = function (b) {
            b !== b ? b = 0 : this.log ? (b -= this.minimum, b = 0 >= b ? 0 : Math.log(b) * this.scale) : b = (b - this.minimum) * this.scale;
            return this.horizontal ? this.inverted ? this.endPos - b : this.startPos + b : this.inverted ? this.startPos + b : this.endPos - b
        };
        this.fromPos = function (b) {
            var a = this.horizontal;
            this.inverted && (a = !a);
            return this.minimum + (a ? b - this.startPos : this.endPos - b) / this.scale
        };
        this.fromSize = function (b) {
            return b / this.scale
        };
        this.calcSize = function (b) {
            return Math.abs(this.calc(b) -
                this.calc(0))
        };
        this.calcMinMax = function (b, a) {
            this.automatic = !1;
            var c = this.fromPos(b), e = this.fromPos(a), f;
            c > e && (f = c, c = e, e = f);
            this.minimum = c;
            this.maximum = e;
            this.checkRange()
        };
        this.minAxisRange = 1E-10;
        this.setMinMax = function (b, a) {
            this.automatic = !1;
            this.minimum = b;
            this.maximum = a;
            this.checkRange()
        }
    }

    function X(a) {
        function d(b) {
            var c = a.series;
            return b.showHidden ? c.items.length : c.visibleCount()
        }

        this.chart = a;
        this.transparent = !1;
        var b = this.format = new Tee.Format(a);
        b.fill = "white";
        b.round.x = 8;
        b.round.y = 8;
        b.font.baseLine =
            "top";
        b.shadow.visible = !0;
        b.z = 0;
        b.depth = .05;
        this.title = new Tee.Annotation(a);
        this.title.transparent = !0;
        this.bounds = new r;
        this.position = "right";
        this.visible = !0;
        this.inverted = !1;
        this.margin = this.padding = 5;
        this.align = 0;
        this.fontColor = !1;
        var c = this.dividing = new C(a);
        c.fill = "";
        c.cap = "butt";
        this.over = -1;
        this.symbol = new function (b) {
            this.chart = b;
            var a = this.format = new Tee.Format(b), c = a.shadow;
            c.visible = !0;
            c.color = "silver";
            c.width = 2;
            c.height = 2;
            a.depth = .01;
            this.padding = this.height = this.width = 8;
            this.style = "rectangle";
            this.visible = !0;
            this.draw = function (c, e, f, d) {
                var g = b.ctx, k;
                a:{
                    if (c.hover.enabled) {
                        var h = b.legend.showValues();
                        if (h && c.over == e || !h && 0 <= c.over) {
                            k = c.hover;
                            break a
                        }
                    }
                    k = null
                }
                var h = a.fill, m = a.stroke;
                a.fill = c.legendColor(e);
                g.z = -.01;
                "rectangle" === this.style ? (k && (a.stroke = k.stroke), this.chart.aspect.view3d ? (c = {
                    x: f,
                    y: d - .5 * this.height - 1,
                    width: this.width,
                    height: this.height
                }, h = a.z, e = g.z, a.z = g.z - a.depth, a.cube(c), a.draw(g, null, c), a.z = h, g.z = e) : a.rectangle(f, d - .5 * this.height - 1, this.width, this.height)) : (g.beginPath(),
                    g.moveTo(f, d), g.lineTo(f + this.width, d), k ? k.stroke.prepare() : a.stroke.prepare(a.fill), g.stroke());
                a.fill = h;
                a.stroke = m
            }
        }(a);
        this.itemHeight = 10;
        this.innerOff = 0;
        this.textStyle = this.legendStyle = "auto";
        this.hover = new Tee.Format(a);
        this.hover.enabled = !0;
        this.hover.font.fill = "red";
        this.totalWidth = function () {
            var b = k + 8, a = this.symbol;
            a.visible && (b += a.width + a.padding);
            return b
        };
        var e = 0;
        this._space = function () {
            return this.bounds.y + e + this.margin * a.bounds.height * .01
        };
        this.availRows = function () {
            var b = this._space() +
                .5 * this.itemHeight;
            b || (b = 0);
            return (a.bounds.getBottom() - b) / this.itemHeight | 0
        };
        this.itemsCount = function () {
            var b = a.series, c = d(this), e = a.bounds;
            if (0 === c)return 0;
            var f = this.legendStyle;
            "values" === f && 0 < c ? c = b.firstVisible().legendCount() : "auto" === f && 1 < c || "series" === f || 1 == c && (c = b.firstVisible().legendCount());
            this.isVertical() ? (.5 + c) * this.itemHeight > e.height - this._space() && (c = this.availRows()) : (this.rows = 1, b = this.totalWidth(), f = this.calcPadding(e), f = e.width - 2 * f, c * b > f ? (this.perRow = f / b | 0, c > this.perRow && (this.rows =
                1 + (c / this.perRow | 0), this.rows * this.itemHeight > e.height - this.bounds.y && (this.rows = this.availRows(), c = this.rows * this.perRow))) : this.perRow = c);
            return c
        };
        this.showValues = function () {
            var b = this.legendStyle;
            return "values" == b || "auto" == b && 1 == d(this)
        };
        this.itemText = function (b, a) {
            var c = b.legendText(a, this.textStyle, !1, !0);
            return this.ongettext ? this.ongettext(this, b, a, c) : c
        };
        this.calcItemPos = function (b, a) {
            var c = this.itemHeight, f = this.bounds;
            a.x = f.x;
            a.y = f.y + this.innerOff;
            this.isVertical() ? (a.x += f.width - 6 - this.innerOff,
                a.y += .4 * c + b * c + e) : (a.x += this.innerOff + (1 + b % this.perRow) * this.totalWidth(), a.y += c * ((b / this.perRow | 0) + .25))
        };
        this.calcItemRect = function (b, a) {
            var c = this.itemHeight, f = this.bounds;
            a.height = c;
            a.x = f.x;
            a.y = f.y;
            this.isVertical() ? (a.width = f.width, a.y += .4 * c + b * c + e) : (a.width = this.totalWidth(), a.x += this.innerOff + b % this.perRow * a.width, a.y += c * ((b / this.perRow | 0) + .25))
        };
        var f = new r;
        this.mousedown = function (b) {
            if (this.onclick && -1 !== this.over) {
                if (this.showValues())this.onclick(a.series.firstVisible(), this.over); else {
                    b =
                        a.series.items;
                    for (var c = b.length, e = 0, f = 0; f < c; f++)if (this.showHidden || b[f].visible)if (e == this.over) {
                        this.onclick(b[f], -1);
                        break
                    } else e++
                }
                return !0
            }
            return !1
        };
        this.mousemove = function (b) {
            var a = this.over;
            if (this.bounds.contains(b))for (var c = this.itemsCount(), e = 0; e < c; e++) {
                if (this.calcItemRect(e, f), f.contains(b)) {
                    a = e;
                    break
                }
            } else a = -1;
            if (a != this.over) {
                if (this.onhover)this.onhover(this.over, a);
                this.over = a;
                var d = this.chart;
                window.requestAnimFrame(function () {
                    d.draw()
                })
            }
            this.onclick && (this.chart.newCursor = -1 ===
            a ? "default" : "pointer")
        };
        this.drawSymbol = function (b, a, c) {
            var e = this.symbol;
            e.draw(b, a, c.x - k - e.width - e.padding, c.y + .4 * this.itemHeight)
        };
        var h = {x: 0, y: 0}, g = new r, l;
        this.drawItem = function (a, c, e, f) {
            var d = this.isVertical();
            this.calcItemPos(e, h);
            g.x = h.x;
            g.y = h.y;
            d ? g.y -= this.chart.isMozilla ? 0 : 2 : this.chart.isMozilla ? g.y++ : g.y--;
            var t = b.font.fill;
            this.over == e ? b.font.fill = this.hover.enabled ? this.hover.font.fill : t : this.fontColor ? b.font.fill = this.showValues() ? c.legendColor(e) : c.format.fill : c.visible || (b.font.fill =
                "silver");
            var q = this.chart.ctx;
            if (f)b.font.textAlign = "start", g.x -= m[0], q.textAlign = b.font.textAlign, b.drawText(g, a); else if (a instanceof Array || (a = [a]), d) {
                f = a.length;
                for (var d = g.width, n = b.textWidth(" "); f--;)b.font.textAlign = l[f] ? "start" : "end", g.x -= m[f], q.textAlign = b.font.textAlign, b.drawText(g, a[f]), g.width -= m[f] + n;
                g.width = d
            } else b.font.textAlign = "start", g.x -= k, q.textAlign = b.font.textAlign, b.drawText(g, a.join(" "));
            b.font.fill = t;
            a = !c.isColorEach || this.showValues();
            this.symbol.visible && a && this.drawSymbol(c,
                e, h);
            0 < e && "" !== this.dividing.fill && (c = this.bounds, q.beginPath(), this.isVertical() ? (q.moveTo(c.x, g.y - 2), q.lineTo(c.getRight(), g.y - 2)) : (e = g.x - k - 4, a = this.symbol, a.visible && (e -= a.width + a.padding), q.moveTo(e, c.y), q.lineTo(e, c.getBottom())), this.dividing.prepare(), q.stroke())
        };
        this.drawSeries = function (b, c) {
            var e = a.series.items[b];
            return this.showHidden || e.visible ? (this.drawItem(e.titleText(b), e, c, !0), !0) : !1
        };
        this.draw = function () {
            var c = this.itemsCount(), f, d;
            f = this.title;
            var h = a.ctx, m, t = this.format.transparency,
                q = this.isVertical();
            if (0 < c) {
                var n = h.beginParent;
                this.visual = n ? h.beginParent() : null;
                b.cube(this.bounds);
                this.transparent || b.draw(h, null, this.bounds);
                0 < t && (m = h.globalAlpha, h.globalAlpha = (1 - t) * m);
                q && 0 < e && (f.bounds.x = this.bounds.x - 4, f.bounds.y = this.bounds.y, f.doDraw());
                b.font.prepare();
                g.width = k;
                g.height = this.itemHeight;
                if (this.showValues()) {
                    q = a.series.firstVisible();
                    d = 0;
                    f = c;
                    switch (this.textStyle) {
                        case "auto":
                        case "percentlabel":
                        case "valuelabel":
                            l = [!1, !0];
                            break;
                        case "labelpercent":
                        case "labelvalue":
                            l =
                                [!0, !1];
                            break;
                        case "label":
                            l = [!0];
                            break;
                        default:
                            l = [!1]
                    }
                    if (this.inverted)for (; f--;)this.drawItem(this.itemText(q, f), q, d++); else for (d = 0; d < f; d++)this.drawItem(this.itemText(q, d), q, d)
                } else if (f = a.series.count(), q && (f = Math.min(f, this.availRows())), c = 0, l = [!0], this.inverted)for (; f--;)this.drawSeries(f, c) && c++; else for (d = 0; d < f; d++)this.drawSeries(d, c) && c++;
                0 < t && (h.globalAlpha = m);
                n && h.endParent()
            }
        };
        var k, m;
        this.calcWidths = function () {
            var c, e, f, d, g = a.series;
            k = 0;
            m = [0, 0];
            if (this.showValues())for (c = g.firstVisible(),
                                           d = this.itemsCount(), e = 0; e < d; e++)g = this.itemText(c, e), g instanceof Array || (g = [g]), 0 < g.length && (f = b.textWidth(g[0]), f > m[0] && (m[0] = f), 1 < g.length && (f = b.textWidth(g[1]), f > m[1] && (m[1] = f))); else for (d = g.count(), e = 0; e < d; e++)if (c = g.items[e], this.showHidden || c.visible)f = b.textWidth(c.titleText(e)), f > m[0] && (m[0] = f);
            k = m[0] + m[1]
        };
        this.calcPadding = function (b) {
            return .01 * this.padding * (this.isVertical() ? b.width : b.height)
        };
        this.isVertical = function () {
            var b = this.position;
            return "right" === b || "left" === b
        };
        this.calcrect =
            function () {
                var c = 0, f = this.title, d = a.chartRect, g = this.align, h = this.bounds, m = this.isVertical();
                f.shouldDraw() ? (f.resize(), e = f.bounds.height, c = f.bounds.width) : e = 0;
                m ? h.y = 0 === g ? d.y : a.bounds.height * g * .01 : h.x = 0 === g ? d.x : a.bounds.width * g * .01;
                b.font.prepare();
                this.itemHeight = b.textHeight("Wj");
                this.calcWidths();
                var g = this.calcPadding(d), l = this.itemsCount();
                m ? (m = this.symbol.visible ? this.symbol.width + this.symbol.padding : 0, h.width = Math.max(c, 12 + k + m), h.height = (.5 + l) * this.itemHeight + e, h.width - 6 > c && (f.bounds.width =
                    h.width - 6)) : (h.width = g + this.perRow * this.totalWidth(), h.x += .5 * (d.width - h.width), h.height = this.itemHeight * (this.rows + .25));
                "" !== b.stroke.fill && (m = +b.stroke.size, 1 < m && (h.width += m, h.height += m, this.innerOff = .5 * m));
                0 !== l && ("right" === this.position ? (h.x = d.getRight() - h.width - this.margin * h.width * .01, d.automatic && d.setRight(Math.max(d.x, h.x - g))) : "left" === this.position ? (h.x = d.x, d.automatic && d.setLeft(h.x + h.width + g)) : "top" === this.position ? (h.y = d.y + g, d.automatic && d.setTop(h.getBottom() + g)) : (h.y = d.getBottom() - h.height -
                    g, d.automatic && d.setBottom(h.y - g)))
            }
    }

    function Q(a, d) {
        Tee.Annotation.call(this, d);
        this.series = a;
        var b = this.arrow = new Tee.Format(d);
        b.length = 10;
        b.underline = !1;
        b.z = .5;
        b.depth = .1;
        this.style = "auto";
        this.drawEvery = 1;
        this.visible = !1;
        this.format.z = .5;
        this.setChart = function (a) {
            this.chart = a;
            this.format.setChart(a);
            b.setChart(a)
        };
        this.drawPolar = function (a, e, f, d) {
            var g = this.series.markText(d);
            d = a.x + Math.cos(f) * e;
            var l = a.y + Math.sin(f) * e, k = this.chart.ctx;
            this.text = g;
            this.resize();
            var g = this.bounds, m, p = this.position;
            e += b.length;
            m = a.x + Math.cos(f) * e;
            e = a.y + Math.sin(f) * e;
            0 > m - g.width && (m -= m - g.width - 4);
            Math.abs(m - a.x) < g.width ? p.x = m - .5 * g.width : p.x = m < a.x ? m - g.width : m;
            Math.abs(e - a.y) < g.height ? p.y = e - .5 * g.height : p.y = e < a.y ? e - g.height : e;
            k.beginPath();
            k.moveTo(d, l);
            k.lineTo(m, e);
            b.underline && (e <= p.y || e >= p.y + g.height) && (k.moveTo(p.x, e), k.lineTo(p.x + g.width, e));
            b.stroke.prepare();
            k.stroke();
            this.draw()
        };
        this.canDraw = function (a, e, f, d) {
            if ((f = this.series.markText(f)) && "" !== f && (this.showZero || "0" !== f)) {
                this.text = f;
                this.resize();
                f = d ? -1 : 1;
                var g = this.bounds;
                this.series.yMandatory ? (g.x = a - .5 * g.width, g.y = e - f * (b.length + (d ? 0 : g.height))) : (g.x = a + f * b.length, d && (g.x -= g.width), g.y = e - .5 * g.height);
                this.position.x = g.x;
                this.position.y = g.y;
                return !0
            }
            return !1
        };
        this.drawMark = function (a, e, f, d) {
            if (this.canDraw(a, e, f, d)) {
                this.draw();
                f = this.bounds;
                var g = this.series.yMandatory, l = d ? f.y : f.getBottom(), k = this.chart.ctx, m = this.chart.aspect.view3d;
                if (g) {
                    if (m) {
                        a = {x: a - 3, y: l, width: 6, height: e - l};
                        b.z = this.format.z - .5 * b.depth;
                        b.cylinder(a, 1, !0);
                        b.draw(this.chart.ctx,
                            null, a);
                        return
                    }
                    k.beginPath();
                    k.moveTo(a, l);
                    k.lineTo(a, e);
                    b.underline && (k.moveTo(f.x, l), k.lineTo(f.x + f.width, l))
                } else e = f.y + .5 * f.height, k.beginPath(), k.moveTo(a, e), d && (f.x += f.width), k.lineTo(f.x, e), b.underline && (k.moveTo(f.x, f.y + f.height), k.lineTo(f.x + (d ? -f.width : f.width), f.y + f.height));
                b.stroke.prepare();
                k.stroke()
            }
        }
    }

    function R(a) {
        for (var d = 0, b = a.length; b--;)d += 0 < a[b] ? a[b] : -a[b];
        return d
    }

    function L(a) {
        return a && a.constructor == Array ? a.filter(function (a) {
            return null !== a
        }).map(L) : a
    }

    function H(a) {
        return Math.max.apply({},
            L(a))
    }

    function I(a) {
        return Math.min.apply({}, L(a))
    }

    function M(a) {
        function d(b) {
            return b.visible && b.firstSeries ? (b = b.format.stroke, "" === b.fill ? 0 : .5 * b.size) : 0
        }

        this.chart = a;
        this.items = [];
        this.count = function () {
            return this.items.length
        };
        this.clicked = function (b) {
            var a = !1;
            this.each(function (e) {
                if (e.visible && e.onclick) {
                    var f = e.clicked(b);
                    -1 != f && (a = e.onclick(e, f, b.x, b.y))
                }
            });
            return a
        };
        this.mousedown = function (b) {
            for (var a = 0, e, f = !1; e = this.items[a++];)e.visible && e.mousedown(b) && (f = !0);
            return f
        };
        this.mousemove =
            function (b) {
                for (var a = 0, e; e = this.items[a++];)e.visible && e.mousemove(b)
            };
        this.mouseout = function () {
            this.each(function (b) {
                b.visible && b.mouseout()
            })
        };
        this.visibleCount = function (b, a, e) {
            for (var f = 0, d = this.items, g = d.length, l; g--, l = d[g];)l.visible && (!a || l instanceof a) && (e && l == b && (e.index = f), f++);
            e && (e.total = f, e.index = f - 1 - e.index);
            return f
        };
        this.beforeDraw = function () {
            this.each(function (b) {
                b.useAxes && b.recalcAxes();
                b.calcColorEach()
            })
        };
        this.anyUsesAxes = function () {
            for (var b = this.items.length, a; b--;)if (a = this.items[b],
                a.visible && a.useAxes)return !0;
            return !1
        };
        this.firstVisible = function () {
            for (var b = 0, a; a = this.items[b++];)if (a.visible)return a;
            return null
        };
        this.vertMargins = function () {
            var b, a = this.items, e = a.length, f, d;
            if (0 < e)for (b = {x: 0, y: 0}, f = {
                x: 0,
                y: 0
            }, a[0].vertMargins(b), d = 1; d < e; d++)f.x = f.y = 0, a[d].vertMargins(f), f.x > b.x && (b.x = f.x), f.y > b.y && (b.y = f.y);
            return b
        };
        this.horizMargins = function () {
            var b, a = this.items, e = a.length, f, d;
            if (0 < e)for (b = {x: 0, y: 0}, f = {
                x: 0,
                y: 0
            }, a[0].horizMargins(b), d = 1; d < e; d++)f.x = f.y = 0, a[d].horizMargins(f),
            f.x > b.x && (b.x = f.x), f.y > b.y && (b.y = f.y);
            return b
        };
        this.minXValue = function (b) {
            var a = Infinity, e;
            this.eachAxis(b, function (b) {
                e = b.minXValue();
                e < a && (a = e)
            });
            return a
        };
        this.minYValue = function (b) {
            var a = Infinity, e;
            this.eachAxis(b, function (b) {
                e = b.minYValue();
                e < a && (a = e)
            });
            return a
        };
        this.maxXValue = function (b) {
            var a = -Infinity, e;
            this.eachAxis(b, function (b) {
                e = b.maxXValue();
                e > a && (a = e)
            });
            return a
        };
        this.maxYValue = function (b) {
            var a = -Infinity, e;
            this.eachAxis(b, function (b) {
                e = b.maxYValue();
                e > a && (a = e)
            });
            return a
        };
        this.draw =
            function () {
                var b = this.items.length, a = this.chart, e = a.ctx, f = a.aspect, h, g;
                if (0 < b) {
                    for (h = 0; h < b; h++)g = this.items[h], g.visible && g.beforeDraw && g.beforeDraw();
                    var l = f.clip && this.anyUsesAxes(), k = a.axes;
                    if (l) {
                        var a = a.chartRect, m = d(k.left), p = d(k.top), k = {
                            x: a.x + m,
                            y: a.y + p,
                            width: a.width - d(k.right),
                            height: a.height - d(k.bottom)
                        };
                        f.clipRect(k)
                    }
                    try {
                        var v = e.beginParent;
                        for (h = 0; h < b; h++)if (g = this.items[h], g.visible) {
                            var y = e.globalAlpha;
                            e.globalAlpha = 1 - g.format.transparency;
                            g.transform && (e.save(), g.transform());
                            g.visual =
                                v ? e.beginParent() : null;
                            if (g.onbeforedraw)g.onbeforedraw(g);
                            g.draw();
                            v && e.endParent();
                            if (g.ondraw)g.ondraw(g);
                            g.transform && e.restore();
                            e.globalAlpha = y
                        }
                    } finally {
                        l && e.restore()
                    }
                    for (h = 0; h < b; h++)g = this.items[h], g.visible && g.marks.visible && (g.transform && (e.save(), g.transform()), g.drawMarks(), g.transform && e.restore())
                }
            }
    }

    function Y(a) {
        this.chart = a;
        this.visible = !0;
        this.transparency = 0;
        this.left = new w(a, !1, !1);
        this.top = new w(a, !0, !0);
        this.right = new w(a, !1, !0);
        this.bottom = new w(a, !0, !1);
        this.items = [this.left,
            this.top, this.right, this.bottom];
        this.each = function (a) {
            for (var b = 0, c; c = this.items[b++];)a.call(c)
        };
        this.add = function (d, b) {
            var c = new w(a, d, b);
            c.custom = !0;
            this.items.push(c);
            return c
        }
    }

    "undefined" !== typeof exports && (exports.Tee = Tee);
    "undefined" !== typeof window && (window.requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
                window.setTimeout(a, 1E3 / 60,
                    (new Date).getTime())
            }
    }());
    var x;
    try {
        Object.defineProperty({}, "x", {}), x = Object.defineProperty
    } catch (Z) {
    }
    "indexOf" in Array.prototype || (Array.prototype.indexOf = function (a, d) {
        void 0 === d && (d = 0);
        0 > d && (d += this.length);
        0 > d && (d = 0);
        for (var b = this.length; d < b; d++)if (d in this && this[d] === a)return d;
        return -1
    });
    r.prototype.set = function (a, d, b, c) {
        this.x = a;
        this.y = d;
        this.width = b;
        this.height = c
    };
    r.prototype.setFrom = function (a) {
        this.x = a.x;
        this.y = a.y;
        this.width = a.width;
        this.height = a.height
    };
    r.prototype.getRight = function () {
        return this.x +
            this.width
    };
    r.prototype.getBottom = function () {
        return this.y + this.height
    };
    r.prototype.setTop = function (a) {
        this.height -= a - this.y;
        this.y = a
    };
    r.prototype.setBottom = function (a) {
        this.height = a - this.y
    };
    r.prototype.setLeft = function (a) {
        this.width -= a - this.x;
        this.x = a
    };
    r.prototype.setRight = function (a) {
        this.width = a - this.x
    };
    r.prototype.contains = function (a) {
        return a.x >= this.x && a.x <= this.x + this.width && a.y >= this.y && a.y <= this.y + this.height
    };
    r.prototype.offset = function (a, d) {
        this.x += a;
        this.y += d
    };
    Tee.Tool = function (a) {
        this.chart =
            a;
        this.active = !0
    };
    Tee.Animation = function (a, d) {
        Tee.Tool.call(this, a);
        this.active = !0;
        this.mode = "linear";
        this.duration = 500;
        this.items = [];
        this.autoDraw = !0;
        this.running = this.loop = !1;
        this.onstop = this.onstart = null;
        a && (a instanceof Tee.Chart ? this.chart = a : a instanceof Tee.Animation && (this.chart = a.chart, a.items.push(this)));
        var b = null;
        this._dostart = function () {
            this.init = (new Date).getTime();
            b.start();
            for (var a = 0, e; e = b.items[a++];)e.active && (e.chart = b.chart, e.start());
            b.chart.draw();
            requestAnimFrame(this.step,
                this)
        };
        this.animate = function (a) {
            this.running || (this.running = !0, a && (this.chart = a), b = this, this._dostart())
        };
        this.start = function () {
            if (this.onstart)this.onstart()
        };
        this.stop = function () {
            if (this.onstop)this.onstop()
        };
        this.doStep = function (b) {
            d && d(b)
        };
        this.step = function () {
            var a, e;
            a = ((new Date).getTime() - b.init) / b.duration;
            var f = "linear" == b.mode ? a : Math.pow(2, 10 * (a - 1));
            if (0 <= f && 1 > f) {
                if (b.running) {
                    b.doStep(f);
                    for (a = 0; e = b.items[a++];)e.active && (e.chart = b.chart, e.doStep(f));
                    b.autoDraw && b.chart.draw();
                    requestAnimFrame(b.step,
                        b)
                }
            } else {
                b.stop();
                for (a = 0; e = b.items[a++];)e.active && (e.chart = b.chart, e.stop());
                if (b.onstop)b.onstop(b);
                b.loop ? b._dostart() : (b.running = !1, b.chart.draw())
            }
        }
    };
    Tee.Animation.prototype = new Tee.Tool;
    Tee.Tool.prototype.mousedown = function () {
    };
    Tee.Tool.prototype.mousemove = function () {
    };
    Tee.Tool.prototype.mouseout = function () {
    };
    Tee.Tool.prototype.clicked = function () {
        return !1
    };
    Tee.Tool.prototype.draw = function () {
    };
    B.prototype.setEndColor = function (a) {
        if (a && "" !== a)for (var d = 1, b = this.colors.length; d < b; d++)this.colors[d] =
            a
    };
    A.prototype.set = function (a) {
        this.visible = a.visible;
        this.color = a.color;
        this.blur = a.blur;
        this.width = a.width;
        this.height = a.height
    };
    E.prototype.getSize = function () {
        var a = this.style.split(" "), d, b;
        for (d = 0; d < a.length; d++)if (b = parseFloat(a[d]))return b;
        return 20
    };
    E.prototype.setSize = function (a) {
        var d = "", b = this.style.split(" "), c;
        for (c = 0; c < b.length; c++)parseFloat(b[c]) ? d += a.toString() + "px " : d += b[c] + " ";
        this.style = d
    };
    E.prototype.prepare = function () {
        var a = this.chart.ctx;
        a.textAlign = this.textAlign;
        a.textBaseline =
            this.baseLine;
        this._sh && this._sh.prepare(a);
        a.font != this.style && (a.font = this.style)
    };
    E.prototype.setChart = function (a) {
        this.chart = a;
        this._g && (this._g.chart = a);
        this._sh && (this._sh.chart = a);
        this._s && this._s.setChart(a)
    };
    Tee.Format = function (a) {
        this.chart = a;
        this.gradient = new B(a);
        this.fill = "rgb(200,200,200)";
        this.stroke = new C(a);
        this.round = {x: 0, y: 0};
        this.transparency = 0;
        this.font = new E(a);
        this._img = null;
        x ? x(this, "image", {
            get: function () {
                this._img || (this._img = new O(this.chart));
                return this._img
            }
        }) : this._img =
            this.image = new O(a);
        this.shadow = new A(a);
        this.roundRect = function (b, a, e, f, d) {
            if (b.roundRect)b.roundRect(a, e, f, d, this.round.x, this.round.y); else {
                var g = a + f, l = e + d, k = this.round.x, m = this.round.y, p = this.round.corners;
                0 > d && (e = l, l = e - d);
                0 > f && (a = g, g = a - f);
                2 * k > f && (k = .5 * f);
                2 * m > d && (m = .5 * d);
                !p || p[0] ? b.moveTo(a + k, e) : b.moveTo(a, e);
                !p || p[1] ? (b.lineTo(g - k, e), b.quadraticCurveTo(g, e, g, e + m)) : b.lineTo(g, e);
                !p || p[2] ? (b.lineTo(g, l - m), b.quadraticCurveTo(g, l, g - k, l)) : b.lineTo(g, l);
                !p || p[3] ? (b.lineTo(a + k, l), b.quadraticCurveTo(a,
                    l, a, l - m)) : b.lineTo(a, l);
                !p || p[0] ? (b.lineTo(a, e + m), b.quadraticCurveTo(a, e, a + k, e)) : b.lineTo(a, e);
                b.closePath()
            }
        };
        this.textHeight = function () {
            return 1.3 * this.font.getSize()
        };
        this.textWidth = function (b) {
            return this.chart.ctx.measureText(b).width
        };
        this.draw = function (b, a, e, f, d, g) {
            var l = this._img, k;
            "object" === typeof e && (f = e.y, d = e.width, g = e.height, e = e.x);
            0 < this.transparency && (k = b.globalAlpha, b.globalAlpha = (1 - this.transparency) * k);
            this.shadow.prepare(b);
            l && l.visible && "" !== l.url ? (b.save(), b.clip(), a ? (a = a(), l.tryDraw(a.x,
                a.y, a.width, a.height)) : l.tryDraw(e, f, d, g), b.restore()) : this.gradient.visible ? (b.fillStyle = a ? this.gradient.create(a()) : this.gradient.rect(e, f, d, g), b.fill()) : "" !== this.fill && (b.fillStyle = this.fill, b.fill());
            "" !== this.stroke.fill && (this.stroke.prepare(), b.stroke());
            0 < this.transparency && (b.globalAlpha = k)
        };
        this.drawText = function (b, a) {
            function e(b) {
                d.fillText(b, k, m);
                g && "" !== g.fill && (g.prepare(), d.strokeText(b, k, m))
            }

            var f = this.font._g, d = this.chart.ctx, g = this.font._s, l = this.font.textAlign, k = b.x, m = b.y;
            d.fillStyle =
                f && f.visible && b ? f.create(b) : this.font.fill;
            if ("center" == l)k += .5 * b.width; else if ("right" == l || "end" == l)k += b.width;
            f = a.split("\n");
            l = f.length;
            if (1 < l)for (var p = this.textHeight(f[0]), v = 0; v < l; v++)e(f[v]), m += p; else e(a)
        };
        this.rectangle = function (b, a, e, f) {
            1 > this.transparency && ("object" === typeof b ? this.rectangle(b.x, b.y, b.width, b.height) : (this.rectPath(b, a, e, f), this.draw(this.chart.ctx, null, b, a, e, f)))
        };
        this.polygonBounds = function (b, a) {
            var e = 0, f = 0, d = 0, g = 0, l = b.length, k, m;
            if (0 < l)for (e = d = b[0].x, f = g = b[0].y, m = 1; m <
            l; m++)k = b[m].x, k < e ? e = k : k > d && (d = k), k = b[m].y, k < f ? f = k : k > g && (g = k);
            a.x = e;
            a.y = f;
            a.width = d - e;
            a.height = g - f
        };
        var d = new r;
        this.polygon = function (b) {
            var a = this.chart.ctx, e = b.length, f;
            a.beginPath();
            a.moveTo(b[0].x, b[0].y);
            for (f = 1; f < e; f++)a.lineTo(b[f].x, b[f].y);
            a.closePath();
            var h = this;
            this.draw(a, function () {
                h.polygonBounds(b, d);
                return d
            })
        }
    };
    Tee.Format.prototype.ellipsePath = function (a, d, b, c, e) {
        this.chart.__webgl ? (a.z = this.z, a.depth = this.depth, a.ellipsePath(d, b, c, e)) : (a.save(), a.translate(d, b), a.scale(.5 * c, .5 *
            e), a.beginPath(), a.arc(0, 0, 1, 0, 2 * Math.PI, !1), a.restore())
    };
    Tee.Format.prototype.ellipse = function (a, d, b, c) {
        var e = this.chart.ctx;
        this.ellipsePath(e, a, d, b, c);
        this.draw(e, null, a - .5 * b, d - .5 * c, b, c)
    };
    Tee.Format.prototype.sphere = function (a, d, b, c) {
        if (this.chart.__webgl) {
            var e = this.chart.ctx;
            e.depth = this.depth;
            e.z = this.z;
            this.gradient.visible && (e.fillStyle = this.gradient.colors[this.gradient.colors.length - 1]);
            e.sphere(a, d, b, c)
        } else this.ellipse(a, d, b, c)
    };
    Tee.Format.prototype.cylinder = function (a, d, b, c) {
        if (this.chart.__webgl) {
            var e =
                this.chart.ctx;
            e.depth = this.depth;
            e.z = this.z;
            e.image = this.image;
            e.cylinder(a, d, b, c)
        } else 1 == d ? this.cube(a) : (d = a.width, c = a.height, b ? this.polygon([new n(a.x + .5 * d, a.y), new n(a.x, a.y + c), new n(a.x + d, a.y + c)]) : this.polygon([new n(a.x + d, a.y + .5 * c), new n(a.x, a.y), new n(a.x, a.y + c)]))
    };
    Tee.Format.prototype.cube = function (a) {
        var d = this.chart.aspect, b = d.view3d, c, e, f, h = 0, g = 0;
        if (b) {
            if (this.chart.__webgl) {
                b = this.chart.ctx;
                b.depth = this.depth;
                b.z = this.z;
                b.cube(a, this.round.x);
                return
            }
            c = this.z;
            var l = this.depth, h = c * d._orthox,
                g = -c * d._orthoy;
            c = a.x + a.width;
            e = a.y + a.height;
            var k = l * d._orthox, d = -l * d._orthoy;
            f = this.shadow.visible;
            this.shadow.visible = !1;
            var m = c + k, p = a.y + d;
            0 < l && (this.polygon([{x: c, y: a.y}, {x: m, y: p}, {x: m, y: e + d}, {
                x: c,
                y: e
            }]), 0 < a.width && this.polygon([{x: a.x, y: a.y}, {x: a.x + k, y: p}, {x: m, y: p}, {x: c, y: a.y}]))
        }
        this.rectPath(a.x + h, a.y + g, a.width, a.height);
        b && (this.shadow.visible = f)
    };
    Tee.Format.prototype.rectPath = function (a, d, b, c) {
        var e = this.chart.ctx;
        e.beginPath();
        0 < this.round.x && 0 < this.round.y ? this.roundRect(e, a, d, b, c) : e.rect(a,
            d, b, c)
    };
    Tee.Format.prototype.setChart = function (a) {
        this.chart = a;
        this.shadow.chart = a;
        this.gradient.chart = a;
        this.font.setChart(a);
        this._img && (this._img.chart = a);
        this.stroke.setChart(a)
    };
    Tee.Annotation = function (a, d, b, c) {
        function e(b) {
            return !b || 0 === b.length
        }

        Tee.Tool.call(this, a);
        this.position = new n(b || 10, c || 10);
        var f = this.margins = new N;
        this.items = [];
        var h = this.bounds = new r;
        this.visible = !0;
        this.transparent = !1;
        this.text = d || "";
        var g = this.format = new Tee.Format(a);
        g.font.textAlign = "center";
        g.font.baseLine =
            "top";
        g.fill = "beige";
        g.round = {x: 4, y: 4};
        g.stroke.fill = "silver";
        g.shadow.visible = !0;
        g.depth = .05;
        g.z = .5;
        var l, k, m;
        this.moveTo = function (b, a) {
            this.position.x = b;
            this.position.y = a;
            this.resize()
        };
        this.shouldDraw = function () {
            return this.visible && !e(this.text)
        };
        this.resize = function () {
            if (!e(this.text)) {
                g.font.prepare();
                this.rows = this.text.split("\n");
                l = g.textHeight(this.text);
                var b = this.rows.length;
                k = l * b + f.top;
                var a, c = k + f.bottom;
                if (1 < b)for (a = 0; b--;)a = Math.max(a, g.textWidth(this.rows[b] + "W")); else a = g.textWidth(this.text +
                    "W");
                a += f.left + f.right;
                var b = this.position, d = b.y + k, m, t;
                for (m = 0; t = this.items[m++];) {
                    var q = t.bounds;
                    t.resize();
                    c += q.height;
                    a = Math.max(a, q.width);
                    q.x = b.x;
                    q.y = d;
                    d += q.height
                }
                for (m = 0; t = this.items[m++];)t.bounds.width = a - f.right;
                h.set(b.x, b.y, a, c)
            }
        };
        this.add = function (b) {
            b = new Tee.Annotation(this.chart, b);
            this.items.push(b);
            b.transparent = !0;
            return b
        };
        this.doDraw = function () {
            if (!e(this.text)) {
                if (this.transparent)this.chart.ctx.z = g.z; else if (this.chart.aspect.view3d && 0 < this.format.depth) {
                    var b = g.z;
                    g.z -= .5 * this.format.depth;
                    g.cube(h);
                    g.draw(this.chart.ctx, null, h);
                    g.z = b
                } else this.chart.ctx.z = g.z, g.rectangle(h);
                var a, b = this.format.transparency, c = this.chart ? this.chart.ctx : null;
                0 < b && (a = c.globalAlpha, c.globalAlpha = (1 - b) * a);
                g.font.prepare();
                h.y += f.top + .1 * l;
                h.x += f.left;
                var d = h.width;
                h.width -= f.right;
                g.drawText(h, this.text);
                h.x = this.position.x;
                h.y = this.position.y;
                h.width = d;
                0 < b && (c.globalAlpha = a)
            }
            for (a = 0; b = this.items[a++];)b.doDraw()
        };
        this.clicked = function (b) {
            return this.visible && h.contains(b)
        };
        this.doMouseMove = function (b) {
            (this.mouseinside =
                this.clicked(b)) ? (this.cursor && (this.chart.newCursor = this.cursor), this.wasinside || (m = new S(250, h, g))) : this.wasinside && (m.restore(), this.chart.draw());
            this.wasinside = this.mouseinside
        };
        this.mousemove = function (b) {
            this.cursor && "default" != this.cursor && this.doMouseMove(b)
        };
        this.forceDraw = function () {
            this.resize();
            this.doDraw()
        };
        this.setChart = function (b) {
            this.chart = b;
            this.format.setChart(b)
        }
    };
    Tee.Annotation.prototype = new Tee.Tool;
    Tee.Annotation.prototype.draw = function () {
        this.visible && this.forceDraw()
    };
    Tee.DragTool =
        function (a) {
            Tee.Tool.call(this, a);
            this.series = null;
            var d = this.target = {series: null, index: -1};
            this.clicked = function () {
                d.series = null;
                d.index = -1
            };
            var b = new n(0, 0);
            this.Point = b;
            this.mousedown = function (a) {
                var e = this.chart.series.items, f = e.length;
                this.chart.calcMouse(a, b);
                d.series = null;
                d.index = -1;
                if (this.series && this.series.visible)d.index = this.series.clicked(b), -1 != d.index && (d.series = this.series); else for (a = 0; a < f; a++)if (e[a].visible && (d.index = e[a].clicked(b), -1 != d.index)) {
                    d.series = e[a];
                    break
                }
                return -1 !=
                    d.index
            };
            this.mousemove = function (b) {
                if (-1 != d.index) {
                    var a = d.series;
                    b = a.mandatoryAxis.fromPos(a.yMandatory ? b.y : b.x);
                    this.onchanging && (b = this.onchanging(this, b));
                    a.data.values[d.index] = b;
                    if (this.onchanged)this.onchanged(this, b);
                    this.chart.draw()
                }
            }
        };
    Tee.DragTool.prototype = new Tee.Tool;
    Tee.CursorTool = function (a) {
        Tee.Tool.call(this, a);
        this.direction = "both";
        this.size = new n(0, 0);
        this.followMouse = !0;
        this.dragging = -1;
        this.format = new Tee.Format(a);
        this.horizAxis = a ? a.axes.bottom : null;
        this.vertAxis = a ? a.axes.left :
            null;
        var d, b = new r;
        this.over = function (a) {
            var e = -1;
            if (b.contains(a)) {
                var c = 3 > Math.abs(d.x - a.x);
                a = 3 > Math.abs(d.y - a.y);
                var f = this.direction;
                "both" == f && c && a ? e = 0 : !c || "both" != f && "vertical" != f ? !a || "both" != f && "horizontal" != f || (e = 2) : e = 1
            }
            return e
        };
        this.calcRect = function () {
            var e = a.chartRect, c = this.horizAxis, f = this.vertAxis;
            b.x = c ? c.startPos : e.x;
            b.width = c ? c.endPos - b.x : e.width;
            b.y = f ? f.startPos : e.y;
            b.height = f ? f.endPos - b.y : e.height
        };
        var c = new n(0, 0);
        this.mousedown = function (b) {
            this.chart.calcMouse(b, c);
            this.dragging =
                this.followMouse ? -1 : this.over(c);
            return -1 < this.dragging
        };
        this.clicked = function () {
            this.dragging = -1
        };
        this.mousemove = function (c) {
            var g = this.dragging, l = this.followMouse;
            if (l || -1 < g)if (d || (d = new n), d.x != c.x || d.y != c.y)if (this.calcRect(), b.contains(c)) {
                if (l || 0 === g || 1 === g)d.x = c.x;
                if (l || 0 === g || 2 === g)d.y = c.y;
                "full" == this.render ? this.chart.draw() : (e && ("copy" == this.render ? this.chart.ctx.drawImage(e, 0, 0) : (g = a.bounds, f.clearRect(g.x, g.y, g.width, g.height))), this.dodraw("copy" == this.render ? this.chart.ctx : f));
                if (this.onchange)this.onchange(c);
                return
            }
            c = this.over(c);
            this.chart.newCursor = d && -1 < c ? 0 === c ? "move" : 1 === c ? "e-resize" : "n-resize" : "default"
        };
        this.render = "copy";
        var e, f;
        this.setRender = function (b) {
            this.render = b;
            e && (this.resetCopy(), this.chart.draw())
        };
        this.resetCopy = function () {
            var b = this.chart.canvas;
            "layer" == this.render ? (e.style.position = "absolute", b.parentNode.appendChild(e), e.setAttribute("left", b.offsetLeft + "px"), e.setAttribute("top", b.offsetTop + "px"), e.style.left = b.offsetLeft, e.style.top = b.offsetTop, e.style.zIndex = 10, e.style.pointerEvents =
                "none") : e.parentNode && e.parentNode.removeChild(e)
        };
        this.draw = function () {
            "full" == this.render ? this.dodraw(this.chart.ctx) : (e || (e = this.chart.canvas.cloneNode(), this.resetCopy(), f = e.getContext("2d")), "copy" == this.render ? (f.drawImage(a.canvas, 0, 0), this.dodraw(this.chart.ctx)) : this.dodraw(f))
        };
        this.dodraw = function (a) {
            var c = this.direction, e = "both" == c, f;
            this.calcRect();
            d || (d = new n(b.x + .5 * b.width, b.y + .5 * b.height));
            a.beginPath();
            if (e || "vertical" == c)f = .5 * this.size.y, a.moveTo(d.x, 0 === f ? b.y : d.y - f), a.lineTo(d.x,
                0 === f ? b.y + b.height : d.y + f);
            if (e || "horizontal" == c)f = .5 * this.size.x, a.moveTo(0 === f ? b.x : d.x - f, d.y), a.lineTo(0 === f ? b.x + b.width : d.x + f, d.y);
            this.format.stroke.prepare(this.format.stroke.fill, a);
            a.stroke()
        }
    };
    Tee.CursorTool.prototype = new Tee.Tool;
    Tee.ToolTip = function (a) {
        function d() {
            function b(a) {
                c.moveTo(c.oldX + a * c.deltaX, c.oldY + a * c.deltaY);
                c.autoRedraw && c.chart.draw()
            }

            var a = ((new Date).getTime() - c.init) / c.animated;
            1 > a ? (b(a), window.requestAnimFrame(d, c)) : b(1)
        }

        Tee.Annotation.call(this, a);
        this.visible = !1;
        this.currentSeries =
            null;
        this.currentIndex = -1;
        this.timID = null;
        this.autoHide = !1;
        this.delay = 1E3;
        this.animated = 100;
        this.autoRedraw = !0;
        this.render = "dom";
        this.domStyle = "padding:5px; margin-left:5px; background-color:#666; border-radius:4px 4px; color:#FFF; z-index:1000;";
        this.hide = function () {
            var b = "dom" === this.render;
            if (this.visible || b) {
                if (this.onhide)this.onhide(this);
                this.visible = !1;
                this.autoRedraw && (b ? Tee.DOMTip.hide() : this.chart.draw());
                this.currentIndex = -1;
                this.currentSeries = null
            }
        };
        var b = function (b) {
            b && b[0].hide()
        };
        this.mousemove = function (a) {
            var c = this.chart.series, d = c.count(), g = null, l = -1;
            if (this.chart.chartRect.contains(a))for (d -= 1; 0 <= d; d--) {
                var k = c.items[d];
                if (k.visible && (l = k.clicked(a), -1 != l)) {
                    g = k;
                    break
                }
            }
            if (-1 == l)this.hide(), this.currentIndex = -1, this.currentSeries = null; else if (l != this.currentIndex || g != this.currentSeries)if (this.currentIndex = l, this.currentSeries = g)this.refresh(g, l), this.autoHide && 0 < this.delay && (clearTimeout(this.timID), this.timID = window.setTimeout(b, this.delay, [this]))
        };
        var c = null;
        this.refresh =
            function (b, a) {
                var h = "dom" === this.render;
                this.visible = !h;
                this.text = b.markText(a);
                this.ongettext && (this.text = this.ongettext(this, this.text, b, a));
                if ("" !== this.text) {
                    this.resize();
                    var g = new n;
                    b.calc(a, g);
                    g.x -= .5 * this.bounds.width;
                    g.y -= 1.5 * this.bounds.height;
                    0 > g.x && (g.x = 0);
                    0 > g.y && (g.y = 0);
                    h || this.autoHide || !(0 < this.animated) || isNaN(this.position.x) || isNaN(this.position.y) ? (this.moveTo(g.x, g.y), this.autoRedraw && (h ? Tee.DOMTip.show(this.text, "auto", this.chart.canvas, this.domStyle) : this.chart.draw())) : (this.oldX =
                        this.position.x, this.oldY = this.position.y, this.deltaX = g.x - this.oldX, this.deltaY = g.y - this.oldY, this.init = (new Date).getTime(), c = this, window.requestAnimFrame(d, this));
                    if (this.onshow)this.onshow(this, b, a)
                }
            }
    };
    Tee.ToolTip.prototype = new Tee.Annotation;
    Tee.RainbowPalette = function () {
        return "#FF0000 #FF7F00 #FFFF00 #00FF00 #0000FF #6600FF #8B00FF".split(" ")
    };
    Tee.Palette = function (a) {
        this.colors = a
    };
    Tee.Palette.prototype.get = function (a) {
        return this.colors[-1 == a ? 0 : a % this.colors.length]
    };
    K.prototype = new Tee.Annotation;
    w.adjustRect = function () {
        if (this.visible) {
            var a = 0, d = this.labels, b = this.chart.chartRect, c = this.title, e;
            (this.firstSeries = this.hasAnySeries()) && this.visible && (this.checkMinMax(), d.checkStyle(), (e = c.shouldDraw()) && c.resize(), b.automatic && !this.custom && (d.visible && (d.format.font.prepare(), this.maxLabelDepth = a = this.minmaxLabelWidth(!0), d.alternate && (a *= 2), a += d.padding), this.ticks.visible && (a += this.ticks.length), e && (a += c.bounds.height), this.horizontal ? this.otherSide ? b.setTop(b.y + a) : b.height -= a : this.otherSide ?
                b.width -= a : b.setLeft(b.x + a)))
        }
    };
    w.prototype.setPos = function (a, d) {
        this.startPos = a + this.start * d * .01;
        this.endPos = a + this.end * d * .01;
        this.axisSize = this.endPos - this.startPos
    };
    w.calcRect = function () {
        if (this.firstSeries) {
            this.checkMinMax();
            var a = this.chart.chartRect, d = this.bounds, b = this.horizontal;
            b ? (d.y = this.otherSide ? a.y : a.y + a.height, d.width = a.width, this.setPos(a.x, a.width)) : (d.x = this.otherSide ? a.x + a.width : a.x, d.height = a.height, this.setPos(a.y, a.height));
            this.calcAxisScale();
            if (this.automatic) {
                var d = this.chart.series,
                    d = b ? d.horizMargins() : d.vertMargins(), c = 0 < d.x, e = 0 < d.y;
                c && (this.minimum -= this.fromSize(d.x));
                e && (this.maximum += this.fromSize(d.y));
                (c || e) && this.calcAxisScale()
            }
            this.calcScale();
            var d = (b ? a.height : a.width) * this.position * .01, c = this.chart.walls, e = 0, f = c.visible && this.chart.aspect.view3d;
            b ? (f && c.bottom.visible && (e = c.bottom.size), this.axisPos = this.otherSide ? a.y + d : a.getBottom() + e - d) : (f && c.left.visible && (e = c.left.size), this.axisPos = this.otherSide ? a.getRight() - d : a.x - e + d)
        }
    };
    w.draw = function () {
        this.visible && this.firstSeries &&
        (this.z = this.otherSide ? this.chart.walls.back.format.z : 0, "" !== this.format.stroke.fill && this.drawAxis(), this.roundMin() + 1E3 * this.increm > this.maximum && (this.grid.visible && this.drawGrids(), this.ticks.visible && this.drawTicks(this.ticks, 1, 0), this.innerTicks.visible && this.drawTicks(this.innerTicks, -1, 0), this.minorTicks.visible && this.drawTicks(this.minorTicks, 1, Math.max(0, this.minorTicks.count)), this.labels.visible && this.drawLabels()), this.title.shouldDraw() && this.drawTitle())
    };
    Q.prototype = new Tee.Annotation;
    "map" in Array.prototype || (Array.prototype.map = function (a, d) {
        for (var b = Array(this.length), c = 0, e = this.length; c < e; c++)c in this && (b[c] = a.call(d, this[c], c, this));
        return b
    });
    "filter" in Array.prototype || (Array.prototype.filter = function (a, d) {
        for (var b = [], c, e = 0, f = this.length; e < f; e++)e in this && a.call(d, c = this[e], e, this) && b.push(c);
        return b
    });
    Tee.Series = function (a, d) {
        this.chart = null;
        this.data = {values: [], labels: [], source: null};
        this.yMandatory = !0;
        this.horizAxis = "bottom";
        this.vertAxis = "left";
        this.sequential = !0;
        var b = this.format = new Tee.Format(this.chart), c = this.hover = new Tee.Format(this.chart), e = c.shadow;
        b.fill = "";
        b.stroke.fill = "";
        this.visible = !0;
        c.stroke.size = 3;
        c.fill = "";
        c.stroke.fill = "red";
        e.visible = !0;
        e.color = "red";
        e.blur = 10;
        e.width = 0;
        e.height = 0;
        this.cursor = "default";
        this.over = -1;
        this.marks = new Q(this, this.chart);
        this.palette = new Tee.Palette;
        this.paletteName = "opera";
        this.themeName = "default";
        this.colorEach = "auto";
        this.useAxes = !0;
        this.decimals = 2;
        this._paintWalls = this._paintAxes = !0;
        this.init = function (b,
                              a) {
            "object" === typeof b && b && (b instanceof Array ? (this.data.values = b, a instanceof Array && (this.data.labels = a)) : b instanceof Tee.Chart ? (this.chart = b, a instanceof Array && (this.data.values = a)) : (this.data.source = b, this.refresh()))
        };
        this.init(a, d);
        this.getFill = function (b, a) {
            var c = this.palette, c = c && c.colors ? c.get(b) : null;
            return null === c ? this.isColorEach || !a ? this.chart.palette.get(b) : a.fill : c
        };
        this.isNull = function (b) {
            return null === this.data.values[b]
        };
        this.getFillStyle = function (a, c) {
            return b.gradient.visible ?
                b.gradient.create(a, c) : c
        };
        this.title = "";
        this.titleText = function (b) {
            return this.title || "Series " + b.toString()
        };
        this.refresh = function (b) {
            this.data.source ? this.data.source instanceof HTMLTextAreaElement ? (parseText(this.data, this.data.source.value), this.chart && this.chart.draw()) : this.data.source instanceof HTMLInputElement ? Tee.doHttpRequest(this, this.data.source.value, function (b, a) {
                parseText(b.data, a);
                b.chart.draw()
            }, function (a, c) {
                b && b(this, a, c)
            }) : b && b(this) : this.data.xml ? (parseXML(this, this.data.xml),
                this.chart.draw()) : this.data.json && (parseJSON(this, this.data.json), this.chart.draw())
        };
        this.valueOrLabel = function (b) {
            var a = this.data.labels[b];
            a && "" !== a || (a = this.valueText(b));
            return a
        };
        this.toPercent = function (b) {
            var a = this.data.values;
            return (100 * Math.abs(a[b]) / R(a)).toFixed(this.decimals) + " %"
        };
        this.markText = function (b) {
            var a = this.marks, c = this.dataText(b, a.style, !1);
            return a.ongettext ? a.ongettext(this, b, c) : c
        };
        this.associatedToAxis = function (b) {
            return b.horizontal ? "both" == this.horizAxis || this._horizAxis ==
            b : "both" == this.vertAxis || this._vertAxis == b
        };
        this.bounds = function (b) {
            var a = this._horizAxis, c = this._vertAxis;
            b.x = a.calc(this.minXValue());
            b.width = a.calc(this.maxXValue()) - b.x;
            b.y = c.calc(this.maxYValue());
            b.height = c.calc(this.minYValue()) - b.y
        };
        this.calcStack = function (b, a, c) {
            c = this.pointOrigin(b, !1) + c;
            var e = this.mandatoryAxis;
            a.x = this.notmandatory.calc(this.data.x ? this.data.x[b] : b);
            this.isStack100 ? (b = this.pointOrigin(b, !0), a.y = 0 === b ? e.endPos : e.calc(100 * c / b)) : a.y = e.calc(c);
            this.yMandatory || (b = a.x, a.x =
                a.y, a.y = b)
        };
        this.pointOrigin = function (b, a) {
            var c = 0, e, d, m = this.chart.series.items, p;
            for (e = 0; e < m.length; e++)if (d = m[e], a || d != this)p = d.data.values, d.visible && d.constructor == this.constructor && p.length > b && (d = p[b], void 0 !== d && (c += a && 0 > d ? -d : d)); else break;
            return c
        };
        this.doHover = function (b) {
            var a = this.chart;
            if (b != this.over) {
                if (a.onhover)a.onhover(this, b);
                this.over = b;
                this.hover.enabled && window.requestAnimFrame(function () {
                    a.draw()
                })
            }
        }
    };
    Tee.Series.prototype.initZ = function (a, d) {
        var b = this.format;
        b.z = a / d;
        b.depth =
            1 / d;
        this.marks.format.z = b.z + .5 * b.depth
    };
    Tee.Series.prototype.setChart = function (a, d) {
        a.chart = d;
        a.recalcAxes();
        a.format.setChart(d);
        a.marks.setChart(d);
        a.hover.setChart(d)
    };
    Tee.Series.prototype.calc = function (a, d) {
        var b = this.data, c = this.notmandatory.calc(b.x ? b.x[a] : a), b = this.mandatoryAxis.calc(b.values[a]);
        d.x = this.yMandatory ? c : b;
        d.y = this.yMandatory ? b : c
    };
    Tee.Series.prototype.recalcAxes = function () {
        var a = this.chart.axes;
        this._horizAxis = this.horizAxis instanceof w ? this.horizAxis : "top" == this.horizAxis ? a.top :
            a.bottom;
        this._vertAxis = this.vertAxis instanceof w ? this.vertAxis : "right" == this.vertAxis ? a.right : a.left;
        this.mandatoryAxis = this.yMandatory ? this._vertAxis : this._horizAxis;
        this.notmandatory = this.yMandatory ? this._horizAxis : this._vertAxis
    };
    Tee.Series.prototype.getRect = function () {
        return new r
    };
    Tee.Series.prototype.clicked = function () {
        return -1
    };
    Tee.Series.prototype.valueText = function (a) {
        return (a = (this.data._old || this.data.values)[a]) ? a instanceof Date ? a.format ? a.format(this.dateFormat) : a.toString() : this.valueFormat ?
            a.toLocaleString() : (a | 0) == a ? a.toFixed(0) : a.toFixed(this.decimals) : "0"
    };
    Tee.Series.prototype.labelOrTitle = function (a) {
        return this.data.labels[a] || this.title
    };
    Tee.Series.prototype.mousedown = function () {
        return !1
    };
    Tee.Series.prototype.mousemove = function (a) {
        if (this.hover.enabled || "default" != this.cursor) {
            var d = this.clicked(a);
            this.doHover(d);
            if ("default" != this.cursor && -1 != d) {
                this.chart.newCursor || (this.chart.newCursor = this.cursor);
                return
            }
        }
        d = this.marks;
        if (d.visible) {
            var b = this.data.values.length, c = new n,
                e;
            for (e = 0; e < b; e += d.drawEvery)if (!this.isNull(e) && (this.markPos(e, c), d.canDraw(c.x, c.y, e) && d.bounds.contains(a))) {
                this.doHover(e);
                break
            }
        }
    };
    Tee.Series.prototype.mouseout = function () {
    };
    Tee.Series.prototype.markPos = function (a, d) {
        this.calc(a, d);
        return !1
    };
    Tee.Series.prototype.drawMarks = function () {
        var a = this.data.values.length, d = new n, b, c;
        for (b = 0; b < a; b += this.marks.drawEvery)this.isNull(b) || (c = this.markPos(b, d), this.marks.drawMark(d.x, d.y, b, c))
    };
    Tee.Series.prototype.horizMargins = function () {
    };
    Tee.Series.prototype.vertMargins =
        function () {
        };
    Tee.Series.prototype.minXValue = function () {
        return this.data.x && 0 < this.data.x.length ? I(this.data.x) : 0
    };
    Tee.Series.prototype.minYValue = function () {
        var a = this.data.values;
        return 0 < a.length ? I(a) : 0
    };
    Tee.Series.prototype.maxXValue = function () {
        if (this.data.x)return 0 < this.data.x.length ? H(this.data.x) : 0;
        var a = this.data.values.length;
        return 0 === a ? 0 : a - 1
    };
    Tee.Series.prototype.maxYValue = function () {
        var a = this.data.values, d = a.length, b, c, e;
        if (0 < d) {
            e = H(a);
            if (e !== e)for (b = 0; b < d; b++)c = a[b], void 0 !== c && (e !==
            e ? e = c : c > e && (e = c));
            return e === e ? e : 0
        }
        return 0
    };
    Tee.Series.prototype.calcColorEach = function () {
        this.isColorEach = "yes" == this.colorEach
    };
    Tee.Series.prototype.stackMaxValue = function () {
        if ("100" == this.stacked)return 100;
        var a = Tee.Series.prototype.maxYValue;
        if ("no" == this.stacked)return a.call(this);
        for (var a = a.call(this), d = this.data.values, b = d.length, c; b--;)c = d[b], void 0 === c && (c = 0), a = Math.max(a, this.pointOrigin(b, !1) + c);
        return a
    };
    Tee.Series.prototype.dataText = function (a, d, b, c) {
        function e(b, a) {
            return c ? f ? [b,
                a] : [b, ""] : b + (a ? " " + a : "")
        }

        var f = b ? this.labelOrTitle(a) : this.data.labels[a];
        return "value" == d ? this.valueText(a) : "percent" == d ? this.toPercent(a) : "percentlabel" == d ? e(this.toPercent(a), f) : "valuelabel" == d || "auto" == d ? e(this.valueText(a), f) : "label" == d ? f || "" : "index" == d ? a.toFixed(0) : "labelvalue" == d ? e(f, this.valueText(a)) : "labelpercent" == d ? e(f, this.toPercent(a)) : this.valueOrLabel(a)
    };
    Tee.Series.prototype.legendText = Tee.Series.prototype.dataText;
    Tee.Series.prototype.count = function () {
        return this.data.values.length
    };
    Tee.Series.prototype.legendCount = function () {
        return this.count()
    };
    Tee.Series.prototype.legendColor = function (a) {
        return this.isColorEach && -1 != a ? this.getFill(a) : this.format.fill
    };
    Tee.Series.prototype.addRandom = function (a, d, b) {
        d || (d = 1E3);
        a || (a = 5);
        var c = this.data;
        c.values.length = a;
        b && (c.x = Array(a));
        if (0 < a) {
            c.values[0] = Math.random() * d;
            b && (c.x[0] = Math.random() * d);
            for (var e = 1; e < a; e++)c.values[e] = c.values[e - 1] + Math.random() * d - .5 * d, b && (c.x[e] = Math.random() * d)
        }
        return this
    };
    Tee.Series.prototype.doSort = function (a,
                                            d) {
        if ("none" == a)return null;
        for (var b = this.data.values, c = b.length, e = Array(c), f = 0; f < c; f++)e[f] = f;
        if ("labels" == a) {
            var b = this.data.labels, h, g, l = d ? -1 : 1, k = d ? 1 : -1;
            e.sort(function (a, c) {
                h = b[a].toLowerCase();
                g = b[c].toLowerCase();
                return h < g ? l : h == g ? 0 : k
            })
        } else e.sort(d ? function (a, c) {
            return b[a] - b[c]
        } : function (a, c) {
            return b[c] - b[a]
        });
        return e
    };
    M.prototype.each = function (a) {
        for (var d = this.items.length, b = 0; b < d; b++)a(this.items[b])
    };
    M.prototype.eachAxis = function (a, d) {
        for (var b = this.items.length, c; b--;)c = this.items[b],
        c.visible && (!a || c.associatedToAxis(a)) && (c.__alwaysDraw || 0 < c.count()) && d(c)
    };
    Tee.Chart = function (a, d, b) {
        function c(a) {
            f.chart.addSeries(new (b || Tee.Bar)(f.chart)).data.values = a
        }

        var e = "undefined" != typeof navigator ? navigator.userAgent.toLowerCase() : "";
        this.isChrome = -1 < e.indexOf("chrome");
        this.isAndroid = -1 < e.indexOf("android");
        this.isMozilla = "undefined" !== typeof window && window.mozRequestAnimationFrame;
        a && (this.canvas = "undefined" !== typeof HTMLCanvasElement && a instanceof HTMLCanvasElement ? a : "string" == typeof a ?
            document.getElementById(a) : a);
        this.canvas || (this.canvas = document.createElement("canvas"), this.canvas.width = 600, this.canvas.height = 400);
        var f = this.canvas;
        this.bounds = (this.__webgl = f.__webgl) || 0 === f.clientWidth ? new r(0, 0, f.width, f.height) : new r(0, 0, f.clientWidth, f.clientHeight);
        this.chartRect = new r;
        this.chartRect.automatic = !0;
        this.chartRect.setFrom(this.bounds);
        this.palette = new Tee.Palette("#4466a3 #f39c35 #f14c14 #4e97a8 #2b406b #1d7b63 #b3080e #f2c05d #5db79e #707070 #f3ea8d #b4b4b4".split(" "));
        var h = this.aspect = {
            chart: this,
            view3d: this.__webgl,
            ortogonal: !this.__webgl,
            rotation: 0,
            elevation: 315,
            perspective: 50,
            clip: !0,
            _orthox: 10,
            _orthoy: 8,
            clipRect: function (b) {
                var a = this.chart.ctx;
                a.save();
                a.beginPath();
                this.view3d ? a.rect(b.x, b.y - this._orthoy, b.width + this._orthox, b.height + this._orthoy) : a.rect(b.x, b.y, b.width, b.height);
                a.clip()
            }
        };
        this.panel = new W(this);
        this.walls = {
            chart: this,
            visible: !0,
            left: new F(this),
            right: new F(this),
            bottom: new F(this),
            back: new F(this),
            draw: function (b, a) {
                var c, e = this.chart.ctx,
                    f = this.transparency, d = e.beginParent;
                this.visual = d ? e.beginParent() : null;
                0 < f && (c = e.globalAlpha, e.globalAlpha = (1 - f) * c);
                var g = this.back.bounds;
                g.setFrom(b);
                if (a.view3d) {
                    var h = this.bottom.visible ? this.bottom.size : 0, l = this.left.size;
                    0 < l && (g.x -= l, g.width += l);
                    0 < h && (g.height += h);
                    this.left.bounds.set(b.x - l, b.y, l, b.height + h);
                    this.bottom.bounds.set(b.x, b.getBottom(), b.width, h);
                    this.back.format.depth = this.back.size
                }
                !this.back.visible || this.back.draw();
                this.chart.aspect.view3d && (this.left.visible && this.left.draw(),
                this.bottom.visible && this.bottom.draw(), this.right.visible && this.right.draw());
                0 < f && (e.globalAlpha = c);
                d && e.endParent()
            }
        };
        a = this.walls.back.format;
        a.fill = "rgb(240,240,240)";
        a.shadow.visible = !0;
        a.z = 1;
        a = this.walls.left;
        a.format.fill = "#BBAA77";
        a.format.depth = 1;
        a.size = 2;
        a = this.walls.bottom;
        a.format.depth = 1;
        a.size = 2;
        this.walls.right.visible = !1;
        this.axes = new Y(this);
        this.legend = new X(this);
        this.series = new M(this);
        this.title = new K(this, "blue");
        this.title.text = "TeeChart";
        this.title.format.z = 1;
        this.footer =
            new K(this, "red");
        this.footer.format.z = 0;
        this.zoom = new U(this);
        this.scroll = new V(this);
        this.tools = new T(this);
        this.oldPos = new n;
        this.calcMouse = function (b, a) {
            a.x = b.clientX;
            a.y = b.clientY;
            var c = this.canvas;
            if (c.getBoundingClientRect)c = c.getBoundingClientRect(), a.x -= c.left, a.y -= c.top; else if (c.offsetParent) {
                do a.x -= c.offsetLeft, a.y -= c.offsetTop, c = c.offsetParent; while (c)
            }
        };
        var g = new n(0, 0);
        this.domousemove = function (b) {
            var a = this.chart;
            if (!a.ctx)return !1;
            b = b || window.event;
            b.touches && (b = b.touches[b.touches.length -
            1]);
            a.calcMouse(b, g);
            if (a.scroll.active) {
                var c = a.scroll.direction, e = "both" == c, f;
                if (e || "horizontal" == c)f = a.axes.bottom.fromSize(a.oldPos.x - g.x), a.axes.top.scroll(f), a.axes.bottom.scroll(f);
                if (e || "vertical" == c)f = -a.axes.left.fromSize(a.oldPos.y - g.y), a.axes.left.scroll(f), a.axes.right.scroll(f);
                a.oldPos.x = g.x;
                a.oldPos.y = g.y;
                a.scroll.done = !0;
                if (a.onscroll)a.onscroll(b);
                a.scroll.done && window.requestAnimFrame(function () {
                    a.draw()
                });
                return !1
            }
            if (a.zoom.active) {
                if (g.x != a.oldPos.x || g.y != a.oldPos.y)a.zoom.change(g),
                    window.requestAnimFrame(function () {
                        a.draw()
                    }), a.zoom.done = !0;
                return !1
            }
            a.newCursor = null;
            a.tools.mousemove(g);
            a.series.mousemove(g);
            a.legend.mousemove(g);
            a.title.mousemove(g);
            a.mousemove && a.mousemove(g);
            b = this.chart.canvas.style;
            a.newCursor ? b.cursor != a.newCursor && (a.oldCursor = b.cursor, b.cursor = a.newCursor) : void 0 !== a.oldCursor && b.cursor != a.oldCursor && (b.cursor = a.oldCursor);
            return !0
        };
        var l = new n(0, 0);
        this.domousedown = function (b) {
            b = b || window.event;
            var a = !1, c = this.chart;
            c.calcMouse(b.touches ? b.touches[0] :
                b, l);
            var e = c.series.anyUsesAxes() && c.chartRect.contains(l);
            b.touches ? 1 < b.touches.length ? (c.zoom.active = c.zoom.enabled && e, c.zoom.active && (c.scroll.active = !1)) : (c.scroll.active = c.scroll.enabled && e, c.scroll.active && (c.zoom.active = !1)) : (c.zoom.active = b.button == c.zoom.mouseButton && c.zoom.enabled && e, c.scroll.active = b.button == c.scroll.mouseButton && c.scroll.enabled && e);
            c.zoom.done = !1;
            c.scroll.done = !1;
            c.oldPos = l;
            0 === b.button ? (a = c.tools.mousedown(b), a || (a = c.series.mousedown(b)) || (a = c.legend.mousedown(b)), a ||
            c.mousedown && (a = c.mousedown(b)), c.canvas.oncontextmenu = null) : 2 == b.button && (c.canvas.oncontextmenu = function () {
                return !1
            });
            a ? c.zoom.active = c.scroll.active = !1 : a = c.zoom.active || c.scroll.active;
            b.preventDefault ? b.preventDefault() : b.cancelBubble = !0;
            a && (b = b.target || b.fromElement) && b.setCapture && b.setCapture();
            return !a
        };
        this.domouseup = function (b) {
            b = b || window.event;
            var a = this.chart, c;
            a.zoom.active = !1;
            a.scroll.active = !1;
            if (a.zoom.done) {
                if (a.zoom.apply() && a.onzoom)a.onzoom();
                a.draw();
                c = !0
            } else if (c = a.scroll.done,
                    !c) {
                c = a.series.clicked(a.oldPos);
                if (!c && (c = a.tools.clicked(a.oldPos), !c && (c = a.title.clicked(a.oldPos)) && a.title.onclick))a.title.onclick(a.title);
                c || a.mouseup && (c = a.mouseup(b))
            }
            a.zoom.old = null;
            a.zoom.done = !1;
            a.scroll.done = !1;
            c ? b.preventDefault ? b.preventDefault() : b.cancelBubble = !0 : a.canvas.oncontextmenu = null;
            (b = b.target || b.fromElement) && b.releaseCapture && b.releaseCapture()
        };
        f.onmousedown = f.ontouchstart = this.domousedown;
        f.onmouseup = f.ontouchstop = this.domouseup;
        f.onmousemove = f.ontouchmove = this.domousemove;
        this._doWheel = function (b) {
            var a = this.chart;
            if (a.zoom.wheel.enabled) {
                b = b || window.event;
                var c = a.zoom.wheel.factor * (b.wheelDelta ? b.wheelDelta / 120 : b.detail ? -b.detail / 3 : 0);
                if (0 < Math.abs(c)) {
                    var e = {x: 0, y: 0};
                    a.calcMouse(b, e);
                    a.chartRect.contains(e) && (a.axes.each(function () {
                        var b = this.maximum - this.minimum;
                        0 < b && (b = c * b * .05, this.setMinMax(this.minimum + b, this.maximum - b))
                    }), a.draw(), b.returnValue = !1, b.preventDefault && b.preventDefault())
                }
            }
        };
        f.addEventListener && f.addEventListener("DOMMouseScroll", this._doWheel,
            !1);
        f.onmousewheel = this._doWheel;
        f.onmouseout = function (b) {
            b && !b.target.setCapture && (this.chart.scroll.active = !1);
            this.chart.series.mouseout();
            this.chart.tools.mouseout()
        };
        this.addSeries = function (b) {
            b.setChart(b, this);
            var a = this.series.items, c = a.indexOf(b);
            -1 == c && (c = a.push(b) - 1);
            "" === b.title && (b.title = "Series" + (1 + c).toString());
            "" === b.format.fill && (b.format.fill = this.palette.get(c));
            return b
        };
        this.removeSeries = function (b) {
            var a = this.series.items;
            b = a.indexOf(b);
            -1 != a && a.splice(b, 1)
        };
        f.chart = this;
        if (d &&
            0 < d.length)if (d[0] instanceof Array)for (a = 0; a < d.length; a++)c(d[a]); else c(d);
        this.getSeries = function (b) {
            return this.series.items[b]
        };
        this.draw = function (b) {
            var a = this.series, c = this.chartRect;
            b = this.ctx = b || (this.canvas.getContext ? this.canvas.getContext("2d") : null);
            if (!b)throw"Canvas does not provide Context";
            c.automatic && c.setFrom(this.bounds);
            for (var e = a.items.length, f, d = !1, g = !1, l = 1, q = a.visibleCount(), n = 0; e--;)f = a.items[e], f.visible && (f.initZ(n, q), n++, f._paintAxes && (d = !0), f._paintWalls && (g = !0), f.maxZ &&
            f.maxZ > l && (l = f.maxZ));
            this.walls.left.format.depth = l;
            this.walls.bottom.format.depth = l;
            this.walls.back.format.z = l;
            this.panel.draw();
            c.automatic && this.panel.margins.apply(c);
            this.title.tryDraw(!0);
            this.footer.tryDraw(!1);
            a.beforeDraw();
            this.legend.visible && (this.legend.calcrect(), this.legend.draw());
            h.view3d && !this.__webgl && (c.y += h._orthoy, c.height -= h._orthoy, c.width -= h._orthox);
            var a = this.axes, r;
            this.series.anyUsesAxes() && (a.each(w.adjustRect), a.each(w.calcRect), this.walls.visible && g && this.walls.draw(c,
                this.aspect), a.visible && d && (0 < a.transparency && (r = b.globalAlpha, b.globalAlpha = (1 - a.transparency) * r), c = b.beginParent, a.visual = c ? b.beginParent() : null, a.each(w.draw), c && b.endParent(), 0 < a.transparency && (b.globalAlpha = r)));
            this.series.draw();
            this.tools.draw();
            this.zoom.active && this.zoom.draw();
            if (this.ondraw)this.ondraw(this)
        };
        this.toImage = function (b, a, c) {
            if (b = document.getElementById(b))b.src = "" !== a ? this.canvas.toDataURL(a, c) : this.canvas.toDataURL()
        }
    };
    Tee.CustomBar = function (a, d) {
        Tee.Series.call(this, a,
            d);
        this.sideMargins = 100;
        this.useOrigin = !0;
        this.origin = 0;
        this.marks.visible = !0;
        this.marks.location = "end";
        this.hover.enabled = !0;
        this.offset = 0;
        this.barSize = 70;
        this.barStyle = "bar";
        var b = this.format;
        b.fill = "";
        b.stroke.fill = "black";
        b.shadow.visible = !0;
        b.round.x = 4;
        b.round.y = 4;
        b.gradient.visible = !0;
        b.depth = 1;
        this.stacked = "no";
        this.drawBar = function (a, c) {
            var e = b.depth, f = b.z, d = this.chart.ctx;
            c || (c = this.barStyle);
            b.depth = .5 * Math.min(this.yMandatory ? a.width : a.height, 200) / 100;
            if (0 < a.width && 0 < a.height) {
                "side" !==
                this.stacked && (b.z += .5 * (1 - b.depth));
                if ("bar" === c)b.cube(a); else if ("line" === c) {
                    var g;
                    d.beginPath();
                    d.z = b.z + .5 * b.depth;
                    this.yMandatory ? (g = a.x + .5 * a.width, d.moveTo(g, a.y), d.lineTo(g, a.y + a.height)) : (g = a.y + .5 * a.height, d.moveTo(a.x, g), d.lineTo(a.x + a.width, g))
                } else"cylinder" === c ? b.cylinder(a, 1, this.yMandatory) : "cone" === c ? b.cylinder(a, 0, this.yMandatory) : "ellipsoid" === c && this.chart.__webgl ? (d.depth = b.depth, d.z = b.z, d.image = this.image, d.ellipsoid(a, this.yMandatory)) : (b.z += .5 * b.depth, b.ellipsePath(this.chart.ctx,
                    a.x + .5 * a.width, a.y + .5 * a.height, a.width, a.height));
                b.depth = e;
                b.z = f;
                return !0
            }
            return !1
        };
        this.countAll = function (a) {
            var b = this.chart.series.items, c = 0, e = b.length, f, d;
            for (f = 0; f < e && (d = b[f], d != this || !a); f++)d.visible && d.constructor == this.constructor && (c += d.data.values.length);
            return c
        };
        var c = new n, e, f = new r, h = {total: 0, index: 0};
        this._margin = 0;
        this.calcBarOffset = function (a) {
            var b = "sideAll" == this.stacked;
            this.countall = b ? this.countAll(!0) : 0;
            b = b ? this.countAll() : this.data.values.length;
            1 < b && (a /= b - 1);
            "no" == this.stacked ?
                (a /= h.total, c.x = a * this.barSize * .01 * (1 == h.total ? -.5 : h.index - .5 * h.total), b = h.total) : (c.x = .5 * -a, b = 1);
            c.y = a * this.barSize * .01;
            this._margin = .5 * b * c.y + this.sideMargins * b * (a - c.y) * .005;
            "no" != this.stacked && (c.x += this.offset * a * .01 + .5 * (a - c.y))
        };
        this.calcStackPos = function (a, b) {
            var c, f, d;
            this.isStacked ? (this.calcStack(a, b, this.data.values[a]), c = this.pointOrigin(a, !1), d = this.mandatoryAxis, this.isStack100 ? (f = this.pointOrigin(a, !0), e = 0 === f ? d.endPos : d.calc(100 * c / f)) : e = d.calc(c)) : (this.calc(a, b), "sideAll" == this.stacked &&
            (f = this.notmandatory.calc(this.countall + a), this.yMandatory ? b.x = f : b.y = f))
        };
        var g = !1;
        this.draw = function () {
            var a = this.data.values.length;
            if (0 < a) {
                this.initOffsets();
                var d = new n, h = this.chart.ctx;
                this.hover.enabled || (b.stroke.prepare(), b.shadow.prepare(h));
                var p = this.hover.enabled, v = "line" === this.barStyle, y = this.data.styles;
                p && null != this.format.image.url && (this.hover.image.url = this.format.image.url);
                for (var s = b.z = 0; s < a; s++)if (!this.isNull(s)) {
                    this.calcStackPos(s, d);
                    this.calcBarBounds(d, f, c, e);
                    var u = this.drawBar(f,
                        y ? y[s] : null), t = p && this.over == s, q = t ? this.hover : b;
                    h.fillStyle = this.getFillStyle(f, this.getFill(s, "" === q.fill ? b : q));
                    p && q.shadow.prepare(h);
                    t && (null == this.format.image.url || g ? h.fill() : (g = !0, b.draw(h, null, f)));
                    u && (q.draw(h, null, f), v || "" !== q.stroke.fill) && (p && q.stroke.prepare(), !t && v && (h.strokeStyle = h.fillStyle), h.shadowColor = "transparent", h.stroke(), q.shadow.visible && (h.shadowColor = q.shadow.color))
                }
            }
        };
        this.calcColorEach = function () {
            this.chart.series.visibleCount(this, Tee.CustomBar, h);
            this.isColorEach = "yes" ==
                this.colorEach || "auto" == this.colorEach && 1 == h.total
        };
        this.initOffsets = function () {
            var a = this.notmandatory, b = this.mandatoryAxis, c = this.yMandatory ? this.maxXValue() - this.minXValue() : this.maxYValue() - this.minYValue();
            this.calcBarOffset(0 === c ? a.axisSize : a.calcSize(c));
            e = this.useOrigin ? b.calc(this.origin) : this.yMandatory ? b.inverted ? b.startPos : b.endPos : b.inverted ? b.endPos : b.startPos;
            a = this.stacked;
            this.isStacked = "no" !== a && "sideAll" !== a && "side" !== a;
            this.isStack100 = "100" === a
        };
        this.clicked = function (a) {
            this.initOffsets();
            var b = new n, d = this.data.values.length, g;
            for (g = 0; g < d; g++)if (!this.isNull(g) && (this.calcStackPos(g, b), this.calcBarBounds(b, f, c, e), f.contains(a)))return g;
            return -1
        };
        this.markPos = function (a, b) {
            var d = this.yMandatory, g = c.x + .5 * c.y, h = this.marks;
            this.calcStackPos(a, b);
            if ("sideAll" == this.stacked) {
                var n = this.notmandatory.calc(this.countall + a);
                d ? b.x = n : b.y = n
            }
            n = this.useOrigin && this.data.values[a] < this.origin;
            this.mandatoryAxis.inverted && (n = !n);
            "center" == h.location && (this.calcBarBounds(b, f, c, e), h.canDraw(b.x, b.y,
                a, n) && (d ? b.y = f.y + .5 * f.height + .5 * h.bounds.height : b.x = f.x + .5 * f.width - .5 * h.bounds.width));
            var h = this.chart.aspect, s = h.view3d, u = 0, t = 0;
            s && h.orthogonal && (u = .5 * h._orthox, t = .5 * h._orthoy);
            d ? (b.x += s ? g + u : g, s && (b.y -= t)) : (b.y += s ? g - t : g, s && (b.x += u));
            return n
        };
        this.labelOrTitle = function (b) {
            var a = this.title, c = this.data.labels[b];
            return 1 < h.total ? a || c : this.parent.labelOrTitle(b)
        };
        this.initZ = function (b, a) {
            var c, e = this.format;
            if ("side" !== this.stacked)for (e.z = 0, e.depth = 1; 1 < b;) {
                if (b--, c = this.chart.series.items[b], c.visible &&
                    c.constructor == this.constructor) {
                    e.z = c.z;
                    e.depth = c.depth;
                    break
                }
            } else Tee.Series.prototype.initZ.call(this, b, a);
            this.marks.format.z = e.z + .5 * e.depth
        }
    };
    Tee.CustomBar.prototype = new Tee.Series;
    Tee.CustomBar.prototype.parent = Tee.Series.prototype;
    Tee.CustomBar.constructor = Tee.CustomBar;
    Tee.Bar = function (a, d) {
        Tee.CustomBar.call(this, a, d);
        this.calc = function (b, a) {
            this.isStacked ? this.calcStack(b, a, this.data.values[b]) : this.parent.calc.call(this, b, a)
        };
        this.horizMargins = function (b) {
            this.initOffsets();
            b.x = this._margin;
            b.y = this._margin
        };
        this.vertMargins = function (b) {
            var a = this.marks, e = this.format.stroke, f = this.minYValue() < this.origin;
            a.visible && "center" !== a.location && (b.y = a.arrow.length + a.format.textHeight("Wj") + a.margins.top + a.margins.bottom, e = a.format.stroke);
            "" !== e.fill && (b.y += 2 * e.size + 1);
            f && (b.x = b.y)
        };
        this.maxXValue = function () {
            return "sideAll" === this.stacked ? this.countAll() - 1 : this.parent.maxXValue.call(this)
        };
        this.minYValue = function () {
            var a = this.parent.minYValue.call(this);
            return this.useOrigin ? Math.min(this.origin,
                a) : a
        };
        this.maxYValue = function () {
            if ("sideAll" === this.stacked || "side" === this.stacked) {
                var a = 0, c, e = this.chart.series.items, f = e.length, d;
                for (d = 0; d < f; d++)c = e[d], c.visible && c.constructor === this.constructor && (c = c.parent.maxYValue.call(c), c > a && (a = c));
                return a
            }
            return this.stackMaxValue()
        };
        this.calcBarBounds = function (a, c, e, f) {
            c.x = a.x + e.x;
            c.width = e.y;
            this._vertAxis.inverted ? (c.y = f, c.height = a.y - c.y) : (c.y = a.y, c.height = f - a.y);
            0 > c.height && (c.y += c.height, c.height = -c.height)
        }
    };
    Tee.Bar.prototype = new Tee.CustomBar;
    Tee.Bar.prototype.parent = Tee.CustomBar.prototype;
    Tee.HorizBar = function (a, d) {
        Tee.CustomBar.call(this, a, d);
        this.yMandatory = !1;
        this.format.gradient.direction = "rightleft";
        this.maxMarkWidth = function () {
            var a = 0, c, e, f = this.marks, d = this.count(), g;
            if (f.visible)for (c = this.marks.format, c.font.prepare(), e = 0; e < d; e += f.drawEvery)this.isNull(e) || (g = c.textWidth(this.markText(e) + "W"), g > a && (a = g));
            return a
        };
        this.horizMargins = function (a) {
            var c = this.marks, e = this.format.stroke, f = this.minXValue() < this.origin;
            c.visible && "center" !==
            c.location && (a.y = c.arrow.length + this.maxMarkWidth() + c.margins.left + c.margins.right, e = c.format.stroke);
            "" !== e.fill && (a.y += 2 * e.size + 1);
            f && (a.x = a.y)
        };
        this.vertMargins = function (a) {
            this.initOffsets();
            a.x += this._margin;
            a.y += this._margin
        };
        this.maxYValue = function () {
            return "sideAll" == this.stacked ? this.countAll() - 1 : this.parent.maxXValue.call(this)
        };
        this.minYValue = function () {
            return "sideAll" == this.stacked ? 0 : this.parent.minXValue.call(this)
        };
        this.minXValue = function () {
            var a = this.parent.minYValue.call(this);
            return this.useOrigin ?
                Math.min(this.origin, a) : a
        };
        this.maxXValue = function () {
            return this.stackMaxValue()
        };
        this.calcBarBounds = function (a, c, e, f) {
            c.y = a.y + e.x;
            c.height = e.y;
            this._horizAxis.inverted ? (c.x = a.x, c.width = f - a.x) : (c.x = f, c.width = a.x - c.x);
            0 > c.width && (c.x += c.width, c.width = -c.width)
        }
    };
    Tee.HorizBar.prototype = new Tee.CustomBar;
    Tee.HorizBar.prototype.parent = Tee.CustomBar.prototype;
    Tee.CustomSeries = function (a, d) {
        Tee.Series.call(this, a, d);
        this.stacked = "no";
        this.invertedStairs = this.stairs = !1;
        this.hover.enabled = !0;
        this.isStack100 =
            this.isStacked = this.hover.line = !1;
        this.smooth = 0;
        this.pointer = new function (a, c) {
            this.setChart = function (a) {
                this.chart = a;
                this.format.setChart(a)
            };
            this.chart = a;
            this.inflateMargins = !0;
            var e = this.format = new Tee.Format(a);
            e.shadow.visible = !1;
            e.fill = "";
            e.gradient.colors = ["white", "white", "white"];
            e.gradient.visible = !0;
            e.shadow.visible = !0;
            this.colorEach = this.visible = !1;
            this.style = "rectangle";
            this.height = this.width = 12;
            this.draw = function (a, b, e, d) {
                var k = this.chart.ctx;
                e.z = c.format.z;
                this.transform && (k.save(),
                    this.transform(a.x, a.y, b));
                b = .5 * this.width;
                var m = .5 * this.height;
                "cube" == this.style ? (a = {
                    x: a.x - b,
                    y: a.y - m,
                    width: this.width,
                    height: this.height
                }, d = Math.max(b, m) / 50, e.z = .5 * (c.format.z + c.format.depth) - .5 * d, e.depth = d, e.cube(a), e.draw(k, null, a)) : "rectangle" == this.style ? e.rectangle(a.x - b, a.y - m, this.width, this.height) : "ellipse" == this.style ? e.ellipse(a.x, a.y, this.width, this.height) : "sphere" == this.style ? (e.depth = c.format.depth, e.sphere(a.x, a.y, this.width, this.height)) : "cylinder" == this.style ? (a = {
                    x: a.x - b, y: a.y -
                    m, width: this.width, height: this.height
                }, d = e.gradient, b = d.direction, m = d.colors.slice(0), d.direction = "leftright", d.colors = [d.colors[1], d.colors[0], d.colors[1]], e.cylinder(a, 1, !0), e.draw(k, null, a), d.direction = b, d.colors = m) : "cone" == this.style ? (a = {
                    x: a.x - b,
                    y: a.y - m,
                    width: this.width,
                    height: this.height
                }, e.cylinder(a, 0, !0), e.draw(k, null, a)) : "triangle" == this.style ? e.polygon([new n(a.x, a.y - m), new n(a.x - b, a.y + m), new n(a.x + b, a.y + m)]) : "downtriangle" == this.style ? e.polygon([new n(a.x, a.y + m), new n(a.x - b, a.y - m), new n(a.x +
                    b, a.y - m)]) : "diamond" == this.style ? e.polygon([new n(a.x, a.y - m), new n(a.x - b, a.y), new n(a.x, a.y + m), new n(a.x + b, a.y)]) : (k.beginPath(), "cross" == this.style && (k.moveTo(a.x - b, a.y), k.lineTo(a.x + b, a.y), k.moveTo(a.x, a.y - m), k.lineTo(a.x, a.y + m)), "x" == this.style && (k.moveTo(a.x - b, a.y - m), k.lineTo(a.x + b, a.y + m), k.moveTo(a.x - b, a.y + m), k.lineTo(a.x + b, a.y - m)), e.stroke.prepare(d), k.stroke());
                this.transform && k.restore()
            };
            this.setSize = function (a) {
                this.height = this.width = a
            }
        }(this.chart, this);
        this.maxYValue = function () {
            return this.stackMaxValue()
        };
        this.calc = function (a, c) {
            this.isStacked ? this.calcStack(a, c, this.data.values[a]) : Tee.Series.prototype.calc.call(this, a, c)
        };
        this.calcColorEach = function () {
            this.isColorEach = "yes" == this.colorEach || this.pointer.colorEach
        };
        this.initZ = function (a, c) {
            var e, d = this.format;
            if ("no" !== this.stacked)for (d.z = 0, d.depth = 1; 1 < a;) {
                if (a--, e = this.chart.series.items[a], e.visible && e.constructor == this.constructor) {
                    d.z = e.z;
                    d.depth = e.depth;
                    break
                }
            } else Tee.Series.prototype.initZ.call(this, a, c);
            this.marks.z = d.z + .5 * d.depth
        }
    };
    Tee.CustomSeries.prototype =
        new Tee.Series;
    Tee.CustomSeries.prototype.drawPointers = function () {
        var a = this.data.values.length, d = this.pointer.format, b = "yes" == this.colorEach || this.pointer.colorEach;
        b || "" !== d.fill || (d.fill = this.format.fill);
        var c = new n, e = d.gradient, f, h = d.fill, g = h;
        !b && e.visible && e.setEndColor(h);
        for (f = 0; f < a; f++)this.isNull(f) || (this.calc(f, c), h = this.getFill(f, d), h != g && (e.visible ? e.setEndColor(h) : d.fill = h, g = h), this.getSize(f), this.pointer.draw(c, f, d, h), this.hover.enabled && this.over == f && this.pointer.draw(c, f, this.hover,
            h));
        b && (d.fill = g)
    };
    Tee.CustomSeries.prototype.setChart = function (a, d) {
        var b = Tee.Series.prototype.setChart;
        b(a, d);
        a.pointer.setChart(d)
    };
    Tee.CustomSeries.prototype.clicked = function (a) {
        var d = new n, b = new n, c = this.data.values.length, e;
        if (this.drawLine && 0 < c && (this.hover.line || !this.pointer.visible))for (this.calc(0, d), e = 1; e < c; e++) {
            this.calc(e, b);
            if (this.stairs) {
                var f;
                f = this.invertedStairs ? new n(b.x, d.y) : new n(d.x, b.y);
                if (J(a, d, f, 3) || J(a, f, b, 3))return e
            } else if (J(a, d, b, 3))return e;
            d.x = b.x;
            d.y = b.y
        }
        if (this.pointer.visible)for (d =
                                          new r, b = this.pointer, e = c - 1; 0 <= e; e--)if (!this.isNull(e) && (this.calc(e, d), this.getSize(e), d.x -= .5 * b.width, d.width = b.width, d.y -= .5 * b.height, d.height = b.height, d.contains(a)))return e;
        return -1
    };
    Tee.CustomSeries.prototype.horizMargins = function (a) {
        var d = this.pointer, b = d.format.stroke;
        d.visible && d.inflateMargins && (a.x = a.y = ("" !== b.fill ? b.size : 0) + 1 + .5 * d.width)
    };
    Tee.CustomSeries.prototype.vertMargins = function (a) {
        var d = this.pointer, b = d.format.stroke;
        d.visible && d.inflateMargins && (a.x = a.y = ("" !== b.fill ? b.size : 0) +
            1 + .5 * d.height)
    };
    Tee.CustomSeries.prototype.getSize = function () {
    };
    Tee.Line = function (a, d) {
        Tee.CustomSeries.call(this, a, d);
        this.drawLine = !0;
        this.treatNulls = "dontPaint";
        var b = this.format;
        b.shadow.visible = !0;
        b.shadow.blur = 10;
        b.lineCap = "round";
        this.doDrawLine = function (a) {
            var e = new n, d, h, g = this.data.values.length, l, k = 0, m = g, p = this.notmandatory;
            this.smooth || this.data.x || (k = Math.max(0, (p.minimum | 0) - 1), m = Math.min(g, (p.maximum | 0) + 2));
            p = this.chart.aspect.view3d;
            a.beginPath();
            if (0 < this.smooth && "undefined" !== typeof Tee.drawSpline) {
                d =
                    Array(2 * g);
                for (l = 0; l < g; l++)this.calc(l, e), d[2 * l] = e.x, d[2 * l + 1] = e.y;
                a.spline ? a.spline(d) : Tee.drawSpline(a, d, this.smooth, !0)
            } else for (g = "skip" !== this.treatNulls, l = k; l < m; l++)this.isNull(l) ? g && (k = -1) : (this.calc(l, e), l == k || -1 === k ? (a.moveTo(e.x, e.y), k = 0) : (this.stairs && (this.invertedStairs ? a.lineTo(e.x, h) : a.lineTo(d, e.y)), a.lineTo(e.x, e.y)), d = e.x, h = e.y);
            d = b.stroke;
            this.chart.isChrome && b.shadow.visible && (d.size = Math.max(1.1, d.size));
            a.z = b.z;
            a.depth = b.depth;
            e = d.fill;
            "" === e && (e = b.fill);
            d.prepare(e);
            b.shadow.prepare(a);
            p && (a.fillStyle = b.fill, a.fill());
            "" !== e && a.stroke()
        };
        this.draw = function () {
            0 < this.data.values.length && (this.isStacked = "no" != this.stacked, this.isStack100 = "100" == this.stacked, this.drawLine && this.doDrawLine(this.chart.ctx), this.pointer.visible && this.drawPointers())
        }
    };
    Tee.Line.prototype = new Tee.CustomSeries;
    Tee.PointXY = function (a, d) {
        Tee.Line.call(this, a, d);
        this.hover.enabled = !0;
        this.pointer.visible = !0;
        this.drawLine = !1
    };
    Tee.PointXY.prototype = new Tee.Line;
    Tee.Series.prototype.cellRect = function (a, d, b) {
        var c =
        {total: 0, index: -1};
        a.setFrom(this.chart.chartRect);
        this.chart.series.visibleCount(this, b, c);
        if (d && 1 < c.total) {
            d = Math.round(Math.sqrt(c.total));
            b = Math.round(c.total / d);
            if (a.width > a.height) {
                var e = d;
                d = b;
                b = e
            }
            a.width /= d;
            a.x += c.index % d * 1.03 * a.width;
            a.height /= b;
            a.y += 1.03 * (c.index / d | 0) * a.height;
            a.width *= .94;
            a.height *= .94
        }
        return a
    };
    Tee.Pie = function (a, d) {
        function b(a, b) {
            b.x = k.x + Math.cos(a) * l;
            b.y = k.y + Math.sin(a) * l
        }

        Tee.Series.call(this, a, d);
        this.marks.style = "percent";
        this.rotation = this.donut = 0;
        this.colorEach =
            "yes";
        this.useAxes = !1;
        var c = this.format;
        c.stroke.fill = "black";
        c.shadow.visible = !0;
        c.gradient.visible = !0;
        c.gradient.direction = "radial";
        c.gradient.colors = ["white", "white", "white"];
        this.hover.enabled = !0;
        this.sort = "values";
        this.orderAscending = !1;
        this.explode = null;
        this.marks.visible = !0;
        this.concentric = !1;
        this.getValue = function (a) {
            return this.data.values[a]
        };
        this.calcCenter = function (a, b, c, e) {
            this.explode && (a = this.explode[a]) && (a = b * a * .01, e.x += a * Math.cos(c), e.y += a * Math.sin(c))
        };
        this.clicked = function (a) {
            var b =
                this.chart.ctx, c = this.data.values.length, e, d;
            if (b.isPointInPath)for (v = p = Math.PI * this.rotation / 180, e = 0; e < c; e++)if (d = m ? m[e] : e, !this.isNull(d) && (this.slice(b, d), b.isPointInPath(a.x, a.y)))return d;
            return -1
        };
        var e, f, h, g, l, k = {x: 0, y: 0}, m, p, v, y;
        this.getCenter = function (a) {
            a.x = k.x;
            a.y = k.y;
            return g
        };
        this.slice = function (a, d) {
            var m = new n;
            v += 2 * Math.PI * (Math.abs(this.data.values[d]) / e);
            k.x = f;
            k.y = h;
            this.calcCenter(d, g, .5 * (p + v), k);
            0 === this.donut ? (m.x = k.x, m.y = k.y) : b(p, m);
            this.chart.__webgl ? (b(2 * Math.PI - p, m), a.slice(m,
                k, g, p, v, l, c.tube, c.beveled)) : (a.beginPath(), a.moveTo(m.x, m.y), a.arc(k.x, k.y, g, p, v, !1), 0 !== this.donut && (b(v, m), a.lineTo(m.x, m.y), a.arc(k.x, k.y, l, v, p, !0)), a.closePath());
            d == this.over && (y = p);
            p = v
        };
        this.fill = function (a) {
            return this.getFillStyle(this.chart.chartRect, this.getFill(a))
        };
        this.slices = function (a) {
            var b = this.chart.ctx, e = this.data.values.length, d, f;
            v = p = Math.PI * this.rotation / 180;
            b.z = .5;
            b.depth = 1;
            for (d = 0; d < e; d++)f = m ? m[d] : d, this.isNull(f) || (this.slice(b, f), a ? c.shadow.prepare(b) : b.fillStyle = this.fill(f),
                b.fill(), a || (f = c.stroke, "" !== f.fill && (f.prepare(), b.stroke())))
        };
        var s = new r;
        this.draw = function () {
            if (0 < this.data.values.length) {
                var a = 0, b = this.marks;
                c.shadow.visible && (a += 2 * c.shadow.height);
                b.visible && (b.format.font.prepare(), a += b.format.textHeight("Wj") + .5 * b.arrow.length);
                this.cellRect(s, !this.concentric, Tee.Pie);
                f = s.x + .5 * s.width;
                h = s.y + .5 * s.height;
                g = .5 * s.width;
                a = .5 * (s.height - 2 * a);
                0 > a && (a = 0);
                a < g && (g = a);
                l = g * this.donut * .01;
                e = R(this.data.values);
                m = this.doSort(this.sort, this.orderAscending);
                this.chart.__webgl ||
                this.slices(!0);
                this.slices(!1);
                this.hover.enabled && -1 != this.over && (a = this.hover, "" !== a.stroke.fill && (v = p = y, b = this.chart.ctx, this.slice(b, this.over), b.fillStyle = this.fill(this.over), a.draw(b, null, s)))
            }
        };
        this.drawMarks = function () {
            var a = Math.PI * this.rotation / 180, b = a, c = this.data.values, d = c.length, l, p;
            this.marks.format.z = .5;
            for (p = 0; p < d; p += this.marks.drawEvery)l = m ? m[p] : p, this.isNull(l) || (a += 2 * Math.PI * (Math.abs(c[l]) / e), b = .5 * (b + a), k.x = f, k.y = h, this.calcCenter(p, g, b, k), this.marks.drawPolar(k, g, b, l), b = a)
        }
    };
    Tee.Pie.prototype = new Tee.Series;
    Tee.Area = function (a, d) {
        Tee.CustomSeries.call(this, a, d);
        this.useOrigin = !1;
        this.origin = 0;
        this.drawLine = !0;
        var b = this.format;
        b.shadow.visible = !0;
        b.lineCap = "round";
        b.stroke.fill = "black";
        b.fill = "";
        b.beveled = !0;
        b.depth = 1;
        b.z = .5;
        var c = new r;
        this.draw = function () {
            var a = this.data.values.length;
            if (0 < a) {
                var d = this.mandatoryAxis, h = this.notmandatory, g, l = this.yMandatory;
                g = this.useOrigin ? d.calc(this.origin) : l && d.inverted || !l && !d.inverted ? d.startPos : d.endPos;
                this.isStacked = "no" != this.stacked;
                this.isStack100 = "100" == this.stacked;
                var k = new n, m, p, d = this.chart.ctx, v, y = this.isStacked, s = 0, u = a;
                this.smooth || this.data.x || (s = Math.max(0, (h.minimum | 0) - 1), u = Math.min(a, (h.maximum | 0) + 2));
                d.depth = b.depth;
                d.z = b.z;
                d.beginPath();
                if (0 < this.smooth && "undefined" !== typeof Tee.drawSpline) {
                    v = Array(2 * a);
                    for (p = 0; p < a; p++)this.calc(p, k), v[2 * p] = k.x, v[2 * p + 1] = k.y;
                    h = l ? v[0] : v[1];
                    d.spline ? d.spline(v, !0) : Tee.drawSpline(d, v, this.smooth, !0);
                    if (y) {
                        var t = 0;
                        for (p = a - 1; 0 <= p; p--)this.calcStack(p, k, 0), v[t++] = k.x, v[t++] = k.y;
                        d.lineTo(v[0],
                            v[1]);
                        d.spline ? d.spline(v, !0) : Tee.drawSpline(d, v, this.smooth, !1)
                    }
                } else if (this.calc(s, k), d.moveTo(k.x, k.y), h = l ? k.x : k.y, m = l ? k.y : k.x, this.stairs)for (p = s + 1; p < u; p++)this.calc(p, k), d.lineTo(k.x, m), d.lineTo(k.x, k.y), m = l ? k.y : k.x; else for (p = s + 1; p < u; p++)this.calc(p, k), d.lineTo(k.x, k.y);
                if (y) {
                    if (0 === this.smooth)for (p = u - 1; p >= s; p--)this.calcStack(p, k, 0), this.stairs ? (d.lineTo(k.x, m), d.lineTo(k.x, k.y), m = l ? k.y : k.x) : d.lineTo(k.x, k.y)
                } else l ? (d.lineTo(k.x, g), d.lineTo(h, g)) : (d.lineTo(g, k.y), d.lineTo(g, h));
                d.closePath();
                a = b.gradient;
                a.visible && (a.colors[a.colors.length - 1] = b.fill);
                this.bounds(c);
                d.__webgl && (d.beveled = b.beveled);
                b.draw(d, null, c);
                this.pointer.visible && this.drawPointers()
            }
        };
        this.minYValue = function () {
            var a = this.yMandatory ? Tee.Series.prototype.minYValue.call(this) : Tee.Series.prototype.minXValue.call(this);
            return this.yMandatory ? this.useOrigin ? Math.min(a, this.origin) : a : a
        };
        this.minXValue = function () {
            var a = this.yMandatory ? Tee.Series.prototype.minXValue.call(this) : Tee.Series.prototype.minYValue.call(this);
            return this.yMandatory ? a : this.useOrigin ? Math.min(a, this.origin) : a
        };
        this.maxYValue = function () {
            var a = this.yMandatory ? this.stackMaxValue() : Tee.Series.prototype.maxXValue.call(this);
            return this.yMandatory ? this.useOrigin ? Math.max(a, this.origin) : a : a
        };
        this.maxXValue = function () {
            var a = this.yMandatory ? Tee.Series.prototype.maxXValue.call(this) : this.stackMaxValue();
            return this.yMandatory ? a : this.useOrigin ? Math.max(a, this.origin) : a
        };
        this.vertMargins = function (a) {
            this.yMandatory && "" !== b.stroke.fill && (a.y += b.stroke.size +
                2)
        };
        this.horizMargins = function (a) {
            this.yMandatory || "" === b.stroke.fill || (a.y += b.stroke.size + 2)
        }
    };
    Tee.Area.prototype = new Tee.CustomSeries;
    Tee.HorizArea = function (a, d) {
        Tee.Area.call(this, a, d);
        this.yMandatory = !1
    };
    Tee.HorizArea.prototype = new Tee.Area;
    Tee.Donut = function (a, d) {
        Tee.Pie.call(this, a, d);
        this.donut = 50
    };
    Tee.Donut.prototype = new Tee.Pie;
    Tee.Gantt = function (a, d) {
        Tee.Series.call(this, a, d);
        this.yMandatory = !1;
        this.dateFormat = "mediumDate";
        this.hover.enabled = !0;
        this.hover.round.x = this.hover.round.y = 8;
        this.colorEach =
            "yes";
        this.data.start = this.data.values;
        this.data.x = [];
        this.data.end = [];
        this.height = 70;
        this.margin = new n(6, 6);
        var b = this.format;
        b.shadow.visible = !0;
        b.round.x = b.round.y = 8;
        b.stroke.fill = "black";
        b.gradient.visible = !0;
        var c = new r, e;
        this.addRandom = function (a) {
            a || (a = 5);
            var b = this.data;
            b.x.length = a;
            b.start.length = a;
            b.end.length = a;
            if (0 < a)for (var c, d, e = 0; e < a; e++)b.x[e] = e, c = 12 * Math.random() | 0, d = 10 * Math.random() | 0, b.start[e] = new Date(2012, c, d), 5 > c && (c = 5 + (7 * Math.random() | 0)), b.end[e] = new Date(2012, c, d + 10 * Math.random())
        };
        this.bounds = function (a, b) {
            if (this.isNull(a))return !1;
            this.calc(a, b);
            b.y -= .5 * e;
            b.width = this.data.end ? this.mandatoryAxis.calcSize(this.data.end[a] - this.data.start[a]) : 0;
            b.height = e;
            return !0
        };
        this.add = function (a, b, c, d) {
            var e = this.data;
            e.labels.push(b);
            e.x.push(a);
            e.start.push(c);
            e.end.push(d)
        };
        this.clicked = function (a) {
            var b = this.data.values.length, d;
            for (d = 0; d < b; d++)if (this.bounds(d, c) && c.contains(a))return d;
            return -1
        };
        this.draw = function () {
            var a = this.data.values.length, d, g, l = this.hover, k = l.fill;
            e = this.notmandatory.calcSize(.01 *
                this.height);
            for (d = 0; d < a; d++)this.bounds(d, c) && (g = l.enabled && this.over === d ? l : b, g.fill = this.getFillStyle(c, this.getFill(d, g)), g.rectangle(c));
            l.fill = k
        };
        this.horizMargins = function (a) {
            a.x = this.margin.x;
            a.y = this.margin.y
        };
        this.minYValue = function () {
            return this.parent.minXValue.call(this) - .5
        };
        this.maxYValue = function () {
            return this.parent.maxXValue.call(this) + .5
        };
        this.minXValue = function () {
            return I(this.data.start)
        };
        this.maxXValue = function () {
            return H(this.data.end)
        }
    };
    Tee.Gantt.prototype = new Tee.Series;
    Tee.Gantt.prototype.parent =
        Tee.Series.prototype;
    Tee.Bubble = function (a, d) {
        Tee.PointXY.call(this, a, d);
        var b = this.pointer;
        b.colorEach = !0;
        b.style = "sphere";
        b.format.gradient.visible = !0;
        b.format.gradient.direction = "radial";
        this.inflate = !0;
        this.data.radius = [];
        this.addRandom = function (a) {
            var b = this.data;
            a || (a = 5);
            b.values.length = a;
            b.x = null;
            b.radius = [];
            b.radius.length = a;
            if (0 < a)for (var d = 0; d < a; d++)b.values[d] = 1E3 * Math.random(), b.radius[d] = 50 + 150 * Math.random()
        }
    };
    Tee.Bubble.prototype.initZ = function () {
        this.parent.prototype.initZ.call(this);
        this.format.marks.z = this.format.z - 1
    };
    Tee.Bubble.prototype = new Tee.PointXY;
    Tee.Bubble.prototype.getSize = function (a) {
        a = this.data.radius ? this._vertAxis.calcSize(this.data.radius[a]) : 0;
        this.pointer.width = a;
        this.pointer.height = a
    };
    Tee.Bubble.prototype.horizMargins = function (a) {
        this.calcWidth = function (a) {
            this.getSize(a);
            a = 1 + .5 * this.pointer.width;
            var b = this.pointer.format.stroke;
            "" !== b.fill && (a += b.size);
            return a
        };
        this.pointer.visible && this.inflate && (a.x = this.calcWidth(0), a.y = this.calcWidth(this.count() - 1))
    };
    Tee.Bubble.prototype.vertMargins = function (a) {
        this.calcHeight = function (a) {
            this.getSize(a);
            a = 1 + .5 * this.pointer.height;
            var b = this.pointer.format.stroke;
            "" !== b.fill && (a += b.size);
            return a
        };
        if (this.pointer.visible && this.inflate) {
            var d, b, c = 0, e = 0, f = this.count(), h = {x: 0, y: 0};
            if (0 < f) {
                this.calc(0, h);
                d = b = h.y;
                for (var g = 1; g < f; g++)this.calc(g, h), h.y < d ? c = g : h.y > b && (e = g);
                a.x = this.calcHeight(e);
                a.y = this.calcHeight(c)
            }
        }
    };
    Tee.Volume = function (a, d) {
        Tee.Bar.call(this, a, d);
        this.barStyle = "line";
        this.colorEach = this.marks.visible = !1;
        var b = this.format;
        b.shadow.visible = !1;
        b.gradient.visible = !1;
        b.stroke.fill = ""
    };
    Tee.Volume.prototype = new Tee.Bar;
    Tee.Candle = function (a, d) {
        Tee.PointXY.call(this, a, d);
        var b = this.format;
        b.z = .5;
        b.depth = .1;
        this.pointer.width = 7;
        this.pointer.format.stroke.visible = !1;
        var c = this.higher = this.pointer.format;
        c.fill = "green";
        var e = this.lower = new Tee.Format(this.chart);
        e.fill = "red";
        e.stroke.visible = !1;
        this.style = "candle";
        this.setChart = function (a, b) {
            var c = Tee.PointXY.prototype.setChart;
            c(a, b);
            e.setChart(b)
        };
        this.draw =
            function () {
                var a = this.data, d = a.values.length, g, l = new n, k = this.pointer, m = .5 * k.width, p, v, y, s = this.mandatoryAxis, u, t, q = this.chart.ctx, r, w;
                q.z = b.z + .5 * b.depth;
                for (g = 0; g < d; g++)this.isNull(g) || (this.calc(g, l), w = l.x, p = s.calc(a.open[g]), v = s.calc(a.high[g]), y = s.calc(a.low[g]), l.y > p ? (u = p, t = l.y - p, r = e) : (u = l.y, t = p - u, r = c), "bar" == this.style ? (q.beginPath(), q.moveTo(w, v), q.lineTo(w, y), q.moveTo(w - m, p), q.lineTo(w, p), q.moveTo(w, l.y), q.lineTo(w + m, l.y), r.stroke.prepare(r.fill), q.stroke()) : (r.depth = m / 100, r.z = b.z + .5 * b.depth -
                    .5 * r.depth, p = {
                    x: w - m,
                    y: u,
                    width: k.width,
                    height: t
                }, "cylinder" === this.pointer.style ? r.cylinder(p, 1, !0) : r.cube(p), r.draw(q, null, p), this.hover.enabled && this.over == g && this.hover.rectangle(w - m, u, k.width, t)), "openclose" != this.style && (v < u || y > u + t) && (q.z = b.z + .5 * b.depth, q.beginPath(), q.moveTo(w, u), q.lineTo(w, v), q.moveTo(w, u + t), q.lineTo(w, y), this.hover.enabled && this.over == g ? this.hover.stroke.prepare(r.fill) : r.stroke.prepare(r.fill), q.stroke()))
            };
        this.minYValue = function () {
            return 0 < this.data.low.length ? I(this.data.low) :
                0
        };
        this.maxYValue = function () {
            return 0 < this.data.high.length ? H(this.data.high) : 0
        };
        this.addRandom = function (a) {
            var b = this.data;
            a || (a = 10);
            b.values.length = a;
            b.close = b.values;
            b.open ? b.open.length = a : b.open = Array(a);
            b.high ? b.high.length = a : b.high = Array(a);
            b.low ? b.low.length = a : b.low = Array(a);
            if (0 < a)for (var c = 25 + 100 * Math.random(), d, e = 0; e < a; e++)d = b.open[e] = c, c = b.close[e] = c + 25 * Math.random() - 12.5, b.high[e] = Math.max(d, c) + 15 * Math.random(), b.low[e] = Math.min(d, c) - 15 * Math.random()
        }
    };
    Tee.Candle.prototype = new Tee.PointXY;
    Tee.Candle.prototype.clicked = function (a) {
        var d = this.pointer.width, b = this.mandatoryAxis, c = this.notmandatory, e = this.data, f = e.values.length, h = new r, g, l, k;
        h.width = d;
        for (g = 0; g < f; g++)if (!this.isNull(g) && (h.x = c.calc(g) - .5 * d, l = b.calc(e.open[g]), k = b.calc(e.close[g]), h.y = l > k ? k : l, h.height = Math.abs(l - k), h.contains(a)))return g;
        return -1
    };
    Tee.Candle.prototype.vertMargins = function () {
    };
    Tee.Polar = function (a, d) {
        var b, c;

        function e(a, b, c) {
            if (a.visible) {
                var d = a.axisPos;
                a.axisPos = b;
                a.startPos = c - k;
                a.endPos = c + k;
                b = a.z;
                a.z =
                    1 - .5 * a.chart.walls.back.size - .1;
                a.drawAxis();
                a.axisPos = d;
                a.z = b
            }
        }

        function f(a, d) {
            var e = a.width, f = a.height;
            b = a.x + .5 * e;
            c = a.y + .5 * f;
            k = .5 * Math.min(e, f);
            d.visible && d.labels.visible && (e = d.labels.format.textHeight("W"), k -= e)
        }

        Tee.CustomSeries.call(this, a, d);
        this.pointer.visible = !0;
        this.rotation = 0;
        this.useOrigin = this._paintWalls = this._paintAxes = !1;
        this.origin = 0;
        var h = {x: 0, y: 0}, g, l = this.format;
        c = b = 0;
        var k, m = Math.PI / 180;
        l.stroke.fill = "black";
        l.z = .5;
        this.calc = function (a, d) {
            var e = this.data, f = e.values[a], g = this.mandatoryAxis,
                e = m * (this.rotation + (e.x ? e.x[a] : 360 * a / e.values.length)), f = (g.inverted ? g.maximum - f : f - g.minimum) * k / (g.maximum - g.minimum);
            d.x = b + Math.cos(e) * f;
            d.y = c + Math.sin(e) * f
        };
        this.beforeDraw = function () {
            var a;
            f(this.chart.chartRect, this.notmandatory);
            var d = this.chart.walls;
            if (d.visible && (a = d.back, a.visible)) {
                var g = a.format;
                a = g.z;
                g.z = 1;
                g.ellipse(b, c, 2 * k, 2 * k);
                g.z = a
            }
            if (this.chart.axes.visible) {
                var g = this.notmandatory, h = g.grid.format.stroke, l = this.mandatoryAxis, n = 0, q = this.chart.ctx, r, w = 10, x = g.rotation || 0;
                if (g.visible &&
                    g.labels.visible) {
                    var B = {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0
                    }, A = g.labels.format, C = A.textHeight("W"), z = k + .8 * C, w = Math.max(10, 90 / (k / C | 0));
                    a = A.z;
                    A.z = .6;
                    for (n = 0; 360 > n;)r = m * (n + x), B.x = b + Math.cos(r) * z, B.y = c + Math.sin(r) * z - .5 * C, A.drawText(B, "" + n), n += w;
                    A.z = a
                }
                if (g.visible && g.grid.visible) {
                    a = g.increment || 10;
                    q.z = 1 - .5 * d.back.size - .1;
                    q.beginPath();
                    for (n = 0; 360 > n;)r = m * (n + x), q.moveTo(b, c), q.lineTo(b + Math.cos(r) * k, c + Math.sin(r) * k), n += a;
                    h.prepare(h.fill, q);
                    q.stroke()
                }
                if (l.visible && l.grid.visible) {
                    n = l.roundMin();
                    h = l.grid.format;
                    r = 2 * k / (l.maximum - l.minimum);
                    a = h.z;
                    h.z = 1 - .5 * d.back.size - .1;
                    for (q.z = h.z; n < l.maximum;)d = (n - l.minimum) * r, h.ellipse(b, c, d, d), n += l.increm;
                    h.z = a
                }
                e(l, b, c);
                e(g, c, b)
            }
        };
        this.draw = function () {
            f(this.chart.chartRect, this.notmandatory);
            var a = this.data.values.length, d;
            g = [];
            for (d = 0; d < a; d++)this.isNull(d) || (this.calc(d, h), g.push({x: h.x, y: h.y}));
            a = g.length;
            if (0 < a) {
                if ("bar" == this.style) {
                    var e = this.chart.ctx;
                    e.beginPath();
                    for (d = 0; d < a; d++)e.moveTo(b, c), e.lineTo(g[d].x, g[d].y);
                    this.format.stroke.prepare(this.format.fill,
                        e);
                    e.stroke()
                } else l.polygon(g);
                this.pointer.visible && this.drawPointers()
            }
        };
        this.minYValue = function () {
            var a = Tee.Series.prototype.minYValue.call(this);
            return this.useOrigin ? Math.min(a, this.origin) : a
        };
        this.maxYValue = function () {
            var a = this.stackMaxValue();
            return this.useOrigin ? Math.max(a, this.origin) : a
        }
    };
    Tee.Polar.prototype = new Tee.CustomSeries;
    "function" !== typeof String.prototype.trim && (String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "")
    });
    Tee.PaletteSeries = function (a, d) {
        Tee.Series.call(this,
            a, d);
        var b = this.palette;
        b.colors = Tee.RainbowPalette();
        var c, e;
        this._range = this._min = 0;
        this.prepareColors = function () {
            var a = b.colors, d;
            e = a.length;
            c = Array(e);
            for (var g = 0; g < e; g++)d = a[g].trim(), 7 == d.length ? c[g] = {
                r: parseInt(d.substr(1, 2), 16),
                g: parseInt(d.substr(3, 2), 16),
                b: parseInt(d.substr(5, 2), 16),
                a: 0
            } : "rgb(" == d.substr(0, 4) && (d = d.slice(4, d.length - 1).split(","), c[g] = {
                r: d[0],
                g: d[1],
                b: d[2],
                a: d[3] || 0
            })
        };
        this.getColor = function (a) {
            a = (a - this._min) / this._range * (e - 1) | 0;
            return c[b.inverted ? e - 1 - a : a]
        };
        this.legendCount =
            function () {
                return this.palette.colors ? this.palette.colors.length : 0
            }
    };
    Tee.PaletteSeries.prototype = new Tee.Series;
    Tee.PaletteSeries.prototype.legendColor = function (a) {
        var d = this.palette, b = d.colors, c = d.inverted;
        this.chart.legend.inverted && (c = !c);
        return d.grayScale ? (a = 255 * a / b.length | 0, c && (a = 255 - a), "rgb(" + a + "," + a + "," + a + ")") : b ? b[c ? a : this.legendCount() - a - 1] : this.format.fill
    };
    Tee.PaletteSeries.prototype.legendText = function (a) {
        a = -1 + this.legendCount() - a;
        return (this._min + a * this._range / (this.palette.colors.length -
        1)).toFixed(this.decimals)
    };
    Tee.DOMTip = function () {
        var a = 0, d, b, c, e, f = "undefined" !== typeof document && document.all ? !0 : !1;
        return {
            show: function (a, g, l, k) {
                d || (d = document.createElement("div"), d.setAttribute("id", "teetip1"), e = l, d.className = "teetip", d.setAttribute("style", k), document.body.appendChild(d), b = d.style, b.opacity = 0, f && (b.filter = "alpha(opacity=0)"));
                document.onmousemove = this.pos;
                b.display = "block";
                b.position = "absolute";
                d.innerHTML = a;
                b.width = g ? g + "px" : "auto";
                !g && f && (b.width = d.offsetWidth);
                300 < d.offsetWidth &&
                (b.width = "300px");
                c = parseInt(d.offsetHeight, 10) + 3;
                d.timer && clearInterval(d.timer);
                d.timer = setInterval(function () {
                    Tee.DOMTip.fade(1)
                }, 10)
            }, pos: function (a) {
                var g = document.documentElement, l = f ? a.clientY + g.scrollTop : a.pageY;
                a = f ? a.clientX + g.scrollLeft : a.pageX;
                0 > l - c && (l = c);
                0 > a && (a = 0);
                e && a > e.clientLeft + e.clientWidth - d.offsetWidth - 25 && (a = e.clientLeft + e.clientWidth - d.offsetWidth - 25);
                b.top = l - c + "px";
                b.left = a + 3 + "px"
            }, fade: function (c) {
                var e = a;
                if (97 !== e && 1 === c || 0 !== e && -1 === c) {
                    var l = 10;
                    10 > 97 - e && 1 == c ? l = 97 - e : 10 > a &&
                    -1 == c && (l = e);
                    a = e + l * c;
                    b.opacity = .01 * a;
                    f && (b.filter = "alpha(opacity=" + a + ")")
                } else clearInterval(d.timer), -1 == c && (b.display = "none", document.onmousemove = null)
            }, hide: function () {
                d && (clearInterval(d.timer), d.timer = setInterval(function () {
                    Tee.DOMTip.fade(-1)
                }, 10))
            }
        }
    }()
}).call(this);

// ### X3DInterpolatorNode ###
x3dom.registerNodeType(
    "X3DInterpolatorNode",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DChildNode,
        function (ctx) {
            x3dom.nodeTypes.X3DInterpolatorNode.superClass.call(this, ctx);

            this.addField_MFFloat(ctx, 'key', []);
            this.addField_SFFloat(ctx, 'set_fraction', 0);
        },
        {
            linearInterp: function (t, interp) {
                if (t <= this._vf.key[0]) {
                    return this._vf.keyValue[0];
                }
                if (t >= this._vf.key[this._vf.key.length-1]) {
                    return this._vf.keyValue[this._vf.key.length-1];
                }
                for (var i = 0; i < this._vf.key.length-1; ++i) {
                    if ((this._vf.key[i] < t) && (t <= this._vf.key[i+1])) {
                        return interp( this._vf.keyValue[i], this._vf.keyValue[i+1],
                                (t - this._vf.key[i]) / (this._vf.key[i+1] - this._vf.key[i]) );
                    }
                }
                return this._vf.keyValue[0];
            }
        }
    )
);

// ### OrientationInterpolator ###
x3dom.registerNodeType(
    "OrientationInterpolator",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DInterpolatorNode,
        function (ctx) {
            x3dom.nodeTypes.OrientationInterpolator.superClass.call(this, ctx);

            if (ctx && ctx.xmlNode.hasAttribute('keyValue')) {
                this._vf.keyValue = x3dom.fields.MFRotation.parse(ctx.xmlNode.getAttribute('keyValue'));
            } else {
                this._vf.keyValue = new x3dom.fields.MFRotation();
            }

            this._fieldWatchers.fraction = this._fieldWatchers.set_fraction = [ function (msg) {
                var value = this.linearInterp(msg, function (a, b, t) { return a.slerp(b, t); });
                this.postMessage('value_changed', value);
            } ];
        }
    )
);

// ### PositionInterpolator ###
x3dom.registerNodeType(
    "PositionInterpolator",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DInterpolatorNode,
        function (ctx) {
            x3dom.nodeTypes.PositionInterpolator.superClass.call(this, ctx);

            if (ctx && ctx.xmlNode.hasAttribute('keyValue')) {
                this._vf.keyValue = x3dom.fields.MFVec3f.parse(ctx.xmlNode.getAttribute('keyValue'));
            } else {
                this._vf.keyValue = new x3dom.fields.MFVec3f();
            }

            this._fieldWatchers.fraction = this._fieldWatchers.set_fraction = [ function (msg) {
                var value = this.linearInterp(msg, function (a, b, t) {
                            return a.multiply(1.0-t).add(b.multiply(t)); });
                this.postMessage('value_changed', value);
            } ];
        }
    )
);

// ### NormalInterpolator ###
x3dom.registerNodeType(
    "NormalInterpolator",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DInterpolatorNode,
        function (ctx) {
            x3dom.nodeTypes.NormalInterpolator.superClass.call(this, ctx);

            if (ctx && ctx.xmlNode.hasAttribute('keyValue')) {
                this._vf.keyValue = x3dom.fields.MFVec3f.parse(ctx.xmlNode.getAttribute('keyValue'));
            } else {
                this._vf.keyValue = new x3dom.fields.MFVec3f();
            }

            this._fieldWatchers.fraction = this._fieldWatchers.set_fraction = [ function (msg) {
                var value = this.linearInterp(msg, function (a, b, t) {
                            return a.multiply(1.0-t).add(b.multiply(t)).normalize(); });
                this.postMessage('value_changed', value);
            } ];
        }
    )
);

// ### ColorInterpolator ###
x3dom.registerNodeType(
    "ColorInterpolator",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DInterpolatorNode,
        function (ctx) {
            x3dom.nodeTypes.ColorInterpolator.superClass.call(this, ctx);

            if (ctx && ctx.xmlNode.hasAttribute('keyValue')) {
                this._vf.keyValue = x3dom.fields.MFColor.parse(ctx.xmlNode.getAttribute('keyValue'));
            } else {
                this._vf.keyValue = new x3dom.fields.MFColor();
            }

            this._fieldWatchers.fraction = this._fieldWatchers.set_fraction = [ function (msg) {
                var value = this.linearInterp(msg, function (a, b, t) {
                            // FIXME; perform color interpolation in HSV space
                            return a.multiply(1.0-t).add(b.multiply(t)); });
                this.postMessage('value_changed', value);
            } ];
        }
    )
);

// ### ScalarInterpolator ###
x3dom.registerNodeType(
    "ScalarInterpolator",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DInterpolatorNode,
        function (ctx) {
            x3dom.nodeTypes.ScalarInterpolator.superClass.call(this, ctx);

            if (ctx && ctx.xmlNode.hasAttribute('keyValue')) {
                this._vf.keyValue = Array.map(ctx.xmlNode.getAttribute('keyValue').split(/\s+/),
                                                                    function (n) { return +n; });
            } else {
                this._vf.keyValue = new x3dom.fields.MFFloat();
            }

            this._fieldWatchers.fraction = this._fieldWatchers.set_fraction = [ function (msg) {
                var value = this.linearInterp(msg, function (a, b, t) { return (1.0-t)*a + t*b; });
                this.postMessage('value_changed', value);
            } ];
        }
    )
);

// ### CoordinateInterpolator ###
x3dom.registerNodeType(
    "CoordinateInterpolator",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DInterpolatorNode,
        function (ctx) {
            x3dom.nodeTypes.CoordinateInterpolator.superClass.call(this, ctx);

            this._vf.keyValue = [];
            if (ctx && ctx.xmlNode.hasAttribute('keyValue')) {
                var arr = x3dom.fields.MFVec3f.parse(ctx.xmlNode.getAttribute('keyValue'));
                var key = this._vf.key.length > 0 ? this._vf.key.length : 1;
                var len = arr.length / key;
                for (var i=0; i<key; i++) {
                    var val = new x3dom.fields.MFVec3f();
                    for (var j=0; j<len; j++) {
                        val.push( arr[i*len+j] );
                    }
                    this._vf.keyValue.push(val);
                }
            }

            this._fieldWatchers.fraction = this._fieldWatchers.set_fraction = [ function (msg) {
                var value = this.linearInterp(msg, function (a, b, t) {
                    var val = new x3dom.fields.MFVec3f();
                    for (var i=0; i<a.length; i++) {
                        val.push(a[i].multiply(1.0-t).add(b[i].multiply(t)));
                    }
                    return val;
                });
                this.postMessage('value_changed', value);
            } ];
        }
    )
);
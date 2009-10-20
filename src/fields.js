/*

Might be nice to have specialised transform-matrices etc, for more optimised maths.

*/

/** @namespace The x3dom.fields namespace. */
x3dom.fields = {};

/** SFMatrix4 constructor. 
    @class Represents a SFMatrix4
  */
x3dom.fields.SFMatrix4 = function(_00, _01, _02, _03, _10, _11, _12, _13, _20, _21, _22, _23, _30, _31, _32, _33) {
    if (arguments.length == 0) {
        this._00 = 1; this._01 = 0; this._02 = 0; this._03 = 0;
        this._10 = 0; this._11 = 1; this._12 = 0; this._13 = 0;
        this._20 = 0; this._21 = 0; this._22 = 1; this._23 = 0;
        this._30 = 0; this._31 = 0; this._32 = 0; this._33 = 1;
    } else {
        this._00 = _00; this._01 = _01; this._02 = _02; this._03 = _03;
        this._10 = _10; this._11 = _11; this._12 = _12; this._13 = _13;
        this._20 = _20; this._21 = _21; this._22 = _22; this._23 = _23;
        this._30 = _30; this._31 = _31; this._32 = _32; this._33 = _33;
    }
}

/** returns 1st base vector (right) */
x3dom.fields.SFMatrix4.prototype.e0 = function () {
	var baseVec = new x3dom.fields.SFVec3(this._00, this._10, this._20);
	return baseVec.normalised();
}

/** returns 2nd base vector (up) */
x3dom.fields.SFMatrix4.prototype.e1 = function () {
	var baseVec = new x3dom.fields.SFVec3(this._01, this._11, this._21);
	return baseVec.normalised();
}

/** returns 3rd base vector (fwd) */
x3dom.fields.SFMatrix4.prototype.e2 = function () {
	var baseVec = new x3dom.fields.SFVec3(this._02, this._12, this._22);
	return baseVec.normalised();
}

/** returns 4th base vector (pos) */
x3dom.fields.SFMatrix4.prototype.e3 = function () {
	return new x3dom.fields.SFVec3(this._03, this._13, this._23);
}

/** Returns a SFMatrix4 identity matrix. */
x3dom.fields.SFMatrix4.identity = function () {
    return new x3dom.fields.SFMatrix4(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}

x3dom.fields.SFMatrix4.translation = function (vec) {
    return new x3dom.fields.SFMatrix4(
        1, 0, 0, vec.x,
        0, 1, 0, vec.y,
        0, 0, 1, vec.z,
        0, 0, 0, 1
    );
}

x3dom.fields.SFMatrix4.rotationX = function (a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new x3dom.fields.SFMatrix4(
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1
    );
}

x3dom.fields.SFMatrix4.rotationY = function (a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new x3dom.fields.SFMatrix4(
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1
    );
}

x3dom.fields.SFMatrix4.rotationZ = function (a) {
    var c = Math.cos(a);
    var s = Math.sin(a);
    return new x3dom.fields.SFMatrix4(
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}

x3dom.fields.SFMatrix4.scale = function (vec) {
    return new x3dom.fields.SFMatrix4(
        vec.x, 0, 0, 0,
        0, vec.y, 0, 0,
        0, 0, vec.z, 0,
        0, 0, 0, 1
    );
}

x3dom.fields.SFMatrix4.prototype.setTranslate = function (vec) {
	this._03 = vec.x;
	this._13 = vec.y;
	this._23 = vec.z;
}

x3dom.fields.SFMatrix4.prototype.setScale = function (vec) {
	this._00 = vec.x;
	this._11 = vec.y;
	this._22 = vec.z;
}

x3dom.fields.SFMatrix4.parseRotation = function (str) {
    var m = /^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$/.exec(str);
    var x = +m[1], y = +m[2], z = +m[3], a = +m[4];
    var d = Math.sqrt(x*x + y*y + z*z);
    if (d == 0) {
        x = 1; y = z = 0;
    } else {
        x /= d; y /= d; z /= d;
    }
    //a -= 3.141;
    var c = Math.cos(a);
    var s = Math.sin(a);
    var t  = 1-c;

    return new x3dom.fields.SFMatrix4(
        t*x*x+c,   t*x*y+s*z, t*x*z-s*y, 0,
        t*x*y-s*z, t*y*y+c,   t*y*z+s*x, 0,
        t*x*z+s*y, t*y*z-s*x, t*z*z+c,   0,
        0,         0,         0,         1
    ).transpose();
}

x3dom.fields.SFMatrix4.prototype.mult = function (that)  {
    return new x3dom.fields.SFMatrix4(
        this._00*that._00+this._01*that._10+this._02*that._20+this._03*that._30, this._00*that._01+this._01*that._11+this._02*that._21+this._03*that._31, this._00*that._02+this._01*that._12+this._02*that._22+this._03*that._32, this._00*that._03+this._01*that._13+this._02*that._23+this._03*that._33,
        this._10*that._00+this._11*that._10+this._12*that._20+this._13*that._30, this._10*that._01+this._11*that._11+this._12*that._21+this._13*that._31, this._10*that._02+this._11*that._12+this._12*that._22+this._13*that._32, this._10*that._03+this._11*that._13+this._12*that._23+this._13*that._33,
        this._20*that._00+this._21*that._10+this._22*that._20+this._23*that._30, this._20*that._01+this._21*that._11+this._22*that._21+this._23*that._31, this._20*that._02+this._21*that._12+this._22*that._22+this._23*that._32, this._20*that._03+this._21*that._13+this._22*that._23+this._23*that._33,
        this._30*that._00+this._31*that._10+this._32*that._20+this._33*that._30, this._30*that._01+this._31*that._11+this._32*that._21+this._33*that._31, this._30*that._02+this._31*that._12+this._32*that._22+this._33*that._32, this._30*that._03+this._31*that._13+this._32*that._23+this._33*that._33
    );
}

x3dom.fields.SFMatrix4.prototype.multMatrixPnt = function (vec) {
    return new x3dom.fields.SFVec3(
        this._00*vec.x + this._01*vec.y + this._02*vec.z + this._03,
        this._10*vec.x + this._11*vec.y + this._12*vec.z + this._13,
        this._20*vec.x + this._21*vec.y + this._22*vec.z + this._23
    );
}

x3dom.fields.SFMatrix4.prototype.multMatrixVec = function (vec) {
    return new x3dom.fields.SFVec3(
        this._00*vec.x + this._01*vec.y + this._02*vec.z,
        this._10*vec.x + this._11*vec.y + this._12*vec.z,
        this._20*vec.x + this._21*vec.y + this._22*vec.z
    );
}

x3dom.fields.SFMatrix4.prototype.transpose = function () {
    return new x3dom.fields.SFMatrix4(
        this._00, this._10, this._20, this._30,
        this._01, this._11, this._21, this._31,
        this._02, this._12, this._22, this._32,
        this._03, this._13, this._23, this._33
    );
}

x3dom.fields.SFMatrix4.prototype.toGL = function () {
    return [
        this._00, this._10, this._20, this._30,
        this._01, this._11, this._21, this._31,
        this._02, this._12, this._22, this._32,
        this._03, this._13, this._23, this._33
    ];
}

x3dom.fields.SFMatrix4.prototype.decompose = function () {
    // Return [ T, S, x, y, z ] such that
    //   rotateX(x); rotateY(t); rotateZ(z); scale(S); translate(T);
    // does the equivalent transformation

    var T = new SFVec3(this._03, this._13, this._23);
    var S = new SFVec3(1, 1, 1); // XXX

    // http://www.j3d.org/matrix_faq/matrfaq_latest.html
    var angle_x, angle_y, angle_y, tr_x, tr_y, C;
    angle_y = Math.asin(this._02);
    C = Math.cos(angle_y);
    if (Math.abs(C) > 0.005) {
      tr_x = this._22 / C;
      tr_y = -this._12 / C;
      angle_x = Math.atan2(tr_y, tr_x);
      tr_x =  this._00 / C;
      tr_y = -this._01 / C;
      angle_z = Math.atan2(tr_y, tr_x);
    } else {
      angle_x = 0;
      tr_x = this._11;
      tr_y = this._10;
      angle_z = Math.atan2(tr_y, tr_x);
    }

    return [ T, S, angle_x, angle_y, angle_z ];
}

x3dom.fields.SFMatrix4.prototype.det3 = function (
				a1, a2, a3, b1, b2, b3, c1, c2, c3) {
    var d = (a1 * b2 * c3) + (a2 * b3 * c1) + (a3 * b1 * c2) -
			(a1 * b3 * c2) - (a2 * b1 * c3) - (a3 * b2 * c1);
	return d;
}

x3dom.fields.SFMatrix4.prototype.det = function () {
    var a1, a2, a3, a4,
        b1, b2, b3, b4,
        c1, c2, c3, c4,
        d1, d2, d3, d4;

    a1 = this._00;
    b1 = this._10;
    c1 = this._20;
    d1 = this._30;

    a2 = this._01;
    b2 = this._11;
    c2 = this._21;
    d2 = this._31;

    a3 = this._02;
    b3 = this._12;
    c3 = this._22;
    d3 = this._32;

    a4 = this._03;
    b4 = this._13;
    c4 = this._23;
    d4 = this._33;
	
    var d = + a1 * this.det3(b2, b3, b4, c2, c3, c4, d2, d3, d4)
            - b1 * this.det3(a2, a3, a4, c2, c3, c4, d2, d3, d4)
            + c1 * this.det3(a2, a3, a4, b2, b3, b4, d2, d3, d4)
            - d1 * this.det3(a2, a3, a4, b2, b3, b4, c2, c3, c4);
	return d;
}

x3dom.fields.SFMatrix4.prototype.inverse = function () {
    var a1, a2, a3, a4,
        b1, b2, b3, b4,
        c1, c2, c3, c4,
        d1, d2, d3, d4;

    a1 = this._00;
    b1 = this._10;
    c1 = this._20;
    d1 = this._30;

    a2 = this._01;
    b2 = this._11;
    c2 = this._21;
    d2 = this._31;

    a3 = this._02;
    b3 = this._12;
    c3 = this._22;
    d3 = this._32;

    a4 = this._03;
    b4 = this._13;
    c4 = this._23;
    d4 = this._33;

    var rDet = this.det();

    if (Math.abs(rDet) < 0.000001)
    {
        x3dom.debug.logInfo("Invert matrix: singular matrix, no inverse!");
        return x3dom.fields.SFMatrix4.identity();
    }

    rDet = 1.0 / rDet;

	return new x3dom.fields.SFMatrix4(
    +this.det3(b2, b3, b4, c2, c3, c4, d2, d3, d4) * rDet,
    -this.det3(a2, a3, a4, c2, c3, c4, d2, d3, d4) * rDet,
    +this.det3(a2, a3, a4, b2, b3, b4, d2, d3, d4) * rDet,
    -this.det3(a2, a3, a4, b2, b3, b4, c2, c3, c4) * rDet,
    -this.det3(b1, b3, b4, c1, c3, c4, d1, d3, d4) * rDet,
    +this.det3(a1, a3, a4, c1, c3, c4, d1, d3, d4) * rDet,
    -this.det3(a1, a3, a4, b1, b3, b4, d1, d3, d4) * rDet,
    +this.det3(a1, a3, a4, b1, b3, b4, c1, c3, c4) * rDet,
    +this.det3(b1, b2, b4, c1, c2, c4, d1, d2, d4) * rDet,
    -this.det3(a1, a2, a4, c1, c2, c4, d1, d2, d4) * rDet,
    +this.det3(a1, a2, a4, b1, b2, b4, d1, d2, d4) * rDet,
    -this.det3(a1, a2, a4, b1, b2, b4, c1, c2, c4) * rDet,
    -this.det3(b1, b2, b3, c1, c2, c3, d1, d2, d3) * rDet,
    +this.det3(a1, a2, a3, c1, c2, c3, d1, d2, d3) * rDet,
    -this.det3(a1, a2, a3, b1, b2, b3, d1, d2, d3) * rDet,
    +this.det3(a1, a2, a3, b1, b2, b3, c1, c2, c3) * rDet
	);
}

x3dom.fields.SFMatrix4.prototype.toString = function () {
    return '[SFMatrix4 ' +
        this._00+', '+this._01+', '+this._02+', '+this._03+'; '+
        this._10+', '+this._11+', '+this._12+', '+this._13+'; '+
        this._20+', '+this._21+', '+this._22+', '+this._23+'; '+
        this._30+', '+this._31+', '+this._32+', '+this._33+']';
}

/** SFVec2 constructor.
    @class Represents a SFVec2
  */
x3dom.fields.SFVec2 = function(x, y) {
    if (arguments.length == 0) {
        this.x = this.y = 0;
    } else {
        this.x = x;
        this.y = y;
    }
}

x3dom.fields.SFVec2.parse = function (str) {
    var m = /^([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*)$/.exec(str);
    return new x3dom.fields.SFVec2(+m[1], +m[2]);
}

x3dom.fields.SFVec2.prototype.add = function (that) {
    return new x3dom.fields.SFVec2(this.x+that.x, this.y+that.y);
/*    this.x += that.x;
    this.y += that.y;
    return this;*/
}

x3dom.fields.SFVec2.prototype.subtract = function (that) {
    return new x3dom.fields.SFVec2(this.x-that.x, this.y-that.y);
/*    this.x -= that.x;
    this.y -= that.y;
    return this;    */
}

x3dom.fields.SFVec2.prototype.negate = function () {
    return new x3dom.fields.SFVec2(this.x*-1, this.y*-1);
/*    this.x *= -1;
    this.y *= -1;
    return this;    */
}

x3dom.fields.SFVec2.prototype.dot = function (that) {
    return this.x * that.x  +  this.y * that.y;
}


x3dom.fields.SFVec2.prototype.reflect = function (n) {
    var d2 = this.dot(n)*2;
    return new x3dom.fields.SFVec2(this.x-d2*n.x, this.y-d2*n.y);
/*    this.x -= d2*n.x;
    this.y -= d2*n.y;
    return this;    */
}

x3dom.fields.SFVec2.prototype.normalised = function (that) {
    // var n = Math.sqrt((this.x*this.x) + (this.y*this.y));
    var n = this.length();
    if (n) n = 1.0 / n;
    return new x3dom.fields.SFVec2(this.x*n, this.y*n);
/*    this.x *= n;
    this.y *= n;
    return this;*/
}

x3dom.fields.SFVec2.prototype.multiply = function (n) {
    return new x3dom.fields.SFVec2(this.x*n, this.y*n);
/*    this.x *= n;
    this.y *= n;
    return this;*/
}

x3dom.fields.SFVec2.prototype.length = function() {
    return Math.sqrt((this.x*this.x) + (this.y*this.y));
}

x3dom.fields.SFVec2.prototype.toGL = function () {
    return [ this.x, this.y ];
}

x3dom.fields.SFVec2.prototype.toString = function () {
    return "{ x " + this.x + " y " + this.y + " }";
}

x3dom.fields.SFVec2.prototype.setValueByStr = function(s) {
    var m = /^([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*)$/.exec(s);
    this.x = +m[1];
    this.y = +m[2];
    return this;
}




/** SFVec3 constructor.
    @class Represents a SFVec3
  */
x3dom.fields.SFVec3 = function(x, y, z) {
    if (arguments.length == 0) {
        this.x = this.y = this.z = 0;
    } else {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

x3dom.fields.SFVec3.parse = function (str) {
    var m = /^(\S+)\s+(\S+)\s+(\S+)$/.exec(str);
    return new x3dom.fields.SFVec3(+m[1], +m[2], +m[3]);
}

x3dom.fields.SFVec3.prototype.add = function (that) {
    return new x3dom.fields.SFVec3(this.x + that.x, this.y + that.y, this.z + that.z);
}

x3dom.fields.SFVec3.prototype.subtract = function (that) {
    return new x3dom.fields.SFVec3(this.x - that.x, this.y - that.y, this.z - that.z);
}

x3dom.fields.SFVec3.prototype.negate = function () {
    return new x3dom.fields.SFVec3(-this.x, -this.y, -this.z);
}

x3dom.fields.SFVec3.prototype.dot = function (that) {
    return (this.x*that.x + this.y*that.y + this.z*that.z);
}

x3dom.fields.SFVec3.prototype.cross = function (that) {
    return new x3dom.fields.SFVec3(this.y*that.z - this.z*that.y, this.z*that.x - this.x*that.z, this.x*that.y - this.y*that.x);
}

x3dom.fields.SFVec3.prototype.reflect = function (n) {
    var d2 = this.dot(n)*2;
    return new x3dom.fields.SFVec3(this.x - d2*n.x, this.y - d2*n.y, this.z - d2*n.z);
}

x3dom.fields.SFVec3.prototype.length = function() {
    return Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z*this.z));
}

x3dom.fields.SFVec3.prototype.normalised = function (that) {
    var n = this.length();
    if (n) n = 1.0 / n;
    return new x3dom.fields.SFVec3(this.x*n, this.y*n, this.z*n);
}

x3dom.fields.SFVec3.prototype.scale = function (n) {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
}

x3dom.fields.SFVec3.prototype.toGL = function () {
    return [ this.x, this.y, this.z ];
}

x3dom.fields.SFVec3.prototype.toString = function () {
    return "{ x " + this.x + " y " + this.y + " z " + this.z + " }";
}


/** Quaternion constructor.
    @class Represents a Quaternion
  */
x3dom.fields.Quaternion = function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

x3dom.fields.Quaternion.prototype.mult = function (that) {
    return new x3dom.fields.Quaternion(
        this.w*that.x + this.x*that.w + this.y*that.z - this.z*that.y,
        this.w*that.y + this.y*that.w + this.z*that.x - this.x*that.z,
        this.w*that.z + this.z*that.w + this.x*that.y - this.y*that.x,
        this.w*that.w - this.x*that.x - this.y*that.y - this.z*that.z
    );
}

x3dom.fields.Quaternion.parseAxisAngle = function (str) {
    var m = /^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)$/.exec(str);
    return x3dom.fields.Quaternion.axisAngle(new x3dom.fields.SFVec3(+m[1], +m[2], +m[3]), +m[4]);
}

x3dom.fields.Quaternion.axisAngle = function (axis, a) {
	var t = axis.length();
	
	if (t > 0.000001)
	{
		var s = Math.sin(a/2) / t;
		var c = Math.cos(a/2);
		return new x3dom.fields.Quaternion(axis.x*s, axis.y*s, axis.z*s, c);
	}
	else
	{
		return new x3dom.fields.Quaternion(0, 0, 0, 1);
	}
}

x3dom.fields.Quaternion.prototype.toMatrix = function () {
    var xx = this.x * this.x * 2;
    var xy = this.x * this.y * 2;
    var xz = this.x * this.z * 2;
    var yy = this.y * this.y * 2;
    var yz = this.y * this.z * 2;
    var zz = this.z * this.z * 2;
    var wx = this.w * this.x * 2;
    var wy = this.w * this.y * 2;
    var wz = this.w * this.z * 2;

    return new x3dom.fields.SFMatrix4(
        1 - (yy + zz), xy - wz, xz + wy, 0,
        xy + wz, 1 - (xx + zz), yz - wx, 0,
        xz - wy, yz + wx, 1 - (xx + yy), 0,
        0, 0, 0, 1
    );
}

x3dom.fields.Quaternion.prototype.dot = function (that) {
    return this.x*that.x + this.y*that.y + this.z*that.z + this.w*that.w;
}

x3dom.fields.Quaternion.prototype.add = function (that) {
    return new x3dom.fields.Quaternion(this.x + that.x, this.y + that.y, this.z + that.z, this.w + that.w);
}

x3dom.fields.Quaternion.prototype.subtract = function (that) {
    return new x3dom.fields.Quaternion(this.x - that.x, this.y - that.y, this.z - that.z, this.w - that.w);
}

x3dom.fields.Quaternion.prototype.multScalar = function (s) {
    return new x3dom.fields.Quaternion(this.x*s, this.y*s, this.z*s, this.w*s);
}

x3dom.fields.Quaternion.prototype.normalised = function (that) {
    var d2 = this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w;
    if (d2 == 0) return this;
    var id = 1/Math.sqrt(d2);
    return new x3dom.fields.Quaternion(this.x*id, this.y*id, this.z*id, this.w*id);
}

x3dom.fields.Quaternion.prototype.slerp = function (that, t) {
    var dot = this.dot(that);
    if (dot > 0.995)
        return this.add(that.subtract(this).multScalar(t)).normalised();
    dot = Math.max(-1, Math.min(1, dot));
    var theta = Math.acos(dot)*t;
    var tother = that.subtract(this.multScalar(dot)).normalised();
    return this.multScalar(Math.cos(theta)).add(tother.multScalar(Math.sin(theta)));
}

x3dom.fields.Quaternion.prototype.toString = function () {
    return '((' + this.x + ', ' + this.y + ', ' + this.z + '), ' + this.w + ')';
}


/** SFColor constructor.
    @class Represents a SFColor
  */
x3dom.fields.SFColor = function(r, g, b) {
    if (arguments.length == 0) {
        this.r = this.g = this.b = 0;
    } else {
        this.r = r;
        this.g = g;
        this.b = b;
    }    
}

x3dom.fields.SFColor.parse = function(str) {
    var m = /^([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*)$/.exec(str);
    return new x3dom.fields.SFColor( +m[1], +m[2], +m[3] );
}

x3dom.fields.SFColor.prototype.toGL = function () {
    return [ this.r, this.g, this.b ];
}

x3dom.fields.SFColor.prototype.toString = function() {
    return "{ r " + this.r + " g " + this.g + " b " + this.b + " }";
}
  

/** MFColor constructor.
    @class Represents a MFColor
  */
x3dom.fields.MFColor = function(colorArray) {
    if (arguments.length == 0) {
        
    }
    else {
        colorArray.map( function(c) { this.push(c); }, this );
        // console.dir(this);
    }
};

x3dom.fields.MFColor.prototype = new Array;

x3dom.fields.MFColor.parse = function(str) {    
    // var mc = str.match(/(?:(?:[+-]?\d*\.?\d*\s*){3})(?:,?\s*)/g);
    var mc = str.match(/([+-]?\d*\.?\d*\s*){3},?\s*/g);
    var colors = [];
    for (var i = 0; i < mc.length; ++i) {
        // console.info("Test 2: Fund " + i + " - " + mc[i]);
        var c = /^([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*),?\s*$/.exec(mc[i]);
        // console.info("c" + i + " - " + c[0]);
        // console.dir(c);
        if (c[0])
            colors.push( new x3dom.fields.SFColor(+c[1], +c[2], +c[3]) );
    }

    return new x3dom.fields.MFColor( colors );
    
}

x3dom.fields.MFColor.prototype.toGL = function() {
    var a = [];

    Array.map( this, function(c) {
        a.push(c.r);
        a.push(c.g);
        a.push(c.b);        
    });
    
    // console.log("l=" + this.length);
//     for (var i=0; i<this.length; i++) {
//         a.push(this[i].r);
//         a.push(this[i].g);
//         a.push(this[i].b);
//     }

    return a;
}


/** MFVec3 constructor.
    @class Represents a MFVec3
  */
x3dom.fields.MFVec3 = function(vec3Array) {
    if (arguments.length == 0) {        
        
    }
    else {
        vec3Array.map( function(v) { this.push(v); }, this );
    }
};

x3dom.fields.MFVec3.prototype = new Array;

x3dom.fields.MFVec3.parse = function(str) {    
    var mc = str.match(/([+-]?\d*\.?\d*\s*){3},?\s*/g);
    var vecs = [];
    for (var i = 0; i < mc.length; ++i) {
        var c = /^([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*),?\s*$/.exec(mc[i]);
        if (c[0])
            vecs.push( new x3dom.fields.SFVec3(+c[1], +c[2], +c[3]) );
    }

    return new x3dom.fields.MFVec3( vecs );    
}

x3dom.fields.MFVec3.prototype.toGL = function() {
    var a = [];

    Array.map( this, function(c) {
        a.push(c.x);
        a.push(c.y);
        a.push(c.z);        
    });

    return a;
}



/** MFVec2 constructor.
    @class Represents a MFVec2
  */
x3dom.fields.MFVec2 = function(vec2Array) {
    if (arguments.length == 0) {        
        
    }
    else {
        vec2Array.map( function(v) { this.push(v); }, this );
    }
};

x3dom.fields.MFVec2.prototype = new Array;

x3dom.fields.MFVec2.parse = function(str) {    
    var mc = str.match(/([+-]?\d*\.?\d*\s*){2},?\s*/g);
    var vecs = [];
    for (var i = 0; i < mc.length; ++i) {
        var c = /^([+-]?\d*\.*\d*)\s*,?\s*([+-]?\d*\.*\d*)\s*,?\s*$/.exec(mc[i]);
        if (c[0])
            vecs.push( new x3dom.fields.SFVec2(+c[1], +c[2]) );
    }

    return new x3dom.fields.MFVec2( vecs );    
}

x3dom.fields.MFVec2.prototype.toGL = function() {
    var a = [];

    Array.map( this, function(v) {
        a.push(v.x);
        a.push(v.y);    
    });

    return a;
}



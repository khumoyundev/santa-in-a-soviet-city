export default class Rect {
    constructor({
        ctx,
        width,
        height,
        position,
        fillColor = "#155",
    }) {
        this.ctx = ctx;
        this.rotation = 0;
        this.width = width || 723;
        this.height = height || 256;
        this.position = position || { x: 0, y: 0 };
        this.fillColor = fillColor;
    }

    debugView() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.fillStyle = this.fillColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }

    setPosition(_x, _y) {
        this.position.x = _x;
        this.position.y = _y;
    }

    setFillColor(_colorValue) {
        this.fillColor = _colorValue;
    }

    getBottom() {
        return this.position.y + this.height;
    }

    getRight() {
        return this.position.x + this.height;
    }

    getTop() {
        return this.position.y;
    }

    getLeft() {
        return this.position.x;
    }

    setRotationInAngle(_angle) {
        this.rotation = ((Math.PI * 2) / 360) * _angle;
    }
}
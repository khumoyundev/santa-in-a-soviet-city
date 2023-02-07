import Rect from "./Rect.js";

export default class MessageBoard extends Rect {
    constructor({
        ctx,
        text,
        width,
        height,
        position,
        fillColor,
        fontSize = 17,
        color = "#122",
    }) {
        super({
            ctx, width, height, position, fillColor
        });
        this.text = text;
        this.fontSize = fontSize;
        this.color = color || "#333";
    }

    draw() {
        this.ctx.strokeStyle = "#777";
        this.ctx.lineWidth = 6;
        this.ctx.lineJoin = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x + this.width * 0.5, this.position.y + this.height);
        this.ctx.lineTo(this.position.x + this.width * 0.5, this.position.y + this.height + 100);
        this.ctx.closePath();
        this.ctx.stroke();
        this.debugView();
        this.ctx.font = "normal " + this.fontSize + "px xyz, monospace";
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.position.x + this.width * 0.5, this.position.y + this.height * 0.5);
    }

    move() {
        this.position.x -= 1.5;
    }
}
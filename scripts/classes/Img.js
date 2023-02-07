import Rect from "./Rect.js";

export default class Img extends Rect {
    constructor({
        ctx,
        width,
        height,
        position,
        imageSrc = "",
        velocity,
    }) {
        super({ ctx, width, height, position });
        this.loaded = false;
        this.imageSrc = imageSrc;
        this.image = new Image();
        this.image.src = this.imageSrc;
        this.image.onload = () => this.loaded = true;
        this.velocity = velocity;
    }

    draw() {
        this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

    move() {
        if(this.velocity) this.position.x += this.velocity;
    }
}
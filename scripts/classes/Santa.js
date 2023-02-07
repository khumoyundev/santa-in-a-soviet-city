import Player from "./Player.js"

export default class Santa extends Player {
    constructor({
        imageSrc,
        frameRate,
        animations,
        loop = true,
        ctx,
        position,
        ground,
        moveable = false
    }) {
        super({ imageSrc, frameRate, animations, loop, ctx, position, ground });
        this.moveable = moveable;
        this.alreadyMoving = false;
    }

    move(_keys) {
        if (_keys.d.pressed) this.position.x -= 2;

        if (this.moveable) {
            this.position.x -= 1;
            this.position.y = this.ground + 20;
        }

        if (this.moveable && !this.alreadyMoving) {
            this.alreadyMoving = true;
            this.switchSprite("run");
        }
    }

    shadow() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.beginPath();
        this.ctx.ellipse(this.position.x + this.width * 0.5, this.position.y + this.height - 2, this.width * 0.25, this.width * 0.05, 0, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fill();
    }
}
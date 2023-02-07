import { getRandom } from "../utils.js";

export default class Bubble {
    constructor({
        position
    }) {
        this.position = position;
        this.radius = 3;
        this.opacity = 0.6;
        this.velocity = {
            x: getRandom(-2),
            y: getRandom(-1)
        };
    }

    draw(_ctx) {
        _ctx.fillStyle = `rgba(90, 90, 90, ${this.opacity})`;
        _ctx.beginPath();
        _ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        _ctx.closePath();
        _ctx.fill();
    }

    update(_ctx) {
        if(this.opacity < 0) this.markedForDelegation = true;
        
        this.opacity -= 0.025;
        this.draw(_ctx);
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
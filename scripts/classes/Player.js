import Sprite from "./Sprite.js";

export default class Player extends Sprite {
    constructor({
        imageSrc,
        frameRate,
        animations,
        loop = true,
        ctx,
        position,
        ground
    }) {
        super({ imageSrc, frameRate, animations, loop });
        this.position = position;

        this.velocity = {
            x: 0,
            y: 0,
        };

        this.ctx = ctx;

        this.gravity = 1.2;

        this.sides = {
            bottom: this.position.y + this.height,
        };

        this.hitbox = {
            position: {
                x: 0,
                y: 0,
            },
            width: 50,
            height: 50,
        };

        this.ground = ground;
    }

    update() {
        this.draw();

        this.updateHitbox();

        this.applyGravity();

        this.updateHitbox();
    }

    applyGravity() {
        if (this.velocity.y != 0) this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
    }

    setOnGround() {
        if (this.position.y >= this.ground) {
            this.position.y = this.ground;
            this.velocity.y = 0;
        }
    }

    switchSprite(_name) {
        if (this.image === this.animations[_name].image) return;

        this.currentFrame = 0;
        this.image = this.animations[_name].image;
        this.frameRate = this.animations[_name].frameRate;
        this.frameBuffer = this.animations[_name].frameBuffer;
        this.loop = this.animations[_name].loop;
        this.currentAnimation = this.animations[_name];
    }

    handleInput(keys) {
        if (this.preventInput) return;

        if (keys.d.pressed) {
            this.switchSprite("run");
            this.lastDirection = "right";
        } else if (keys.w.pressed) {
            this.switchSprite("jumpUp");
        }
        else this.switchSprite("idle");

    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 58,
                y: this.position.y + 34,
            },
            width: 50,
            height: 53,
        };
    }

    shadow() {
        if(this.position.y !== this.ground) return;
         
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.beginPath();
        this.ctx.ellipse(this.position.x + this.width * 0.5, this.position.y + this.height + 1, this.width * 0.3, this.width * 0.05, 0, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

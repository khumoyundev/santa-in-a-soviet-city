export default class Sprite {
    constructor({
        position,
        imageSrc,
        frameRate = 1,
        animations,
        frameBuffer = 2,
        loop = true,
        autoplay = true,
        ctx
    }) {
        this.ctx = ctx;
        this.position = position;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.image = new Image();
        this.image.src = imageSrc;
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
            this.imageWidth = this.image.width / this.frameRate;
            this.imageHeight = this.image.height;
        };
        this.frameRate = frameRate;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.frameBuffer = frameBuffer;
        this.animations = animations;
        this.loop = loop;
        this.autoplay = autoplay;
        this.currentAnimation = undefined;
        this.width = 60;
        this.height = 60;

        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image();
                image.src = this.animations[key].imageSrc;
                this.animations[key].image = image;
            }
        }
    }

    draw() {
        if (!this.loaded) return;
        const cropbox = {
            position: {
                x: this.imageWidth * this.currentFrame,
                y: 0,
            },
            width: this.imageWidth,
            height: this.imageHeight,
        };
        this.ctx.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );

        this.updateFrames();
    }

    play() {
        this.autoplay = true;
    }

    updateFrames() {
        if (!this.autoplay) return;

        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
            else if (this.loop === true) this.currentFrame = 0;
        }

        if (this.currentAnimation?.onComplete) {
            if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
                this.currentAnimation.onComplete();
                this.currentAnimation.isActive = true;
            }
        }
    }

}

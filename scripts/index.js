import Img from "./classes/Img.js";
import Player from "./classes/Player.js";
import Bubble from "./classes/Bubble.js";
import { getRandomInt } from "./utils.js";
import Santa from "./classes/Santa.js";
import MessageBoard from "./classes/MessageBoard.js";

/* A tree of variables! XD */
let i,
    ctx,
    scene,
    scale,
    player,
    resource,
    dy = -13,
    loads = [],
    santas = [],
    animationId,
    bubbles = [],
    sceneHalfWidth,
    sceneHalfHeight,
    sceneWidth = 723,
    sceneHeight = 256,
    movingRight = false,
    alreadyLoaded = false,
    groundLevel = sceneHeight - 70,
    mouse = { x: undefined, y: undefined, active: false };

const keys = {
    w: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
}, overlay = { opacity: 1 };

/* fires when a user presses a key on keyboard */
const keyDown = _event => {
    switch (_event.key.toLowerCase()) {
        case "w":
            keys.w.pressed = true;
            break;
        case " ":
            jump();
            keys.w.pressed = true;
            break;
        case "arrowup":
            jump();
            keys.w.pressed = true;
            break;
        case "a":
            keys.a.pressed = true;
            break;
        case "d":
            movingRight = true;
            keys.d.pressed = true;
            break;
        case "arrowright":
            movingRight = true;
            keys.d.pressed = true;
            break;
    }
};

const jump = () => {
    if (player.velocity.y === 0) player.velocity.y = dy;
};

const getArea = () => {
    if (mouse.x >= innerWidth * 0.5) return "right";
    else if (mouse.x <= innerWidth * 0.5) return "top";
};

const mouseDown = _event => {
    mouse.active = true;
    mouse.x = _event.clientX - scene.getBoundingClientRect().left;
    mouse.y = _event.clientY - scene.getBoundingClientRect().top;
};

const mouseUp = _event => {
    mouse.active = false;
};

const touchStart = _event => {
    mouse.active = true;
    mouse.x = _event.touches[0].clientX - scene.getBoundingClientRect().left;
    mouse.y = _event.touches[0].clientY - scene.getBoundingClientRect().top;
};

const touchEnd = _event => {
    mouse.active = false;
};

const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const keyUp = _event => {
    switch (_event.key.toLowerCase()) {
        case "w":
            keys.w.pressed = false;
            break;
        case "arrowup":
            keys.w.pressed = false;
            break;
        case " ":
            keys.w.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "d":
            movingRight = false;
            keys.d.pressed = false;
            break;
        case "arrowright":
            movingRight = false;
            keys.d.pressed = false;
            break;
    }
};

/* Switches to landscape mode */
const rotateScreen = () => {
    if (isMobile()) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen();
        }

        screen.orientation.lock("landscape-primary")
            .then(function () {
                console.log('landscape-primary');
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};

const generateBubbles = () => {
    for (let j = 0; j < 5; j++) {
        bubbles.push(new Bubble({
            position: {
                x: getRandomInt(player.position.x, player.position.x + player.width - 10),
                y: player.position.y + player.height
            }
        }));
    }
};

const generateSantas = () => {
    for (let j = 0; j < 20; j++) {
        const near = getRandomInt(groundLevel, groundLevel + 25);
        const santa = new Santa({
            ctx,
            position: {
                x: sceneWidth * j,
                y: near,
            },
            moveable: Math.random() < 0.3,
            ground: groundLevel,
            frameRate: 6,
            imageSrc: "./res/santa blue/idle.png",
            animations: {
                run: {
                    frameRate: 6,
                    frameBuffer: 7,
                    loop: true,
                    imageSrc: "./res/santa blue/run.png",
                },
                idle: {
                    frameRate: 6,
                    frameBuffer: 6,
                    loop: true,
                    imageSrc: "./res/santa blue/idle.png",
                },
            }
        });

        santa.frameBuffer = 5;

        santas.push(santa);
    }
};

const displayIfMobile = () => {
    if (!(window.innerWidth < 750)) return;

    if (isMobile()) {
        let modal = new tingle.modal({
            closeMethods: ['overlay', 'escape'],
            onClose: function () {
                rotateScreen();
            },
        });

        modal.setContent("We detected that you are using a mobile device. Please click anywhere outside of this modal box to switch to landscape mode.");

        modal.open();
    }

    scale = Math.min(
        innerWidth / scene.clientHeight,
        innerHeight / scene.clientWidth
    );

    scene.style.transform = "scale(" + scale + ")";
};

const displayOverlay = () => {
    ctx.save();
    ctx.globalAlpha = overlay.opacity;
    ctx.fillStyle = "#122";
    ctx.fillRect(0, 0, sceneWidth, sceneHeight);
    ctx.fillStyle = "white";

    ctx.fillStyle = 'white';
    ctx.fillText("Loading...", sceneHalfWidth, sceneHalfHeight - 20);
    ctx.fillText("It turns out you have got a slow network connection.", sceneHalfWidth, sceneHalfHeight);
    ctx.fillText("Let us load the game resources...", sceneHalfWidth, sceneHalfHeight + 20);

    ctx.restore();
}

const define = () => {
    scene = document.getElementById("game-board");
    ctx = scene.getContext("2d");
    player = new Player({
        ctx,
        position: {
            x: 90,
            y: groundLevel,
        },
        ground: groundLevel,
        frameRate: 6,
        imageSrc: "./res/santa/idle.png",
        animations: {
            run: {
                frameRate: 6,
                frameBuffer: 5,
                loop: true,
                imageSrc: "./res/santa/run.png",
            },
            idle: {
                frameRate: 6,
                frameBuffer: 7,
                loop: true,
                imageSrc: "./res/santa/idle.png",
            },
            jumpUp: {
                frameRate: 2,
                frameBuffer: 6,
                loop: false,
                imageSrc: "./res/santa/jump/jumpUp.png",
            },
        }
    });
    resource = {
        ground: new Img({
            velocity: -2,
            imageSrc: "./res/layer_1_ground.png",
            ctx
        }),
        ground2: new Img({
            position: {
                x: sceneWidth,
                y: 0
            },
            velocity: -2,
            imageSrc: "./res/layer_1_ground.png",
            ctx
        }),
        stars: new Img({
            imageSrc: "./res/layer_2_stars.png",
            ctx
        }),
        moon: new Img({
            imageSrc: "./res/layer_3_moon.png",
            ctx
        }),
        clouds2: new Img({
            imageSrc: "./res/layer_5_clouds_2.png",
            ctx
        }),
        clouds: new Img({
            velocity: -0.1,
            imageSrc: "./res/layer_4_clouds_1.png",
            ctx
        }),
        clouds3: new Img({
            position: {
                x: sceneWidth,
                y: 0
            },
            velocity: -0.1,
            imageSrc: "./res/layer_4_clouds_1.png",
            ctx
        }),
        farBuildings: new Img({
            velocity: -0.5,
            imageSrc: "./res/layer_6_far_buildings.png",
            ctx
        }),
        farBuildings2: new Img({
            position: {
                x: sceneWidth,
                y: 0
            },
            velocity: -0.5,
            imageSrc: "./res/layer_6_far_buildings.png",
            ctx
        }),
        bgBuildings: new Img({
            velocity: -1,
            imageSrc: "./res/layer_7_bg_buildings.png",
            ctx
        }),
        bgBuildings2: new Img({
            position: {
                x: sceneWidth,
                y: 0
            },
            velocity: -1,
            imageSrc: "./res/layer_7_bg_buildings.png",
            ctx
        }),
        fgBuildings: new Img({
            velocity: -1.4,
            imageSrc: "./res/layer_8_fg_buildings.png",
            ctx
        }),
        fgBuildings2: new Img({
            position: {
                x: sceneWidth,
                y: 0
            },
            velocity: -1.4,
            imageSrc: "./res/layer_8_fg_buildings.png",
            ctx
        }),
        messageBoard: new MessageBoard({
            ctx,
            text: "Welcome",
            width: 125,
            height: 50,
            fillColor: "#d2e6e9",
            position: {
                x: 35,
                y: 50
            }
        }),
        messageBoard2: new MessageBoard({
            ctx,
            text: "to one of my..",
            width: 155,
            height: 50,
            fillColor: "#d2e6e9",
            position: {
                x: sceneWidth * 1.5,
                y: 50
            }
        }),
        messageBoard3: new MessageBoard({
            ctx,
            text: "meaningless games..",
            width: 195,
            height: 50,
            fillColor: "#d2e6e9",
            position: {
                x: sceneWidth * 3,
                y: 50
            }
        }),
        messageBoard4: new MessageBoard({
            ctx,
            text: "Hope you like it ;)",
            width: 190,
            height: 50,
            fillColor: "#d2e6e9",
            position: {
                x: sceneWidth * 4,
                y: 50
            }
        }),
        messageBoard5: new MessageBoard({
            ctx,
            text: "Created by..",
            width: 125,
            height: 50,
            fillColor: "#d2e6e9",
            position: {
                x: sceneWidth * 7,
                y: 50
            }
        }),
        messageBoard6: new MessageBoard({
            ctx,
            text: "Khumoyun <3",
            width: 125,
            height: 50,
            fillColor: "#d2e6e9",
            position: {
                x: sceneWidth * 8,
                y: 50
            }
        }),
        messageBoard7: new MessageBoard({
            ctx,
            text: "The End :)",
            width: 135,
            height: 40,
            fillColor: "#d2e6e9",
            position: {
                x: sceneWidth * 9,
                y: 50
            }
        }),
        wall: new Img({
            velocity: -2,
            imageSrc: "./res/layer_9_wall.png",
            ctx
        }),
        wall2: new Img({
            position: {
                x: sceneWidth,
                y: 0
            },
            velocity: -2,
            imageSrc: "./res/layer_9_wall.png",
            ctx
        }),
    };

};

const clear = () => ctx.clearRect(0, 0, sceneWidth, sceneHeight);

const resize = (_width, _height) => {
    sceneHalfWidth = (scene.width = _width) * 0.5;
    sceneHalfHeight = (scene.height = _height) * 0.5;
    scale = Math.min(
        innerWidth / scene.clientWidth,
        innerHeight / scene.clientHeight
    );
    scene.style.transform = "scale(" + scale + ")";
};

const loaded = () => {
    loads = [];

    for (const key in resource) {
        if (resource[key].loaded == undefined) break;
        loads.push(resource[key].loaded);
    }

    for (const santa of santas) {
        loads.push(santa.loaded);
    }

    return loads.every(_load => _load);
};

const parallax = () => {
    if (resource.bgBuildings2.position.x <= 0 && resource.bgBuildings.position.x <= resource.bgBuildings2.position.x) resource.bgBuildings.position.x = sceneWidth - 1;
    if (resource.ground2.position.x < 0 && resource.ground.position.x < resource.ground2.position.x) resource.ground.position.x = sceneWidth - 2;
    if (resource.farBuildings2.position.x <= 0 && resource.farBuildings.position.x <= resource.farBuildings2.position.x) resource.farBuildings.position.x = sceneWidth - 1;
    if (resource.fgBuildings2.position.x <= 0 && resource.fgBuildings.position.x <= resource.fgBuildings2.position.x) resource.fgBuildings.position.x = sceneWidth - 1;
    if (resource.wall2.position.x <= 0 && resource.wall.position.x <= resource.wall2.position.x) resource.wall.position.x = sceneWidth - 1;
    if (resource.clouds3.position.x <= 0 && resource.clouds.position.x <= resource.clouds3.position.x) resource.clouds.position.x = sceneWidth - 1;

    if (resource.wall.position.x < 0 && resource.wall2.position.x < resource.wall.position.x) resource.wall2.position.x = sceneWidth - 1;
    if (resource.ground.position.x < 0 && resource.ground2.position.x < resource.ground.position.x) resource.ground2.position.x = sceneWidth - 2;
    if (resource.bgBuildings.position.x < 0 && resource.bgBuildings2.position.x < resource.bgBuildings.position.x) resource.bgBuildings2.position.x = sceneWidth - 1;
    if (resource.farBuildings.position.x < 0 && resource.farBuildings2.position.x < resource.farBuildings.position.x) resource.farBuildings2.position.x = sceneWidth - 1;
    if (resource.fgBuildings.position.x < 0 && resource.fgBuildings2.position.x < resource.fgBuildings.position.x) resource.fgBuildings2.position.x = sceneWidth - 1;
    if (resource.clouds.position.x < 0 && resource.clouds3.position.x < resource.clouds.position.x) resource.clouds3.position.x = sceneWidth - 1;

};

const animate = () => {
    animationId = requestAnimationFrame(animate);

    clear();

    resource.clouds.move();
    resource.clouds3.move();

    if (keys.d.pressed && animationId % 3 === 0 && !keys.w.pressed) generateBubbles();

    for (i in resource) {
        resource[i].draw();
        if (keys.d.pressed) resource[i].move();
    }

    parallax();

    player.velocity.x = 0;

    player.handleInput(keys);

    player.shadow();

    player.update();

    player.setOnGround();

    bubbles.forEach(_bubble => _bubble.update(ctx));

    bubbles = bubbles.filter(_bubble => !_bubble.markedForDelegation);

    santas.forEach((_santa, _index) => {
        _santa.shadow();
        _santa.draw();
        _santa.move(keys);
    });

    if (!loaded() || !alreadyLoaded) {
        alreadyLoaded = true;
        displayOverlay();
    }

    if (getArea() == "right" && mouse.active) keys.d.pressed = true;
    if (!mouse.active && !movingRight) keys.d.pressed = false;
    if (getArea() == "top" && mouse.active) jump();
};

const init = function () {
    define();
    resize(sceneWidth, sceneHeight);
    displayIfMobile();
    generateSantas();
    animate();
};

/* EVENT LISTENERS */
document.addEventListener("DOMContentLoaded", init);
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);
window.addEventListener("touchstart", touchStart);
window.addEventListener("touchend", touchEnd);
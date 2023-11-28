const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;
const floor = 480;
const speed = 5;

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: "./sprites/background.png"
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: "./sprites/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 100,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./sprites/samuraiMack/Idle.png",
    heightAdjust: 20,
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 175
    },
    sprites: {
        idle: {
            imageSrc: "./sprites/samuraiMack/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./sprites/samuraiMack/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./sprites/samuraiMack/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./sprites/samuraiMack/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./sprites/samuraiMack/Attack1.png",
            framesMax: 6
        },
        takeHit: {
            imageSrc: "./sprites/samuraiMack/Take hit - white silhouette.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./sprites/samuraiMack/Death.png",
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 25
        },
        width: 121,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 100,
        y: 100 + player.height + 1
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: "./sprites/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 180
    },
    sprites: {
        idle: {
            imageSrc: "./sprites/kenji/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./sprites/kenji/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./sprites/kenji/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./sprites/kenji/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./sprites/kenji/Attack1.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: "./sprites/kenji/Take hit.png",
            framesMax: 3
        },
        death: {
            imageSrc: "./sprites/kenji/Death.png",
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -75,
            y: 50
        },
        width: -132,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
    
}

function animate(){
    window.requestAnimationFrame(animate);

    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player movement
    if (keys.a.pressed && player.lastKey == "a") {
        player.velocity.x = -speed;
        player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey == "d") {
        player.velocity.x = speed;
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
    }

    // Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == "ArrowLeft") {
        enemy.velocity.x = -speed;
        enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed && enemy.lastKey == "ArrowRight") {
        enemy.velocity.x = speed;
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
    }

    // detect for colision & enemy is hit
    if (
        rectCollision({rect1 : player, rect2: enemy}) &&
        player.isAttacking &&
        player.frameCurrent == 4
    ){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to("#enemyhealth", {
            width: enemy.health + "%"
        })
    }

    // if player misses
    if (player.isAttacking && player.frameCurrent == 4){
        player.isAttacking = false
    }

    if (
        rectCollision({rect1 : enemy, rect2: player}) &&
        enemy.isAttacking &&
        enemy.frameCurrent == 2
    ){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to("#playerhealth", {
            width: player.health + "%"
        })
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.frameCurrent == 2){
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

    
    checkBox(shop);
    checkBox(player);
    checkBox(enemy);
}

animate();
decreaseTimer();

window.addEventListener("keydown", (event) => {
    if (!player.dead){
        switch (event.key){
            case "d":
                keys.d.pressed = true;
                player.lastKey = "d";
                if (player.dirX != 1){
                    player.dirX = 1;
                }
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = "a";
                if (player.dirX != -1){
                    player.dirX = -1;
                }
                break;
            case "w":
                if (player.position.y + player.height >= floor){
                    player.velocity.y = -10;
                    }
                break;
            case " ":
                player.attack();
                break;
        }
    }

    
    if (!enemy.dead){
        switch (event.key){
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                if (enemy.dirX != -1){
                    enemy.dirX = -1;
                }
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                if (enemy.dirX != 1){
                    enemy.dirX = 1;
                }
                break;
            case "ArrowUp":
                if (enemy.position.y + enemy.height >= floor){
                    enemy.velocity.y = -10;
                    }
                break;
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key){
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
    }
    switch (event.key){
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
})
class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y:0}}){
        this.position = position;   
        this.image = new Image();
        this.image.src = imageSrc;
        this.offset = offset;         // the image in the file is smallet so we 
                                      // need to move it so it would fit the coordinates
        // animation related
        this.scale = scale;           // resising the image
        this.framesMax = framesMax;   // amount of frames in the picture file
        this.frameCurrent = 0;        // the current frame
        this.framesElapsed = 0;       // how many frames elapsed threw
        this.framesHold = 15;         // every how many frames teh frame will change

        this.width = (this.image.width / this.framesMax - this.offset.x * 2) * this.scale;
        this.height = (this.image.height - this.offset.y * 2) * this.scale;
    }

    draw() {
        c.drawImage(
            this.image,                                               // the image
            this.frameCurrent * (this.image.width / this.framesMax),  // the current frame
            0,                                                        // the current frame for the y so it always 0
            this.image.width / this.framesMax,                        // the right width for every frame (its the same for every one of them)
            this.image.height,                                        // again the height ramains the same
            this.position.x - this.offset.x,                          // fiting at the x coordinates
            this.position.y - this.offset.y,                          // fiting at the y coordinates                   
            (this.image.width / this.framesMax) * this.scale,         // resising the image width
            this.image.height * this.scale                            // resising the image height
        )
    }

    animateFrames(){
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold == 0) {
            if (this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update(){
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity, 
        imageSrc, 
        heightAdjust = 0,
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y:0},
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })

        this.width = (this.image.width / this.framesMax) * this.scale - this.offset.x * 2;
        this.height = this.image.height * this.scale - this.offset.y * 2 - heightAdjust;
    
        this.velocity = velocity
        this.health = 100
        this.lastKey
        this.attackBox = {
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.dirX = 1;

        // animation related
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 15;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        if (this.dirX < 0){
            c.scale(-1, 1);
            this.position.x *= -1;
            c.translate(-this.width, 0);
            this.draw();
            this.position.x *= -1;
            c.setTransform(1, 0, 0, 1, 0, 0);
        }else{
            this.draw();
        }

        if (!this.dead){
            this.animateFrames();
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= floor){
            this.velocity.y = 0;
            this.position.y = floor - this.height;
        } else{this.velocity.y += gravity};
    }

    attack(){
        this.switchSprite("attack1")
        this.isAttacking = true
    }

    takeHit(){
        this.health -= 10
        if (this.health <= 0) {
            this.switchSprite("death")
        } else{
            this.switchSprite("takeHit")
        }
    }
    
    switchSprite(sprite) { 
        if (this.image == this.sprites.death.image ) {
            if (this.frameCurrent == this.sprites.death.framesMax - 1) this.dead = true
            return}
        
        // overriding all other animations
        if (this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.framesMax - 1) return

        if (this.image === this.sprites.takeHit.image && this.frameCurrent < this.sprites.takeHit.framesMax - 1) return

        switch (sprite) {
            case "idle":
                if (this.image != this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.frameCurrent = 0;
                }
                break
            case "run":
                if (this.image != this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.frameCurrent = 0;
                }
                break
            case "jump":
                if (this.image != this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.frameCurrent = 0;
                }
                break
            case "fall":
                if (this.image != this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.frameCurrent = 0;
                }
                break

            case "attack1":
                if (this.image != this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.frameCurrent = 0;
                }
                break

            case "takeHit":
                if (this.image != this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.frameCurrent = 0;
                }
                break

            case "death":
                if (this.image != this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.frameCurrent = 0;
                }
                break
        }
    }
}
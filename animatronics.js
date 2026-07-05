class Animatronic {
    constructor(name, x, y, speed) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.targetX = x;
        this.targetY = y;
        this.state = 'idle';
        this.stateTimer = 0;
        this.active = true;
        this.color = this.getColor();
    }

    getColor() {
        const colors = {
            'Freddy': '#f44336',
            'Bonnie': '#9c27b0',
            'Chica': '#ffc107',
            'Foxy': '#ff6f00'
        };
        return colors[this.name] || '#f00';
    }

    update(gameWidth, gameHeight, night) {
        if (!this.active) return;

        this.stateTimer++;

        const nightMultiplier = 1 + (night - 1) * 0.15;
        const adjustedSpeed = this.speed * nightMultiplier;

        if (this.stateTimer > 60) {
            this.makeDecision(gameWidth, gameHeight, night);
            this.stateTimer = 0;
        }

        this.moveTowards(adjustedSpeed);

        this.x = Math.max(0, Math.min(gameWidth, this.x));
        this.y = Math.max(0, Math.min(gameHeight, this.y));
    }

    makeDecision(gameWidth, gameHeight, night) {
        const aggressionLevel = 0.3 + (night * 0.15);

        if (Math.random() < aggressionLevel) {
            this.targetX = -50;
            this.targetY = gameHeight / 2 + (Math.random() - 0.5) * 100;
            this.state = 'moving';
        } else {
            this.targetX = Math.random() * gameWidth;
            this.targetY = Math.random() * gameHeight;
        }
    }

    moveTowards(speed) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > speed) {
            this.x += (dx / distance) * speed;
            this.y += (dy / distance) * speed;
        } else {
            this.x = this.targetX;
            this.y = this.targetY;
        }
    }

    isAttacking(leftDoorOpen, rightDoorOpen) {
        if (this.x < 0 && leftDoorOpen) return true;
        if (this.x > 1280 && rightDoorOpen) return true;
        return false;
    }
}

class Camera {
    constructor(name, x, y, width, height) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.animatronicsInView = [];
    }

    updateView(animatronics) {
        this.animatronicsInView = animatronics.filter(a => 
            a.x >= this.x && 
            a.x <= this.x + this.width && 
            a.y >= this.y && 
            a.y <= this.y + this.height &&
            a.active
        );
    }

    getScreenCoordinates(worldX, worldY, screenWidth, screenHeight) {
        const screenX = ((worldX - this.x) / this.width) * screenWidth;
        const screenY = ((worldY - this.y) / this.height) * screenHeight;
        return { x: screenX, y: screenY };
    }
}

class FNAFGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.currentScreen = 'menu';
        this.night = 1;
        this.hour = 0;
        this.minute = 0;
        this.power = 100;
        this.maxPower = 100;
        this.powerPerSecond = 0.1;
        this.leftDoorClosed = false;
        this.rightDoorClosed = false;
        this.cameraActive = false;
        this.currentCameraIndex = 0;

        this.animatronics = [];
        this.cameras = [];
        this.gameStartTime = 0;
        this.gameWon = false;

        this.setupEventListeners();
        this.initializeCameras();
        this.animate();
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('instructionsBtn').addEventListener('click', () => this.showScreen('instructions'));
        document.getElementById('creditsBtn').addEventListener('click', () => this.showScreen('credits'));
        document.getElementById('closeInstructionsBtn').addEventListener('click', () => this.showScreen('menu'));
        document.getElementById('closeCreditsBtn').addEventListener('click', () => this.showScreen('menu'));
        document.getElementById('retryBtn').addEventListener('click', () => this.startGame());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.returnToMenu());
        document.getElementById('nextNightBtn').addEventListener('click', () => this.startNextNight());

        document.getElementById('leftDoorBtn').addEventListener('click', () => this.toggleLeftDoor());
        document.getElementById('rightDoorBtn').addEventListener('click', () => this.toggleRightDoor());

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    initializeCameras() {
        this.cameras = [
            new Camera('MAIN OFFICE', 400, 150, 480, 420),
            new Camera('WEST HALL', 0, 0, 640, 720),
            new Camera('EAST HALL', 640, 0, 640, 720),
            new Camera('KITCHEN', 0, 0, 1280, 720)
        ];
    }

    handleKeyDown(e) {
        if (this.currentScreen !== 'playing') return;

        switch (e.key.toLowerCase()) {
            case ' ':
                this.cameraActive = !this.cameraActive;
                this.updateUI();
                break;
            case 'd':
                this.toggleLeftDoor();
                break;
            case 'a':
                this.leftDoorClosed = false;
                this.updateUI();
                break;
            case 'k':
                this.toggleRightDoor();
                break;
            case 'l':
                this.rightDoorClosed = false;
                this.updateUI();
                break;
            case 'arrowup':
            case 'w':
                if (this.cameraActive) {
                    this.currentCameraIndex = Math.max(0, this.currentCameraIndex - 1);
                }
                break;
            case 'arrowdown':
            case 's':
                if (this.cameraActive) {
                    this.currentCameraIndex = Math.min(this.cameras.length - 1, this.currentCameraIndex + 1);
                }
                break;
        }
    }

    toggleLeftDoor() {
        this.leftDoorClosed = !this.leftDoorClosed;
        this.updateUI();
    }

    toggleRightDoor() {
        this.rightDoorClosed = !this.rightDoorClosed;
        this.updateUI();
    }

    startGame() {
        this.night = 1;
        this.power = this.maxPower;
        this.hour = 0;
        this.minute = 0;
        this.leftDoorClosed = false;
        this.rightDoorClosed = false;
        this.cameraActive = false;
        this.gameStartTime = Date.now();
        this.gameWon = false;

        this.initializeAnimatronics();
        this.showScreen('playing');
    }

    startNextNight() {
        this.night++;
        this.power = this.maxPower;
        this.hour = 0;
        this.minute = 0;
        this.leftDoorClosed = false;
        this.rightDoorClosed = false;
        this.cameraActive = false;
        this.gameStartTime = Date.now();

        this.initializeAnimatronics();
        this.showScreen('playing');
    }

    initializeAnimatronics() {
        this.animatronics = [
            new Animatronic('Freddy', 900, 300, 1.0),
            new Animatronic('Bonnie', 800, 400, 1.1),
            new Animatronic('Chica', 1000, 350, 0.9),
            new Animatronic('Foxy', 950, 250, 1.2)
        ];
    }

    showScreen(screen) {
        this.currentScreen = screen;
        this.updateScreenVisibility();
    }

    updateScreenVisibility() {
        document.getElementById('menuScreen').classList.add('hidden');
        document.getElementById('instructionsScreen').classList.add('hidden');
        document.getElementById('creditsScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('nightCompleteScreen').classList.add('hidden');
        document.querySelector('.game-screen').classList.remove('active');

        switch (this.currentScreen) {
            case 'menu':
                document.getElementById('menuScreen').classList.remove('hidden');
                break;
            case 'instructions':
                document.getElementById('instructionsScreen').classList.remove('hidden');
                break;
            case 'credits':
                document.getElementById('creditsScreen').classList.remove('hidden');
                break;
            case 'playing':
                document.querySelector('.game-screen').classList.add('active');
                break;
            case 'gameOver':
                document.getElementById('gameOverScreen').classList.remove('hidden');
                break;
            case 'nightComplete':
                document.getElementById('nightCompleteScreen').classList.remove('hidden');
                break;
        }
    }

    returnToMenu() {
        this.showScreen('menu');
    }

    update() {
        if (this.currentScreen !== 'playing') return;

        const elapsed = (Date.now() - this.gameStartTime) / 1000;
        const totalMinutes = Math.floor(elapsed / 10);
        this.hour = Math.floor(totalMinutes / 60) + 12;
        this.minute = totalMinutes % 60;

        if (totalMinutes >= 360) {
            this.nightComplete();
            return;
        }

        this.updatePower();

        for (let animatronic of this.animatronics) {
            animatronic.update(this.canvas.width, this.canvas.height, this.night);

            if (animatronic.isAttacking(!this.leftDoorClosed, !this.rightDoorClosed)) {
                this.gameOverDefeat(animatronic.name + ' got you!');
                return;
            }
        }

        const currentCamera = this.cameras[this.currentCameraIndex];
        currentCamera.updateView(this.animatronics);

        this.updateUI();
    }

    updatePower() {
        let drain = this.powerPerSecond;

        if (this.leftDoorClosed) drain += 0.3;
        if (this.rightDoorClosed) drain += 0.3;
        if (this.cameraActive) drain += 0.2;

        this.power = Math.max(0, this.power - drain / 10);

        if (this.power <= 0) {
            this.gameOverDefeat('Power depleted! Animatronics entered the office!');
        }
    }

    nightComplete() {
        if (this.night >= 5) {
            this.gameWon = true;
            this.showGameOver('YOU SURVIVED ALL 5 NIGHTS!', true);
        } else {
            this.showScreen('nightComplete');
            document.getElementById('nightCompleteMessage').textContent = 
                'Night ' + this.night + ' Complete! Get ready for Night ' + (this.night + 1) + '...';
        }
    }

    gameOverDefeat(message) {
        this.showGameOver(message, false);
    }

    showGameOver(message, won) {
        this.showScreen('gameOver');
        const title = document.getElementById('gameOverTitle');
        const msgElement = document.getElementById('gameOverMessage');
        const stats = document.getElementById('gameStats');

        if (won) {
            title.textContent = 'VICTORY!';
            title.classList.add('victory');
            msgElement.textContent = message;
        } else {
            title.textContent = 'GAME OVER';
            title.classList.remove('victory');
            msgElement.textContent = message;
        }

        stats.innerHTML = '<p>Night Survived: ' + this.night + '/5</p>' +
            '<p>Time: ' + (this.hour % 12 || 12) + ':' + String(this.minute).padStart(2, '0') + ' ' + (this.hour >= 12 ? 'PM' : 'AM') + '</p>' +
            '<p>Final Power: ' + Math.round(this.power) + '%</p>';
    }

    updateUI() {
        document.getElementById('nightDisplay').textContent = this.night;
        document.getElementById('timeDisplay').textContent = 
            (this.hour % 12 || 12) + ':' + String(this.minute).padStart(2, '0') + ' ' + (this.hour >= 12 ? 'PM' : 'AM');
        document.getElementById('powerDisplay').textContent = Math.ceil(this.power) + '%';

        let status = 'SAFE';
        let animatronic_close = this.animatronics.some(a => a.x < 300);
        if (animatronic_close) status = 'ALERT!';
        document.getElementById('statusDisplay').textContent = status;

        const leftDoorBtn = document.getElementById('leftDoorBtn');
        const rightDoorBtn = document.getElementById('rightDoorBtn');
        const leftDoorState = document.getElementById('leftDoorState');
        const rightDoorState = document.getElementById('rightDoorState');

        leftDoorBtn.textContent = this.leftDoorClosed ? 'OPEN (A)' : 'CLOSE (D)';
        rightDoorBtn.textContent = this.rightDoorClosed ? 'OPEN (L)' : 'CLOSE (K)';
        leftDoorState.textContent = this.leftDoorClosed ? 'CLOSED' : 'OPEN';
        rightDoorState.textContent = this.rightDoorClosed ? 'CLOSED' : 'OPEN';

        if (this.leftDoorClosed) {
            leftDoorState.classList.add('closed');
        } else {
            leftDoorState.classList.remove('closed');
        }

        if (this.rightDoorClosed) {
            rightDoorState.classList.add('closed');
        } else {
            rightDoorState.classList.remove('closed');
        }

        if (this.cameraActive) {
            document.getElementById('officeUI').style.display = 'none';
            document.getElementById('cameraUI').classList.remove('hidden');
            this.updateCameraDisplay();
        } else {
            document.getElementById('officeUI').style.display = 'flex';
            document.getElementById('cameraUI').classList.add('hidden');
        }
    }

    updateCameraDisplay() {
        const camera = this.cameras[this.currentCameraIndex];
        document.getElementById('cameraName').textContent = camera.name;
        document.getElementById('cameraNumber').textContent = (this.currentCameraIndex + 1) + '/' + this.cameras.length;

        let warning = '';
        if (this.power < 20) {
            warning = 'WARNING: LOW POWER!';
        } else if (this.power < 5) {
            warning = 'CRITICAL POWER FAILURE!';
        }
        document.getElementById('powerWarning').textContent = warning;
    }

    render() {
        if (this.currentScreen !== 'playing') return;

        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.cameraActive) {
            this.renderCameraView();
        } else {
            this.renderOfficeView();
        }
    }

    renderOfficeView() {
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, 100, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - 100, 0, 100, this.canvas.height);

        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(this.canvas.width / 2 - 200, this.canvas.height - 200, 400, 200);

        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(this.canvas.width / 2 - 150, this.canvas.height - 150, 300, 100);

        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('> PRESS SPACE FOR CAMERAS <', this.canvas.width / 2, this.canvas.height - 70);
    }

    renderCameraView() {
        const viewport = document.getElementById('cameraViewport');
        viewport.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'camera-grid';
        viewport.appendChild(grid);

        const camera = this.cameras[this.currentCameraIndex];

        for (let animatronic of camera.animatronicsInView) {
            const screenCoords = camera.getScreenCoordinates(
                animatronic.x,
                animatronic.y,
                viewport.clientWidth,
                viewport.clientHeight
            );

            const entity = document.createElement('div');
            entity.className = 'camera-entity';
            entity.style.left = screenCoords.x + 'px';
            entity.style.top = screenCoords.y + 'px';

            const sprite = document.createElement('div');
            sprite.className = 'camera-entity-sprite';
            sprite.style.backgroundColor = animatronic.color;
            sprite.textContent = animatronic.name.substring(0, 1);

            const label = document.createElement('div');
            label.className = 'camera-entity-label';
            label.textContent = animatronic.name;

            entity.appendChild(sprite);
            entity.appendChild(label);
            viewport.appendChild(entity);
        }
    }

    animate() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FNAFGame();
});

class FNAFGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.currentScreen = 'menu';
        this.night = 1;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.power = 100;
        this.maxPower = 100;
        this.powerPerSecond = 0.05;
        this.leftDoorClosed = false;
        this.rightDoorClosed = false;
        this.cameraActive = false;
        this.currentCameraIndex = 0;

        this.animatronics = [];
        this.cameras = [];
        this.locations = [];
        this.gameStartTime = 0;
        this.gameWon = false;
        this.lastUpdateTime = Date.now();

        this.setupEventListeners();
        this.initializeLocations();
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

    initializeLocations() {
        // Create a map with multiple locations
        this.locations = [
            { id: 'kitchen', name: 'KITCHEN', x: 100, y: 100, width: 200, height: 180 },
            { id: 'hallway_left', name: 'WEST HALL', x: 100, y: 300, width: 200, height: 180 },
            { id: 'office', name: 'OFFICE', x: 400, y: 200, width: 280, height: 280 },
            { id: 'hallway_right', name: 'EAST HALL', x: 800, y: 300, width: 200, height: 180 },
            { id: 'stage', name: 'STAGE', x: 800, y: 100, width: 200, height: 180 },
            { id: 'storage', name: 'STORAGE', x: 100, y: 500, width: 200, height: 180 },
            { id: 'backroom', name: 'BACK ROOM', x: 400, y: 520, width: 200, height: 180 },
            { id: 'camera_room', name: 'CAM ROOM', x: 700, y: 520, width: 200, height: 180 }
        ];
    }

    initializeCameras() {
        this.cameras = [
            { name: 'STAGE', locationIds: ['stage'] },
            { name: 'KITCHEN', locationIds: ['kitchen'] },
            { name: 'WEST HALL', locationIds: ['hallway_left'] },
            { name: 'EAST HALL', locationIds: ['hallway_right'] },
            { name: 'STORAGE', locationIds: ['storage'] },
            { name: 'BACK ROOM', locationIds: ['backroom'] },
            { name: 'OFFICE ENTRANCE', locationIds: ['hallway_left', 'hallway_right', 'office'] }
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
        this.second = 0;
        this.leftDoorClosed = false;
        this.rightDoorClosed = false;
        this.cameraActive = false;
        this.gameStartTime = Date.now();
        this.lastUpdateTime = Date.now();
        this.gameWon = false;

        this.initializeAnimatronics();
        this.showScreen('playing');
    }

    startNextNight() {
        this.night++;
        this.power = this.maxPower;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;
        this.leftDoorClosed = false;
        this.rightDoorClosed = false;
        this.cameraActive = false;
        this.gameStartTime = Date.now();
        this.lastUpdateTime = Date.now();

        this.initializeAnimatronics();
        this.showScreen('playing');
    }

    initializeAnimatronics() {
        this.animatronics = [
            new Animatronic('Freddy', this.locations[4], 1.0, this.locations),
            new Animatronic('Bonnie', this.locations[3], 1.1, this.locations),
            new Animatronic('Chica', this.locations[1], 0.9, this.locations),
            new Animatronic('Foxy', this.locations[5], 1.2, this.locations)
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

        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        this.second += deltaTime;
        if (this.second >= 1) {
            this.minute += Math.floor(this.second);
            this.second %= 1;
        }

        if (this.minute >= 60) {
            this.hour += Math.floor(this.minute / 60);
            this.minute %= 60;
        }

        if (this.hour >= 6) {
            this.nightComplete();
            return;
        }

        this.updatePower();

        for (let animatronic of this.animatronics) {
            animatronic.update(this.night);

            // Check if animatronic reached the office
            if (animatronic.currentLocation.id === 'office') {
                // Check if doors block them
                if (!this.leftDoorClosed || !this.rightDoorClosed) {
                    this.gameOverDefeat(animatronic.name + ' got you!');
                    return;
                }
            }
        }

        this.updateUI();
    }

    updatePower() {
        let drain = this.powerPerSecond;

        if (this.leftDoorClosed) drain += 0.2;
        if (this.rightDoorClosed) drain += 0.2;
        if (this.cameraActive) drain += 0.1;

        this.power = Math.max(0, this.power - drain);

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
            '<p>Time: ' + (this.hour % 12 || 12) + ':' + String(Math.floor(this.minute)).padStart(2, '0') + ':' + String(Math.floor(this.second)).padStart(2, '0') + '</p>' +
            '<p>Final Power: ' + Math.round(this.power) + '%</p>';
    }

    updateUI() {
        document.getElementById('nightDisplay').textContent = this.night;
        document.getElementById('timeDisplay').textContent = 
            (this.hour % 12 || 12) + ':' + String(Math.floor(this.minute)).padStart(2, '0') + ':' + String(Math.floor(this.second)).padStart(2, '0');
        document.getElementById('powerDisplay').textContent = Math.ceil(this.power) + '%';

        let status = 'SAFE';
        for (let animatronic of this.animatronics) {
            if (animatronic.currentLocation.id === 'hallway_left' || animatronic.currentLocation.id === 'hallway_right') {
                status = 'ALERT!';
                break;
            }
        }
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
        document.getElementById('cameraName').textContent = this.cameras[this.currentCameraIndex].name;
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
        // Draw office background
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw desk
        this.ctx.fillStyle = '#3a3a2a';
        this.ctx.fillRect(this.canvas.width / 2 - 250, this.canvas.height - 200, 500, 200);

        // Draw monitor screen
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(this.canvas.width / 2 - 180, this.canvas.height - 160, 360, 120);
        
        // Monitor glow
        this.ctx.strokeStyle = '#0f0';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.canvas.width / 2 - 180, this.canvas.height - 160, 360, 120);

        // Draw timer on monitor
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = 'bold 40px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            (this.hour % 12 || 12) + ':' + String(Math.floor(this.minute)).padStart(2, '0') + ':' + String(Math.floor(this.second)).padStart(2, '0'),
            this.canvas.width / 2,
            this.canvas.height - 90
        );

        // Draw left wall (left door area)
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, 120, this.canvas.height);

        // Draw left door
        this.drawDoor(20, this.canvas.height / 2 - 80, 80, 160, this.leftDoorClosed, 'LEFT');

        // Draw right wall (right door area)
        this.ctx.fillRect(this.canvas.width - 120, 0, 120, this.canvas.height);

        // Draw right door
        this.drawDoor(this.canvas.width - 100, this.canvas.height / 2 - 80, 80, 160, this.rightDoorClosed, 'RIGHT');

        // Draw info text
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PRESS SPACE FOR MAP CAMERAS', this.canvas.width / 2, 40);
    }

    drawDoor(x, y, width, height, closed, side) {
        if (closed) {
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(x, y, width, height);
            
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, width, height);
            
            this.ctx.fillStyle = '#f00';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('LOCKED', x + width / 2, y + height / 2 + 5);
        } else {
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.fillRect(x, y, width, height);
            
            this.ctx.strokeStyle = '#0a0';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, width, height);
            
            this.ctx.fillStyle = '#0a0';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('OPEN', x + width / 2, y + height / 2 + 5);
        }

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(side, x + width / 2, y - 10);
    }

    renderCameraView() {
        const viewport = document.getElementById('cameraViewport');
        viewport.innerHTML = '';

        // Draw map background
        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = viewport.clientWidth;
        mapCanvas.height = viewport.clientHeight;
        const mapCtx = mapCanvas.getContext('2d');

        // Draw background
        mapCtx.fillStyle = '#001a00';
        mapCtx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

        // Draw grid
        mapCtx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
        mapCtx.lineWidth = 1;
        for (let i = 0; i < mapCanvas.width; i += 40) {
            mapCtx.beginPath();
            mapCtx.moveTo(i, 0);
            mapCtx.lineTo(i, mapCanvas.height);
            mapCtx.stroke();
        }
        for (let i = 0; i < mapCanvas.height; i += 40) {
            mapCtx.beginPath();
            mapCtx.moveTo(0, i);
            mapCtx.lineTo(mapCanvas.width, i);
            mapCtx.stroke();
        }

        // Draw scale (normalize to fit in viewport)
        const scaleX = mapCanvas.width / 1100;
        const scaleY = mapCanvas.height / 700;

        // Draw locations
        for (let location of this.locations) {
            const x = location.x * scaleX;
            const y = location.y * scaleY;
            const w = location.width * scaleX;
            const h = location.height * scaleY;

            mapCtx.fillStyle = '#1a3a1a';
            mapCtx.fillRect(x, y, w, h);
            mapCtx.strokeStyle = '#0f0';
            mapCtx.lineWidth = 2;
            mapCtx.strokeRect(x, y, w, h);

            // Location name
            mapCtx.fillStyle = '#0f0';
            mapCtx.font = '12px Arial';
            mapCtx.textAlign = 'center';
            mapCtx.fillText(location.name, x + w / 2, y + h / 2 + 5);
        }

        // Draw animatronics on map
        for (let animatronic of this.animatronics) {
            const loc = animatronic.currentLocation;
            const x = (loc.x + loc.width / 2) * scaleX;
            const y = (loc.y + loc.height / 2) * scaleY;

            // Draw animatronic as colored circle
            mapCtx.fillStyle = animatronic.color;
            mapCtx.beginPath();
            mapCtx.arc(x, y, 8, 0, Math.PI * 2);
            mapCtx.fill();

            // Draw outline
            mapCtx.strokeStyle = '#fff';
            mapCtx.lineWidth = 2;
            mapCtx.beginPath();
            mapCtx.arc(x, y, 8, 0, Math.PI * 2);
            mapCtx.stroke();

            // Name label
            mapCtx.fillStyle = animatronic.color;
            mapCtx.font = 'bold 10px Arial';
            mapCtx.textAlign = 'center';
            mapCtx.fillText(animatronic.name, x, y + 20);
        }

        // Convert canvas to image and add to viewport
        const imgData = mapCanvas.toDataURL();
        const img = new Image();
        img.onload = function() {
            viewport.appendChild(img);
        };
        img.src = imgData;

        // Add camera info
        const info = document.createElement('div');
        info.style.position = 'absolute';
        info.style.top = '10px';
        info.style.left = '10px';
        info.style.color = '#0f0';
        info.style.fontSize = '12px';
        info.textContent = 'Viewing entire facility map';
        viewport.appendChild(info);
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

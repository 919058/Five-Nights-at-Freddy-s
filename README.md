# Five Nights at Freddy's - Fan Game

A web-based recreation of the Five Nights at Freddy's game mechanics. Survive 5 nights at Freddy Fazbear's Pizza by managing power, closing doors, and monitoring security cameras.

## Features

- **5 Progressive Nights**: Each night gets increasingly difficult as animatronics become more aggressive
- **Security Camera System**: Switch between different camera feeds to monitor animatronic positions
- **Power Management**: Limited power supply that depletes when using doors and cameras
- **Door Control**: Close doors to block animatronics from entering the office
- **Animated Characters**: AI-controlled animatronics (Freddy, Bonnie, Chica, Foxy) with realistic behavior
- **Dynamic Difficulty**: Animatronic aggression increases with each night

## How to Play

### Objective
Survive from 12:00 AM to 6:00 AM for 5 consecutive nights.

### Controls
- **SPACE** - Toggle camera view
- **Arrow Keys / WASD** - Navigate between camera feeds (Up/Down)
- **D** - Close left door | **A** - Open left door
- **K** - Close right door | **L** - Open right door

### Game Mechanics

**Power System**
- You start each night with 100% power
- Power depletes naturally and faster when using doors/cameras
- If power reaches 0%, the lights go out and animatronics can attack
- Manage power carefully to last the entire night

**Animatronics**
- Four animatronic characters patrol the pizzeria
- Each has different aggression levels and patterns
- Monitor cameras to track their positions
- Close doors if they get too close
- If an animatronic enters your office, it's game over

**Cameras**
- View the security camera feed with SPACE
- Switch between different camera feeds
- Use cameras to locate animatronics
- Camera usage drains power

**Doors**
- Close doors to block animatronics
- Door usage drains power
- Must be strategic - use only when necessary
- Keep an eye on which door needs protection

## Game Progression

| Night | Difficulty | Animatronic Speed | Description |
|-------|-----------|------------------|-------------|
| 1 | Easy | Base + 10% | Introduction to mechanics |
| 2 | Normal | Base + 20% | Increased activity |
| 3 | Hard | Base + 30% | Significantly more aggressive |
| 4 | Very Hard | Base + 40% | Extreme pressure |
| 5 | Nightmare | Base + 50% | Final test of survival skills |

## Tips for Success

1. **Monitor regularly**: Check cameras frequently to stay aware of animatronic positions
2. **Power conservation**: Don't close doors unless absolutely necessary
3. **Learn patterns**: Each animatronic has behavior patterns you can learn
4. **Balance resources**: Decide between camera use and door protection
5. **Stay alert**: Keep track of time and animatronic activity
6. **Later nights are hardest**: Don't waste power early, save it for when things get intense

## Technical Details

- Built with HTML5 Canvas and Vanilla JavaScript
- No external dependencies required
- Real-time game state management
- Dynamic difficulty scaling
- Responsive control system

## File Structure

- `index.html` - Main HTML structure and UI
- `styles.css` - Game styling and UI design
- `game.js` - Core game logic and state management
- `animatronics.js` - AI behavior and character movement
- `camera.js` - Camera system utilities
- `README.md` - This file

## Development

This is a fan-made game based on the Five Nights at Freddy's franchise. It's created for educational and entertainment purposes.

### Customization

You can modify several parameters in the game:
- `powerUsage` - Base power consumption rate
- `doorPowerCost` - Power cost for keeping doors closed
- `aggressiveness` - Base animatronic aggression levels
- Camera positions and names
- Game difficulty parameters

## Future Enhancements

Potential features for future versions:
- Sound effects and ambient music
- More camera feeds
- Additional animatronics
- Custom difficulty settings
- Game statistics and leaderboard
- Mobile touch controls
- Different office layouts
- Story progression
- Easter eggs and secrets

## License

This is a fan-made project. Five Nights at Freddy's is owned by Scott Cawthon.

## Credits

Game mechanics inspired by Five Nights at Freddy's by Scott Cawthon.

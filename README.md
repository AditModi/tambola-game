# 🎪 Tambola (Indian Housie) Game 🎪

A complete implementation of the popular Indian bingo game with both web-based GUI and command-line interfaces.

## 🎯 Game Overview

Tambola is a popular game of chance played with tickets containing numbers from 1-90. Players mark off numbers as they're called out, competing for various prize categories.

## 📁 Project Structure

```
tambola-game/
├── index.html           # Web-based GUI (RECOMMENDED)
├── styles.css           # CSS styling for web interface
├── game.js              # JavaScript game logic
├── main.py              # Command-line version
├── ticket.py            # Ticket generation module
├── caller.py            # Number calling module
├── winner_checker.py    # Win detection module
└── README.md           # This file
```

## 🚀 How to Run

### 🌐 Web-Based GUI (Recommended)

1. **Navigate to the project folder:**
   ```bash
   cd tambola-game
   ```

2. **Start the web server:**
   ```bash
   python3 -m http.server 8080
   ```

3. **Open in browser:**
   ```
   http://localhost:8080
   ```

4. **Play the game:**
   - Click "🎮 New Game" to start
   - Set up players and enjoy!

### 💻 Command-Line Version

```bash
cd tambola-game
python3 main.py
```

## 🎮 Web GUI Features

### **🎨 Beautiful Interface**
- Modern gradient design
- Responsive layout for all devices
- Smooth animations and transitions
- Professional color scheme

### **🎯 Interactive Controls**
- **🎮 New Game** - Set up players with custom names
- **🎯 Call Number** - Manually call the next number
- **⏯️ Auto Play** - Automatic number calling (2-second intervals)
- **📋 Rules** - Complete game rules in popup
- **🔄 Reset** - Start fresh anytime

### **🎫 Visual Game Elements**
- **Large current number display** - Easy to see what was called
- **Live ticket grids** - Numbers turn green when marked
- **Called numbers grid** - Visual history of all called numbers
- **Recent numbers tracker** - Last 10 numbers always visible
- **Real-time win tracking** - Shows current wins for each player

### **🏆 Smart Features**
- **Automatic ticket generation** - Follows proper Tambola rules
- **Instant win detection** - All patterns checked automatically
- **Winner celebrations** - Pop-up announcements
- **Final results summary** - Complete game statistics
- **Duplicate name prevention** - Ensures unique player names

## 🎫 Game Rules

### **Ticket Structure**
- Each ticket is a 3×9 grid with 15 numbers
- Numbers range from 1-90
- Column distribution: 1-9, 10-19, 20-29, etc.
- Each row has exactly 5 numbers

### **🏆 Winning Patterns**
1. **First Line** - Complete the top row
2. **Second Line** - Complete the middle row
3. **Third Line** - Complete the bottom row
4. **Four Corners** - Mark all four corner numbers
5. **Full House** - Mark all 15 numbers (JACKPOT!)

### **🎮 How to Play**
- Numbers are called out randomly
- Numbers are automatically marked on tickets
- Winners are announced immediately
- Game continues until Full House is achieved

## 🛠️ Technical Details

### **Web Version**
- **HTML5** - Modern semantic markup
- **CSS3** - Responsive design with flexbox/grid
- **Vanilla JavaScript** - No external dependencies
- **Local Storage** - No server required

### **Python Version**
- **Python 3.6+** - Compatible with modern Python
- **No dependencies** - Uses only standard library
- **Modular design** - Separate classes for each component

## 🎊 Quick Start

1. **Download/Clone** the project
2. **Open terminal** in the `tambola-game` folder
3. **Run:** `python3 -m http.server 8080`
4. **Open:** `http://localhost:8080` in your browser
5. **Click:** "🎮 New Game" and start playing!

## 🎪 Have Fun!

Enjoy playing Tambola with friends and family! The web interface provides a modern, engaging experience that captures all the excitement of the traditional Indian Housie game.

---
*Made with ❤️ for Tambola enthusiasts everywhere!*

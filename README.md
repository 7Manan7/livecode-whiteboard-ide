# LiveCode Whiteboard IDE

A professional interview software platform with integrated code editor, whiteboard, and video chat capabilities. Built with React, Monaco Editor, Fabric.js, and WebRTC.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff)

## ✨ Features

### 🖥️ Code Editor
- **Multi-language support**: JavaScript, TypeScript, Python, Java, C++
- **Monaco Editor**: VS Code's powerful editor with syntax highlighting
- **Code execution**: Run code directly using Piston API (no backend needed)
- **Output panel**: View execution results in real-time
- **Theme support**: Dark and light themes
- **Auto-completion**: IntelliSense and bracket pair colorization

### 🎨 Whiteboard
- **Drawing tools**: Pencil, shapes (rectangle, circle), text
- **Customization**: Adjustable brush size and color picker
- **Canvas controls**: Clear canvas, undo/redo support
- **Fabric.js powered**: Smooth, responsive drawing experience
- **Professional UI**: Clean toolbar with VS Code-inspired design

### 📹 Video Chat
- **WebRTC integration**: Real-time video and audio
- **Minimizable interface**: Compact, collapsible video window
- **Media controls**: Mute/unmute audio, toggle video on/off
- **Professional design**: Clean, modern video chat interface

### 🎯 User Interface
- **VS Code-inspired design**: Professional dark theme
- **Activity bar**: Quick navigation between tools
- **Responsive layout**: Adapts to different screen sizes
- **Smooth transitions**: Polished animations and hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livecode-whiteboard-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Stop server
```
 netstat -ano | findstr :5000
```

The production-ready files will be in the `dist` directory.

## 📁 File Structure

```
livecode-whiteboard-ide/
├── public/                          # Static assets
├── src/
│   ├── components/                  # React components
│   │   ├── Layout.jsx              # Main layout with activity bar (48px sidebar)
│   │   ├── CodeEditor.jsx          # Monaco-based code editor with execution
│   │   ├── Whiteboard.jsx          # Fabric.js whiteboard with drawing tools
│   │   └── VideoChat.jsx           # WebRTC video chat component
│   ├── App.jsx                     # Root component with state management
│   ├── index.css                   # Global styles and CSS variables
│   └── main.jsx                    # Application entry point
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── eslint.config.js                # ESLint configuration
└── README.md                        # This file
```

### Component Details

#### `src/App.jsx`
- **Purpose**: Root component managing application state
- **State Management**: 
  - `activeTab`: Current view (IDE or Whiteboard)
  - `code`: Editor content (persists across tab switches)
  - `language`: Selected programming language
- **Routing**: Conditional rendering of CodeEditor or Whiteboard

#### `src/components/Layout.jsx`
- **Purpose**: Main application layout with navigation
- **Features**:
  - 48px activity bar (sidebar) with tool icons
  - Hover tooltips for navigation items
  - Active state indicators with gradient
  - Professional VS Code-inspired design
- **Props**: `activeTab`, `setActiveTab`, `children`

#### `src/components/CodeEditor.jsx`
- **Purpose**: Code editing and execution interface
- **Features**:
  - Monaco Editor integration
  - Multi-language support (5 languages)
  - Code execution via Piston API
  - Output panel with close functionality
  - Theme switching (dark/light)
- **Props**: `code`, `setCode`, `language`, `setLanguage`
- **State**: `theme`, `output`, `isRunning`, `showOutput`

#### `src/components/Whiteboard.jsx`
- **Purpose**: Interactive drawing canvas
- **Features**:
  - Fabric.js canvas (full screen minus 48px sidebar)
  - Drawing tools: pencil, rectangle, circle, text
  - Color picker and brush size controls
  - Clear canvas functionality
  - Professional toolbar (35px height)
- **State**: `activeTool`, `color`, `brushSize`

#### `src/components/VideoChat.jsx`
- **Purpose**: Video conferencing interface
- **Features**:
  - WebRTC media stream handling
  - Minimize/maximize functionality
  - Audio/video toggle controls
  - Compact design (320px width when expanded)
  - Fixed bottom-right positioning
- **State**: `stream`, `isMuted`, `isVideoOff`, `isMinimized`

#### `src/index.css`
- **Purpose**: Global styles and design system
- **CSS Variables**:
  - `--bg-primary`: #1e1e1e (main background)
  - `--bg-secondary`: #252526 (secondary background)
  - `--accent-blue`: #007acc (primary accent)
  - `--text-primary`: #cccccc (main text)
  - Custom scrollbar styling
  - Professional color palette

## 🛠️ Technologies Used

### Core
- **React 18.3.1**: UI framework
- **Vite 7.2.4**: Build tool and dev server
- **JavaScript**: Primary language

### Editor
- **@monaco-editor/react 4.6.0**: Code editor component
- **Monaco Editor**: VS Code's editor engine

### Whiteboard
- **Fabric.js 6.5.2**: Canvas manipulation library

### UI & Icons
- **Lucide React 0.468.0**: Modern icon library
- **Tailwind CSS 3.4.17**: Utility-first CSS framework

### Code Execution
- **Piston API**: Free online code execution service
  - Endpoint: `https://emkc.org/api/v2/piston/execute`
  - Supports: JavaScript, TypeScript, Python, Java, C++

### Video Chat
- **WebRTC**: Browser-native video/audio streaming
- **MediaDevices API**: Camera and microphone access

## 🎨 Design System

### Color Palette
```css
--bg-primary: #1e1e1e       /* Main background */
--bg-secondary: #252526     /* Toolbar background */
--bg-tertiary: #2d2d30      /* Elevated elements */
--accent-blue: #007acc      /* Primary accent */
--accent-green: #16a34a     /* Success/Run button */
--text-primary: #cccccc     /* Main text */
--text-secondary: #858585   /* Secondary text */
--border-subtle: #3e3e42    /* Borders */
```

### Typography
- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'
- **Code Font**: 'Cascadia Code', 'Fira Code', 'Consolas', monospace
- **Base Size**: 13px
- **Line Height**: 1.5

### Spacing
- **Activity Bar**: 48px width
- **Toolbar Height**: 35px
- **Padding**: 16px standard, 12px compact
- **Gap**: 8px standard, 4px tight

## 🔧 Configuration

### Vite Configuration (`vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

### Supported Languages
| Language   | Version  | Piston ID  |
|------------|----------|------------|
| JavaScript | 18.15.0  | javascript |
| TypeScript | 5.0.3    | typescript |
| Python     | 3.10.0   | python     |
| Java       | 15.0.2   | java       |
| C++        | 10.2.0   | cpp        |

## 📝 Usage

### Code Editor
1. Select a programming language from the dropdown
2. Write your code in the Monaco editor
3. Click "Run Code" to execute
4. View output in the panel below

### Whiteboard
1. Click the whiteboard icon in the activity bar
2. Select a tool (pencil, shapes, text)
3. Choose color and brush size
4. Draw on the canvas
5. Use "Clear" to reset

### Video Chat
1. Allow camera/microphone permissions
2. Video chat appears in bottom-right corner
3. Click minimize to collapse to a button
4. Click the button to restore
5. Use controls to mute/unmute or toggle video

## 🚧 Future Enhancements

- [ ] Real-time collaboration (WebSocket sync)
- [ ] WebRTC signaling server for peer-to-peer connections
- [ ] Save/load code sessions
- [ ] Export whiteboard as image
- [ ] Multiple whiteboard pages
- [ ] Code snippets library
- [ ] Screen sharing
- [ ] Chat messaging
- [ ] Session recording

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Monaco Editor**: Microsoft's VS Code editor
- **Fabric.js**: HTML5 canvas library
- **Piston API**: Free code execution service
- **Lucide**: Beautiful icon library
- **Tailwind CSS**: Utility-first CSS framework

---

**Built with ❤️ for seamless technical interviews**
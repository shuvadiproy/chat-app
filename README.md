# 💬 Sanjog - Real-Time Chat Application

A full-featured real-time chat application built with the **MERN stack**, featuring instant messaging, online presence, media sharing, AI-powered chat summarization, and beautiful UI with **32 theme options**.

🚀 **Live Demo:** [https://chat-app-o31d.onrender.com](https://chat-app-o31d.onrender.com)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based secure login/signup with bcrypt password hashing |
| 💬 **Real-time Messaging** | Instant message delivery using Socket.io |
| 🟢 **Online Status** | See who's online in real-time |
| 🖼️ **Image Sharing** | Share images via Cloudinary integration |
| 🤖 **AI Chat Summary** | Summarize conversations using Groq AI (Llama 3.3) |
| 🎨 **32 Themes** | Customizable UI with DaisyUI themes |
| 👤 **User Profiles** | Upload profile pictures and manage account |
| ✨ **Modern UI** | Particles effect, gradient icons, responsive design |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **Socket.io** | Real-time bidirectional communication |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Image storage and CDN |
| **Groq SDK** | AI-powered features (Llama 3.3 model) |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **TailwindCSS** | Utility-first CSS framework |
| **DaisyUI** | Component library with themes |
| **Zustand** | State management |
| **Socket.io-client** | Real-time client |
| **Axios** | HTTP client |
| **React Router v6** | Client-side routing |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

---

## 📁 Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.controller.js    # Login, signup, logout
│   │   │   └── message.controller.js # Messages, summarization
│   │   ├── lib/              # Utilities
│   │   │   ├── db.js         # MongoDB connection
│   │   │   ├── socket.js     # Socket.io setup
│   │   │   ├── cloudinary.js # Image upload config
│   │   │   ├── groq.js       # AI (Groq) configuration
│   │   │   └── utils.js      # JWT token generation
│   │   ├── middleware/
│   │   │   └── auth.middleware.js  # JWT verification
│   │   ├── models/
│   │   │   ├── user.model.js     # User schema
│   │   │   └── message.model.js  # Message schema
│   │   ├── routes/
│   │   │   ├── auth.route.js     # Auth endpoints
│   │   │   └── message.route.js  # Message endpoints
│   │   └── index.js          # Server entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── Sidebar.jsx       # User list sidebar
│   │   │   ├── ChatContainer.jsx # Main chat area
│   │   │   ├── ChatHeader.jsx    # Chat header with actions
│   │   │   ├── MessageInput.jsx  # Message input with image upload
│   │   │   ├── SummaryModal.jsx  # AI summary modal
│   │   │   ├── NoChatSelected.jsx # Empty state
│   │   │   └── AuthImagePattern.jsx # Particles animation
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Main chat page
│   │   │   ├── LoginPage.jsx     # Login form
│   │   │   ├── SignUpPage.jsx    # Registration form
│   │   │   ├── ProfilePage.jsx   # User profile
│   │   │   └── SettingsPage.jsx  # Theme selector
│   │   ├── store/            # Zustand state management
│   │   │   ├── useAuthStore.js   # Auth state
│   │   │   ├── useChatStore.js   # Chat state
│   │   │   └── useThemeStore.js  # Theme state
│   │   ├── lib/
│   │   │   ├── axios.js      # Axios instance
│   │   │   └── utils.js      # Helper functions
│   │   ├── App.jsx           # Main app with routes
│   │   └── main.jsx          # React entry point
│   ├── tailwind.config.js    # Tailwind + DaisyUI config
│   └── package.json
│
├── start.sh                  # Script to start both servers
└── README.md                 # This file
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String,        // Unique, required
  fullName: String,     // Required
  password: String,     // Hashed, min 6 chars
  profilePic: String,   // Cloudinary URL
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  senderId: ObjectId,   // Reference to User
  receiverId: ObjectId, // Reference to User
  text: String,         // Message content
  image: String,        // Cloudinary URL (optional)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |
| PUT | `/update-profile` | Update profile picture |
| GET | `/check` | Check auth status |

### Messages (`/api/messages`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users for sidebar |
| GET | `/:id` | Get messages with specific user |
| POST | `/send/:id` | Send message to user |
| GET | `/summarize/:id` | AI-summarize chat with user |

---

## 🔄 Real-Time Architecture (Socket.io)

```
┌─────────────────┐                    ┌─────────────────┐
│   Frontend      │                    │   Backend       │
│   (React)       │                    │   (Express)     │
├─────────────────┤                    ├─────────────────┤
│                 │   WebSocket        │                 │
│  socket.io      │◄──────────────────►│  socket.io      │
│  client         │                    │  server         │
│                 │                    │                 │
│  Events:        │                    │  Events:        │
│  - newMessage   │◄───────────────────│  - emit to      │
│  - getOnline    │                    │    specific     │
│    Users        │                    │    user socket  │
└─────────────────┘                    └─────────────────┘

Flow:
1. User connects → Server stores socket ID with user ID
2. User sends message → Server saves to DB → Emits to receiver's socket
3. User disconnects → Server removes from online users map
```

### Key Socket Events:
- `connection` - User connects, joins with their user ID
- `disconnect` - User disconnects, removed from online list
- `newMessage` - Real-time message delivery to recipient
- `getOnlineUsers` - Broadcast updated online users list

---

## 🤖 AI Integration (Groq)

The app uses **Groq's Llama 3.3-70b-versatile** model for chat summarization.

### How It Works:
```
1. User clicks "Summarize" button in chat header
2. Backend fetches last 50 messages
3. Formats messages and sends to Groq API
4. AI generates bullet-point summary
5. Summary displayed in modal with copy option
```

### API Prompt:
```
Summarize the chat conversation in 3-5 bullet points:
- Key topics discussed
- Decisions made
- Action items mentioned
- Important dates/times
```

---

## 🎨 Theming System

DaisyUI provides **32 pre-built themes** that can be switched in Settings:

| Light Themes | Dark Themes | Special Themes |
|--------------|-------------|----------------|
| light, cupcake, bumblebee | dark, synthwave, halloween | cyberpunk, valentine |
| emerald, corporate, garden | forest, black, luxury | retro, aqua, lofi |

**Theme switching is persistent** using Zustand + localStorage.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Groq API key (free at console.groq.com)

### Environment Variables
Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
GROQ_API_KEY=gsk_your_groq_api_key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chat-app.git
cd chat-app

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Start development servers
cd ..
./start.sh
```

### Access the App
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

---

## 📦 Deployment

### Production Build
```bash
cd frontend
npm run build
```

### Deploy to Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set environment variables
4. Build command: `npm install && cd frontend && npm install && npm run build`
5. Start command: `cd backend && npm start`

---

## 🔒 Security Features

1. **Password Hashing** - bcryptjs with salt rounds
2. **JWT Authentication** - Secure token-based auth
3. **HTTP-Only Cookies** - Prevents XSS attacks
4. **CORS Configuration** - Restricted origins
5. **Protected Routes** - Middleware verification

---

## 📱 Key Features Explained

### 1. Real-Time Messaging
- Messages sent via Socket.io for instant delivery
- No page refresh needed
- Typing indicators possible (future feature)

### 2. Online Status
- Server tracks active socket connections
- Online users list broadcast to all clients
- Green indicator shown next to online users

### 3. Image Sharing
- Images uploaded to Cloudinary
- Base64 encoding for preview
- CDN delivery for fast loading

### 4. AI Summarization
- Uses Groq's fast inference
- Summarizes last 50 messages
- Fallback to demo mode if API fails

---

## 🎯 Interview Q&A

### Q: Why MERN stack?
**A:** MERN (MongoDB, Express, React, Node) provides a unified JavaScript ecosystem, making development faster with shared language across stack. MongoDB's flexible schema suits chat data well.

### Q: Why Socket.io over WebSockets?
**A:** Socket.io provides automatic reconnection, fallback to polling, room management, and easier event handling. It's more robust for production.

### Q: How do you handle auth?
**A:** JWT tokens stored in HTTP-only cookies. Server validates token on each request via middleware. Passwords hashed with bcrypt.

### Q: Why Zustand over Redux?
**A:** Zustand is simpler, has less boilerplate, and is more performant for small-medium apps. It's also easier to learn and maintain.

### Q: How is the AI feature implemented?
**A:** Backend fetches recent messages, formats them into a prompt, sends to Groq API (Llama 3.3 model), and returns the AI-generated summary.

### Q: How do you handle real-time updates?
**A:** Socket.io maintains persistent connections. On message send, server saves to DB then emits to recipient's socket. Client updates UI immediately.

---

## 🔧 Future Enhancements

- [ ] Smart Reply Suggestions
- [ ] Message Reactions (Emoji)  
- [ ] Typing Indicators
- [ ] Group Chats
- [ ] Message Search
- [ ] Voice Messages
- [ ] Message Translation

---

## 👨‍💻 Author

**Shuvadip Roy**

---

## 📄 License

MIT License - feel free to use this project for learning and development.

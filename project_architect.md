# Build an Impostor Project (Online Game)

## Technical Architecture: Impostor Game

This document outlines the technical architecture for a real-time, turn-based, word-based social deduction game. This design is server-authoritative to manage game logic and prevent cheating, using WebSockets for real-time communication.

---

## 1. High-Level Overview

The application follows a **client-server model**:

- **Client (Frontend)**: A web application Next.js. It handles user interface, renders the game state, and sends user actions to the server.

- **Server (Backend)**: A Node.js application responsible for all game logic, state management, and real-time communication via Socket.IO.

- **Database**: A document database (like MongoDB) used to store the "word bank" (categories and associated keywords).

---

## 2. Core Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js |
| **Backend** | Node.js with Express |
| **Real-time Communication** | Socket.IO |
| **Database** | MongoDB (or PostgreSQL) |

---

## 3. Frontend (Client-side Architecture)

The frontend is a **NextJS Project** responsible only for rendering the UI based on state received from the server. It should **not** contain any game logic (e.g., determining the winner, managing turns).

### Key Components

#### `Lobby.js`
- **UI**: Shows "Create Room" and "Join Room" (with Room ID input)
- **State**: Manages `username`, `roomId`
- **Function**: Connects to the Socket.IO server on mount

#### `Room.js`
- **UI**: Displays the list of connected players (`playerList`). Shows a "Start Game" button (visible only to the room host)
- **State**: `playerList`, `isHost`
- **Function**: Emits `startGame` event when the host clicks the button

#### `GameScreen.js` (Main container)
- **UI**: Manages the overall game layout. Conditionally renders child components based on the `gameState`
- **State**: `gameState` (e.g., `'PLAYING'`, `'VOTING'`, `'RESULT'`), `currentTurn`, `round`, `wordHistory`

#### `RoleDisplay.js`
- **UI**: Displays the private information sent to this client
- **Logic**:
  - If `role === 'crewmate'`: "You are a Crewmate. The category is: Animals. The keyword is: Penguin."
  - If `role === 'impostor'`: "You are the Impostor. The category is: Animals."

#### `WordHistory.js`
- **UI**: Renders a list of all words said, e.g.:
  ```
  Round 1:
    Alice: "swim"
    Bob: "cold"
  ```

#### `InputBox.js`
- **UI**: A text input and "Submit" button
- **Logic**: The component is only enabled (`disabled=false`) if the `currentTurnId` received from the server matches the client's own `socket.id`
- **Function**: Emits `submitWord` with the word value

#### `VotingScreen.js`
- **UI**: Displays a button for each player (except oneself)
- **Function**: Emits `castVote` with the `playerId` of the voted player

#### `ResultsScreen.js`
- **UI**: Shows who was voted out, their role ("Alice was the Impostor!"), and the winning team ("Crewmates Win!"). Provides a "Play Again" button

---

## 4. Backend (Server-side Architecture)

The backend is the **single source of truth**. All game logic is processed here.

### Server (Node.js + Express + Socket.IO)

- **Express**: Used to serve the static frontend app
- **Socket.IO**: Handles all real-time game events

### Core Logic & State Management

#### Room Management
The server uses Socket.IO Rooms to manage game instances. A `gameInstances` object will map `roomId` to its game state.

#### Game State Machine
The server manages the game flow for each room:

| State | Description |
|-------|-------------|
| **LOBBY** | Waiting for players |
| **STARTING** | When host starts. Server fetches a word, assigns roles |
| **PLAYING** | Server manages turns and rounds |
| **VOTING** | After all rounds, server triggers the voting phase |
| **RESULT** | Server calculates votes and determines the winner |

#### Turn Management
The server maintains an array of player IDs in turn order and an index for the `currentPlayer`.

#### Role & Word Assignment (Authoritative)
On `startGame`, the server:
1. Fetches one random category and one random keyword from the DB
2. Randomly selects one `socket.id` in the room to be the Impostor
3. Emits individually to each socket their role:

```javascript
io.to(impostorSocketId).emit('gameStart', { role: 'impostor', category: '...' });
socket.broadcast.to(roomId).emit('gameStart', { role: 'crewmate', category: '...', keyword: '...' });
```
*(Emits to everyone else in the room)*

---

## 5. Database (Persistence)

The database's only role is to store the content for the game.

### Collection: `wordbanks`

**Schema (MongoDB Example)**: A collection where each document represents a category.

```json
{
  "category": "Animals",
  "keywords": ["Penguin", "Elephant", "Kangaroo", "Whale", "Dolphin"]
},
{
  "category": "Sports",
  "keywords": ["Goalkeeper", "Basketball", "Touchdown", "Homerun", "Referee"]
},
{
  "category": "Jobs",
  "keywords": ["Doctor", "Programmer", "Teacher", "Chef", "Firefighter"]
}
```

---

## 6. Real-time Communication (Socket.IO Events)

This defines the API contract between the client and server.

### Client-to-Server (C2S) Events

| Event | Payload | Description |
|-------|---------|-------------|
| `createRoom` | `{ username }` | Asks the server to create a new room. Server replies with `roomCreated({ roomId })` |
| `joinRoom` | `{ username, roomId }` | Asks to join an existing room. Server replies with success or failure |
| `startGame` | - | Sent by the room host to begin the game |
| `submitWord` | `{ word }` | Sent by the player whose turn it is |
| `castVote` | `{ votedPlayerId }` | Sent by a player during the voting phase |
| `playAgain` | - | Sent after a game ends to return to the lobby |

### Server-to-Client (S2C) Events

| Event | Payload | Description |
|-------|---------|-------------|
| `roomUpdate` | `{ players }` | Broadcast to all in-room when a player joins or leaves |
| `gameStart` | `{ role, category, keyword? }` | Sent individually to each client with their private role |
| `nextTurn` | `{ playerId, round }` | Broadcast to all. The client with `playerId` enables their input |
| `wordHistoryUpdate` | `{ player, word }` | Broadcast to all so they can update their word history UI |
| `startVoting` | - | Broadcast to all to switch the UI to the VotingScreen |
| `gameResult` | `{ votedPlayer, role, winner }` | Broadcast to all with the game's outcome |
| `error` | `{ message }` | Sent to a client if they perform an invalid action (e.g., submit a word when it's not their turn) |
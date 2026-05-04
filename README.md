# Synq

A real-time messaging and video calling app built with React and Firebase.  
Try it live → **https://ms-teams-b465g.web.app**

---

## What can you do with Synq?

- **Chat** — send instant messages to anyone who has a Synq account
- **Video call** — one-click HD video calls with echo cancellation
- **Find people** — search for any registered user and start a conversation
- **Themes** — switch between Violet Night, Indigo Slate, and Clean Light from the chat header

---

## Getting started

### 1. Create an account
Go to the app and click **Get started**. Enter your first name, last name, email, and a password. Hit **Create Account**.

### 2. Sign in
Click **Sign in**, enter your email and password, and you're in.  
Forgot your password? Click **Forgot password?** on the sign-in screen — we'll email you a reset link.

### 3. Find someone to chat with
Use the **search bar** at the top of the chat screen to search for another user by their email address. Click their name to add them to your contacts list.

### 4. Send a message
Click on any contact from the left panel to open the conversation. Type in the box at the bottom and press **Enter** or the send button.

### 5. Start a video call
Open a conversation, then click the **Video Call** button in the top-right of the chat panel. The other person will receive an incoming call notification and can accept or decline. Both of you need to be signed in for the call to connect.

### 6. During a call
| Button | What it does |
|--------|-------------|
| 🎥 Camera | Toggle your video on/off |
| 🎤 Mic | Mute/unmute yourself |
| 🔴 End call | Hang up and return to chat |

---

## Running locally

> You need Node.js 16+ and a Firebase project with Authentication and Firestore enabled.

```bash
git clone https://github.com/aryan465/ms-teams.git
cd ms-teams
npm install
```

Copy `.env.example` to `.env` and fill in your Firebase project credentials:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

Then start the dev server:

```bash
npm start
```

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| UI | MUI v5, CSS Variables (custom theme system) |
| Auth | Firebase Authentication |
| Database | Cloud Firestore (real-time) |
| Video | WebRTC — STUN + TURN relay via OpenRelay |
| Hosting | Firebase Hosting |

---

## Releases

| Tag | Description |
|-----|-------------|
| `v1.0` | Original Dec 2021 prototype |
| `v2.0` | Full rebrand to Synq — theme system, new auth flow, video call improvements |

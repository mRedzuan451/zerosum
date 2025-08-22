# Zero Sum

> A sleek, fast-paced digital card game where strategy and arithmetic collide in a high-tech showdown.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Status: In Development](https://img.shields.io/badge/status-in%20development-green.svg)

**Zero Sum** is a digital card game for 2-8 players. Participants use number and operator cards to form equations that get as close as possible to a target number. The game features a unique, simultaneous "Showdown" mechanic and a sleek "Neon Cypher" aesthetic.

---

## Table of Contents

- [About the Game](#about-the-game)
- [Key Features](#key-features)
- [Gameplay & Rules](#gameplay--rules)
  - [Core Mechanics](#core-mechanics)
  - [Game Modes](#game-modes)
  - [Player Actions](#player-actions)
- [Game Flow & Screens](#game-flow--screens)
- [Suggested Tech Stack](#suggested-tech-stack)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

---

## About the Game

Welcome to the **Neon Cypher**, the digital matrix where **Zero Sum** takes place. This game is designed for thinkers, risk-takers, and puzzle-solvers. The goal is simple: use your hand of number and operator cards to create an equation that gets you as close as possible to the target. It's easy to learn, but only the sharpest mind will be crowned **The Grand Calculator**.

## Key Features

* **Two Distinct Game Modes:** A simple **Junior Mode** for beginners and a deeply strategic **Pro Mode** for experts.
* **Unique "Showdown" Mechanic:** No waiting for long turns! All players reveal their equations simultaneously in a tense, competitive showdown.
* **Engaging Player Actions:** Go beyond just playing cards. **Recalculate** your hand to chase the perfect score.
* **Sleek "Neon Cypher" Theme:** Immerse yourself in a cool, high-tech world of glowing visuals, smooth animations, and a modern UI.
* **Multiplayer Focus:** Play in a quick match with randoms or set up a private room to challenge your friends.

---

## Gameplay & Rules

### Core Mechanics

* **The Deck:** A standard 52-card deck is re-purposed:
    * Aces = **1**
    * 2-10 = **Face value**
    * J, Q, K = Operators **`+`**, **`-`**, **`×`**
* **The Goal:** Be the first player to score **5 points**.
* **Scoring:**
    * The player closest to the target in a **Showdown** wins **1 point**.
    * A tie (**Shared Victory**) results in all winners getting **1 point**.
    * An exact match (**Perfect Calculation**) wins **2 points**.

### Game Modes

The game mode is selected by the host in the game lobby.

#### Junior Mode
* **Target Number:** Generated from a random 3-card equation (e.g., `5 x 4 = 20`).
* **Gameplay:** Players can only play a simple 3-card equation (`Number-Operator-Number`).

#### Pro Mode
* **Target Number:** Generated from two flipped cards to form a 2-digit number (e.g., a 5 and a 2 is **52**).
* **Equation Chaining:** Players can use any number of cards from their hand to form a complex equation. Standard order of operations applies.
* **Strategic Grouping:** Players can group one `+` or `-` operation to have it calculate first.
* **Scavenging:** Players can choose to draw the top card from the discard pile instead of the deck.
* **Master Equation Bonus:** Win a round using 5 or more cards to score **+1 bonus point**.

### Player Actions (Per Turn)

1.  **Draw:** The player draws 1 card (or Scavenges in Pro Mode).
2.  **Choose an Action:**
    * **Commit:** Place cards face-down for the **Showdown**.
    * **Pass:** Discard 1 card and do not compete in the round.
    * **Recalculate:** Discard 2 cards to draw 1 new card, then must either Commit or Pass.

---

## Game Flow & Screens

The user journey is designed to be sleek and intuitive.

1.  **Splash Page:** Animated logo and entry point.
2.  **Main Menu:** Hub for navigation ([Quick Play], [Play with Friends], [How to Play], [Settings]).
3.  **Game Lobby:** Players gather, the host selects the game mode, and the game begins.
4.  **Game Table:** The main interactive screen where the gameplay loop occurs.
5.  **Victory Screen:** A celebratory screen crowning **The Grand Calculator** and showing final scores.

---

## Suggested Tech Stack

This project is well-suited for a modern web development stack.

* **Frontend:** `React`, `Vue`, or `Svelte` for a dynamic and responsive user interface.
* **Backend:** `Node.js` with `Express` for the server framework.
* **Real-time Communication:** `Socket.IO` or `WebSockets` for managing multiplayer game state.
* **Database:** `PostgreSQL` or `MongoDB` for storing user profiles and game stats.
* **Deployment:** `Vercel`, `Netlify`, or `AWS`.

---

## Installation

Instructions on how to clone the repository and set up the project locally will be added here.

1.  Clone the repo: `git clone https://github.com/your-username/zero-sum.git`
2.  Install NPM packages: `npm install`
3.  Start the development server: `npm run dev`

---

## Contributing

Contributions are welcome! Please read the contributing guidelines (to be created) before submitting a pull request.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

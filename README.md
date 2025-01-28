# ScribeAI
![image](https://github.com/user-attachments/assets/626855f3-3850-48cd-b025-35a8e9299a1e)

## Overview

`ScribeAI` is a full-stack project that utilizes React JS for the frontend and Firebase for the backend. This application provides a platform for users to register, authenticate, and manage documents with the help of AI. Users can either chat with ScribeAI or select a portion of text in a document to have it analyzed by the AI.

## Features

- **Account Registration & Authentication**: Users can create an account and log in using email/password or Google Sign-In.
- **Real-Time Document Editing**: Documents can be edited with changes automatically saved in real time.
- **Public Sharing**: Users have the option to make their documents publicly accessible.
- **Artificial Intelligence**: Users can access the ScribeAI chatbot via the chat button below the document page or by highlighting text and tapping the button that appears for AI to analyze text.

## Tech Stack

- **Frontend**: React JS
- **Backend**: Firebase
- **Authentication**: Firebase Authentication, Google Sign-In API
- **Database**: Firebase Firestore (for storing and retrieving documents)
- **API**: Gemini API for Artificial Intelligence

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/react-docs.git
    cd react-docs
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up Firebase:

    - Create a Firebase project and obtain your Firebase configuration details.
    - Add your Firebase configuration to the `src/firebase.js` file.

4. Start the development server:

    ```bash
    npm start
    ```

5. Open `http://localhost:3000` in your browser to access the application.

## Usage

- **Registration & Authentication**:
  - Users can register with their email and password or log in using Google Sign-In.
  
- **Document Management**:
  - Create and edit documents with automatic saving.
  - Highlight text and double-tap the button that appears for AI access.
  - Toggle the visibility of documents between public and private.

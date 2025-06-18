# SciDev WebApp

A modern web application built with Next.js and Python FastAPI.

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- shadcn/ui
- Firebase (Auth, Storage, Hosting)

### Backend
- Python 3.11+
- FastAPI
- Firebase Admin SDK
- Uvicorn

## Prerequisites

1. Node.js 18+ and npm
2. Python 3.11+
3. Firebase account and project
4. Git

## Setup Instructions

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On Unix/MacOS
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your configuration:
   ```
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   FIREBASE_PROJECT_ID=your-project-id
   API_HOST=0.0.0.0
   API_PORT=8000
   ```

5. Download your Firebase service account key and save it as `serviceAccountKey.json` in the backend directory

6. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

## Development

- Frontend runs on http://localhost:3000
- Backend API runs on http://localhost:8000
- API documentation available at http://localhost:8000/docs

## Deployment

The application is configured for deployment using Firebase Hosting and Firebase Functions.

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## License

MIT

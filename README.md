
# VIPS Community Web App

A full-stack web application for the VIPS community, built with React (Vite) for the frontend and Node.js/Express for the backend. The app provides authentication, member profiles, events, and more.

## Features

- User authentication (signup, login, password reset)
- Member profiles and dashboard
- Events and announcements
- Community sections
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose, Nodemailer
- **Environment:** .env files for configuration

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Environment Variables

#### Client (`client/.env`)
```
VITE_SERVER_URL=http://localhost:5000
VITE_CLIENT_URL=http://localhost:5173
```

#### Server (`server/.env`)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Installation

#### 1. Clone the repository
```sh
git clone https://github.com/yourusername/vips-community-web-app.git
cd VIPS_COMMUNITY_WEB_APP
```

#### 2. Install dependencies

**Client:**
```sh
cd client
npm install
```

**Server:**
```sh
cd ../server
npm install
```

#### 3. Set up environment variables

- Copy `.env.example` to `.env` in both `client` and `server` folders and fill in your values.

#### 4. Start the development servers

**Server:**
```sh
npm run server
```

**Client:**
```sh
npm run dev
```

The client will run on [http://localhost:5173](http://localhost:5173) and the server on [http://localhost:5000](http://localhost:5000) by default.

## Folder Structure

```
VIPS_COMMUNITY_WEB_APP/
	client/      # React frontend
	server/      # Node.js/Express backend
```

## Scripts

**Client:**
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

**Server:**
- `npm run server` - Start backend with nodemon

## License

MIT

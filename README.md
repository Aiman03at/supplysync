# supplysync# ⚡ SupplySync

Real-time supply chain visibility platform.

## Tech Stack
- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express
- **Real-Time:** Socket.io
- **Database:** PostgreSQL
- **AI/ML:** Python + FastAPI
- **DevOps:** GitHub Actions + Docker

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Python 3.11+

### Setup
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/supplysync.git
cd supplysync

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Set up environment variables
cp .env.example .env
```

## Project Structure
```
supplysync/
├── client/       # React frontend
├── server/       # Node/Express API
└── ml-service/   # Python FastAPI
```

# MetricFlow

A real-time API monitoring platform that tracks endpoint health, detects anomalies, and sends automated alerts.

## What it does

MetricFlow monitors your APIs by pinging them every 30 seconds and collecting performance metrics like response time and uptime. It uses statistical analysis to detect unusual behavior and sends notifications when something goes wrong.

The dashboard shows live metrics with charts, historical trends, and alert summaries. Each organization can monitor up to five API endpoints.

## Why I built this

I wanted to learn how to build a production-grade monitoring system from scratch. This project pushed me to explore cron job orchestration, time-series data modeling, and multi-tenant architecture design.

## Tech stack

### Backend
- Node.js with Express  
- MongoDB for time-series storage  
- JWT authentication  
- node-cron for scheduled tasks  
- PDFKit for report generation  

### Frontend
- React 18 with Vite  
- Tailwind CSS  
- Chart.js for visualizations  
- Axios for API communication  

### Deployment
- Frontend on Vercel  
- Backend on Render  
- MongoDB Atlas (free tier)  

## Features

### Core monitoring
- Polls endpoints every 30 seconds  
- Tracks response time, status codes, uptime  
- Stores 30 days of data  
- Supports GET and POST requests  

### Anomaly detection
- Statistical analysis every minute  
- Mean + standard deviation (2σ warning, 3σ critical)  
- Compares against a 7-day baseline  
- Auto-generates alerts  

### Automated reporting
- Daily PDF reports (midnight)  
- Includes summary metrics and alert counts  
- Delivered via Discord webhooks  
- Shows performance trends  

### Multi-tenant design
- Organization-level isolation  
- Up to five endpoints per org  
- Secure JWT-based auth  
- Users belong to organizations  

## How to run locally

### Prerequisites
- Node.js 18+  
- MongoDB (Atlas or local)  
- npm or yarn  

### Setup

Clone and install dependencies:

```bash
git clone https://github.com/yourusername/metricflow.git
cd metricflow
```

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd ../client
npm install
```

### Environment variables

Create `.env` in `server/`:

```env
MONGO_URI=mongodb://localhost:27017/metricflow
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
DISCORD_WEBHOOK_URL=your-webhook-url
```

Create `.env` in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Start the app

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

Visit: `http://localhost:5173`

## Project structure

```
metricflow/
├── client/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Login, Register, Dashboard
│   │   ├── context/      # Auth context
│   │   └── utils/        # API client + helpers
│   └── package.json
├── server/
│   ├── config/           # DB connection
│   ├── controllers/      # Route handlers
│   ├── jobs/             # Cron schedulers
│   ├── middleware/       # Auth + rate limiting
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── server.js         # Entry point
└── README.md
```

## API endpoints

```
POST   /api/auth/register           Create account
POST   /api/auth/login              Login
GET    /api/metrics                 Get metrics (?hours=)
GET    /api/metrics/latest          Latest metric values
GET    /api/alerts                  Recent alerts
POST   /api/endpoints               Add monitored endpoint
DELETE /api/endpoints/:id           Remove endpoint
PATCH  /api/endpoints/:id/toggle    Enable/disable monitoring
```

## How it works

### Data collection
Four cron jobs run continuously:

1. Metric simulator (every 30s)  
2. API monitor (every 30s)  
3. Anomaly detector (every 1 min)  
4. Daily reporter (midnight)  

### Anomaly detection algorithm

```js
mean = average(all_values)
stdDev = standardDeviation(all_values)

if (value > mean + 2 * stdDev) warning
if (value > mean + 3 * stdDev) critical
```

This captures abnormal spikes without requiring manual thresholds.

### Data retention
A cleanup job removes metrics older than 30 days to stay within the 512 MB Atlas free-tier limit.

## Deployment

### Backend (Render)
1. Push code to GitHub  
2. Create a Web Service  
3. Set root directory to `server`  
4. Add env variables  
5. Deploy  

### Frontend (Vercel)
1. Import the repo  
2. Set root to `client`  
3. Add `VITE_API_URL`  
4. Deploy  

### Keep-alive
Using cron-job.org to ping `/api/health` every 10 minutes prevents Render from sleeping.

## Challenges I faced

**Time-series modeling**  
Originally used a flat collection, which slowed queries. Indexing by `orgId` and `timestamp` improved performance significantly.

**Cron coordination**  
Some jobs overlapped, creating duplicate entries. Execution locks resolved the issue.

**Frontend state management**  
The dashboard was polling too often. A 5‑second interval with caching balanced accuracy and load.

## What I learned

- Full-stack app deployment workflow  
- Working with time-series data  
- Background job orchestration  
- Multi-tenant schema design  
- Applying basic statistics to anomaly detection  
- Real‑time dashboards with Chart.js  

## Future improvements

- Slack integration  
- Custom thresholds per endpoint  
- Webhook delivery for alerts  
- CSV export for historical data  
- More HTTP method support  
- Mobile-responsive alert dashboard  

## Live demo

Frontend: https://metric-flow-sigma.vercel.app  
Backend: https://metricflow.onrender.com  

## License

MIT License

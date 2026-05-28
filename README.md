# Elderly Fall Risk Monitoring Dashboard

Production-ready Next.js 14 dashboard for an AI-powered smart elderly wellness system inside a condominium room.

## What It Includes

- Interactive SVG condo floorplan for Bedroom, Bathroom, Kitchen, Living Room, and Hallway
- Animated walking trails, heatmap intensity, high-risk zones, and near-fall markers
- Real-time simulated sensor stream for IMU values: `ax`, `ay`, `az`, `gx`, `gy`, `gz`
- Mock AI pipeline: sensor stream -> feature extraction -> inference -> dashboard
- Dynamic fall-risk, stability, sway, cadence, speed, and turning instability metrics
- AI insight cards for abnormal gait, fatigue, bathroom risk, and nighttime instability
- Caregiver alert system with severity tags: low, medium, high, emergency
- Analytics dashboards using Recharts
- Historical playback timeline for room replay
- Dark and light mode
- Vercel-compatible frontend-only architecture

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style reusable primitives
- Framer Motion
- Recharts
- Zustand
- Custom SVG floorplan visualization

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Vercel Deployment

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Keep the default framework preset as `Next.js`.
4. Use:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `.next`
5. Deploy.

No backend, database, or environment variables are required.

## Folder Structure

```text
app/                  Next.js App Router pages
components/           Reusable dashboard, chart, floorplan, and UI components
components/ui/        shadcn/ui-style primitives
data/                 Mock JSON sensor readings
lib/                  Types, utilities, and mock AI inference engine
store/                Zustand real-time monitoring store
```

## Data Schema

```json
{
  "timestamp": "2026-05-27T21:18:00+07:00",
  "room": "Bathroom",
  "gait_speed": 0.49,
  "sway": 0.84,
  "cadence": 78,
  "turning_velocity": 101,
  "instability_score": 89,
  "fall_risk": 92,
  "near_fall": true,
  "ax": 0.33,
  "ay": -0.48,
  "az": 1.16,
  "gx": 1.02,
  "gy": -0.64,
  "gz": 0.51
}
```

## Mock Prediction Logic

Risk scores are generated from gait speed, sway amplitude, gait variability, turning velocity, room hazard bias, nighttime movement, and near-fall events. Bathroom and hallway transitions intentionally receive higher risk weighting because those zones commonly include turning, thresholds, wet floors, and low-light activity.

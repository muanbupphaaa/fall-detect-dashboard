# Dulae

A production-ready mock web application for AI-powered ambient wellness monitoring inside a condominium. It uses a real SVG condo-style floorplan, simulated IMU sensor streams, room-aware fall-risk inference, caregiver alerts, and mobility analytics.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired local primitives
- Framer Motion
- Zustand
- Recharts
- SVG indoor condo floorplan visualization
- Mock data only, deploy-ready for Vercel

## Features

- Realistic condo floorplan with Bedroom, Bathroom, Kitchen, Living Room, Hallway, and Balcony
- Animated walking trails, live position indicator, timestamped movement path, and near-fall markers
- Risk heatmap using green, yellow, orange, and red intensity zones
- Simulated IMU data with acceleration, gyroscope, gait speed, cadence, sway, turn velocity, instability, and fall risk
- AI inference pipeline simulation from sensor stream to caregiver alert
- Realtime alert panel and caregiver notification drawer
- Analytics charts for mobility, stability, room usage, hourly activity, gait variability, and turning instability
- Historical playback timeline with movement replay
- Device status and edge AI architecture view

## Pages

- `/` Main Dashboard
- `/floorplan` Floorplan Monitoring
- `/analytics` Analytics
- `/alerts` Alerts
- `/caregiver` Caregiver Overview
- `/devices` Device Status
- `/playback` Historical Playback

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm run start
```

## Vercel Deployment

1. Push the project to a Git repository.
2. Import it in Vercel.
3. Use the default Next.js framework settings.
4. Build command: `npm run build`
5. Output: managed automatically by Next.js.

No backend or environment variables are required.

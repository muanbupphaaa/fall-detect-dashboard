import { HeatPoint, PathPoint, RoomName } from "@/lib/types";

export const rooms: Array<{
  name: RoomName;
  d: string;
  label: { x: number; y: number };
  center: { x: number; y: number };
}> = [
  {
    name: "Bedroom",
    d: "M54 70 H282 V226 H246 V286 H54 Z",
    label: { x: 94, y: 108 },
    center: { x: 164, y: 166 },
  },
  {
    name: "Bathroom",
    d: "M54 286 H206 V434 H54 Z",
    label: { x: 88, y: 328 },
    center: { x: 130, y: 360 },
  },
  {
    name: "Hallway",
    d: "M206 226 H366 V434 H206 Z",
    label: { x: 244, y: 324 },
    center: { x: 286, y: 334 },
  },
  {
    name: "Living Room",
    d: "M282 70 H596 V268 H366 V226 H282 Z",
    label: { x: 416, y: 108 },
    center: { x: 456, y: 170 },
  },
  {
    name: "Kitchen",
    d: "M366 268 H596 V434 H366 Z",
    label: { x: 430, y: 322 },
    center: { x: 484, y: 350 },
  },
  {
    name: "Balcony",
    d: "M596 136 H716 V434 H596 Z",
    label: { x: 632, y: 180 },
    center: { x: 656, y: 288 },
  },
];

export const riskZones: HeatPoint[] = [
  { id: "bathroom-shower-wet", x: 106, y: 372, radius: 78, intensity: 94, room: "Bathroom" },
  { id: "bathroom-door-turn", x: 202, y: 292, radius: 60, intensity: 86, room: "Bathroom" },
  { id: "bedside-morning-stand", x: 246, y: 176, radius: 58, intensity: 70, room: "Bedroom" },
  { id: "hallway-bathroom-corner", x: 282, y: 276, radius: 66, intensity: 82, room: "Hallway" },
  { id: "hallway-night-turn", x: 316, y: 374, radius: 58, intensity: 72, room: "Hallway" },
  { id: "kitchen-counter-edge", x: 464, y: 366, radius: 60, intensity: 68, room: "Kitchen" },
  { id: "living-sofa-turn", x: 502, y: 222, radius: 66, intensity: 74, room: "Living Room" },
  { id: "balcony-door-threshold", x: 604, y: 268, radius: 60, intensity: 66, room: "Balcony" },
];

export const baselinePath: PathPoint[] = [
  { x: 246, y: 210, at: "07:18", risk: 34 },
  { x: 286, y: 244, at: "07:19", risk: 42 },
  { x: 294, y: 302, at: "07:20", risk: 54 },
  { x: 202, y: 316, at: "07:21", risk: 64 },
  { x: 132, y: 366, at: "07:22", risk: 86 },
  { x: 286, y: 316, at: "07:24", risk: 58 },
  { x: 428, y: 344, at: "07:25", risk: 46 },
  { x: 506, y: 230, at: "07:27", risk: 44 },
  { x: 608, y: 268, at: "07:29", risk: 52 },
];

export const roomCoordinates: Record<RoomName, Array<{ x: number; y: number }>> = {
  Bedroom: [
    { x: 156, y: 164 },
    { x: 238, y: 202 },
    { x: 118, y: 214 },
    { x: 252, y: 246 },
  ],
  Bathroom: [
    { x: 126, y: 364 },
    { x: 94, y: 398 },
    { x: 192, y: 314 },
  ],
  Kitchen: [
    { x: 420, y: 342 },
    { x: 500, y: 350 },
    { x: 550, y: 392 },
  ],
  "Living Room": [
    { x: 424, y: 166 },
    { x: 506, y: 208 },
    { x: 552, y: 238 },
  ],
  Hallway: [
    { x: 286, y: 250 },
    { x: 286, y: 318 },
    { x: 320, y: 396 },
  ],
  Balcony: [
    { x: 616, y: 246 },
    { x: 664, y: 310 },
    { x: 632, y: 386 },
  ],
};

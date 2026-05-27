import { HeatPoint, PathPoint, RoomName } from "@/lib/types";

export const rooms: Array<{
  name: RoomName;
  d: string;
  label: { x: number; y: number };
  center: { x: number; y: number };
}> = [
  {
    name: "Bedroom",
    d: "M58 62 H282 V218 H250 V260 H58 Z",
    label: { x: 96, y: 96 },
    center: { x: 166, y: 152 },
  },
  {
    name: "Bathroom",
    d: "M58 260 H220 V426 H58 Z",
    label: { x: 92, y: 300 },
    center: { x: 138, y: 350 },
  },
  {
    name: "Hallway",
    d: "M220 218 H356 V426 H220 Z",
    label: { x: 248, y: 304 },
    center: { x: 288, y: 328 },
  },
  {
    name: "Kitchen",
    d: "M356 250 H570 V426 H356 Z",
    label: { x: 414, y: 304 },
    center: { x: 462, y: 346 },
  },
  {
    name: "Living Room",
    d: "M282 62 H570 V250 H356 V218 H282 Z",
    label: { x: 392, y: 96 },
    center: { x: 438, y: 156 },
  },
  {
    name: "Balcony",
    d: "M570 112 H688 V400 H570 Z",
    label: { x: 604, y: 152 },
    center: { x: 628, y: 260 },
  },
];

export const riskZones: HeatPoint[] = [
  { id: "bathroom-wet-floor", x: 126, y: 344, radius: 74, intensity: 94, room: "Bathroom" },
  { id: "bathroom-door-turn", x: 216, y: 286, radius: 56, intensity: 82, room: "Bathroom" },
  { id: "bedside-stand", x: 240, y: 158, radius: 58, intensity: 72, room: "Bedroom" },
  { id: "hallway-tight-turn", x: 296, y: 236, radius: 64, intensity: 86, room: "Hallway" },
  { id: "kitchen-counter-corner", x: 394, y: 382, radius: 56, intensity: 70, room: "Kitchen" },
  { id: "living-sofa-turn", x: 470, y: 214, radius: 64, intensity: 76, room: "Living Room" },
  { id: "balcony-threshold", x: 578, y: 256, radius: 58, intensity: 68, room: "Balcony" },
];

export const baselinePath: PathPoint[] = [
  { x: 244, y: 198, at: "07:18", risk: 34 },
  { x: 266, y: 226, at: "07:19", risk: 40 },
  { x: 286, y: 276, at: "07:20", risk: 52 },
  { x: 224, y: 304, at: "07:21", risk: 60 },
  { x: 154, y: 336, at: "07:22", risk: 82 },
  { x: 224, y: 304, at: "07:24", risk: 58 },
  { x: 326, y: 342, at: "07:25", risk: 48 },
  { x: 420, y: 344, at: "07:27", risk: 42 },
  { x: 542, y: 260, at: "07:29", risk: 36 },
];

export const roomCoordinates: Record<RoomName, Array<{ x: number; y: number }>> = {
  Bedroom: [
    { x: 174, y: 150 },
    { x: 236, y: 198 },
    { x: 116, y: 198 },
    { x: 250, y: 226 },
  ],
  Bathroom: [
    { x: 154, y: 338 },
    { x: 112, y: 382 },
    { x: 202, y: 304 },
  ],
  Kitchen: [
    { x: 396, y: 344 },
    { x: 476, y: 344 },
    { x: 530, y: 384 },
  ],
  "Living Room": [
    { x: 404, y: 164 },
    { x: 486, y: 196 },
    { x: 536, y: 226 },
  ],
  Hallway: [
    { x: 286, y: 240 },
    { x: 286, y: 310 },
    { x: 302, y: 390 },
  ],
  Balcony: [
    { x: 598, y: 236 },
    { x: 634, y: 304 },
    { x: 606, y: 364 },
  ],
};

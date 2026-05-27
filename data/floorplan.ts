import { HeatPoint, PathPoint, RoomName } from "@/lib/types";

export const rooms: Array<{
  name: RoomName;
  d: string;
  label: { x: number; y: number };
  center: { x: number; y: number };
}> = [
  {
    name: "Bedroom",
    d: "M42 44 H298 V256 H42 Z",
    label: { x: 92, y: 82 },
    center: { x: 170, y: 150 },
  },
  {
    name: "Bathroom",
    d: "M42 256 H188 V430 H42 Z",
    label: { x: 72, y: 292 },
    center: { x: 115, y: 344 },
  },
  {
    name: "Hallway",
    d: "M188 256 H330 V430 H188 Z",
    label: { x: 218, y: 292 },
    center: { x: 260, y: 350 },
  },
  {
    name: "Kitchen",
    d: "M330 256 H560 V430 H330 Z",
    label: { x: 390, y: 292 },
    center: { x: 450, y: 346 },
  },
  {
    name: "Living Room",
    d: "M298 44 H560 V256 H330 V210 H298 Z",
    label: { x: 365, y: 82 },
    center: { x: 430, y: 150 },
  },
  {
    name: "Balcony",
    d: "M560 88 H682 V408 H560 Z",
    label: { x: 590, y: 132 },
    center: { x: 622, y: 250 },
  },
];

export const riskZones: HeatPoint[] = [
  { id: "bath-wet", x: 112, y: 350, radius: 70, intensity: 92, room: "Bathroom" },
  { id: "bedside", x: 286, y: 158, radius: 62, intensity: 76, room: "Bedroom" },
  { id: "hall-turn", x: 252, y: 266, radius: 58, intensity: 68, room: "Hallway" },
  { id: "kitchen-corner", x: 354, y: 404, radius: 46, intensity: 58, room: "Kitchen" },
  { id: "night-route", x: 198, y: 254, radius: 54, intensity: 62, room: "Hallway" },
];

export const baselinePath: PathPoint[] = [
  { x: 166, y: 156, at: "07:18", risk: 34 },
  { x: 222, y: 182, at: "07:19", risk: 39 },
  { x: 290, y: 234, at: "07:20", risk: 52 },
  { x: 258, y: 338, at: "07:21", risk: 49 },
  { x: 152, y: 356, at: "07:22", risk: 82 },
  { x: 232, y: 362, at: "07:24", risk: 57 },
  { x: 382, y: 348, at: "07:25", risk: 45 },
  { x: 454, y: 242, at: "07:27", risk: 38 },
  { x: 530, y: 178, at: "07:29", risk: 31 },
];

export const roomCoordinates: Record<RoomName, Array<{ x: number; y: number }>> = {
  Bedroom: [
    { x: 154, y: 142 },
    { x: 230, y: 178 },
    { x: 282, y: 154 },
    { x: 110, y: 210 },
  ],
  Bathroom: [
    { x: 112, y: 332 },
    { x: 146, y: 372 },
    { x: 82, y: 386 },
  ],
  Kitchen: [
    { x: 392, y: 352 },
    { x: 486, y: 346 },
    { x: 362, y: 404 },
  ],
  "Living Room": [
    { x: 394, y: 164 },
    { x: 492, y: 188 },
    { x: 518, y: 238 },
  ],
  Hallway: [
    { x: 242, y: 286 },
    { x: 266, y: 354 },
    { x: 306, y: 412 },
  ],
  Balcony: [
    { x: 612, y: 198 },
    { x: 626, y: 302 },
    { x: 590, y: 360 },
  ],
};

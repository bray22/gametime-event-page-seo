import { NextResponse } from "next/server";

const inventorySnapshots = [
  [
    { id: "1", section: "130", row: "12", price: 325 },
    { id: "2", section: "205", row: "18", price: 275 },
    { id: "3", section: "VIP", row: "Field", price: 950 },
  ],
  [
    { id: "1", section: "130", row: "12", price: 319 },
    { id: "2", section: "205", row: "18", price: 289 },
    { id: "3", section: "VIP", row: "Field", price: 975 },
  ],
  [
    { id: "1", section: "130", row: "12", price: 335 },
    { id: "2", section: "205", row: "18", price: 279 },
    { id: "3", section: "VIP", row: "Field", price: 925 },
  ],
];

export async function GET() {
  const index = Math.floor(Date.now() / 30000) % inventorySnapshots.length;

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    offers: inventorySnapshots[index],
  });
}

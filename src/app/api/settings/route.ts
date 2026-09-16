import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";

export async function GET() {
  try {
    const allSettings = db.select().from(settings).all();

    const settingsObj: Record<string, any> = {};
    for (const s of allSettings) {
      if (s.key) {
        let val: any = s.value || "";
        // Try parsing JSON if applicable
        if (
          typeof val === "string" &&
          ((val.startsWith("{") && val.endsWith("}")) ||
            (val.startsWith("[") && val.endsWith("]")))
        ) {
          try {
            val = JSON.parse(val);
          } catch {
            // keep raw string
          }
        }
        settingsObj[s.key] = val;
      }
    }

    return NextResponse.json({ data: settingsObj });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


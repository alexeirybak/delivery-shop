import { Schedule } from "@/types/deliverySchedule";
import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDB();
    const deliveryTimes = await db.collection("delivery-times").findOne({});
    
    return NextResponse.json({
      schedule: deliveryTimes?.schedule || {}
    });
  } catch {
    return NextResponse.json(
      { message: "Ошибка при загрузке графика доставки" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { schedule } = await request.json() as { schedule: Schedule };
    const db = await getDB();
    
    await db.collection("delivery-times").updateOne(
      {},
      { 
        $set: { 
          schedule: schedule || {},
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "График доставки сохранен"
    });
  } catch {
    return NextResponse.json(
      { message: "Ошибка при сохранении графика доставки" },
      { status: 500 }
    );
  }
}